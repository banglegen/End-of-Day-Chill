const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const stopBtn = document.getElementById('stopBtn');
const playlistEl = document.getElementById('playlist');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const coverEl = document.getElementById('cover');
const progress = document.getElementById('progress');
const progressBar = progress.querySelector('i');
const curTime = document.getElementById('curTime');
const durTime = document.getElementById('durTime');
const fileInput = document.getElementById('fileInput');
const addBtn = document.getElementById('addBtn');
const dropzone = document.getElementById('dropzone');
const volume = document.getElementById('volume');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const downloadBtn = document.getElementById('downloadBtn');
const lyricEl = document.getElementById('lyrics');

let tracks = [
  { name: "Tháp Rơi Tự Do", artist: "跳楼机", url: "Music/thaproitudo.mp3" },
  { name: "Phim Ba Người", artist: "Nguyễn Vĩ X Cao Tri", url: "Music/phimbanguoi.mp3" },
  { name: "Nắng Dưới Chân Mây", artist: "Nguyễn Hữu Kha (Style Huy PT Remix)", url: "Music/nangduoichanmay.mp3" },
  { name: "Sao Mình Chưa Nắm Tay Nhau", artist: "Yan Nguyễn X BD Media Music", url: "Music/saominhchuanamtaynhau.mp3" },
  { name: "Một Bước Yêu Vạn Dặm Đau", artist: "Mr Siro X Theron Remix", url: "Music/motbuocyeuvandamdau.mp3" },
  { name: "Ngày Mai Em Đi Mất", artist: "Đạt G", url: "Music/ngaymaiemdimat.mp3" },
  { name: "Anh Vui", artist: "Phạm Kỳ x CaoTri", url: "Music/anhvui.mp3" },
  { name: "Mạnh Bà", artist: "Linh Hương Luz, Finn T x CaoTri", url: "Music/manhba.mp3" },
  { name: "Cơ Hội Cuối", artist: "An Vũ x Freak D", url: "Music/cohoicuoi.mp3" },
  { name: "Chạnh Lòng Thương Cô 2", artist: "Huy Vạc X HHD Lofi Chill Mix", url: "Music/chanhlongthuongco.mp3" },
  { name: "Đấng Nam Nhi", artist: "Thái Học X Hido remix", url: "Music/dangnamnhi.mp3" },
  { name: "Anh Đau Từ Lúc Em Đi", artist: "Trần Mạnh Cường X Duzme Remix", url: "Music/anhdautulucemdi.mp3" },
  { name: "Hạ Còn Vương Nắng", artist: "DatKaa", url: "Music/haconvuongnang.mp3" },
  { name: "Mất Kết Nối", artist: "Dương Domic X Theron Remix", url: "Music/matketnoi.mp3" },
  { name: "Sài Gòn Đau Lòng Quá", artist: "Hứa Kim Tuyền X Hoàng Duyên X HUVA REMIX", url: "Music/saigondaulongqua.mp3" },
  { name: "Như Anh Đã Thấy Em", artist: "CTTDE2 X PhucXp ft. X Freak D", url: "Music/nhuanhdathayem.mp3" },
  { name: "Khó Vẽ Nụ Cười", artist: "Đạt G X DuUyên", url: "Music/khovenucuoi.mp3" },
  { name: "Bánh Mì Không", artist: "Đạt G X DuUyên", url: "Music/banhmikhong.mp3" },
  { name: "Đường Tôi Chở Em Về", artist: "buitruonglinh", url: "Music/duongtoichoem.mp3" },
  { name: "Nơi Này Có Anh", artist: "Sơn Tùng M-TP", url: "Music/noinaycoanh.mp3" },
  { name: "Cưới Chính", artist: "Nal X Truzg", url: "Music/cuoichinh.mp3" },
  { name: "Pháp Ta Bà ", artist: "Bảo Vân x Domino Remix", url: "Music/phaptaba.mp3" }
];

let idx = 0, isShuffled = false, repeatMode = 0;
let lyricsData = [], currentLyric = -1;

function formatTime(s){ 
  if(!isFinite(s)) return '0:00'; 
  s=Math.floor(s); 
  let m=Math.floor(s/60); 
  let sec=s%60; 
  return m+':' + (sec<10?'0':'')+sec; 
}

function renderPlaylist(){
  playlistEl.innerHTML='';
  tracks.forEach((t,i)=>{
    let div=document.createElement('div');
    div.className='track'+(i===idx?' active':'');
    div.innerHTML=`<div style="flex:1;min-width:0"><div style="font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.name}</div><div style="font-size:12px;color:var(--muted)">${t.artist||''}</div></div>`;
    div.onclick=()=>playIndex(i);
    playlistEl.appendChild(div);
  });
}

function updateMeta(t){
  titleEl.textContent=t.name;
  artistEl.textContent=t.artist||'';
  coverEl.textContent=(t.name||'♪').charAt(0).toUpperCase();
}

async function loadLyric(track){
  lyricEl.innerHTML='Đang tải lyric...';
  lyricsData = [];
  currentLyric = -1;
  try{
    const fileName = 'lyric/'+track.name+'.lrc';
    const resp = await fetch(fileName);
    if(!resp.ok) throw new Error('Không tìm thấy lyric');
    const text = await resp.text();
    const lines = text.split(/\r?\n/);
    const timeRegex = /\[(\d+):(\d+)\.(\d+)\]/g;

    lines.forEach(line=>{
      let matches = [...line.matchAll(timeRegex)];
      let textPart = line.replace(timeRegex, '').trim();
      if(matches.length && textPart){
        matches.forEach(m=>{
          const min = parseInt(m[1],10);
          const sec = parseInt(m[2],10);
          const frac = m[3];
          let fracSec = (frac.length===3) ? parseInt(frac,10)/1000 : parseInt(frac,10)/100;
          const time = min*60 + sec + fracSec;
          lyricsData.push({time, text: textPart});
        });
      }
    });

    if(!lyricsData.length){
      lyricEl.innerHTML='Không có lyric';
      return;
    }

    lyricsData.sort((a,b)=>a.time-b.time);
    lyricEl.innerHTML='';
    lyricsData.forEach(entry=>{
      const p = document.createElement('p');
      p.textContent = entry.text;
      lyricEl.appendChild(p);
    });
    currentLyric = -1;
    lyricEl.scrollTop = 0;
  }catch(e){
    lyricEl.innerHTML='Không có lyric';
    lyricsData = [];
    currentLyric = -1;
  }
}

function findLyricIndex(t){
  if(!lyricsData.length) return -1;
  let lo = 0, hi = lyricsData.length - 1, ans = -1;
  while(lo <= hi){
    const mid = (lo + hi) >> 1;
    if(lyricsData[mid].time <= t){ ans = mid; lo = mid + 1; }
    else hi = mid - 1;
  }
  return ans;
}

function updateLyricHighlight(now = audio.currentTime, behavior = 'smooth'){
  if(!lyricsData.length) return;
  const newIdx = findLyricIndex(now);
  if(newIdx === currentLyric) return;

  if(currentLyric >= 0 && lyricEl.children[currentLyric]) 
    lyricEl.children[currentLyric].classList.remove('active');

  currentLyric = newIdx;

  if(currentLyric >= 0 && lyricEl.children[currentLyric]){
    const p = lyricEl.children[currentLyric];
    p.classList.add('active');

    const containerRect = lyricEl.getBoundingClientRect();
    const pRect = p.getBoundingClientRect();
    const delta = (pRect.top + pRect.height/2) - (containerRect.top + containerRect.height/2);
    const targetScrollTop = Math.max(0, lyricEl.scrollTop + delta);

    lyricEl.scrollTo({ top: targetScrollTop, behavior });
  }
}

function playIndex(i){
  if(i<0||i>=tracks.length) return;
  idx = i;
  const t = tracks[idx];
  audio.src = t.url;
  audio.play().catch(()=>{ });
  updateMeta(t);
  renderPlaylist();
  playBtn.textContent='⏸️';
  loadLyric(t);
}

audio.addEventListener('loadedmetadata', ()=>{
  durTime.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', ()=>{
  const pct = audio.currentTime / (audio.duration || 1) * 100;
  progressBar.style.width = pct + '%';
  curTime.textContent = formatTime(audio.currentTime);
  updateLyricHighlight(audio.currentTime, 'smooth');
});

audio.addEventListener('seeked', ()=>{
  updateLyricHighlight(audio.currentTime, 'auto');
});

audio.addEventListener('ended', ()=>{
  if(repeatMode === 1) playIndex(idx);
  else if(repeatMode === 2) nextBtn.click();
  else nextBtn.click();
});

progress.addEventListener('click', (e)=>{
  const rect = progress.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const t = (x / rect.width) * (audio.duration || 0);
  audio.currentTime = t;
  updateLyricHighlight(t, 'auto');
});

playBtn.addEventListener('click', ()=>{
  if(audio.paused){ audio.play(); playBtn.textContent='⏸️'; }
  else { audio.pause(); playBtn.textContent='▶️'; }
});
prevBtn.addEventListener('click', ()=>{ if(isShuffled) playIndex(Math.floor(Math.random()*tracks.length)); else playIndex((idx-1+tracks.length)%tracks.length); });
nextBtn.addEventListener('click', ()=>{ if(isShuffled) playIndex(Math.floor(Math.random()*tracks.length)); else playIndex((idx+1)%tracks.length); });
stopBtn.addEventListener('click', ()=>{ audio.pause(); audio.currentTime = 0; playBtn.textContent='▶️'; });

addBtn.addEventListener('click', ()=>fileInput.click());
fileInput.addEventListener('change', (e)=>{ handleFiles(e.target.files); fileInput.value = ''; });

function handleFiles(fileList){
  Array.from(fileList).filter(f=>f.type.startsWith('audio')).forEach(f=>{
    const url = URL.createObjectURL(f);
    const name = f.name.replace(/\.[^/.]+$/,'');
    tracks.push({ name, url, file: f });
  });
  renderPlaylist();
}

['dragenter','dragover'].forEach(ev=>dropzone.addEventListener(ev,e=>{ e.preventDefault(); dropzone.style.borderColor='rgba(124,58,237,0.7)'; }));
['dragleave','drop'].forEach(ev=>dropzone.addEventListener(ev,e=>{ e.preventDefault(); dropzone.style.borderColor=''; }));
dropzone.addEventListener('drop', e=>{ if(e.dataTransfer&&e.dataTransfer.files) handleFiles(e.dataTransfer.files); });

volume.addEventListener('input', ()=> audio.volume = parseFloat(volume.value));
shuffleBtn.addEventListener('click', ()=>{ isShuffled = !isShuffled; shuffleBtn.style.opacity = isShuffled ? 1 : 0.6; });
repeatBtn.addEventListener('click', ()=>{ repeatMode = (repeatMode+1)%3; repeatBtn.style.opacity = repeatMode ? 1 : 0.6; repeatBtn.textContent = repeatMode === 2 ? '🔂' : '🔁'; });

downloadBtn.addEventListener('click', ()=>{
  if(idx<0) return;
  const t = tracks[idx];
  if(!t.url) return;
  const a = document.createElement('a');
  a.href = t.url;
  a.download = (t.name||'music') + '.mp3';
  a.click();
});

window.addEventListener('keydown', e=>{ if(e.code === 'Space'){ e.preventDefault(); playBtn.click(); } });

renderPlaylist();
playIndex(0);