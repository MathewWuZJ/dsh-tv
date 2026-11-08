/**
 * Host half for dsh-tv.
 *
 * Persists a best-effort login snapshot (non-HttpOnly cookies + localStorage) for the
 * media sites to disk, and serves it back to the client over two loopback routes on
 * the existing DSH webserver. It never touches the Electron shell.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Bundled real brand icons (fetched from each site / official brand set at build time).
const PKG_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const ICON_DIR = join(PKG_DIR, "assets", "icons");
const ICONS = {
	globaltv: { file: "globaltv.svg", type: "image/svg+xml" },
	douyin: { file: "douyin.ico", type: "image/x-icon" },
	bilibili: { file: "bilibili.ico", type: "image/x-icon" },
	youtube: { file: "youtube.svg", type: "image/svg+xml" },
	instagram: { file: "instagram.svg", type: "image/svg+xml" },
	hackertube: { file: "hackertube.svg", type: "image/svg+xml" },
	duanju: { file: "duanju.png", type: "image/png" }
};

function storeDir() {
	const home = process.env.DSH_HOME && process.env.DSH_HOME.length > 0 ? process.env.DSH_HOME : join(homedir(), ".dsh");
	return join(home, "social-session");
}
const STORE_FILE = () => join(storeDir(), "store.json");
function readStore() {
	try {
		const file = STORE_FILE();
		if (!existsSync(file)) return {};
		const parsed = JSON.parse(readFileSync(file, "utf8"));
		return parsed !== null && typeof parsed === "object" ? parsed : {};
	} catch { return {}; }
}
function writeStore(value) {
	try { mkdirSync(storeDir(), { recursive: true }); writeFileSync(STORE_FILE(), JSON.stringify(value)); }
	catch (error) { console.error("[dsh-tv] persist failed", error); }
}
function readBody(req) {
	return new Promise((resolve) => {
		let data = "";
		req.on("data", (chunk) => { data += chunk; if (data.length > 12 * 1024 * 1024) data = data.slice(0, 12 * 1024 * 1024); });
		req.on("end", () => resolve(data));
		req.on("error", () => resolve(""));
	});
}

//#region favicon proxy
const faviconCache = new Map();
async function tryIcon(url) {
	try {
		const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(6000) });
		if (!res.ok) return null;
		const type = res.headers.get("content-type") || "";
		if (!/image|icon|octet-stream/i.test(type)) return null;
		const buf = Buffer.from(await res.arrayBuffer());
		if (buf.length === 0 || buf.length > 400000) return null;
		return { type: type, buf: buf };
	} catch { return null; }
}
async function discoverIconLinks(origin) {
	try {
		const res = await fetch(origin + "/", { headers: { "user-agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(6000) });
		if (!res.ok) return [];
		const text = (await res.text()).slice(0, 300000);
		const out = [];
		const re = /<link\b[^>]*>/gi;
		let m;
		while ((m = re.exec(text))) {
			const tag = m[0];
			if (!/rel\s*=\s*["'][^"']*icon/i.test(tag)) continue;
			const href = /href\s*=\s*["']([^"']+)["']/i.exec(tag);
			if (href && href[1]) {
				try { out.push(new URL(href[1], origin).href); } catch { /* ignore */ }
			}
		}
		return out;
	} catch { return []; }
}
async function fetchFavicon(raw) {
	let origin;
	try { origin = new URL(raw).origin; } catch { return null; }
	const cached = faviconCache.get(origin);
	if (cached && Date.now() - cached.at < 86400000) return cached.none === true ? null : cached;
	const candidates = [
		origin + "/favicon.ico",
		origin + "/favicon.png",
		origin + "/apple-touch-icon.png",
		origin + "/apple-touch-icon-precomposed.png"
	];
	for (const candidate of candidates) {
		const icon = await tryIcon(candidate);
		if (icon !== null) { const record = { at: Date.now(), type: icon.type, buf: icon.buf }; faviconCache.set(origin, record); return record; }
	}
	for (const candidate of await discoverIconLinks(origin)) {
		const icon = await tryIcon(candidate);
		if (icon !== null) { const record = { at: Date.now(), type: icon.type, buf: icon.buf }; faviconCache.set(origin, record); return record; }
	}
	faviconCache.set(origin, { at: Date.now(), none: true });
	return null;
}
//#endregion

//#region random IPTV player
const PLAYLIST_SOURCES = [
	"https://iptv-org.github.io/iptv/index.m3u",
	"https://raw.githubusercontent.com/imDazui/Tvlist-awesome-m3u-m3u8/master/m3u/国外电视台202409.m3u",
	"https://raw.githubusercontent.com/imDazui/Tvlist-awesome-m3u-m3u8/master/m3u/国内电视台202509.m3u"
];
let playlistCache = { at: 0, list: [] };
function parseM3u(text) {
	const lines = text.split(/\r?\n/);
	const out = [];
	let name = "";
	let country = "";
	let group = "";
	let logo = "";
	for (const raw of lines) {
		const line = raw.trim();
		if (line.length === 0) continue;
		if (line.startsWith("#EXTINF")) {
			const comma = line.lastIndexOf(",");
			name = comma >= 0 ? line.slice(comma + 1).trim() : "";
			const mn = /tvg-name="([^"]*)"/.exec(line);
			if (mn && mn[1]) name = mn[1];
			const mc = /tvg-country="([^"]*)"/.exec(line);
			country = mc && mc[1] ? mc[1].toUpperCase() : "";
			const mg = /group-title="([^"]*)"/.exec(line);
			group = mg && mg[1] ? mg[1] : "";
			const ml = /tvg-logo="([^"]*)"/.exec(line);
			logo = ml && ml[1] ? ml[1] : "";
		} else if (!line.startsWith("#")) {
			if (/^https?:\/\//i.test(line) && /\.m3u8(\?|$)/i.test(line)) out.push({ name: name || "频道", url: line, country: country, group: group, logo: logo });
			name = ""; country = ""; group = ""; logo = "";
		}
	}
	return out;
}
const PL_CACHE_FILE = () => join(storeDir(), "tv-playlist.json");
function loadDiskPlaylist() {
	try { const j = JSON.parse(readFileSync(PL_CACHE_FILE(), "utf8")); if (Array.isArray(j.list) && j.list.length > 0) return j; } catch (e) {}
	return null;
}
function saveDiskPlaylist(list) {
	try { mkdirSync(storeDir(), { recursive: true }); writeFileSync(PL_CACHE_FILE(), JSON.stringify({ at: Date.now(), list: list })); } catch (e) {}
}
async function fetchPlaylist() {
	if (playlistCache.list.length > 0 && Date.now() - playlistCache.at < 3600 * 1000) return playlistCache.list;
	const attempts = PLAYLIST_SOURCES.map(async (source) => {
		const res = await fetch(source, { headers: { "user-agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(30000) });
		if (!res.ok) throw new Error("HTTP " + res.status);
		const list = parseM3u(await res.text());
		if (list.length === 0) throw new Error("empty playlist");
		return list;
	});
	try {
		const list = await Promise.any(attempts);
		playlistCache = { at: Date.now(), list: list };
		saveDiskPlaylist(list);
		return list;
	} catch (error) {
		console.error("[dsh-tv] all playlist sources failed");
	}
	const disk = loadDiskPlaylist();
	if (disk !== null) { playlistCache = { at: Date.now(), list: disk.list }; return disk.list; }
	return playlistCache.list;
}
const badChannels = new Map();
function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
	return arr;
}
function hevcOnly(variantLines) {
	// true when a master playlist only offers HEVC variants (Electron often can't decode video).
	if (variantLines.length === 0) return false;
	return variantLines.every((attr) => /CODECS="[^"]*(?:hvc1|hev1)/i.test(attr));
}
function isDrm(text) {
	return /#EXT-X-KEY[^\n]*(?:SAMPLE-AES|widevine|com\.apple\.streamingkeydelivery)/i.test(text);
}
async function fetchText(url, timeout) {
	try {
		const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(timeout) });
		if (!res.ok) return null;
		return await res.text();
	} catch { return null; }
}
/** Return a directly playable H.264 media-playlist URL, or null if not usable. */
async function validateChannel(url) {
	const master = await fetchText(url, 5000);
	if (master === null || master.indexOf("#EXTM3U") < 0) return null;
	if (isDrm(master)) return null;
	let mediaUrl = url;
	let media = master;
	if (/#EXT-X-STREAM-INF/i.test(master)) {
		const lines = master.split(/\r?\n/);
		const variants = [];
		for (let i = 0; i < lines.length; i++) {
			if (!/^#EXT-X-STREAM-INF/i.test(lines[i])) continue;
			let j = i + 1;
			while (j < lines.length && (lines[j].trim() === "" || lines[j].trim().startsWith("#"))) j++;
			if (j >= lines.length) continue;
			try { variants.push({ attr: lines[i], url: new URL(lines[j].trim(), url).href }); } catch { /* ignore */ }
		}
		if (variants.length === 0) return null;
		if (hevcOnly(variants.map((v) => v.attr))) return null;
		const chosen = variants.find((v) => !/CODECS="[^"]*(?:hvc1|hev1)/i.test(v.attr)) || variants[0];
		mediaUrl = chosen.url;
		media = await fetchText(mediaUrl, 5000);
		if (media === null || media.indexOf("#EXTM3U") < 0 || isDrm(media)) return null;
	}
	// First media segment must be fetchable.
	let seg = null;
	for (const line of media.split(/\r?\n/)) {
		const t = line.trim();
		if (t.length > 0 && !t.startsWith("#")) { seg = t; break; }
	}
	if (seg === null) return null;
	let segAbs;
	try { segAbs = new URL(seg, mediaUrl).href; } catch { return null; }
	try {
		const res = await fetch(segAbs, { headers: { "user-agent": "Mozilla/5.0", range: "bytes=0-2047" }, signal: AbortSignal.timeout(6000) });
		if (!res.ok && res.status !== 206) return null;
	} catch { return null; }
	return mediaUrl;
}
async function randomChannel() {
	const list = await fetchPlaylist();
	if (list.length === 0) return void 0;
	const order = shuffle(list.slice());
	const deadline = Date.now() + 22000;
	let attempts = 0;
	for (const candidate of order) {
		if (attempts >= 16 || Date.now() > deadline) break;
		const badAt = badChannels.get(candidate.url);
		if (badAt !== void 0 && Date.now() - badAt < 10 * 60 * 1000) continue;
		attempts++;
		const playUrl = await validateChannel(candidate.url);
		if (playUrl !== null) return { name: candidate.name, url: candidate.url, play: playUrl, total: list.length };
		badChannels.set(candidate.url, Date.now());
	}
	return void 0;
}
function rewriteM3u8(text, baseUrl) {
	return text.split(/\r?\n/).map((line) => {
		const t = line.trim();
		if (t.length === 0) return line;
		if (t.startsWith("#")) {
			return line.replace(/URI="([^"]+)"/g, (_m, u) => {
				try { return 'URI="/seg?url=' + encodeURIComponent(new URL(u, baseUrl).href) + '"'; } catch { return _m; }
			});
		}
		try { return "/seg?url=" + encodeURIComponent(new URL(t, baseUrl).href); } catch { return line; }
	}).join("\n");
}
const PLAYER_HTML = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{margin:0;height:100%;background:#000;overflow:hidden;font-family:-apple-system,system-ui,sans-serif}
#stage{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}
video{width:100%;height:100%;object-fit:contain;background:#000}
#bar{position:fixed;left:0;right:0;top:0;display:flex;align-items:center;gap:10px;padding:10px 12px;color:#fff;background:linear-gradient(180deg,rgba(0,0,0,.65),rgba(0,0,0,0));font-size:12px;z-index:2}
#name{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.85}
button{border:0;border-radius:8px;padding:6px 12px;font:inherit;font-size:12px;color:#fff;background:rgba(255,255,255,.16);cursor:pointer}
button:hover{background:rgba(255,255,255,.28)}
#msg{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;gap:8px;color:#bbb;font-size:13px;pointer-events:none}
.spin{width:20px;height:20px;border:2px solid #3a3f4a;border-top-color:#7aa7ff;border-radius:50%;animation:sp .9s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}</style></head>
<body><div id="stage"><video id="v" controls autoplay playsinline></video></div>
<div id="bar"><span id="name">全球 TV 频道</span><button id="map">地图</button><button id="next">换台</button></div>
<div id="msg"><span class="spin"></span><span id="mtext">正在搜寻可用的电视频道</span></div>
<script src="/hls.js"></script>
<script>
(function(){
  var v=document.getElementById('v'), nameEl=document.getElementById('name'), msg=document.getElementById('msg'), mtext=document.getElementById('mtext'), next=document.getElementById('next');
  var hls=null;
  var pickUrl='';
  try{ pickUrl=new URLSearchParams(location.search).get('url')||''; }catch(e){}
  function setMsg(t){ if(mtext) mtext.textContent=t; msg.style.display='flex'; }
  function hideMsg(){ msg.style.display='none'; }
  async function play(){
    setMsg('正在搜寻可用的电视频道'); nameEl.textContent='全球 TV 频道';
    try{
      var j=null;
      if(pickUrl){
        try{ var rr=await fetch('/resolve?url='+encodeURIComponent(pickUrl)); j=await rr.json(); }catch(e){ j=null; }
        pickUrl='';
      }
      if(!j){ var ropt={cache:'no-store'}; try{ if(AbortSignal&&AbortSignal.timeout) ropt.signal=AbortSignal.timeout(25000); }catch(e){} var r=await fetch('/random',ropt); j=await r.json(); }
      if(!j||!(j.play||j.url)){ setMsg('暂时没有可用频道，正在重试…'); setTimeout(play,5000); return; }
      nameEl.textContent=j.name||'频道';
      var src='/m3u8?url='+encodeURIComponent(j.play||j.url);
      if(hls){ try{hls.destroy();}catch(e){} hls=null; }
      v.removeAttribute('src');
      var failed=false;
      function onErr(){ if(failed) return; failed=true; setMsg('这个源不可用，正在换台…'); setTimeout(play,800); }
      if(window.Hls && Hls.isSupported()){
        hls=new Hls({lowLatencyMode:false,maxBufferLength:20});
        hls.loadSource(src); hls.attachMedia(v);
        hls.on(Hls.Events.MANIFEST_PARSED,function(){ hideMsg(); v.play().catch(function(){}); });
        hls.on(Hls.Events.ERROR,function(e,d){ if(d&&d.fatal) onErr(); });
      } else { v.src=src; v.addEventListener('error',onErr,{once:true}); }
      v.play().catch(function(){});
    }catch(e){ setMsg('加载失败，重试中…'); setTimeout(play,1500); }
  }
  next.addEventListener('click',play);
  var mapBtn=document.getElementById('map');
  if(mapBtn){ mapBtn.addEventListener('click',function(){
    setMsg('正在打开地图…');
    var done=false;
    function go(u){ if(done) return; done=true; try{ location.href=u; }catch(e){} }
    try{
      var opt={mode:'no-cors'}; try{ if(AbortSignal&&AbortSignal.timeout) opt.signal=AbortSignal.timeout(6000); }catch(e){}
      fetch('https://tv.garden/',opt).then(function(){ go('https://tv.garden/'); }).catch(function(){
        setMsg('tv.garden 访问不了，已切到内置选台'); setTimeout(function(){ go('/map'); },700);
      });
      setTimeout(function(){ if(!done){ setMsg('tv.garden 访问不了，已切到内置选台'); setTimeout(function(){ go('/map'); },700); } },7000);
    }catch(e){ go('/map'); }
  }); }
  v.addEventListener('playing',hideMsg);
  v.addEventListener('ended',play);
  play();
})();
</script></body></html>`;
const MAP_HTML = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{margin:0;height:100%;background:#0f1115;color:#e5e7eb;font-family:-apple-system,system-ui,sans-serif}
#top{position:sticky;top:0;background:#0f1115;padding:10px 12px;display:flex;gap:8px;align-items:center;border-bottom:1px solid #222;z-index:2}
#q{flex:1;height:30px;border-radius:8px;border:1px solid #333;background:#171a21;color:#e5e7eb;padding:0 10px;font-size:13px;outline:none}
#count{color:#8b93a3;font-size:12px;white-space:nowrap}
#countries{display:flex;flex-wrap:wrap;gap:6px;padding:10px 12px;border-bottom:1px solid #222}
.chip{font-size:12px;padding:4px 8px;border-radius:999px;background:#1b1f27;border:1px solid #2a2f3a;color:#cbd5e1;cursor:pointer}
.chip.on{background:#2563eb;border-color:#2563eb;color:#fff}
#list{padding:6px 8px 40px}
.item{display:flex;gap:8px;align-items:center;padding:8px;border-radius:8px;cursor:pointer}
.item:hover{background:#171a21}
.item img{width:24px;height:24px;object-fit:contain;border-radius:4px;background:#222;flex:none}
.item .nm{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.item .grp{font-size:11px;color:#8b93a3;margin-left:auto;flex:none;max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
</style></head><body>
<div id="top"><input id="q" placeholder="搜索频道名称"><span id="count">加载中…</span></div>
<div id="countries"></div>
<div id="list"></div>
<script>
var ALL=[], curCountry='';
function el(t,c,txt){var e=document.createElement(t); if(c)e.className=c; if(txt!=null)e.textContent=txt; return e;}
function render(){
  var q=(document.getElementById('q').value||'').trim().toLowerCase();
  var items=ALL.filter(function(c){ return (!curCountry||c.c===curCountry)&&(!q||c.n.toLowerCase().indexOf(q)>=0||(c.g||'').toLowerCase().indexOf(q)>=0); });
  var lim=items.slice(0,400);
  document.getElementById('count').textContent=items.length+' 个频道'+(items.length>400?'（前400）':'');
  var list=document.getElementById('list'); list.innerHTML='';
  lim.forEach(function(c){
    var d=el('div','item');
    var img=document.createElement('img'); img.loading='lazy'; if(c.l) img.src=c.l; img.onerror=function(){this.style.visibility='hidden';};
    d.appendChild(img); d.appendChild(el('div','nm',c.n)); d.appendChild(el('div','grp',c.g||c.c||''));
    d.onclick=function(){ location.href='/player?url='+encodeURIComponent(c.u); };
    list.appendChild(d);
  });
}
async function load(){
  try{ var r=await fetch('/channels'); ALL=await r.json()||[]; }catch(e){ ALL=[]; }
  var counts={}; ALL.forEach(function(c){ var k=c.c||'其它'; counts[k]=(counts[k]||0)+1; });
  var arr=Object.keys(counts).sort(function(a,b){return counts[b]-counts[a];});
  var box=document.getElementById('countries'); box.innerHTML='';
  function chip(label,val){ var b=el('button','chip'+(curCountry===val?' on':''),label); b.onclick=function(){curCountry=val; load();}; return b; }
  box.appendChild(chip('全部',''));
  arr.slice(0,80).forEach(function(k){ box.appendChild(chip(k+' '+counts[k],k)); });
  render();
}
document.getElementById('q').addEventListener('input',render);
load();
</script></body></html>`;
let playerServer = null;
async function ensurePlayerServer() {
	if (playerServer !== null) return playerServer;
	const server = createServer(async (req, res) => {
		try {
			const u = new URL(req.url || "/", "http://127.0.0.1");
			if (u.pathname === "/player") {
				res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
				res.end(PLAYER_HTML);
				return;
			}
			if (u.pathname === "/map") {
				res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
				res.end(MAP_HTML);
				return;
			}
			if (u.pathname === "/channels") {
				const list = await fetchPlaylist();
				const payload = list.slice(0, 12000).map((c) => ({ c: c.country || "", n: c.name, u: c.url, g: c.group || "", l: c.logo || "" }));
				res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
				res.end(JSON.stringify(payload));
				return;
			}
			if (u.pathname === "/resolve") {
				const target = u.searchParams.get("url") || "";
				if (!/^https?:\/\//i.test(target)) { res.writeHead(400); res.end("bad url"); return; }
				let name = "";
				try { const list = await fetchPlaylist(); const found = list.find((x) => x.url === target); if (found) name = found.name; } catch { /* ignore */ }
				const play = await validateChannel(target);
				res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
				res.end(JSON.stringify({ name: name || "频道", url: target, play: play || "" }));
				return;
			}
			if (u.pathname === "/hls.js") {
				const buf = readFileSync(join(PKG_DIR, "assets", "hls.min.js"));
				res.writeHead(200, { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=604800" });
				res.end(buf);
				return;
			}
			if (u.pathname === "/random") {
				const channel = await randomChannel();
				res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
				res.end(JSON.stringify(channel || {}));
				return;
			}
			if (u.pathname === "/m3u8") {
				const target = u.searchParams.get("url") || "";
				if (!/^https?:\/\//i.test(target)) { res.writeHead(400); res.end("bad url"); return; }
				const upstream = await fetch(target, { headers: { "user-agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(20000) });
				const text = await upstream.text();
				res.writeHead(200, { "content-type": "application/vnd.apple.mpegurl; charset=utf-8", "cache-control": "no-store" });
				res.end(/\.m3u8(\?|$)/i.test(target) || text.indexOf("#EXTM3U") >= 0 ? rewriteM3u8(text, target) : text);
				return;
			}
			if (u.pathname === "/seg") {
				const target = u.searchParams.get("url") || "";
				if (!/^https?:\/\//i.test(target)) { res.writeHead(400); res.end("bad url"); return; }
				const headers = { "user-agent": "Mozilla/5.0" };
				if (req.headers.range) headers.range = req.headers.range;
				const upstream = await fetch(target, { headers: headers, signal: AbortSignal.timeout(30000) });
				const buf = Buffer.from(await upstream.arrayBuffer());
				res.writeHead(upstream.status === 206 ? 206 : 200, { "content-type": upstream.headers.get("content-type") || "application/octet-stream", "cache-control": "no-store", "access-control-allow-origin": "*" });
				res.end(buf);
				return;
			}
			res.writeHead(404); res.end("not found");
		} catch (error) {
			try { res.writeHead(502); res.end("upstream error"); } catch { /* ignore */ }
		}
	});
	await new Promise((resolve, reject) => {
		server.once("error", reject);
		server.listen(0, "127.0.0.1", () => { server.off("error", reject); resolve(); });
	});
	const port = server.address().port;
	playerServer = { server: server, port: port, base: "http://127.0.0.1:" + port };
	return playerServer;
}
//#endregion

export function apply(ctx) {
	ctx.effect(() => () => {
		if (playerServer !== null) {
			try { playerServer.server.close(); } catch (e) {}
			playerServer = null;
		}
	}, "dsh-tv:player-close");
	ctx.inject(["webServer"], (scope) => {
		scope.effect(() => scope.webServer.register({
			kind: "exact", path: "/dsh-tv/info",
			handler: async (_req, res) => {
				const player = await ensurePlayerServer();
				res.setHeader("content-type", "application/json");
				res.setHeader("cache-control", "no-store");
				res.end(JSON.stringify({ base: player.base }));
			}
		}), "dsh-tv:info");
		scope.effect(() => scope.webServer.register({
			kind: "exact", path: "/dsh-social-session/load",
			handler: async (_req, res) => {
				res.setHeader("content-type", "application/json");
				res.setHeader("cache-control", "no-store");
				res.end(JSON.stringify(readStore()));
			}
		}), "dsh-tv:session-load");
		scope.effect(() => scope.webServer.register({
			kind: "exact", path: "/dsh-social-session/save",
			handler: async (req, res) => {
				let incoming;
				try { incoming = JSON.parse(await readBody(req)); }
				catch { res.statusCode = 400; res.end("bad json"); return; }
				if (incoming === null || typeof incoming !== "object") { res.statusCode = 400; res.end("bad payload"); return; }
				const store = readStore();
				for (const [key, value] of Object.entries(incoming)) if (value !== null && typeof value === "object") store[key] = value;
				writeStore(store);
				res.setHeader("content-type", "application/json");
				res.end('{"ok":true}');
			}
		}), "dsh-tv:session-save");
		scope.effect(() => scope.webServer.register({
			kind: "exact", path: "/dsh-tv/favicon",
			handler: async (req, res) => {
				let target = "";
				try { target = new URL(req.url || "/", "http://x").searchParams.get("u") || ""; } catch { /* ignore */ }
				const icon = /^https?:\/\//i.test(target) ? await fetchFavicon(target) : null;
				if (icon === null) { res.statusCode = 404; res.end("no icon"); return; }
				res.setHeader("content-type", icon.type);
				res.setHeader("cache-control", "public, max-age=86400");
				res.end(icon.buf);
			}
		}), "dsh-tv:favicon");
		scope.effect(() => scope.webServer.register({
			kind: "exact", path: "/dsh-tv/asset",
			handler: async (req, res) => {
				let id = "";
				try { id = new URL(req.url || "/", "http://x").searchParams.get("id") || ""; } catch { /* ignore */ }
				const meta = ICONS[id];
				if (meta === void 0) { res.statusCode = 404; res.end("no asset"); return; }
				try {
					const buf = readFileSync(join(ICON_DIR, meta.file));
					res.setHeader("content-type", meta.type);
					res.setHeader("cache-control", "public, max-age=604800");
					res.end(buf);
				} catch {
					res.statusCode = 404; res.end("missing asset");
				}
			}
		}), "dsh-tv:asset");
	});
}
