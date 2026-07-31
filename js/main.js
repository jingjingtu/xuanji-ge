/* ================================================================
   基础数据
================================================================ */
const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const GAN_EL  = ['木','木','火','火','土','土','金','金','水','水'];
const ZHI_EL  = ['水','土','木','木','土','火','火','土','金','金','土','水'];
const GAN_YY  = ['阳','阴','阳','阴','阳','阴','阳','阴','阳','阴'];
const EL_COLOR = {木:'#5fbf77',火:'#e0654f',土:'#d9a44a',金:'#e8c96a',水:'#5aa7e0'};
const ZHI_ANIMAL = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
const SHENG = {木:'火',火:'土',土:'金',金:'水',水:'木'};
const KE = {木:'土',土:'水',水:'火',火:'金',金:'木'};
const HOUR_NAMES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const HOUR_RANGE = ['23:00–01:00','01:00–03:00','03:00–05:00','05:00–07:00','07:00–09:00','09:00–11:00','11:00–13:00','13:00–15:00','15:00–17:00','17:00–19:00','19:00–21:00','21:00–23:00'];

function shishen(dayG, otherG){
  const dEl = GAN_EL[dayG], oEl = GAN_EL[otherG];
  const sameYY = GAN_YY[dayG] === GAN_YY[otherG];
  if(dEl === oEl) return sameYY ? '比肩' : '劫财';
  if(SHENG[oEl] === dEl) return sameYY ? '偏印' : '正印';
  if(SHENG[dEl] === oEl) return sameYY ? '食神' : '伤官';
  if(KE[dEl] === oEl)    return sameYY ? '偏财' : '正财';
  return sameYY ? '七杀' : '正官';
}
const EL_TRAIT = {
  木:'主仁，其性直，其情和。木旺之人有博爱恻隐之心，清高慷慨，质朴无伪',
  火:'主礼，其性急，其情恭。火旺之人谦和恭敬，热情澎湃，执行力强，亦有急躁之时',
  土:'主信，其性重，其情厚。土旺之人忠孝至诚，度量宽厚，言必行，行必果',
  金:'主义，其性刚，其情烈。金旺之人刚毅果断，疏财仗义，深知廉耻，锋芒外露',
  水:'主智，其性聪，其情善。水旺之人足智多谋，学识过人，善于变通，思虑深远'
};
const DAYMASTER_DESC = {
  甲:'甲木参天，栋梁之材。你如大树临风，正直向上，有担当、有骨气，认定之事百折不挠。宜扎根深处，忌浮躁摇摆。',
  乙:'乙木虽柔，刲羊解牛。你如藤蔓花草，柔韧善变，外柔内刚，善于借势生长。贵人和环境，是你最好的养分。',
  丙:'丙火猛烈，欺霜侮雪。你如中天之日，光明磊落，热情洋溢，天生自带舞台。收敛锋芒、照亮而不灼人，方为上境。',
  丁:'丁火柔中，内性昭融。你如灯烛星火，外静内明，洞察入微，最擅在暗处发光。守住心力，勿为琐事耗光。',
  戊:'戊土固重，既中且正。你如高山厚土，沉稳可靠，一言九鼎，是天生的定海神针。偶有固执，学会转弯天地更宽。',
  己:'己土卑湿，中正蓄藏。你如田园之土，包容滋养，心思细腻，善于统筹谋划。宜多向外走，沃土亦需见阳光。',
  庚:'庚金带煞，刚健为最。你如刀剑精钢，果决锐利，讲义气、重原则，愈挫愈勇。过刚易折，刚柔并济方成大器。',
  辛:'辛金软弱，温润而清。你如珠玉美饰，精致敏锐，追求极致，气质出众。勿因苛求完美而内耗，瑕不掩瑜。',
  壬:'壬水通河，能泄金气。你如江河奔流，智慧奔涌，胸怀宽阔，能容万物、亦能穿石。认准方向，一路向东。',
  癸:'癸水至弱，达于天津。你如雨露溪流，润物无声，直觉敏锐，柔中带韧。聚溪成河，你的能量超乎自我想象。'
};

/* ================================================================
   真历法：lunar-javascript 驱动八字
================================================================ */
function lunarBazi(y, m, d, hour){
  const solar = Solar.fromYmdHms(y, m, d, hour, 0, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  const gz = s => ({gan: GAN.indexOf(s[0]), zhi: ZHI.indexOf(s[1])});
  const yun = ec.getYun(document.getElementById('inGender').value === 'male' ? 1 : 0);
  const daYun = yun.getDaYun(7).slice(1).map(dy => ({
    age: dy.getStartAge(), year: dy.getStartYear(), gz: dy.getGanZhi()
  }));
  return {
    year: gz(ec.getYear()), month: gz(ec.getMonth()), day: gz(ec.getDay()), hour: gz(ec.getTime()),
    nayin: {year: ec.getYearNaYin(), month: ec.getMonthNaYin(), day: ec.getDayNaYin(), hour: ec.getTimeNaYin()},
    shishenGan: {year: ec.getYearShiShenGan(), month: ec.getMonthShiShenGan(), hour: ec.getTimeShiShenGan()},
    daYun, startAge: daYun.length ? daYun[0].age : null
  };
}

/* ================================================================
   视觉层
================================================================ */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [], shooting = [];
function resizeStars(){
  canvas.width = innerWidth; canvas.height = innerHeight;
  stars = Array.from({length: Math.min(200, innerWidth / 7)}, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 1.3 + .3, a: Math.random() * .55 + .18,
    tw: Math.random() * .02 + .004, ph: Math.random() * Math.PI * 2,
    vx: (Math.random() - .5) * .05, vy: (Math.random() - .5) * .05
  }));
}
resizeStars(); addEventListener('resize', resizeStars);
let t0 = 0;
function starLoop(t){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(const s of stars){
    s.ph += s.tw; s.x += s.vx; s.y += s.vy;
    if(s.x < 0) s.x = canvas.width; if(s.x > canvas.width) s.x = 0;
    if(s.y < 0) s.y = canvas.height; if(s.y > canvas.height) s.y = 0;
    const alpha = s.a * (0.6 + 0.4 * Math.sin(s.ph));
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(233,226,208,${alpha})`; ctx.fill();
  }
  if(t - t0 > 5000 + Math.random() * 4000){
    t0 = t;
    shooting.push({x: Math.random() * canvas.width * .7 + canvas.width * .15, y: Math.random() * canvas.height * .3, vx: -7 - Math.random() * 4, vy: 3 + Math.random() * 2, life: 1});
  }
  shooting = shooting.filter(m => m.life > 0);
  for(const m of shooting){
    m.x += m.vx; m.y += m.vy; m.life -= .02;
    const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 9, m.y - m.vy * 9);
    grad.addColorStop(0, `rgba(243,210,122,${m.life})`);
    grad.addColorStop(1, 'rgba(243,210,122,0)');
    ctx.strokeStyle = grad; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * 9, m.y - m.vy * 9); ctx.stroke();
  }
  requestAnimationFrame(starLoop);
}
requestAnimationFrame(starLoop);

/* 符文雨 */
const RUNE_CHARS = ['☰','☱','☲','☳','☵','☶','☷','☴','甲','乙','丙','丁','戊','己','庚','辛','壬','癸','子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥','乾','坤','震','巽','坎','离','艮','兑','✦','☯'];
const runeBox = document.getElementById('runes');
for(let i = 0; i < 24; i++){
  const r = document.createElement('span');
  r.className = 'rune';
  r.textContent = RUNE_CHARS[Math.floor(Math.random() * RUNE_CHARS.length)];
  r.style.left = Math.random() * 100 + 'vw';
  r.style.top = Math.random() * 100 + 'vh';
  r.style.fontSize = (10 + Math.random() * 18) + 'px';
  r.style.animationDuration = (14 + Math.random() * 22) + 's';
  r.style.animationDelay = (-Math.random() * 30) + 's';
  runeBox.appendChild(r);
}
/* 蝙蝠 */
function spawnBat(){
  const bat = document.createElement('div');
  bat.className = 'bat';
  const size = 26 + Math.random() * 22;
  bat.style.setProperty('--batY', (6 + Math.random() * 30) + 'vh');
  bat.style.top = '0'; bat.style.left = '0';
  const dur = 9 + Math.random() * 7;
  bat.style.animationDuration = dur + 's';
  bat.innerHTML = `<svg width="${size * 1.4}" height="${size * .7}" viewBox="0 0 56 28" style="overflow:visible">
    <path d="M28 10 Q20 2 8 8 Q14 10 11 16 Q18 13 21 19 Q23 13 28 16 Q33 13 35 19 Q38 13 45 16 Q42 10 48 8 Q36 2 28 10Z"
      fill="#0a0502" stroke="#5a3a2a" stroke-width=".8"/>
    <circle cx="25" cy="11" r="1.1" fill="#d4af37"/><circle cx="31" cy="11" r="1.1" fill="#d4af37"/>
  </svg>`;
  document.body.appendChild(bat);
  /* 滑翔段：到总时长 55% 处切滑翔，80% 处恢复扇翅 */
  const svg = bat.querySelector('svg');
  setTimeout(() => svg && svg.classList.add('glide'), dur * 550);
  setTimeout(() => svg && svg.classList.remove('glide'), dur * 800);
  bat.addEventListener('animationend', () => bat.remove());
}
setInterval(spawnBat, 12000);
setTimeout(spawnBat, 5000);

/* 3D 倾斜卡片 */
function bindTilt(){
  document.querySelectorAll('.r-card, .panel').forEach(card => {
    if(card.dataset.tiltBound) return;
    card.dataset.tiltBound = '1';
    card.classList.add('tilt');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateY(${px * 3.5}deg) rotateX(${-py * 3.5}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}
bindTilt();
new MutationObserver(bindTilt).observe(document.body, {childList: true, subtree: true});

/* 自定义光标 */
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');
let cx = innerWidth/2, cy = innerHeight/2, tx = cx, ty = cy;
addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY;
  cursorDot.style.left = tx + 'px'; cursorDot.style.top = ty + 'px';
});
(function cursorLoop(){
  cx += (tx - cx) * .38; cy += (ty - cy) * .38;
  cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
  requestAnimationFrame(cursorLoop);
})();
function bindCursor(){
  document.querySelectorAll('a,button,select,input,.hoverable,.palace,.deck-card').forEach(el => {
    if(el.dataset.cursorBound) return;
    el.dataset.cursorBound = '1';
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}
bindCursor();
new MutationObserver(bindCursor).observe(document.body, {childList: true, subtree: true});

/* GSAP */
gsap.registerPlugin(ScrollTrigger);
document.querySelectorAll('.fade-in').forEach(el => {
  gsap.to(el, {opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
    scrollTrigger: {trigger: el, start: 'top 88%'}});
});
const heroTitle = document.getElementById('heroTitle');
heroTitle.innerHTML = heroTitle.textContent.split('').map(c => `<span class="char">${c}</span>`).join('');
gsap.from('.hero-title .char', {opacity: 0, y: 70, rotateX: -70, stagger: .12, duration: 1.2, ease: 'back.out(1.6)', delay: .3});
addEventListener('mousemove', e => {
  const dx = (e.clientX / innerWidth - .5), dy = (e.clientY / innerHeight - .5);
  gsap.to('.compass', {x: dx * 30, y: dy * 30, duration: 1.2, ease: 'power2.out'});
});
document.querySelectorAll('[data-count]').forEach(el => {
  const target = +el.dataset.count;
  ScrollTrigger.create({trigger: el, start: 'top 92%', once: true, onEnter(){
    gsap.to({v: 0}, {v: target, duration: 2, ease: 'power2.out',
      onUpdate(){ el.textContent = Math.round(this.targets()[0].v).toLocaleString(); }});
  }});
});

/* ===== 新增酷炫交互 ===== */
/* 1. 滚动进度条 + 导航收缩 */
const nav = document.querySelector('nav');
addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
  document.getElementById('scrollProgress').style.width = pct + '%';
  nav.classList.toggle('scrolled', h.scrollTop > 60);
}, {passive: true});

/* 2. 区块标题逐字飞入 */
document.querySelectorAll('.sec-title').forEach(title => {
  const nodes = [...title.childNodes];
  title.innerHTML = nodes.map(n => {
    if(n.nodeType === 3) return n.textContent.split('').map(c => c.trim() ? `<span class="st-char">${c}</span>` : ' ').join('');
    if(n.tagName === 'B') return `<b>${n.textContent.split('').map(c => `<span class="st-char">${c}</span>`).join('')}</b>`;
    return n.outerHTML || '';
  }).join('');
  gsap.to(title.querySelectorAll('.st-char'), {
    opacity: 1, y: 0, rotateX: 0, stagger: .06, duration: .8, ease: 'back.out(1.7)',
    scrollTrigger: {trigger: title, start: 'top 88%'}
  });
});

/* 3. 按钮磁吸 + 涟漪 */
document.querySelectorAll('.btn, .btn-cast').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
    gsap.to(btn, {x: x * .18, y: y * .3, duration: .4, ease: 'power2.out'});
  });
  btn.addEventListener('mouseleave', () => gsap.to(btn, {x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)'}));
  btn.addEventListener('click', e => {
    const r = btn.getBoundingClientRect();
    const rip = document.createElement('span');
    rip.className = 'ripple';
    const size = Math.max(r.width, r.height);
    rip.style.width = rip.style.height = size + 'px';
    rip.style.left = (e.clientX - r.left - size / 2) + 'px';
    rip.style.top = (e.clientY - r.top - size / 2) + 'px';
    btn.appendChild(rip);
    setTimeout(() => rip.remove(), 700);
  });
});

/* 4. 罗盘随滚动缓旋 */
gsap.to('.compass', {
  rotate: 120, ease: 'none',
  scrollTrigger: {trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2}
});

/* 5. 区块水印视差 */
document.querySelectorAll('.bg-glyph').forEach(g => {
  gsap.fromTo(g, {yPercent: -60}, {
    yPercent: -30, ease: 'none',
    scrollTrigger: {trigger: g.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.5}
  });
});

/* ================================================================
   表单
================================================================ */
const selY = document.getElementById('inYear'),
      selM = document.getElementById('inMonth'),
      selD = document.getElementById('inDay'),
      selH = document.getElementById('inHour');
for(let y = 1940; y <= 2026; y++) selY.insertAdjacentHTML('beforeend', `<option ${y===1995?'selected':''}>${y}</option>`);
for(let m = 1; m <= 12; m++) selM.insertAdjacentHTML('beforeend', `<option>${m} 月</option>`);
function fillDays(){
  const y = +selY.value, m = parseInt(selM.value);
  const dim = new Date(y, m, 0).getDate();
  selD.innerHTML = '';
  for(let d = 1; d <= dim; d++) selD.insertAdjacentHTML('beforeend', `<option>${d} 日</option>`);
}
fillDays();
selY.addEventListener('change', fillDays);
selM.addEventListener('change', fillDays);
HOUR_NAMES.forEach((n, i) => selH.insertAdjacentHTML('beforeend',
  `<option value="${i}">${n}时 · ${HOUR_RANGE[i]}</option>`));
selH.value = 6;

/* ================================================================
   八字排盘（真历法）
================================================================ */
document.getElementById('baziForm').addEventListener('submit', e => {
  e.preventDefault();
  const y = +selY.value, m = parseInt(selM.value), d = parseInt(selD.value);
  const zh = +selH.value === -1 ? 6 : +selH.value;
  const casting = document.getElementById('casting');
  casting.classList.add('show');
  setTimeout(() => {
    casting.classList.remove('show');
    renderResult(y, m, d, zh);
    document.getElementById('result').style.display = 'block';
    document.getElementById('result').scrollIntoView({behavior: 'smooth', block: 'start'});
  }, 1400);
});

/* 五行雷达图 */
function drawWxRadar(counts){
  const cv = document.getElementById('wxRadar');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const cx = 130, cy = 130, R = 96;
  const els = ['木','火','土','金','水'];
  const max = 4;
  ctx.clearRect(0, 0, 260, 260);
  /* 网格 */
  for(let ring = 1; ring <= 4; ring++){
    ctx.beginPath();
    els.forEach((el, i) => {
      const a = -Math.PI / 2 + i * Math.PI * 2 / 5;
      const r = R * ring / 4;
      i === 0 ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r) : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(212,175,55,.18)'; ctx.lineWidth = 1; ctx.stroke();
  }
  /* 轴线 + 标签 */
  els.forEach((el, i) => {
    const a = -Math.PI / 2 + i * Math.PI * 2 / 5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    ctx.strokeStyle = 'rgba(212,175,55,.12)'; ctx.stroke();
    ctx.fillStyle = EL_COLOR[el]; ctx.font = '600 15px "Noto Serif SC"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(el, cx + Math.cos(a) * (R + 18), cy + Math.sin(a) * (R + 18));
  });
  /* 数据多边形（带动画） */
  let prog = 0;
  const start = performance.now();
  function frame(now){
    prog = Math.min(1, (now - start) / 900);
    const ease = 1 - Math.pow(1 - prog, 3);
    ctx.clearRect(0, 0, 260, 260);
    /* 重画网格 */
    for(let ring = 1; ring <= 4; ring++){
      ctx.beginPath();
      els.forEach((el, i) => {
        const a = -Math.PI / 2 + i * Math.PI * 2 / 5, r = R * ring / 4;
        i === 0 ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r) : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      });
      ctx.closePath(); ctx.strokeStyle = 'rgba(212,175,55,.18)'; ctx.stroke();
    }
    els.forEach((el, i) => {
      const a = -Math.PI / 2 + i * Math.PI * 2 / 5;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.strokeStyle = 'rgba(212,175,55,.12)'; ctx.stroke();
      ctx.fillStyle = EL_COLOR[el]; ctx.font = '600 15px "Noto Serif SC"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(el, cx + Math.cos(a) * (R + 18), cy + Math.sin(a) * (R + 18));
    });
    /* 数据 */
    ctx.beginPath();
    els.forEach((el, i) => {
      const a = -Math.PI / 2 + i * Math.PI * 2 / 5;
      const r = R * (counts[el] / max) * ease;
      i === 0 ? ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r) : ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    });
    ctx.closePath();
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, R);
    grad.addColorStop(0, 'rgba(212,175,55,.45)');
    grad.addColorStop(1, 'rgba(124,58,237,.25)');
    ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = 'rgba(243,210,122,.9)'; ctx.lineWidth = 2; ctx.stroke();
    /* 顶点 */
    els.forEach((el, i) => {
      const a = -Math.PI / 2 + i * Math.PI * 2 / 5;
      const r = R * (counts[el] / max) * ease;
      ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4, 0, Math.PI * 2);
      ctx.fillStyle = EL_COLOR[el]; ctx.fill();
      ctx.strokeStyle = '#fff2c9'; ctx.lineWidth = 1.5; ctx.stroke();
    });
    if(prog < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* 大运运势曲线 */
function drawLuckCurve(daYun, currentYear, dayEl){
  const cv = document.getElementById('luckCurve');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  const W = 600, H = 150, pad = 36;
  ctx.clearRect(0, 0, W, H);
  /* 每步大运评分：与日主生克关系 + 纳音加权 */
  const scores = daYun.map(l => {
    const g = GAN.indexOf(l.gz[0]), z = ZHI.indexOf(l.gz[1]);
    let s = 50;
    const gEl = GAN_EL[g], zEl = ZHI_EL[z];
    if(gEl === dayEl) s += 12; if(zEl === dayEl) s += 8;
    if(SHENG[gEl] === dayEl) s += 14; if(SHENG[zEl] === dayEl) s += 10;
    if(SHENG[dayEl] === gEl) s -= 8; if(SHENG[dayEl] === zEl) s -= 5;
    if(KE[gEl] === dayEl) s -= 12; if(KE[zEl] === dayEl) s -= 8;
    if(KE[dayEl] === gEl) s += 10; if(KE[dayEl] === zEl) s += 6;
    return Math.max(15, Math.min(96, s));
  });
  const n = scores.length;
  const xs = i => pad + i * (W - pad * 2) / (n - 1);
  const ys = v => H - pad + (100 - v) / 100 * (H - pad * 2) * -1 - 0; // 简化映射
  const yMap = v => H - pad - (v - 15) / 81 * (H - pad * 2);
  /* 网格 */
  for(let gy = 0; gy <= 4; gy++){
    const y = pad + gy * (H - pad * 2) / 4;
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y);
    ctx.strokeStyle = 'rgba(212,175,55,.1)'; ctx.stroke();
  }
  /* 平滑曲线（贝塞尔） */
  let prog = 0;
  const start = performance.now();
  function frame(now){
    prog = Math.min(1, (now - start) / 1100);
    const ease = 1 - Math.pow(1 - prog, 3);
    ctx.clearRect(0, 0, W, H);
    for(let gy = 0; gy <= 4; gy++){
      const y = pad + gy * (H - pad * 2) / 4;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y);
      ctx.strokeStyle = 'rgba(212,175,55,.1)'; ctx.stroke();
    }
    /* 渐变填充 */
    ctx.beginPath();
    ctx.moveTo(xs(0), yMap(scores[0] * ease));
    for(let i = 1; i < n; i++){
      const xc = (xs(i - 1) + xs(i)) / 2, yc = (yMap(scores[i - 1] * ease) + yMap(scores[i] * ease)) / 2;
      ctx.quadraticCurveTo(xs(i - 1), yMap(scores[i - 1] * ease), xc, yc);
    }
    ctx.lineTo(xs(n - 1), yMap(scores[n - 1] * ease));
    ctx.lineTo(xs(n - 1), H - pad); ctx.lineTo(xs(0), H - pad); ctx.closePath();
    const fg = ctx.createLinearGradient(0, pad, 0, H - pad);
    fg.addColorStop(0, 'rgba(212,175,55,.4)'); fg.addColorStop(1, 'rgba(124,58,237,.05)');
    ctx.fillStyle = fg; ctx.fill();
    /* 曲线 */
    ctx.beginPath();
    ctx.moveTo(xs(0), yMap(scores[0] * ease));
    for(let i = 1; i < n; i++){
      const xc = (xs(i - 1) + xs(i)) / 2, yc = (yMap(scores[i - 1] * ease) + yMap(scores[i] * ease)) / 2;
      ctx.quadraticCurveTo(xs(i - 1), yMap(scores[i - 1] * ease), xc, yc);
    }
    ctx.lineTo(xs(n - 1), yMap(scores[n - 1] * ease));
    const lg = ctx.createLinearGradient(pad, 0, W - pad, 0);
    lg.addColorStop(0, '#f3d27a'); lg.addColorStop(.5, '#d4af37'); lg.addColorStop(1, '#a78bfa');
    ctx.strokeStyle = lg; ctx.lineWidth = 2.5; ctx.stroke();
    /* 数据点 + 年份标签 */
    daYun.forEach((l, i) => {
      const cur = currentYear >= l.year && currentYear < l.year + 10;
      ctx.beginPath(); ctx.arc(xs(i), yMap(scores[i] * ease), cur ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = cur ? '#f3d27a' : 'rgba(212,175,55,.7)'; ctx.fill();
      if(cur){ ctx.strokeStyle = 'rgba(243,210,122,.5)'; ctx.lineWidth = 3; ctx.stroke(); }
      ctx.fillStyle = cur ? '#fff2c9' : 'rgba(154,144,168,.8)';
      ctx.font = (cur ? '600 ' : '') + '11px "Noto Serif SC"'; ctx.textAlign = 'center';
      ctx.fillText(l.age + '岁', xs(i), H - pad + 18);
    });
    if(prog < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function renderResult(y, m, d, zh){
  const hourNum = zh === 0 ? 0 : zh * 2 - 1; // 时辰中点小时数
  const bazi = lunarBazi(y, m, d, hourNum);
  const pillars = [
    {tag: '年柱', label: '祖上 · 根基', gan: bazi.year.gan, zhi: bazi.year.zhi, nayin: bazi.nayin.year, ss: bazi.shishenGan.year},
    {tag: '月柱', label: '父母 · 事业', gan: bazi.month.gan, zhi: bazi.month.zhi, nayin: bazi.nayin.month, ss: bazi.shishenGan.month},
    {tag: '日柱', label: '自身 · 配偶', gan: bazi.day.gan, zhi: bazi.day.zhi, nayin: bazi.nayin.day, ss: '日主（我）'},
    {tag: '时柱', label: '子女 · 晚运', gan: bazi.hour.gan, zhi: bazi.hour.zhi, nayin: bazi.nayin.hour, ss: bazi.shishenGan.hour}
  ];
  const dayGan = bazi.day.gan, dayEl = GAN_EL[dayGan];
  const counts = {木:0, 火:0, 土:0, 金:0, 水:0};
  pillars.forEach(p => { counts[GAN_EL[p.gan]]++; counts[ZHI_EL[p.zhi]]++; });
  const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
  const strongest = sorted[0], weakest = sorted[sorted.length - 1];
  const currentYear = new Date().getFullYear();

  document.getElementById('pillars').innerHTML = pillars.map((p, i) => `
    <div class="pillar" data-tag="${p.tag}${i===2 ? ' ★':''}">
      <h4>${p.label}</h4>
      <div class="gz">
        <span style="color:${EL_COLOR[GAN_EL[p.gan]]}">${GAN[p.gan]}</span>
        <span style="color:${EL_COLOR[ZHI_EL[p.zhi]]}">${ZHI[p.zhi]}</span>
        <small>${GAN_EL[p.gan]}${GAN_YY[p.gan]} · ${ZHI_EL[p.zhi]}${i===0 ? ' · 属' + ZHI_ANIMAL[p.zhi] : ''}</small>
      </div>
      <div class="nayin">${p.nayin}</div>
      <div class="shishen">${p.ss}</div>
    </div>`).join('');
  gsap.from('#pillars .pillar', {opacity: 0, y: 44, rotateX: -30, stagger: .13, duration: .9, ease: 'back.out(1.5)'});

  document.getElementById('masterLine').innerHTML =
    `日主 <b>${GAN[dayGan]}${dayEl}</b> · ${bazi.nayin.day} 命 · 五行<b>${weakest[1]===0 ? '缺' + weakest[0] : weakest[0] + '偏弱'}</b> · 宜补 <b>${weakest[0]}</b>`;

  const wxBars = document.getElementById('wxBars');
  wxBars.innerHTML = Object.entries(counts).map(([el, c]) => `
    <div class="wx-row">
      <span class="wx-name" style="color:${EL_COLOR[el]}">${el}</span>
      <div class="wx-bar"><i data-w="${c / 8 * 100}" style="background:linear-gradient(90deg,${EL_COLOR[el]}55,${EL_COLOR[el]})"></i></div>
      <span class="wx-pct">${Math.round(c / 8 * 100)}%</span>
    </div>`).join('');
  setTimeout(() => wxBars.querySelectorAll('.wx-bar i').forEach(b => b.style.width = b.dataset.w + '%'), 200);
  document.getElementById('wxVerdict').innerHTML =
    `五行之中，<b style="color:${EL_COLOR[strongest[0]]}">${strongest[0]}</b> 最旺（${EL_TRAIT[strongest[0]]}）；` +
    (weakest[1] === 0
      ? `<b style="color:${EL_COLOR[weakest[0]]}">${weakest[0]}</b> 全无，后天宜多亲近属「${weakest[0]}」之方位、颜色与行业，以补其气。`
      : `<b style="color:${EL_COLOR[weakest[0]]}">${weakest[0]}</b> 稍弱，可稍加扶助，使五行流转更畅。`);

  document.getElementById('luckList').innerHTML = bazi.daYun.map(l => {
    const cur = currentYear >= l.year && currentYear < l.year + 10;
    const g = GAN.indexOf(l.gz[0]);
    return `<div class="luck-item ${cur ? 'current' : ''}">
      <span class="yr">${l.age}岁 · ${l.year}</span>
      <span class="lg" style="color:${EL_COLOR[GAN_EL[g]] || 'inherit'}">${l.gz}</span>
      <span class="tag">${cur ? '◆ 当下大运' : ''}</span>
    </div>`;
  }).join('');

  /* 五行雷达图 */
  drawWxRadar(counts);
  /* 大运运势曲线 */
  drawLuckCurve(bazi.daYun, currentYear, dayEl);

  const analysis = document.getElementById('analysis');
  const thisYearGZ = Lunar.fromDate(new Date()).getYearInGanZhi();
  const tyEl = GAN_EL[GAN.indexOf(thisYearGZ[0])];
  const flowText = tyEl === dayEl ? `今年 ${thisYearGZ} 与日主同气，运势平顺，宜守成稳步` :
    SHENG[tyEl] === dayEl ? `今年 ${thisYearGZ} 生扶日主，贵人运旺，宜进取、宜开口求助` :
    SHENG[dayEl] === tyEl ? `今年 ${thisYearGZ} 泄日主之气，付出较多，辛苦但有积累，注意休养` :
    KE[dayEl] === tyEl ? `今年 ${thisYearGZ} 为日主之财，财运可期，宜主动开拓财源` :
    `今年 ${thisYearGZ} 克制日主，压力与机遇并存，谨慎行事、借势而为可化压力为动力`;
  const paras = [
    `<b>性格总论：</b>${DAYMASTER_DESC[GAN[dayGan]]}`,
    `<b>五行调候：</b>命局${strongest[0]}气当令，为人骨子里带着「${strongest[0]}」的底色。${weakest[1] === 0 ? `独缺「${weakest[0]}」，如琴缺一弦 —— 平日可多穿${weakest[0] === '金' ? '白、金色' : weakest[0] === '木' ? '青、绿色' : weakest[0] === '水' ? '黑、蓝色' : weakest[0] === '火' ? '红、紫色' : '黄、棕色'}衣物，居所宜近${weakest[0] === '水' ? '江河湖海' : weakest[0] === '木' ? '园林草木' : weakest[0] === '火' ? '向阳之地' : weakest[0] === '金' ? '西方高地' : '田园山丘'}。` : `「${weakest[0]}」略弱，偶感相应领域力不从心，稍加留意即可。`}`,
    `<b>流年寄语：</b>${flowText}。${bazi.startAge ? `你于 ${bazi.startAge} 岁起运，` : ''}当下正行「${(bazi.daYun.find(l => currentYear >= l.year && currentYear < l.year + 10) || {}).gz || '—'}」大运，顺势者昌。`
  ];
  analysis.innerHTML = paras.map(() => `<p class="analysis-text"></p>`).join('');
  const pEls = analysis.querySelectorAll('.analysis-text');
  let pi = 0;
  (function typePara(){
    if(pi >= paras.length) return;
    const el = pEls[pi]; el.classList.add('typewriter');
    const html = paras[pi], plain = html.replace(/<[^>]+>/g, '');
    let ci = 0;
    const iv = setInterval(() => {
      ci += 2; el.textContent = plain.slice(0, ci);
      if(ci >= plain.length){
        clearInterval(iv); el.innerHTML = html; el.classList.remove('typewriter');
        pi++; setTimeout(typePara, 160);
      }
    }, 22);
  })();
}

/* ================================================================
   紫微斗数
================================================================ */
const ZW_PALACES = ['命宫','兄弟','夫妻','子女','财帛','疾厄','迁移','交友','官禄','田宅','福德','父母'];
const ZW_INFO = {
  '命宫':'一命之本，统摄全局。主你的性格基调、天赋格局与一生总体走向，是整个命盘的灵魂所在。',
  '兄弟':'主兄弟姐妹、挚友同侪之缘，亦看平辈助力与合作运势。',
  '夫妻':'主感情婚姻与配偶性情，亦反映你对待亲密关系的方式。',
  '子女':'主子女缘分与晚辈子嗣，亦看创造力、作品与桃花。',
  '财帛':'主求财方式与理财能力，看财来财去的格局与量级。',
  '疾厄':'主体质强弱与健康隐患，亦反映内心深处的潜意识与情绪暗流。',
  '迁移':'主外出际遇与社会形象，在外地的运势与人缘皆看此宫。',
  '交友':'主部属、同事与人脉助力，看众人是否愿意为你所用。',
  '官禄':'主事业功名与职场成就，看适合的发展赛道与地位高低。',
  '田宅':'主不动产与居住运势，亦看家庭根基与内心安全感。',
  '福德':'主精神享受与人生福报，看你如何自处、晚年是否安乐。',
  '父母':'主父母缘分与长辈恩荫，亦看与上司、权威的关系。'
};
const ZW_MAJOR = {
  '紫微':'帝星。尊贵孤傲，天生领袖气质，好面子、有主见，得人拥戴。入命者自带三分贵气。',
  '天机':'智星。聪慧善谋，心思活络，点子多而变化快。宜动不宜静，策划参谋之才。',
  '太阳':'贵星。光明磊落，热情博爱，乐于助人而不计回报。昼生之人尤其光芒万丈。',
  '武曲':'财星。刚毅果决，执行力极强，理财有方、行动有力，是将帅与实业家之星。',
  '天同':'福星。温和知足，与世无争，懂得享受生活。福气深厚，但需防过于安逸。',
  '廉贞':'次桃花星。亦正亦邪，原则性强、敢爱敢恨，有权谋之才亦有执着之痛。',
  '天府':'令星。稳重雍容，有包容之量与守成之能，天生掌库之人，衣食丰足。',
  '太阴':'富星。温柔细腻，直觉敏锐，财如月光静静积累。夜生之人尤其灵秀。',
  '贪狼':'桃花星。多才多艺，欲望与魅力并存，交际手腕一流，人生精彩纷呈。',
  '巨门':'暗星。口才出众，洞察力深，能言善辩亦易招惹是非，宜以口才立业。',
  '天相':'印星。正直热心，天生的协调者与辅助者，有服务精神，人缘极佳。',
  '天梁':'荫星。清高慈悲，有长者之风，逢凶能化、遇难呈祥，自带保护伞。',
  '七杀':'将星。刚烈勇猛，敢闯敢拼，人生大开大合。成败皆快，是开拓者之星。',
  '破军':'耗星。破旧立新，先破后成，不甘平庸、永远在折腾。变动之中藏着大机会。'
};
const ZW_AUX = {
  '文昌':'文星。主文才、考试与文书之运，气质儒雅。','文曲':'艺星。主艺术、口才与异性缘，才华横溢。',
  '左辅':'辅星。主贵人相助，为人敦厚，多得平辈扶持。','右弼':'弼星。主机缘助力，性情温和，暗中常有贵人。',
  '天魁':'昼贵人。主白天易得贵人提携，机遇常临。','天钺':'夜贵人。主暗中逢贵，逢凶时常有人出手。',
  '禄存':'禄星。主财源稳定、衣食无亏，有积蓄之能。','天马':'驿马。主变动奔波亦主机会，动中生财。'
};
const ZW_SHA = {
  '擎羊':'煞星。主刚烈冲动，刑伤是非，但亦主决断与突破之力。','陀罗':'煞星。主拖延纠缠，行事易有阻滞，宜磨炼耐心。',
  '火星':'煞星。主急躁暴起，行动风风火火，成败皆快。','铃星':'煞星。主阴沉暗耗，内心起伏较大，宜修心养性。',
  '地空':'空星。主思想超脱、不按常理，亦主财来财去。','地劫':'劫星。主破财波折，亦主另辟蹊径的创造力。'
};
const ZW_SERIES = {紫微:0, 天机:-1, 太阳:-3, 武曲:-4, 天同:-5, 廉贞:-8};
const ZW_SERIES2 = {天府:0, 太阴:1, 贪狼:2, 巨门:3, 天相:4, 天梁:5, 七杀:6, 破军:10};
const WUXINGJU = ['水二局','木三局','金四局','土五局','火六局'];
const MINGZHU_STAR = ['贪狼','巨门','禄存','文曲','廉贞','武曲','破军','武曲','廉贞','文曲','禄存','巨门'];
const ZW_LAYOUT = [7, 6, 5, 4, 8, 3, 9, 2, 10, 1, 11, 0];

/* ===== 纳音五行局表（60 甲子 → 五行局） ===== */
const NAYIN_JU = {
  '甲子':'金四局','乙丑':'金四局','丙寅':'火六局','丁卯':'火六局','戊辰':'木三局','己巳':'木三局',
  '庚午':'土五局','辛未':'土五局','壬申':'金四局','癸酉':'金四局','甲戌':'火六局','乙亥':'火六局',
  '丙子':'水二局','丁丑':'水二局','戊寅':'土五局','己卯':'土五局','庚辰':'金四局','辛巳':'金四局',
  '壬午':'木三局','癸未':'木三局','甲申':'水二局','乙酉':'水二局','丙戌':'土五局','丁亥':'土五局',
  '戊子':'火六局','己丑':'火六局','庚寅':'木三局','辛卯':'木三局','壬辰':'水二局','癸巳':'水二局',
  '甲午':'金四局','乙未':'金四局','丙申':'火六局','丁酉':'火六局','戊戌':'木三局','己亥':'木三局',
  '庚子':'土五局','辛丑':'土五局','壬寅':'金四局','癸卯':'金四局','甲辰':'火六局','乙巳':'火六局',
  '丙午':'水二局','丁未':'水二局','戊申':'土五局','己酉':'土五局','庚戌':'金四局','辛亥':'金四局',
  '壬子':'木三局','癸丑':'木三局','甲寅':'水二局','乙卯':'水二局','丙辰':'土五局','丁巳':'土五局',
  '戊午':'火六局','己未':'火六局','庚申':'木三局','辛酉':'木三局','壬戌':'水二局','癸亥':'水二局'
};

function ziweiCalc(y, m, d, zh){
  /* —— 真农历 & 节气 —— */
  const solar = Solar.fromYmdHms(y, m, d, zh === 0 ? 0 : zh * 2 - 1, 0, 0);
  const lunar = solar.getLunar();
  const lunarMonth = lunar.getMonth();           // 真实农历月（含闰月判断）
  const lunarYearGan = lunar.getYearInGanZhi()[0];
  const yearGan = GAN.indexOf(lunarYearGan);
  /* 节气换月：以生月干支的“月支”为基（lunar.js 已按节气计算） */
  const monthGanZhi = lunar.getMonthInGanZhi();  // 如“丙午”
  const monthBranch = ZHI.indexOf(monthGanZhi[1]); // 月支序号

  /* —— 命宫 & 身宫（以农历月 + 节气月支为基） —— */
  const monthBase = (monthBranch - 2 + 12) % 12; // 寅宫为 0 基准
  const mingPos = (monthBase + (lunarMonth - 1) - zh + 24) % 12;
  const shenPos = (mingPos + 6) % 12;            // 身宫恒在命宫对宫

  /* —— 命宫干支 → 纳音五行局 —— */
  const mingGan = (((yearGan % 5) * 2 + 2) + ((mingPos - 2 + 12) % 12)) % 10;
  const mingGanZhi = GAN[mingGan] + ZHI[mingPos];
  const ju = NAYIN_JU[mingGanZhi] || '土五局';
  const juIdx = WUXINGJU.indexOf(ju);
  const juNum = juIdx + 2;
  let ziweiPos;
  if(d % juNum === 0){ ziweiPos = ((d / juNum) + 1) % 12; }
  else {
    const add = juNum - (d % juNum);
    const q = (d + add) / juNum;
    ziweiPos = (add % 2 === 1) ? ((q + 1 - add) % 12 + 12) % 12 : ((q + 1 + add) % 12);
  }
  const tianfuPos = ((4 - ziweiPos) % 12 + 12) % 12;
  const starMap = Array.from({length: 12}, () => ({major: [], aux: [], sha: []}));
  for(const [s, off] of Object.entries(ZW_SERIES)) starMap[((ziweiPos + off) % 12 + 12) % 12].major.push(s);
  for(const [s, off] of Object.entries(ZW_SERIES2)) starMap[((tianfuPos + off) % 12 + 12) % 12].major.push(s);
  /* —— 文昌文曲：以生年干查表（甲→戌，乙→酉…） —— */
  const WENCHANG_POS = [10, 9, 8, 7, 6, 5, 4, 3, 2, 11]; // 甲乙丙丁戊己庚辛壬癸
  const WENQU_POS    = [4, 5, 6, 7, 8, 9, 10, 11, 0, 1];
  starMap[WENCHANG_POS[yearGan]].aux.push('文昌');
  starMap[WENQU_POS[yearGan]].aux.push('文曲');

  /* —— 左辅右弼：以生月支推算 —— */
  const monthZhi = lunar.getMonthInGanZhi()[1]; // 生月地支
  const monthZhiIdx = ZHI.indexOf(monthZhi);
  starMap[(4 + monthZhiIdx) % 12].aux.push('左辅');
  starMap[(10 - monthZhiIdx + 12) % 12].aux.push('右弼');

  /* —— 天魁天钺：以生年干查表 —— */
  starMap[[1, 0, 11, 11, 1, 0, 1, 6, 3, 3][yearGan]].aux.push('天魁');
  starMap[[7, 8, 9, 9, 7, 8, 7, 2, 5, 5][yearGan]].aux.push('天钺');

  /* —— 禄存 & 擎羊陀罗 & 天马 —— */
  const luPos = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0][yearGan];
  starMap[luPos].aux.push('禄存');
  starMap[(luPos + 1) % 12].sha.push('擎羊');
  starMap[(luPos - 1 + 12) % 12].sha.push('陀罗');
  const yearZhi = lunar.getYearInGanZhi()[1];
  starMap[[2, 11, 8, 5][ZHI.indexOf(yearZhi) % 4]].aux.push('天马');

  /* —— 火星铃星：以生时支查表 —— */
  starMap[[2, 3, 1, 9][zh % 4]].sha.push('火星');
  starMap[[10, 3, 1, 9][zh % 4]].sha.push('铃星');
  starMap[(11 + zh) % 12].sha.push('地空');
  starMap[(11 - zh + 12) % 12].sha.push('地劫');
  return {mingPos, shenPos, ju: WUXINGJU[juIdx], starMap, yearGan, lunarMonth};
}

let zwRendered = false;
function startZiwei(){
  const y = +selY.value, m = parseInt(selM.value), d = parseInt(selD.value);
  const zh = +selH.value === -1 ? 6 : +selH.value;
  const casting = document.getElementById('casting');
  casting.classList.add('show');
  /* 面板状态灯加速呼吸 + CTA 星光扩散反馈 */
  const light = document.getElementById('zlLight');
  if(light) light.classList.add('on');
  const cta = document.getElementById('zwCta');
  if(cta){ cta.classList.remove('burst'); void cta.offsetWidth; cta.classList.add('burst'); }
  setTimeout(() => {
    casting.classList.remove('show');
    renderZiwei(y, m, d, zh);
  }, 1400);
}
document.getElementById('zwBtn').addEventListener('click', startZiwei);
const zwCtaEl = document.getElementById('zwCta');
if(zwCtaEl) zwCtaEl.addEventListener('click', startZiwei);

function renderZiwei(y, m, d, zh){
  const {mingPos, shenPos, ju, starMap, yearGan, lunarMonth} = ziweiCalc(y, m, d, zh);

  /* —— 状态切换：空态退场，星盘/页签/结果登场 —— */
  const empty = document.getElementById('zwEmpty');
  if(empty) empty.style.display = 'none';
  const tabs = document.getElementById('zwTabs');
  if(tabs) tabs.style.display = 'flex';
  const sideRes = document.getElementById('zwSideResult');
  if(sideRes) sideRes.style.display = 'block';
  const zwBtn = document.getElementById('zwBtn');
  if(zwBtn) zwBtn.style.display = 'none';

  /* 侧栏出生信息 */
  document.getElementById('zwDate').textContent = `${y}年${m}月${d}日`;
  document.getElementById('zwTime').textContent = HOUR_NAMES[zh] + '时';
  document.getElementById('zwSex').textContent = document.getElementById('inGender').value === 'male' ? '乾造（男）' : '坤造（女）';

  const chart = document.getElementById('zwChart');
  chart.innerHTML = '';
  const center = document.createElement('div');
  center.className = 'zw-center';
  center.innerHTML = `
    <svg class="zc-taiji" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="47" stroke="#d4af37" stroke-width="1.5" fill="none"/>
      <path d="M50 3a47 47 0 0 1 0 94 23.5 23.5 0 0 1 0-47 23.5 23.5 0 0 0 0-47z" fill="#d4af37" opacity=".85"/>
      <circle cx="50" cy="26.5" r="6.5" fill="#1a110a"/>
      <circle cx="50" cy="73.5" r="6.5" fill="#d4af37"/>
    </svg>
    <div class="zc-name">紫微星盘</div>
    <div class="zc-info">${y}年 ${m}月 ${d}日 ${HOUR_NAMES[zh]}时（农历${lunarMonth}月）<br>${ju} · 命宫在${ZHI[mingPos]}</div>`;
  chart.appendChild(center);
  ZW_LAYOUT.forEach(pos => {
    const isMing = pos === mingPos, isShen = pos === shenPos;
    const pName = ZW_PALACES[(mingPos - pos + 12) % 12];
    const palGan = (((yearGan % 5) * 2 + 2) + ((pos - 2 + 12) % 12)) % 10;
    const box = document.createElement('div');
    box.className = 'palace' + (isMing ? ' ming' : '') + (isShen ? ' shen' : '');
    const stars = starMap[pos];
    box.innerHTML = `
      ${isShen ? '<span class="p-tag">身宫</span>' : ''}
      <div class="p-stars">
        ${stars.major.map(s => `<span class="star-chip star-major">${s}</span>`).join('')}
        ${stars.aux.map(s => `<span class="star-chip star-aux">${s}</span>`).join('')}
        ${stars.sha.map(s => `<span class="star-chip star-sha">${s}</span>`).join('')}
      </div>
      <div class="p-foot">
        <span class="p-name">${pName}</span>
        <span class="p-gz">${GAN[palGan]}${ZHI[pos]}</span>
      </div>`;
    box.addEventListener('click', () => {
      document.querySelectorAll('.palace').forEach(p => p.classList.remove('selected'));
      box.classList.add('selected');
      const det = document.getElementById('zwDetail');
      det.style.display = 'block';
      document.getElementById('zdName').textContent = `${pName} · ${GAN[palGan]}${ZHI[pos]}宫`;
      document.getElementById('zdSub').textContent = stars.major.length ? '主星：' + stars.major.join('、') : '无主星 · 借对宫';
      const starDesc = stars.major.map(s => `<b>${s}</b>：${ZW_MAJOR[s]}`).join('<br>');
      const shaDesc = stars.sha.length ? '<br><span style="color:#e0654f">煞曜：' + stars.sha.map(s => s + '（' + ZW_SHA[s] + '）').join('；') + '</span>' : '';
      document.getElementById('zdText').innerHTML = (starDesc ? starDesc + '<br>' : '') + ZW_INFO[pName] + shaDesc;
      gsap.from(det, {opacity: 0, y: 20, duration: .5, ease: 'power2.out'});
    });
    chart.appendChild(box);
  });
  document.getElementById('zwJu').textContent = ju;
  document.getElementById('zwMingStar').textContent = starMap[mingPos].major.join('、') || '借对宫 ' + starMap[(mingPos + 6) % 12].major.join('、');
  document.getElementById('zwShenPalace').textContent = ZW_PALACES[(mingPos - shenPos + 12) % 12] + '（' + ZHI[shenPos] + '宫）';
  document.getElementById('zwMingZhu').textContent = MINGZHU_STAR[mingPos];
  renderZwBright(mingPos, starMap);
  renderZwDaxian(y, m, d, zh, mingPos, starMap);
  /* 星曜逐个点亮：宫位先展开，星片再错峰浮现，中心太极压轴 */
  gsap.from('.palace', {opacity: 0, scale: .82, stagger: {each: .07, from: 'random'}, duration: .6, ease: 'back.out(1.7)'});
  gsap.from('.palace .star-chip', {opacity: 0, y: 8, scale: .6, stagger: {each: .03, from: 'random'}, duration: .45, delay: .5, ease: 'back.out(2.2)'});
  gsap.from('.zw-center', {opacity: 0, scale: .7, duration: .8, delay: .9, ease: 'back.out(1.5)'});
  const zwStage = document.querySelector('.zw-stage');
  if(zwStage) zwStage.scrollIntoView({behavior: 'smooth', block: 'center'});
}

/* 白话解读：把整盘翻成大白话 */
function starDesc(s){ return ZW_MAJOR[s] ? `<b>${s}</b>：${ZW_MAJOR[s]}` : ''; }
function renderZwEssay(mingPos, shenPos, ju, starMap){
  const mingStars = starMap[mingPos].major;
  const borrow = !mingStars.length;
  const mainStars = borrow ? starMap[(mingPos + 6) % 12].major : mingStars;
  const palaceOf = name => {
    const pos = Object.keys(starMap).find(p => starMap[p].major.includes(name));
    if(pos === undefined) return null;
    return ZW_PALACES[(mingPos - +pos + 12) % 12];
  };
  const paras = [];
  /* 总起 */
  const juPlain = ju.replace('水二局','水二局（水象灵性）').replace('木三局','木三局（木象生发）').replace('金四局','金四局（金象坚毅）').replace('土五局','土五局（土象厚重）').replace('火六局','火六局（火象热情）');
  paras.push(`你的紫微命盘为 <b>${juPlain}</b>，命宫落在 <b>${ZHI[mingPos]}宫</b>。命宫是整张盘的"你"—— 你的性格底色与人生主线，都从这一宫读起。`);
  /* 性格 */
  if(mainStars.length){
    const intro = borrow
      ? `命宫本身没有主星，需借对宫（迁移宫）的 <b>${mainStars.join('、')}</b> 来看。借宫之人往往在外更显本色，环境对你影响很大。`
      : `命宫主星为 <b>${mainStars.join('、')}</b>。`;
    const descs = mainStars.map(s => {
      const t = ZW_MAJOR[s] || '';
      return t ? `${s} —— ${t}` : '';
    }).filter(Boolean).join('<br>');
    paras.push(`<b>你是个怎样的人：</b><br>${intro}<br>${descs}<br>综合看，你的性格关键词就是这几颗星的叠加，优点与需要注意的地方也都在其中。`);
  }
  /* 优势宫位 */
  const highlights = [];
  ['紫微','天府','武曲','太阳','太阴','天梁'].forEach(s => {
    const p = palaceOf(s);
    if(p) highlights.push(`${s}落入 <b>${p}</b>，这方面是你的天然优势（${ZW_INFO[p].split('。')[0].replace(/^主/, '')}）。`);
  });
  if(highlights.length) paras.push(`<b>你天生的强项：</b><br>${highlights.slice(0, 3).join('<br>')}`);
  /* 提醒 */
  const warns = [];
  ['擎羊','陀罗','火星','铃星','地空','地劫'].forEach(s => {
    for(let pos = 0; pos < 12; pos++){
      if(starMap[pos].sha.includes(s)){
        warns.push(`${s}在 <b>${ZW_PALACES[(mingPos - pos + 12) % 12]}</b>，${ZW_SHA[s].split('。')[1] || ZW_SHA[s]}`);
        break;
      }
    }
  });
  if(warns.length) paras.push(`<b>需要留意的地方：</b><br>${warns.slice(0, 3).join('<br>')}`);
  /* 身宫 */
  const shenName = ZW_PALACES[(mingPos - shenPos + 12) % 12];
  paras.push(`<b>身宫</b>在 <b>${shenName}</b>。身宫代表你后天努力的方向、中年后越来越看重的领域 —— 后半生的重心，往往就落在「${shenName}」之上。`);
  paras.push(`<b>怎么看盘：</b>点击左侧任意一个宫位，下方会给出该宫的星曜详解；中间三个页签可切换「本命星盘 / 星曜亮度 / 大限流年」。`);

  const box = document.getElementById('zwEssay');
  box.style.display = 'block';
  const empty = document.getElementById('zwEssayEmpty');
  if(empty) empty.style.display = 'none';
  document.getElementById('zwEssayText').innerHTML = paras.map(p => `<p class="zw-para">${p}</p>`).join('');
  gsap.from(box, {opacity: 0, y: 20, duration: .6, ease: 'power2.out'});
}

/* 星曜亮度表 */
const ZW_BRIGHT = {
  '紫微':['平','庙','旺','庙','平','旺','旺','庙','庙','陷','旺','平'],
  '天机':['陷','庙','平','旺','陷','平','庙','旺','平','陷','平','庙'],
  '太阳':['陷','旺','庙','庙','旺','平','平','陷','庙','旺','旺','陷'],
  '武曲':['庙','平','旺','陷','庙','旺','平','庙','旺','平','庙','陷'],
  '天同':['旺','陷','平','庙','旺','陷','平','庙','平','旺','陷','庙'],
  '廉贞':['平','陷','庙','平','旺','陷','庙','平','旺','庙','陷','平'],
  '天府':['庙','庙','旺','平','庙','平','旺','庙','平','庙','旺','平'],
  '太阴':['庙','庙','陷','旺','平','陷','庙','平','陷','旺','平','庙'],
  '贪狼':['旺','平','庙','陷','旺','平','庙','陷','旺','平','庙','陷'],
  '巨门':['庙','陷','旺','平','庙','陷','旺','平','庙','陷','旺','平'],
  '天相':['庙','旺','平','庙','陷','旺','平','庙','旺','平','庙','平'],
  '天梁':['庙','陷','庙','旺','平','庙','陷','旺','平','庙','旺','陷'],
  '七杀':['旺','庙','平','陷','旺','庙','平','陷','庙','旺','平','庙'],
  '破军':['庙','陷','旺','平','庙','陷','旺','平','庙','旺','陷','庙']
};
function renderZwBright(mingPos, starMap){
  const rows = [];
  starMap.forEach((stars, pos) => {
    stars.major.forEach(s => {
      const lv = (ZW_BRIGHT[s] || [])[pos] || '平';
      const cls = lv === '庙' ? 'bright-miao' : lv === '旺' ? 'bright-wang' : lv === '陷' ? 'bright-xian' : 'bright-ping';
      const pName = ZW_PALACES[(mingPos - pos + 12) % 12];
      rows.push({s, lv, cls, pName, pos});
    });
  });
  const order = {庙: 0, 旺: 1, 平: 2, 陷: 3};
  rows.sort((a, b) => order[a.lv] - order[b.lv]);
  document.getElementById('zwBright').innerHTML = `
    <h3>十四主星亮度</h3>
    <table>
      <thead><tr><th>主星</th><th>落宫</th><th>宫位</th><th>亮度</th></tr></thead>
      <tbody>${rows.map(r => `<tr>
        <td style="color:#f3d27a">${r.s}</td><td>${r.pName}</td><td>${ZHI[r.pos]}宫</td>
        <td><span class="bright-badge ${r.cls}">${r.lv}</span></td>
      </tr>`).join('')}</tbody>
    </table>
    <p class="form-note" style="margin-top:14px">※ 庙最亮、旺次之、平寻常、陷无力。主星入庙则吉力尽显，落陷则特质受阻。</p>`;
}

/* 大限表 */
function renderZwDaxian(y, m, d, zh, mingPos, starMap){
  const juNum = ['水二局','木三局','金四局','土五局','火六局'].indexOf(
    document.getElementById('zwJu').textContent) + 2;
  const forward = document.getElementById('inGender').value === 'male';
  const rows = [];
  for(let i = 0; i < 12; i++){
    const pos = forward ? (mingPos + i) % 12 : (mingPos - i + 12) % 12;
    const startAge = juNum + i * 10;
    rows.push({
      range: `${startAge}–${startAge + 9} 岁`,
      palace: ZW_PALACES[(mingPos - pos + 12) % 12],
      gz: ZHI[pos] + '宫',
      stars: starMap[pos].major.join('、') || '—',
      age: startAge
    });
  }
  const curAge = new Date().getFullYear() - y;
  document.getElementById('zwDaxian').innerHTML = `
    <h3>十二宫大限</h3>
    <div class="luck-list">${rows.map(r => {
      const cur = curAge >= r.age && curAge < r.age + 10;
      return `<div class="luck-item ${cur ? 'current' : ''}">
        <span class="yr">${r.range}</span>
        <span class="lg" style="font-size:16px">${r.palace} · ${r.stars}</span>
        <span class="tag">${cur ? '◆ 当下大限' : ''}</span>
      </div>`;
    }).join('')}</div>
    <p class="form-note" style="margin-top:14px">※ 大限即十年大运在命盘十二宫中的轮转，${juNum}岁起限，${forward ? '顺行' : '逆行'}十二宫。</p>`;
}

/* 页签切换 */
document.getElementById('zwTabs').addEventListener('click', e => {
  const btn = e.target.closest('.zw-tab');
  if(!btn) return;
  document.querySelectorAll('.zw-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const pane = btn.dataset.pane;
  ['chart','bright','daxian'].forEach(k => {
    document.getElementById('zwPane' + k[0].toUpperCase() + k.slice(1)).style.display = k === pane ? 'block' : 'none';
  });
  const active = document.getElementById('zwPane' + pane[0].toUpperCase() + pane.slice(1));
  gsap.from(active, {opacity: 0, y: 24, duration: .5, ease: 'power2.out'});
});

/* ================================================================
   塔罗占卜
================================================================ */
const TAROT = [
  {n:'愚者', e:'THE FOOL', s:'🃏', k:'开始 · 自由 · 冒险',
   up:'新的开始正在招手。像愚者一样带着纯真与勇气上路吧 —— 未知的旅程虽有风险，但宇宙会托住敢于纵身一跃的人。',
   rev:'鲁莽与逃避在暗中作祟。行动之前先看清脚下：是勇敢出发，还是在逃避本该面对的责任？'},
  {n:'魔术师', e:'THE MAGICIAN', s:'⚡', k:'创造 · 意志 · 资源',
   up:'你已集齐四元素的权杖 —— 天时地利人和尽在手中。此刻是显化愿望的最佳时机，想到就去做。',
   rev:'能量涣散或误入歧途。检查你的意图是否纯粹，技巧是否用错了地方；勿被花言巧语之人蒙蔽。'},
  {n:'女祭司', e:'THE HIGH PRIESTESS', s:'🌙', k:'直觉 · 秘密 · 潜意识',
   up:'答案不在喧嚣处，而在静默里。相信你的直觉与梦境，帷幕之后的真相正在向你显影。静观其变是上策。',
   rev:'直觉被噪音淹没。你可能忽视了内心的声音，或有秘密即将浮出水面 —— 回到内心去寻找答案。'},
  {n:'女皇', e:'THE EMPRESS', s:'🌾', k:'丰饶 · 滋养 · 母性',
   up:'丰饶女神的眷顾降临。感情、创作与物质都进入滋养期 —— 允许自己被爱，也慷慨地给予爱。',
   rev:'滋养的天平失衡了。过度付出正在消耗你，或创造力的河流被堵塞 —— 先把自己的杯子斟满。'},
  {n:'皇帝', e:'THE EMPEROR', s:'👑', k:'秩序 · 权威 · 结构',
   up:'建立秩序的时候到了。用规则、纪律和长远规划为你的王国筑基 —— 稳定的结构会带来持久的安全。',
   rev:'控制欲正在反噬。僵化与专制只会让王国崩塌 —— 权力需要温度，规则需要弹性。'},
  {n:'教皇', e:'THE HIEROPHANT', s:'📜', k:'传统 · 信仰 · 指引',
   up:'智者的声音值得聆听。向传统、师承或专业体系求教，正道之光会照亮你的疑惑。',
   rev:'教条正在成为枷锁。有些规则生来就是要被打破的 —— 你的道路，未必需要别人的祝福。'},
  {n:'恋人', e:'THE LOVERS', s:'💞', k:'爱 · 选择 · 结合',
   up:'爱与灵魂的共振正在发生。无论是感情还是重要的合作，真心换真心 —— 同时也要看清：这是一个重要的选择。',
   rev:'关系的天平倾斜，或选择出于恐惧而非爱。先问问自己：这真的是我想要的吗？'},
  {n:'战车', e:'THE CHARIOT', s:'🏹', k:'意志 · 胜利 · 掌控',
   up:'驾驭好你的黑白双狮。以坚定的意志力冲锋，冲突与阻碍都会让路 —— 胜利属于自律的勇士。',
   rev:'方向失控或动力内耗。两头猛兽正在撕扯 —— 先统一内心的方向，再谈冲锋。'},
  {n:'力量', e:'STRENGTH', s:'🦁', k:'勇气 · 柔韧 · 驯服',
   up:'真正的力量是温柔的坚定。以柔克刚、以爱驯兽 —— 你内在的韧性远比想象中强大。',
   rev:'自我怀疑正在啃噬勇气，或以蛮力硬碰硬。记住：温柔从来不是软弱。'},
  {n:'隐士', e:'THE HERMIT', s:'🏮', k:'内省 · 孤独 · 智慧',
   up:'提灯独行并非孤独，而是修行。暂时退出喧嚣，向内探寻 —— 答案藏在你灵魂的深处。',
   rev:'过度孤立或拒绝内省。灯光不是用来躲避世界的 —— 是时候下山了，或真正开始面对自己。'},
  {n:'命运之轮', e:'WHEEL OF FORTUNE', s:'☸️', k:'转机 · 周期 · 命运',
   up:'命运之轮开始转动，否极泰来。顺势而为，抓住这次周期的上升气流 —— 好运偏爱有准备的人。',
   rev:'轮盘暂时逆行的阶段。抗拒改变只会更颠簸 —— 接受低谷也是周期的一部分，轮盘终会再转。'},
  {n:'正义', e:'JUSTICE', s:'⚖️', k:'公正 · 因果 · 真相',
   up:'天平终会回归平衡。诚实面对每一个选择，种下的因正在结果 —— 公正站在你这边。',
   rev:'失衡与不公正在发生，或你在逃避该负的责任。因果从不缺席 —— 检视自己的那一端秤盘。'},
  {n:'倒吊人', e:'THE HANGED MAN', s:'🙃', k:'牺牲 · 换角 · 臣服',
   up:'倒挂不是受难，而是换一个角度看世界。自愿的暂停与放手，会换来顿悟与新视野。',
   rev:'无谓的牺牲或拖延。有些倒挂只是在浪费时间 —— 分清「蛰伏」与「停滞」，该下来了。'},
  {n:'死神', e:'DEATH', s:'🦋', k:'结束 · 转化 · 重生',
   up:'一个章节必须落幕，新章才能开启。别哀悼枯萎的花瓣 —— 蜕变正在发生，放手即新生。',
   rev:'紧抓着已经死去的东西不放。抗拒结束只会延长痛苦 —— 允许它离开，你才会自由。'},
  {n:'节制', e:'TEMPERANCE', s:'🏺', k:'平衡 · 调和 · 耐心',
   up:'水火交融的艺术正在你手中。保持中庸与耐心，慢慢调和 —— 最好的答案往往在两极之间。',
   rev:'天平严重倾斜，某处正在过度。回到中道：节制不是压抑，而是让能量重新流动。'},
  {n:'恶魔', e:'THE DEVIL', s:'⛓️', k:'束缚 · 欲望 · 阴影',
   up:'看清锁链才能解开锁链。直面你的欲望、执念或依赖 —— 阴影被照亮的那一刻，就是它松手的时刻。',
   rev:'枷锁正在松动！你已经开始觉醒并挣脱束缚 —— 继续把阴影拉到阳光下，自由在望。'},
  {n:'高塔', e:'THE TOWER', s:'⚡', k:'崩塌 · 觉醒 · 剧变',
   up:'旧结构的崩塌是为了给真相腾地方。闪电劈开的裂缝里，会照进真正的光 —— 废墟之上，重建更真实的你。',
   rev:'你在勉强支撑一座注定倾塌的塔。与其等雷劈下来，不如自己先拆 —— 主动的变革总比被动的崩塌温柔。'},
  {n:'星星', e:'THE STAR', s:'⭐', k:'希望 · 疗愈 · 灵感',
   up:'风暴过后，星星出来了。希望、疗愈与灵感正在注入你的生命 —— 大胆许愿吧，宇宙正在倾听。',
   rev:'希望被自我怀疑遮蔽。星星其实一直都在 —— 擦干眼睛，重新校准你与梦想的连线。'},
  {n:'月亮', e:'THE MOON', s:'🌕', k:'迷雾 · 潜意识 · 幻象',
   up:'月光下的路看不真切，恐惧会被放大。别急着做重大决定 —— 等满月照亮真相，迷雾自会散去。',
   rev:'迷雾正在散开。那些夜里的恐惧，天亮后大多只是影子 —— 真相浮现，焦虑退潮。'},
  {n:'太阳', e:'THE SUN', s:'☀️', k:'喜悦 · 成功 · 活力',
   up:'太阳高照，万物生长！成功、喜悦与活力扑面而来 —— 这是尽情绽放、享受荣光的时刻。',
   rev:'乌云暂时遮住了太阳，或成功迟到了一点点。别怀疑 —— 光从未离开，只是转了个角度。'},
  {n:'审判', e:'JUDGEMENT', s:'🎺', k:'觉醒 · 召唤 · 重生',
   up:'天使的号角响起 —— 聆听内心更高版本的召唤。过去的种种正在得到清算与升华，回应它，你将重生。',
   rev:'你听到了召唤却假装没听见。自我批判或逃避课题只会让号角一再响起 —— 是时候回应了。'},
  {n:'世界', e:'THE WORLD', s:'🌍', k:'圆满 · 完成 · 整合',
   up:'一个完整的圆画成了。长期的努力抵达圆满，庆祝它 —— 然后带着这份完整，优雅地开启下一段旅程。',
   rev:'离圆满只差最后一步，或不愿为旧章节画上句号。完成它、关上它 —— 新世界的大门才会打开。'}
];

const deckZone = document.getElementById('deckZone');
let pickedCards = [];

function buildDeck(){
  deckZone.innerHTML = ''; pickedCards = [];
  document.getElementById('tarotResult').style.display = 'none';
  document.getElementById('tarotReset').style.display = 'none';
  for(let i = 0; i < 7; i++){
    const c = document.createElement('div');
    c.className = 'deck-card';
    c.innerHTML = `<div class="dc-in">
      <div class="dc-face dc-front">
        <svg viewBox="0 0 100 170">
          <rect x="6" y="6" width="88" height="158" rx="8" fill="none" stroke="#d4af37" stroke-width="1.2" opacity=".85"/>
          <rect x="12" y="12" width="76" height="146" rx="6" fill="none" stroke="#f9efd8" stroke-width=".7" opacity=".35"/>
          <circle cx="50" cy="85" r="26" fill="none" stroke="#d4af37" stroke-width="1" opacity=".9"/>
          <path d="M50 59a26 26 0 0 1 0 52 13 13 0 0 1 0-26 13 13 0 0 0 0-26z" fill="#d4af37" opacity=".75"/>
          <circle cx="50" cy="72" r="3.5" fill="#171029"/>
          <circle cx="50" cy="98" r="3.5" fill="#d4af37"/>
          <text x="50" y="34" text-anchor="middle" font-size="11" fill="#f9efd8" letter-spacing="3">玄机阁</text>
          <text x="50" y="146" text-anchor="middle" font-size="12" fill="#f3d27a">✦ ✦ ✦</text>
        </svg>
      </div>
      <div class="dc-face dc-back"></div>
    </div>`;
    c.addEventListener('click', () => pickTarot(c));
    deckZone.appendChild(c);
  }
  gsap.from('.deck-card', {opacity: 0, y: 60, stagger: .08, duration: .7, ease: 'back.out(1.2)', clearProps: 'transform,opacity'});
}
buildDeck();

function pickTarot(el){
  if(el.classList.contains('picked') || pickedCards.length >= 3) return;
  el.classList.add('picked');
  let idx; do { idx = Math.floor(Math.random() * TAROT.length); } while(pickedCards.some(c => c.idx === idx));
  const rev = Math.random() < .38;
  pickedCards.push({idx, rev});
  const card = TAROT[idx];
  el.querySelector('.dc-back').innerHTML = tarotFace(card, rev);
  el.classList.add('flipped');
  if(pickedCards.length === 3) setTimeout(showTarotReading, 1000);
}

function tarotFace(card, rev){
  return `<div style="width:100%;height:100%;background:linear-gradient(165deg,#241a3e,#120b20 75%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:8px;${rev ? 'transform:rotate(180deg)' : ''}">
    <span style="font-size:34px;filter:drop-shadow(0 0 10px rgba(212,175,55,.7))">${card.s}</span>
    <span style="font-size:14px;letter-spacing:3px;color:#f3d27a;font-family:var(--xw)">${card.n}</span>
    <span style="font-size:8px;letter-spacing:2px;color:#9a8873">${card.e}</span>
    <span style="font-size:9px;letter-spacing:1px;color:#9a8873">${card.k}</span>
  </div>` + (rev ? '<span class="reversed-tag">逆位</span>' : '');
}

function showTarotReading(){
  const posNames = ['过去 · 溯源', '现在 · 处境', '未来 · 走向'];
  const row = document.getElementById('tarotRow');
  row.innerHTML = pickedCards.map((c, i) => {
    const card = TAROT[c.idx];
    return `<div class="t-card">
      <div class="tc-img">${tarotFace(card, c.rev)}</div>
      <div class="tc-pos">${posNames[i]}</div>
      <div class="tc-name">${card.n}<i>${card.e}</i></div>
      ${c.rev ? '<div class="tc-rev">逆 位</div>' : ''}
    </div>`;
  }).join('');
  const q = document.getElementById('tarotQ').value.trim();
  const interpret = document.getElementById('tarotInterpret');
  interpret.innerHTML = (q ? `<p><b>君之所问：</b>「${q}」</p>` : '') +
    pickedCards.map((c, i) => {
      const card = TAROT[c.idx];
      const label = ['<b>过去</b>', '<b>现在</b>', '<b>未来</b>'][i];
      return `<p>${label}位落下 <b>「${card.n}${c.rev ? '·逆位' : ''}」</b> —— ${c.rev ? card.rev : card.up}</p>`;
    }).join('') +
    `<p><b>总断：</b>三张牌连成一线 —— 过去的「${TAROT[pickedCards[0].idx].n}」造就了现在的「${TAROT[pickedCards[1].idx].n}」，而未来的「${TAROT[pickedCards[2].idx].n}」，取决于你此刻的选择。牌指方向，路在脚下。</p>`;
  document.getElementById('tarotResult').style.display = 'block';
  document.getElementById('tarotReset').style.display = 'inline-flex';
  gsap.to('.t-card', {opacity: 1, y: 0, stagger: .3, duration: .9, ease: 'power3.out'});
  gsap.from(interpret, {opacity: 0, y: 30, duration: .8, delay: 1, ease: 'power2.out'});
  document.getElementById('tarotResult').scrollIntoView({behavior: 'smooth', block: 'center'});
}
document.getElementById('tarotReset').addEventListener('click', buildDeck);

/* ================================================================
   梅花易数
================================================================ */
const TRIGRAM = {
  '111': {n:'乾', s:'☰', el:'金', nat:'天', x:'刚健中正，自强不息'},
  '110': {n:'兑', s:'☱', el:'金', nat:'泽', x:'喜悦口舌，以和悦人'},
  '101': {n:'离', s:'☲', el:'火', nat:'火', x:'光明依附，文明之象'},
  '100': {n:'震', s:'☳', el:'木', nat:'雷', x:'震动奋发，雷厉风行'},
  '011': {n:'巽', s:'☴', el:'木', nat:'风', x:'谦逊渗透，无孔不入'},
  '010': {n:'坎', s:'☵', el:'水', nat:'水', x:'险中求进，以智渡险'},
  '001': {n:'艮', s:'☶', el:'土', nat:'山', x:'止而后定，稳如泰山'},
  '000': {n:'坤', s:'☷', el:'土', nat:'地', x:'厚德载物，包容顺从'}
};
const GUA_NAME = {
  '111111':'乾为天','000000':'坤为地','100010':'水雷屯','010001':'山水蒙',
  '111010':'水天需','010111':'天水讼','010000':'地水师','000010':'水地比',
  '111011':'风天小畜','110111':'天泽履','111000':'地天泰','000111':'天地否',
  '101111':'天火同人','111101':'火天大有','001000':'地山谦','000100':'雷地豫',
  '100110':'泽雷随','011001':'山风蛊','110000':'地泽临','000011':'风地观',
  '100101':'火雷噬嗑','101001':'山火贲','000001':'山地剥','100000':'地雷复',
  '100111':'天雷无妄','111001':'山天大畜','100001':'山雷颐','011110':'泽风大过',
  '010010':'坎为水','101101':'离为火','001110':'泽山咸','011100':'雷风恒',
  '001111':'天山遁','111100':'雷天大壮','000101':'火地晋','101000':'地火明夷',
  '101011':'风火家人','110101':'火泽睽','001010':'水山蹇','010100':'雷水解',
  '110001':'山泽损','100011':'风雷益','111110':'泽天夬','011111':'天风姤',
  '000110':'泽地萃','011000':'地风升','010110':'泽水困','011010':'水风井',
  '101110':'泽火革','011101':'火风鼎','100100':'震为雷','001001':'艮为山',
  '001011':'风山渐','110100':'雷泽归妹','101100':'雷火丰','001101':'火山旅',
  '011011':'巽为风','110110':'兑为泽','010011':'风水涣','110010':'水泽节',
  '110011':'风泽中孚','100001':'雷山小过','010101':'水火既济','101010':'火水未济'
};
const YAO_CI = {
  '111111': ['潜龙勿用','见龙在田，利见大人','君子终日乾乾，夕惕若厉','或跃在渊，无咎','飞龙在天，利见大人','亢龙有悔'],
  '000000': ['履霜，坚冰至','直方大，不习无不利','含章可贞，或从王事','括囊，无咎无誉','黄裳，元吉','龙战于野，其血玄黄'],
  '010010': ['习坎入坎，失道凶也','坎有险，求小得','来之坎坎，险且枕','樽酒簋贰，用缶纳约','坎不盈，祗既平','系用徽纆，寘于丛棘'],
  '101101': ['履错然，敬之无咎','黄离，元吉','日昃之离，不鼓缶而歌','突如其来如，焚如死如','出涕沱若，戚嗟若','王用出征，有嘉折首']
};
const GUA_JIE_DEFAULT = {
  吉: ['此卦气象通达，所谋之事得天时相助，宜把握当下、果断前行。', '卦象和顺，诸事虽有缓滞，终能如愿。守正以待，福泽自至。'],
  中: ['卦象吉凶参半，成败系于人为。谨慎筹划、广结善缘，可趋吉避凶。', '此卦主守。目下宜稳不宜进，蓄力待发，时机成熟自然水到渠成。'],
  慎: ['卦中暗藏险阻，行事宜再三斟酌。退一步海阔天空，勿与大势硬抗。', '此卦示警：所求之事根基未稳，宜先补根基、修内功，再图进取。']
};

let tossCount = 0, yaoLines = [], dongYao = -1;
const tossBtn = document.getElementById('tossBtn');
const coinEls = document.querySelectorAll('#coins .coin');

/* ===== 铜钱音效（WebAudio 合成，无外部文件） ===== */
let coinAC = null;
function coinCtx(){
  if(!coinAC) coinAC = new (window.AudioContext || window.webkitAudioContext)();
  if(coinAC.state === 'suspended') coinAC.resume();
  return coinAC;
}
/* 摇币「哗啦」：一簇金属抖动 */
function sfxShake(){
  try{
    const ac = coinCtx(), now = ac.currentTime;
    for(let i = 0; i < 7; i++){
      const t = now + i * .05 + Math.random() * .03;
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'square';
      o.frequency.value = 2200 + Math.random() * 2600;
      g.gain.setValueAtTime(.0001, t);
      g.gain.exponentialRampToValueAtTime(.05 + Math.random() * .05, t + .005);
      g.gain.exponentialRampToValueAtTime(.0001, t + .06 + Math.random() * .04);
      o.connect(g); g.connect(ac.destination);
      o.start(t); o.stop(t + .12);
    }
  }catch(e){}
}
/* 落地清脆「叮」：高频金属敲击 + 指数衰减 */
function sfxClink(delay = 0, vol = .22){
  try{
    const ac = coinCtx(), t = ac.currentTime + delay;
    const o1 = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain();
    o1.type = 'triangle'; o1.frequency.value = 4200 + Math.random() * 900;
    o2.type = 'sine';     o2.frequency.value = 6800 + Math.random() * 600;
    g.gain.setValueAtTime(.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + .004);
    g.gain.exponentialRampToValueAtTime(.0001, t + .28 + Math.random() * .1);
    o1.connect(g); o2.connect(g); g.connect(ac.destination);
    o1.start(t); o1.stop(t + .45); o2.start(t); o2.stop(t + .45);
  }catch(e){}
}

/* 掷铜钱：三币错时弹跳（100~300ms 差），空中 rotateX/Y/Z 3D 翻转，落地各自「叮」 */
tossBtn.addEventListener('click', () => {
  if(tossCount >= 6 || tossBtn.disabled) return;
  tossBtn.disabled = true;

  /* 先决定三币朝向（正=3 / 背=2），让翻转 parity 对应 */
  const vals = Array.from({length: 3}, () => Math.random() < .5 ? 3 : 2);

  sfxShake();
  coinEls.forEach((c, i) => {
    const faceFront = vals[i] === 3;                 /* 正面（字面）朝上 */
    c.style.setProperty('--final', faceFront ? '0deg' : '180deg');
    c.style.setProperty('--tiltX', (8 + Math.random() * 10) + 'deg');
    c.style.setProperty('--tiltZ', (Math.random() * 14 - 7) + 'deg');
    const lag = 100 + Math.random() * 200;           /* 错时 100~300ms */
    setTimeout(() => {
      c.classList.add('tossing');
      sfxClink(.0, .1);                              /* 起跳轻碰 */
      setTimeout(() => sfxClink(0, .24), 640);       /* 落地重「叮」 */
    }, lag);
  });

  setTimeout(() => {
    coinEls.forEach(c => c.classList.remove('tossing'));
    const sum = vals.reduce((a, b) => a + b, 0);
    const isYang = sum % 2 === 1;
    const isDong = sum === 6 || sum === 9;
    yaoLines.push({yang: isYang, dong: isDong});
    if(isDong) dongYao = tossCount;
    renderYaoLine(tossCount, isYang, isDong);
    coinEls.forEach((c, i) => { c.style.transform = `rotateY(${vals[i] === 3 ? 0 : 180}deg)`; });
    tossCount++;
    tossBtn.textContent = tossCount < 6 ? `掷 铜钱（第 ${tossCount + 1} 爻）` : '推演卦象…';
    tossBtn.disabled = false;
    if(tossCount === 6) setTimeout(showGua, 900);
  }, 1500);
});

function renderYaoLine(i, yang, dong){
  const box = document.getElementById('guaLines');
  const div = document.createElement('div');
  div.className = 'gua-line' + (yang ? '' : ' yin') + (dong ? ' moving' : '');
  div.innerHTML = yang
    ? `<span class="yl"></span><span class="yl-label">${dong ? '老阳' : '少阳'}</span>${dong ? '<span class="dong">◆ 动爻</span>' : ''}`
    : `<span class="yl"></span><span class="yl r"></span><span class="yl-label">${dong ? '老阴' : '少阴'}</span>${dong ? '<span class="dong">◆ 动爻</span>' : ''}`;
  box.appendChild(div);
  gsap.to(div, {opacity: 1, duration: .4});
  gsap.from(div, {x: -40, duration: .5, ease: 'back.out(2)'});
}

function showGua(){
  const bits = yaoLines.map(l => l.yang ? '1' : '0').join('');
  const lower = bits.slice(0, 3), upper = bits.slice(3, 6);
  const key = upper + lower;
  const name = GUA_NAME[key] || '未知卦';
  const symbol = TRIGRAM[upper].s + ' ' + TRIGRAM[lower].s;
  const elU = TRIGRAM[upper].el, elL = TRIGRAM[lower].el;
  let rel, grade;
  if(elU === elL){ rel = '比和'; grade = '吉'; }
  else if(SHENG[elL] === elU){ rel = '体生用'; grade = '中'; }
  else if(SHENG[elU] === elL){ rel = '用生体'; grade = '吉'; }
  else if(KE[elU] === elL){ rel = '用克体'; grade = '慎'; }
  else { rel = '体克用'; grade = '中'; }
  const jiePool = GUA_JIE_DEFAULT[grade];
  const jie = jiePool[Math.floor(Math.random() * jiePool.length)];

  document.getElementById('mhEmpty').style.display = 'none';
  const box = document.getElementById('mhResult');
  box.style.display = 'block';
  const q = document.getElementById('meihuaQ').value.trim();
  document.getElementById('guaTitle').textContent = name;
  document.getElementById('guaSymbol').textContent = symbol;
  document.getElementById('guaSub').textContent =
    `上${TRIGRAM[upper].n}（${TRIGRAM[upper].nat}·${elU}）下${TRIGRAM[lower].n}（${TRIGRAM[lower].nat}·${elL}）· 五行${rel}` +
    (q ? ` · 所问：${q}` : '');
  let ciText = '六爻安静，以卦辞为断：宜静观其变，循卦象之性行事。';
  if(dongYao >= 0){
    const ciList = YAO_CI[key];
    const ci = ciList ? ciList[dongYao] : `第${['初','二','三','四','五','上'][dongYao]}爻动 —— 动则有变，变则通`;
    ciText = `动爻在第${['初','二','三','四','五','上'][dongYao]}爻：「${ci}」`;
  }
  document.getElementById('guaCi').textContent = ciText;
  document.getElementById('guaJie').innerHTML =
    `<b>断曰：</b>${jie}` +
    `<br><b>卦性：</b>${TRIGRAM[upper].n}者，${TRIGRAM[upper].x}；${TRIGRAM[lower].n}者，${TRIGRAM[lower].x}。上下相叠，${grade === '吉' ? '气机相生，顺势可成' : grade === '慎' ? '气机相克，须以柔化刚' : '气机相持，人事为要'}。`;
  let changeHtml;
  if(dongYao >= 0){
    const changed = yaoLines.map((l, i) => (i === dongYao ? !l.yang : l.yang)).map(v => v ? '1' : '0').join('');
    const cName = GUA_NAME[changed.slice(3, 6) + changed.slice(0, 3)] || '未知卦';
    changeHtml = `<b>之卦：</b>动爻一变，${name} 之 <b>${cName}</b> —— 事情的最终走向，藏在变卦之中。`;
  } else {
    changeHtml = `<b>之卦：</b>无动爻，事体稳定，短期内格局难有大的改变。`;
  }
  document.getElementById('guaChange').innerHTML = changeHtml;
  gsap.from(box, {opacity: 0, y: 30, duration: .8, ease: 'power3.out'});
  tossBtn.textContent = '重新起卦';
  tossBtn.disabled = false;
  tossBtn.onclick = resetMeihua;
  document.getElementById('mhCard').scrollIntoView({behavior: 'smooth', block: 'center'});
}

function resetMeihua(){
  tossCount = 0; yaoLines = []; dongYao = -1;
  document.getElementById('guaLines').innerHTML = '';
  document.getElementById('mhResult').style.display = 'none';
  document.getElementById('mhEmpty').style.display = 'block';
  coinEls.forEach(c => { c.style.transform = 'rotateY(0)'; });
  tossBtn.textContent = '掷 铜钱（第 1 爻）';
  tossBtn.onclick = null;
}

/* ================================================================
   观音灵签（签在筒内，抽出动画）
================================================================ */
const QIAN = [
  {g:'上上签',t:'天开文运',p:['云开月出正分明','不须进退问前程','婚姻皆由天注定','和合清吉万事成'],j:'此签云开见月之象。所谋之事，先前迷雾尽散，自此一路坦荡。宜大胆前行，贵人已在途中。'},
  {g:'上吉签',t:'鲤鱼跃龙门',p:['一跃龙门身价高','从今平步上青云','功名富贵皆有望','福禄双全喜临门'],j:'多年蛰伏，一跃之机已至。事业学业皆有突破，宜主动争取，切莫错过东风。'},
  {g:'上吉签',t:'春风得意',p:['春风得意马蹄疾','一日看尽长安花','莫言前路无知己','天下谁人不识君'],j:'运势如春风拂面，诸事顺遂。人际大开，名声渐起，把握当下好时光。'},
  {g:'中吉签',t:'守得云开',p:['守得云开见月明','耐心等待福自来','莫嫌目下多辛苦','苦尽甘来运自开'],j:'目下或有阻滞，然黎明在前。此签主守，不宜冒进，静待时机成熟，自有转机。'},
  {g:'中吉签',t:'积水成渊',p:['积水成渊蛟龙生','积土成山风雨兴','劝君莫把小事弃','日积月累功自成'],j:'大事起于微末。眼下所做虽小事，皆是根基。坚持积累，量变终致质变。'},
  {g:'上上签',t:'紫气东来',p:['紫气东来满乾坤','瑞霭盈门福自臻','贵人指引前行路','功成名就报君恩'],j:'大吉之兆。贵气自东方而来，事业得贵人提携，家宅平安，心想事成。'},
  {g:'中平签',t:'稳中求进',p:['行船须防暗礁险','为人且守本分心','平安二字值千金','稳中求进是良箴'],j:'平稳之签。当前宜守不宜攻，凡事三思后行，守住根本即是赢。'},
  {g:'上吉签',t:'枯木逢春',p:['枯木逢春再发芽','困龙得水上云霞','从前多少蹉跎事','今日重新绽光华'],j:'否极泰来。过去困顿皆成序章，生机已现，重整旗鼓，大有可为。'},
  {g:'中吉签',t:'贵人相助',p:['迷途幸遇指路人','柳暗花明又一村','但存感恩方寸地','自有贵人来助君'],j:'遇事莫慌，自有贵人现身相助。以诚心待人，福气自会流转。'},
  {g:'上上签',t:'金玉满堂',p:['金玉满堂喜气扬','财源滚滚达三江','一年四季皆兴旺','阖家安康福无疆'],j:'财运亨通之签。正财偏财皆有进益，宜把握良机，亦可布施积福。'},
  {g:'中平签',t:'以静制动',p:['心静自然凉气生','动中求静静中宁','凡事不可太急进','以静制动胜无形'],j:'此签主静。纷争之中，静者胜。少言多观，以不变应万变。'},
  {g:'下平签',t:'逆水行舟',p:['逆水行舟用力撑','一篙松劲退千寻','而今且把精神振','坚持到底事竟成'],j:'当前阻力较大，如逆水行舟。此非退运，乃是考验。咬牙撑过这段，便是坦途。'},
  {g:'中吉签',t:'月满西楼',p:['月满西楼照玉堂','团圆美满乐无疆','人间自有真情在','琴瑟和鸣岁月长'],j:'感情人际之签。情缘将至或渐深，宜真诚相待；已婚者家宅和睦，其乐融融。'},
  {g:'上吉签',t:'鹏程万里',p:['大鹏一日同风起','扶摇直上九万里','少年自有凌云志','不负黄河万古流'],j:'志在千里者得之，大吉。志向所在，风已就位，只管展翅，天高任飞。'},
  {g:'中平签',t:'守株待兔',p:['守株待兔非良策','坐享其成总是空','劝君勤耕自家田','一分耕耘一分功'],j:'勿存侥幸心理。天降之财留不住，亲手所创方长久。脚踏实地，路自宽阔。'},
  {g:'上上签',t:'龙凤呈祥',p:['龙凤呈祥瑞气临','双喜临门福满庭','百年好合成佳偶','万事亨通享太平'],j:'双喜临门之象。婚嫁、合作、乔迁皆大吉，人缘鼎盛，诸事和合。'},
  {g:'中吉签',t:'柳暗花明',p:['山重水复疑无路','柳暗花明又一村','莫道前途多险阻','转角之处见光明'],j:'看似绝境，实藏转机。拐个弯便是新天地，换个思路，困局自解。'},
  {g:'下平签',t:'雾里看花',p:['雾里看花花不明','水中望月月初蒙','劝君且待迷雾散','再作打算未为迟'],j:'眼下信息不明，易误判。重大决定宜缓行，待真相浮现，再落子不迟。'},
  {g:'上吉签',t:'芝兰生香',p:['芝兰生于深谷中','不以无人而不芳','君子修道立德业','馨香自远播四方'],j:'才德之签。你的才华终将被看见，不必急于表现，守正笃实，名声自至。'},
  {g:'中吉签',t:'顺水推舟',p:['顺水推舟不费力','乘风破浪潮头立','识时务者为俊杰','顺势而为事半倍'],j:'形势比人强。看清大势，顺势而行，此刻借力打力，事半功倍。'},
  {g:'上上签',t:'金榜题名',p:['十年寒窗无人问','一举成名天下知','蟾宫折桂非难事','金榜题名正当时'],j:'考试、竞聘、竞标大吉。厚积薄发，一鸣惊人，金榜之上当有君名。'},
  {g:'中平签',t:'知足常乐',p:['知足者仙境常乐','不知足者凡境常忧','良田万顷日三餐','广厦千间夜八尺'],j:'福在知足。减少一分贪求，便多一分自在。当下所有，已胜许多人。'},
  {g:'上吉签',t:'雨过天晴',p:['雨过天晴现彩虹','云收雾散见真容','一番风雨一番洗','从此前程路路通'],j:'风雨已过。此前的波折都是洗礼，接下来一段日子，天朗气清，宜大胆布局。'},
  {g:'上上签',t:'三阳开泰',p:['三阳开泰万象新','否去泰来天地春','东西南北皆通达','出入平安百福臻'],j:'开泰之签，诸运齐升。无论求财、谋事、出行，四方通达，放手去为。'}
];

/* ================================================================
   Three.js 智能签筒 · 东方 AI 法器（紫檀木 + 哑光金 + 悬浮灵光）
   三态：静止呼吸 / 摇签震动 / 抽签扫描
================================================================ */
let tube3d = null;
function initTube(){
  const canvas = document.getElementById('tubeCanvas');
  const W = canvas.clientWidth || 340, H = canvas.clientHeight || W * 1.08;
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
  renderer.setSize(W, H, false);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x080510, 9, 18);          /* 空间雾化，远处沉入背景 */

  const camera = new THREE.PerspectiveCamera(28, W / H, .1, 100);
  camera.position.set(0, 1.08, 9.8);                    /* 适配矮筒比例，避免画面上方留白过多 */
  camera.lookAt(0, .05, 0);

  /* ===== 灯光：柔光顶 + 侧光 + 内灵光 ===== */
  scene.add(new THREE.AmbientLight(0x2a2033, .9));
  const key = new THREE.DirectionalLight(0xffe9c4, 1.1);
  key.position.set(4, 8, 5); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = key.shadow.camera.bottom = -5;
  key.shadow.camera.right = key.shadow.camera.top = 5;
  key.shadow.bias = -.0004;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x6a5acd, .5);   /* 冷紫轮廓光，东方神秘 */
  rim.position.set(-6, 3, -5); scene.add(rim);
  const spirit = new THREE.PointLight(0xd4af37, 6, 8, 2); /* 筒口内灵光 */
  spirit.position.set(0, 1.0, 0); scene.add(spirit);

  /* ===== 程序化贴图 ===== */
  function woodTex(){                                     /* 紫檀/黑檀：深棕近黑 + 细木纹 */
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 512, 0);
    g.addColorStop(0, '#170b06'); g.addColorStop(.5, '#241309'); g.addColorStop(1, '#120803');
    x.fillStyle = g; x.fillRect(0, 0, 512, 512);
    for(let i = 0; i < 90; i++){
      x.strokeStyle = `rgba(${40 + Math.random() * 40},${22 + Math.random() * 22},${10 + Math.random() * 12},${.08 + Math.random() * .16})`;
      x.lineWidth = .5 + Math.random() * 1.6;
      const y0 = Math.random() * 512; x.beginPath();
      for(let px = 0; px <= 512; px += 14) x.lineTo(px, y0 + Math.sin(px * .02 + i) * 5 + Math.random() * 2);
      x.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 1);
    return t;
  }
  function woodRough(){                                   /* 粗糙度：哑光为主，局部抛光 */
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d');
    x.fillStyle = '#b8b8b8'; x.fillRect(0, 0, 256, 256);
    for(let i = 0; i < 40; i++){
      x.fillStyle = `rgba(${150 + Math.random() * 80},${150 + Math.random() * 80},${150 + Math.random() * 80},.25)`;
      x.fillRect(Math.random() * 256, Math.random() * 256, 2, 20 + Math.random() * 60);
    }
    return new THREE.CanvasTexture(c);
  }
  function stickTex(char){                                /* 竹签：哑光竹 + 朱砂字 */
    const c = document.createElement('canvas'); c.width = 64; c.height = 512;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 64, 0);
    g.addColorStop(0, '#caa755'); g.addColorStop(.5, '#e2c170'); g.addColorStop(1, '#b08a3e');
    x.fillStyle = g; x.fillRect(0, 0, 64, 512);
    x.fillStyle = 'rgba(120,85,25,.35)';
    for(let i = 0; i < 26; i++) x.fillRect(Math.random() * 64, Math.random() * 512, 1, 14 + Math.random() * 30);
    x.fillStyle = 'rgba(168,44,44,.8)';                  /* 朱砂红字，隐约 */
    x.font = '44px "Ma Shan Zheng", serif'; x.textAlign = 'center';
    x.fillText(char, 32, 300);
    x.fillStyle = '#7e1f1f'; x.fillRect(0, 0, 64, 56);   /* 朱砂签头 */
    const t = new THREE.CanvasTexture(c);
    t.rotation = Math.PI; t.center.set(.5, .5);           /* 签头朝上 */
    return t;
  }

  /* ===== 材质 ===== */
  const woodMat = new THREE.MeshStandardMaterial({
    map: woodTex(), roughnessMap: woodRough(), roughness: .74, metalness: .18,
    color: 0xffffff, envMapIntensity: .8
  });
  const darkMat = new THREE.MeshStandardMaterial({color: 0x0a0503, roughness: .95});
  const goldMat = new THREE.MeshStandardMaterial({       /* 哑光金，不过度发光 */
    color: 0xc9a24a, roughness: .34, metalness: .92,
    emissive: 0x2a1c05, emissiveIntensity: .3
  });

  /* ===== 世界：落地补偿 + 摇摆枢轴（筒底为轴） ===== */
  const world = new THREE.Group(); scene.add(world);      /* 摇动时抬升最低点，避免底部穿模 */
  const pivot = new THREE.Group(); world.add(pivot);      /* 摇摆 */
  const body = new THREE.Group(); pivot.add(body);        /* 筒身（筒底在 y=0） */
  pivot.position.y = -1.28;                               /* 枢轴原点 = 筒底，配合 tilt 补偿避免底部穿模 */

  /* 传统签筒：降低高度，保留束腰与敞口轮廓 */
  const R = 1.12, H_TUBE = 2.9, INNER_BASE_Y = .18;       /* 半径 / 高 / 筒内底 */

  /* 筒身：车削轮廓（底足内收 → 束腰 → 筒口外撇） */
  const profile = [
    [0.001, 0.00], [0.86, 0.00], [0.93, 0.06], [0.96, 0.20],  /* 底足（起点≠0 防中心接缝） */
    [0.90, 0.72], [0.86, 1.45], [0.89, 2.08],                 /* 束腰筒腹 */
    [0.95, 2.55], [1.01, 2.78], [1.04, H_TUBE]                /* 敞口外撇 */
  ].map(([r, y]) => new THREE.Vector2(r * R, y));
  const tube = new THREE.Mesh(new THREE.LatheGeometry(profile, 56), woodMat);
  tube.castShadow = tube.receiveShadow = true;
  body.add(tube);
  /* 内壁（真实空间深度，贴筒口内收） */
  const inner = new THREE.Mesh(
    new THREE.CylinderGeometry(R * .98, R * .82, H_TUBE - .08, 48, 1, true), darkMat);
  inner.material.side = THREE.BackSide;
  inner.position.y = H_TUBE / 2; body.add(inner);
  /* 筒内底（在腔内，不穿出外底） */
  const innerBase = new THREE.Mesh(new THREE.CircleGeometry(R * .82, 48), darkMat);
  innerBase.rotation.x = -Math.PI / 2; innerBase.position.y = INNER_BASE_Y; body.add(innerBase);
  /* 筒口哑光金环（贴敞口） */
  const rimRing = new THREE.Mesh(new THREE.TorusGeometry(R * 1.02, .05, 16, 64), goldMat);
  rimRing.rotation.x = Math.PI / 2; rimRing.position.y = H_TUBE; body.add(rimRing);
  /* 筒腹金箍两道（层次与细节） */
  [[1.96, R * .89], [.82, R * .89]].forEach(([y, r]) => {
    const band = new THREE.Mesh(new THREE.TorusGeometry(r, .028, 12, 56), goldMat);
    band.rotation.x = Math.PI / 2; band.position.y = y; body.add(band);
  });
  /* 底足金箍 */
  const baseRing = new THREE.Mesh(new THREE.TorusGeometry(R * .92, .045, 16, 64), goldMat);
  baseRing.rotation.x = Math.PI / 2; baseRing.position.y = INNER_BASE_Y; body.add(baseRing);

  /* ===== 签条：少量、自然倾斜、随机高度，全部约束在筒腔内 ===== */
  const chars = ['玄', '机', '灵', '签', '天', '问', '卜', '命'];
  const stickMeshes = [];
  const STICK_LEN = 3.02;
  const stickGroup = new THREE.Group(); body.add(stickGroup);
  const N = 5;
  for(let i = 0; i < N; i++){
    const ang = (i / N) * Math.PI * 2 + Math.random() * .4;
    const rad = Math.random() * .26;                     /* 收拢筒心，远离筒壁防穿模 */
    const tilt = .04 + Math.random() * .05;              /* 小倾角，物理上不会穿壁 */
    const s = new THREE.Mesh(
      new THREE.BoxGeometry(.1, STICK_LEN, .055),
      new THREE.MeshStandardMaterial({map: stickTex(chars[i % chars.length]), roughness: .6, metalness: .05})
    );
    const bottomY = INNER_BASE_Y + .03 + Math.random() * .1;
    const baseY = bottomY + STICK_LEN / 2;
    s.position.set(Math.cos(ang) * rad, baseY, Math.sin(ang) * rad);
    s.rotation.set(Math.cos(ang) * tilt, Math.random() * Math.PI, Math.sin(ang) * tilt);
    s.castShadow = true;
    s.userData = {
      baseX: s.position.x, baseY: s.position.y, baseZ: s.position.z,
      baseRX: s.rotation.x, baseRY: s.rotation.y, baseRZ: s.rotation.z,
      minY: INNER_BASE_Y + .03 + STICK_LEN / 2,
      phase: Math.random() * Math.PI * 2,
      isTop: bottomY + STICK_LEN > H_TUBE + .08
    };
    stickGroup.add(s); stickMeshes.push(s);
  }

  /* ===== 光环：摇签时扩散 ===== */
  const halo = new THREE.Mesh(
    new THREE.RingGeometry(.9, 1.02, 48),
    new THREE.MeshBasicMaterial({color: 0xd4af37, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false})
  );
  halo.rotation.x = -Math.PI / 2; halo.position.y = H_TUBE + .05; body.add(halo);

  /* ===== 扫描光线：抽签完成时扫过签条 ===== */
  const scan = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, .06),
    new THREE.MeshBasicMaterial({color: 0xf3d27a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false})
  );
  scan.position.set(0, H_TUBE * .64, 1.0); body.add(scan);

  /* 抽出光柱：签升起时自筒口向上的金光轨迹 */
  const riseGlow = new THREE.Mesh(
    new THREE.CylinderGeometry(.08, .14, 2.1, 16, 1, true),
    new THREE.MeshBasicMaterial({color: 0xf3d27a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide})
  );
  riseGlow.position.y = H_TUBE + .72; body.add(riseGlow);

  /* ===== 金色粒子：缓慢流动 ===== */
  const P = 110;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(P * 3), pSeed = new Float32Array(P);
  for(let i = 0; i < P; i++){
    const a = Math.random() * Math.PI * 2, r = 2.0 + Math.random() * 1.1;
    pPos[i * 3] = Math.cos(a) * r;
    pPos[i * 3 + 1] = -1.1 + Math.random() * 3.6;
    pPos[i * 3 + 2] = Math.sin(a) * r;
    pSeed[i] = Math.random() * Math.PI * 2;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xf3d27a, size: .05, transparent: true, opacity: .55,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  const particles = new THREE.Points(pGeo, pMat); world.add(particles);

  /* ===== 地面：柔和阴影 + 底部金色光晕 ===== */
  const ground = new THREE.Mesh(new THREE.CircleGeometry(7, 48), new THREE.ShadowMaterial({opacity: .32}));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -1.30; ground.receiveShadow = true;
  scene.add(ground);

  /* ===== 音效（竹木碰撞 + 清脆落定） ===== */
  function ac(){
    if(!window.__qianAC) window.__qianAC = new (window.AudioContext || window.webkitAudioContext)();
    if(window.__qianAC.state === 'suspended') window.__qianAC.resume();
    return window.__qianAC;
  }
  function sfxBamboo(){
    try{
      const ctx = ac(), now = ctx.currentTime;
      for(let i = 0; i < 10; i++){
        const t0 = now + i * .07 + Math.random() * .05;
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'square'; o.frequency.value = 800 + Math.random() * 1500;
        g.gain.setValueAtTime(.0001, t0);
        g.gain.exponentialRampToValueAtTime(.04 + Math.random() * .04, t0 + .006);
        g.gain.exponentialRampToValueAtTime(.0001, t0 + .05 + Math.random() * .05);
        o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + .12);
      }
    }catch(e){}
  }
  function sfxSnap(vol = .2){
    try{
      const ctx = ac(), t0 = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = 3200 + Math.random() * 600;
      g.gain.setValueAtTime(.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol, t0 + .004);
      g.gain.exponentialRampToValueAtTime(.0001, t0 + .18);
      o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + .22);
    }catch(e){}
  }

  /* ===== 交互状态 ===== */
  let dragging = false, px = 0, rotY = 0, rotTarget = 0;
  let state = 'idle';            /* idle | shaking | rising | done */
  let shakeAmp = 0, doneT = 0, riseT = 0;
  let flying = null;

  canvas.addEventListener('pointerdown', e => { dragging = true; px = e.clientX; });
  addEventListener('pointermove', e => {
    if(!dragging) return;
    rotTarget += (e.clientX - px) * .006; px = e.clientX;
    rotTarget = Math.max(-.6, Math.min(.6, rotTarget));   /* 限制轻旋转角度 */
  });
  addEventListener('pointerup', () => dragging = false);

  let t = 0, doneStart = 0;
  const ease = x => 1 - Math.pow(1 - x, 3);
  function loop(){
    requestAnimationFrame(loop);
    t += .016;
    rotY += (rotTarget - rotY) * .07;
    if(!dragging) rotTarget *= .96;                        /* 松手回正 */

    /* 摇摆（仅 shaking）：以筒底为轴扇形摆 */
    const target = state === 'shaking' ? 1 : 0;
    shakeAmp += (target - shakeAmp) * .08;
    pivot.rotation.z = Math.sin(t * 9) * .13 * shakeAmp;
    pivot.rotation.x = Math.cos(t * 7.3) * .04 * shakeAmp;
    world.position.y = Math.abs(pivot.rotation.z) * R * .92 + Math.abs(pivot.rotation.x) * R * .32;
    world.rotation.y = rotY + Math.sin(t * .5) * .03;

    /* 签条：微颤 + 摇时顶部签跃动 */
    stickMeshes.forEach(s => {
      if(s === flying) return;
      const w = .004 + shakeAmp * .04;
      s.rotation.x = s.userData.baseRX + Math.sin(t * 2.2 + s.userData.phase) * w;
      s.rotation.z = s.userData.baseRZ + Math.cos(t * 2 + s.userData.phase) * w + pivot.rotation.z * .42;
      const bounce = s.userData.isTop && shakeAmp > .05
        ? Math.abs(Math.sin(t * 9 + s.userData.phase)) * .18 * shakeAmp
        : 0;
      const targetY = Math.max(s.userData.minY, s.userData.baseY + bounce);
      s.position.y += (targetY - s.position.y) * .22;
    });

    /* 粒子流动：抽签中向筒口聚集 */
    const gather = shakeAmp;                              /* 0=漂浮, 1=聚集 */
    const parr = pGeo.attributes.position.array;
    for(let i = 0; i < P; i++){
      /* 聚集时向筒口（顶部中心）汇聚 */
      parr[i * 3 + 1] += .004 + gather * .028;
      const pull = gather * .016;
      parr[i * 3]     += Math.sin(t + pSeed[i]) * .002 - parr[i * 3] * pull;
      parr[i * 3 + 2] += Math.cos(t + pSeed[i]) * .002 - parr[i * 3 + 2] * pull;
      if(parr[i * 3 + 1] > H_TUBE + .38) parr[i * 3 + 1] = -1.15;
    }
    pGeo.attributes.position.needsUpdate = true;
    pMat.opacity = .5 + gather * .4;
    pMat.size = .05 + gather * .03 + Math.sin(t * 2) * .008;

    /* 灵光呼吸（底部光晕已去除） */
    spirit.intensity = 5 + Math.sin(t * 1.8) * 1.6 + gather * 14 + doneGlow() * 8;

    /* 抽出光柱：rising 时自筒口升起呼吸 */
    if(state === 'rising'){
      riseGlow.material.opacity = Math.min(riseGlow.material.opacity + .04, .5) + Math.sin(t * 6) * .06;
    }else{
      riseGlow.material.opacity *= .88;
    }

    /* 光环扩散（shaking 时） */
    if(shakeAmp > .05){
      const p = (t * .9) % 1;
      halo.scale.setScalar(1 + p * 1.6);
      halo.material.opacity = (1 - p) * .5 * shakeAmp;
    }else halo.material.opacity *= .9;

    /* 完成扫描光 */
    if(state === 'done'){
      doneT = (t - doneStart);
      const sp = Math.min(doneT / 1.1, 1);
      scan.position.y = INNER_BASE_Y + ease(sp) * (H_TUBE + .28);
      scan.material.opacity = Math.sin(sp * Math.PI) * .8;
    }else scan.material.opacity *= .9;

    renderer.render(scene, camera);
  }
  function doneGlow(){ return state === 'done' ? Math.max(0, 1 - doneT) : 0; }
  loop();

  /* ===== 对外：一次完整抽签（震动→起签→扫描→落定） ===== */
  tube3d = {
    draw(cb){
      if(state !== 'idle') return;
      state = 'shaking';
      sfxBamboo();
      setTimeout(() => sfxBamboo(), 520);
      setTimeout(() => {
        /* 一根签自筒口缓慢升起抽出（向上升 + 居中 + 立正） */
        const s = stickMeshes[Math.floor(Math.random() * stickMeshes.length)];
        flying = s; state = 'rising'; riseT = t;
        s.material.transparent = true;
        sfxSnap(.22);
        /* 先升到筒口上方（明显抽出感），同时向中心收拢、立正 */
        const drawY = H_TUBE + STICK_LEN / 2 + .38;
        gsap.to(s.position, {y: drawY, x: 0, z: 0, duration: 1.15, ease: 'power2.out'});
        gsap.to(s.rotation, {x: 0, z: 0, duration: 1.15, ease: 'power2.out'});
        /* 顶部停留一瞬，再淡去 */
        gsap.to(s.material, {opacity: 0, duration: .5, delay: 1.0, onComplete(){
          state = 'done'; doneStart = t; sfxSnap(.16);
          setTimeout(() => {
            /* 落定复位，恢复静止 */
            gsap.set(s.position, {x: s.userData.baseX, y: s.userData.baseY, z: s.userData.baseZ});
            gsap.set(s.rotation, {x: s.userData.baseRX, y: s.userData.baseRY, z: s.userData.baseRZ});
            gsap.set(s.material, {opacity: 1});
            flying = null; state = 'idle';
            cb && cb();
          }, 1200);
        }});
      }, 1500);                                            /* 震动 1.5s 后起签，整体 ~3.5s */
    }
  };
}

if(document.getElementById('tubeCanvas')) initTube();

let drawing = false;
function triggerDraw(){
  if(drawing || !tube3d || !tube3d.draw) return;
  drawing = true;
  const q = QIAN[Math.floor(Math.random() * QIAN.length)];
  tube3d.draw(() => {
    showQian(q);
    drawing = false;
  });
}
document.getElementById('drawBtn').addEventListener('click', triggerDraw);
document.getElementById('tubeCanvas').addEventListener('click', triggerDraw);


function showQian(q){
  document.getElementById('qianEmpty').style.display = 'none';
  const box = document.getElementById('qianResult');
  box.style.display = 'block';
  document.getElementById('qGrade').textContent = q.g;
  document.getElementById('qGrade').style.borderColor = q.g.includes('下') ? '#e0654f' : 'var(--orange)';
  document.getElementById('qGrade').style.color = q.g.includes('下') ? '#e0654f' : 'var(--orange-light)';
  document.getElementById('qTitle').textContent = q.t;
  document.getElementById('qPoem').innerHTML = q.p.map(l => `<span>${l}</span>`).join('');
  document.getElementById('qJie').innerHTML = '<b>解曰：</b>' + q.j;
  document.getElementById('qDisclaimer').style.display = 'block';
  gsap.from(box, {opacity: 0, y: 30, duration: .8, ease: 'power3.out'});
  gsap.from('#qPoem span', {opacity: 0, y: 20, stagger: .15, duration: .7, ease: 'power2.out', delay: .3});
  if(q.g.includes('上上')){
    confetti({particleCount: 90, spread: 75, origin: {y: .6},
      colors: ['#d4af37', '#f3d27a', '#f9efd8', '#d4af37']});
  }
}
