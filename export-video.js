/* Exportación cuadro por cuadro (no en tiempo real) para Turing YOLO y Turing Vision.
   Recorre el video original a la cadencia pedida, deja que la app procese cada cuadro sin apuro
   (modelos + efectos) y codifica el lienzo con WebCodecs a un MP4 con tiempos exactos, así el
   resultado se ve fluido aunque cada cuadro tarde segundos. Copia el audio del archivo original. */
(() => {
"use strict";
const MUXER_URL = "https://cdn.jsdelivr.net/npm/mp4-muxer@5.1.3/build/mp4-muxer.js";

function loadMuxer(){
  if(window.Mp4Muxer) return Promise.resolve();
  return new Promise((res,rej)=>{ const s=document.createElement("script"); s.src=MUXER_URL; s.onload=res;
    s.onerror=()=>rej(new Error("no se pudo cargar el armador de MP4 (¿sin conexión?)")); document.head.appendChild(s); });
}
async function pickVideo(w,h,fps){
  const bitrate=Math.round(Math.min(20e6,Math.max(2e6,w*h*fps*0.14)));
  // H.264 primero (el más compatible); si el equipo no lo codifica, VP9 o AV1 dentro del mismo MP4
  const tries=[["avc","avc1.640033"],["avc","avc1.4d0033"],["avc","avc1.640028"],["avc","avc1.42003e"],["avc","avc1.42001f"],
    ["vp9","vp09.00.41.08"],["vp9","vp09.00.10.08"],["av1","av01.0.08M.08"]];
  for(const [mux,codec] of tries){
    const cfg={codec,width:w,height:h,bitrate,framerate:fps};
    if(mux==="avc") cfg.avc={format:"avc"};
    try{ if((await VideoEncoder.isConfigSupported(cfg)).supported) return {mux,cfg}; }catch(e){}
  }
  return null;
}
async function decodeAudio(file){
  if(!file||!window.OfflineAudioContext) return null;
  try{ return await new OfflineAudioContext(2,1,48000).decodeAudioData(await file.arrayBuffer()); }
  catch(e){ return null; } // el video no tiene audio o el navegador no lo puede leer
}
async function pickAudio(ch){
  if(!window.AudioEncoder) return null;
  for(const [mux,codec] of [["aac","mp4a.40.2"],["opus","opus"]]){
    const cfg={codec,sampleRate:48000,numberOfChannels:ch,bitrate:160000};
    try{ if((await AudioEncoder.isConfigSupported(cfg)).supported) return {mux,cfg}; }catch(e){}
  }
  return null;
}
function seek(v,t){
  return new Promise(res=>{
    let done=false; const fin=()=>{ if(done) return; done=true; v.removeEventListener("seeked",fin); clearTimeout(to); res(); };
    const to=setTimeout(fin,8000); v.addEventListener("seeked",fin); v.currentTime=t;
  });
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

/* o = { video, file, fps, canvas, process(t,i): Promise, onProgress(i,n,etaMs), cancelled(): bool, onStatus(text),
        start?, end? (segundos, para exportar solo un tramo), noAudio? }
   Devuelve un Blob MP4, o null si se canceló. El lienzo tiene que tener ancho y alto pares. */
async function run(o){
  if(!window.VideoEncoder||!window.VideoFrame) throw new Error("este navegador no tiene WebCodecs; usá Chrome actualizado");
  const v=o.video, fps=o.fps;
  let dur=v.duration;
  if(!isFinite(dur)){ // algunos WebM no traen la duración: se busca al final para que el navegador la calcule
    await seek(v,1e7); dur=v.duration; if(!isFinite(dur)) dur=v.currentTime; }
  if(!isFinite(dur)||dur<=0) throw new Error("no se pudo leer la duración del video");
  o.onStatus&&o.onStatus("Preparando…");
  await loadMuxer();
  const W=o.canvas.width, H=o.canvas.height;
  const vsel=await pickVideo(W,H,fps);
  if(!vsel) throw new Error("este equipo no puede codificar video a "+W+"×"+H);
  const a0=Math.max(0,Math.min(o.start||0,dur-0.05)), a1=Math.max(a0+0.05,Math.min(o.end||dur,dur));
  const audio=o.noAudio?null:await decodeAudio(o.file), ch=audio?Math.min(2,audio.numberOfChannels):0;
  const asel=audio?await pickAudio(ch):null;
  const muxer=new Mp4Muxer.Muxer({
    target:new Mp4Muxer.ArrayBufferTarget(),
    video:{codec:vsel.mux,width:W,height:H,frameRate:fps},
    audio:asel?{codec:asel.mux,numberOfChannels:ch,sampleRate:48000}:undefined,
    fastStart:"in-memory", firstTimestampBehavior:"offset"
  });
  let err=null;
  const ve=new VideoEncoder({output:(c,m)=>muxer.addVideoChunk(c,m),error:e=>{ err=e; }});
  ve.configure(vsel.cfg);
  const n=Math.max(1,Math.floor((a1-a0)*fps+1e-6)), key=Math.max(1,Math.round(fps*2)), t0=performance.now();
  v.pause();
  for(let i=0;i<n;i++){
    if(o.cancelled()){ try{ ve.close(); }catch(e){} return null; }
    if(err) throw err;
    // un milisegundo después del inicio del cuadro, para no caer en el cuadro anterior
    await seek(v,Math.min(a0+i/fps+0.001,Math.max(0,dur-0.01)));
    await o.process(i/fps,i);
    const vf=new VideoFrame(o.canvas,{timestamp:Math.round(i*1e6/fps),duration:Math.round(1e6/fps)});
    ve.encode(vf,{keyFrame:i%key===0}); vf.close();
    while(ve.encodeQueueSize>2) await sleep(4);
    o.onProgress(i+1,n,(performance.now()-t0)/(i+1)*(n-i-1));
  }
  o.onStatus&&o.onStatus("Terminando…");
  await ve.flush(); ve.close(); if(err) throw err;
  if(asel){
    const ae=new AudioEncoder({output:(c,m)=>muxer.addAudioChunk(c,m),error:e=>{ err=e; }});
    ae.configure(asel.cfg);
    const s0=Math.round(a0*48000), total=Math.max(0,Math.min(audio.length-s0,Math.round(n/fps*48000))), CH=4800;
    for(let off=0;off<total;off+=CH){
      const k=Math.min(CH,total-off), data=new Float32Array(k*ch);
      for(let c=0;c<ch;c++) data.set(audio.getChannelData(c).subarray(s0+off,s0+off+k),c*k);
      const ad=new AudioData({format:"f32-planar",sampleRate:48000,numberOfFrames:k,numberOfChannels:ch,timestamp:Math.round(off/48000*1e6),data});
      ae.encode(ad); ad.close();
      if(ae.encodeQueueSize>8) await sleep(2);
    }
    await ae.flush(); ae.close(); if(err) throw err;
  }
  muxer.finalize();
  return {blob:new Blob([muxer.target.buffer],{type:"video/mp4"}), codec:vsel.mux, audio:asel?asel.mux:null, frames:n};
}
function fmtTime(ms){ const s=Math.max(0,Math.round(ms/1000)); return s<60 ? s+" s" : Math.floor(s/60)+" min "+String(s%60).padStart(2,"0")+" s"; }

window.FrameExport={run,fmtTime};
})();
