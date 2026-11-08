window.__ModuleLoader__.load({
	id: "dsh-tv",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");

		const h = react.createElement;

		//#region styles
		const SOCIAL_CSS = `
.dss-root{height:100%;min-height:0;display:flex;flex-direction:column;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}
.dss-tabsrow{flex:none;box-sizing:border-box;height:38px;display:flex;align-items:center;gap:4px;padding:0 8px;border-bottom:.5px solid var(--dsw-alias-border-l3)}
.dss-tabs{flex:1;min-width:0;height:100%;display:flex;align-items:center;gap:2px;overflow-x:auto;scrollbar-width:none}
.dss-tabs::-webkit-scrollbar{display:none}
.dss-tab{flex:none;border:0;background:transparent;color:var(--dsw-alias-label-tertiary);line-height:1;height:28px;width:34px;display:inline-flex;align-items:center;justify-content:center;padding:0;border-radius:8px;cursor:pointer;white-space:nowrap;transition:background .12s ease,color .12s ease}
.dss-fav{width:18px;height:18px;border-radius:4px;object-fit:contain;display:block}
.dss-fav-fallback{width:18px;height:18px;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover)}
.dss-tab:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dss-tab-active{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l3)}
.dss-iconbtn{width:28px;height:28px;flex:none;border:0;background:transparent;color:var(--dsw-alias-label-secondary);border-radius:7px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0;line-height:1}
.dss-iconbtn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dss-iconbtn svg{width:16px;height:16px}
.dss-volwrap .dss-iconbtn svg{width:19px;height:19px}
.dss-topbtn{width:28px;height:28px;flex:none;border:0;background:transparent;color:var(--dsw-alias-label-secondary);border-radius:7px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0;line-height:1;appearance:none;-webkit-appearance:none;outline:none}
.dss-topbtn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dss-topbtn:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:1px}
.dss-topbtn svg{width:16px;height:16px}
.dss-volwrap{position:relative;flex:none;display:inline-flex}
.dss-volpop{position:absolute;right:0;top:calc(100% + 6px);z-index:70;display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--dsw-alias-bg-layer-1);border:.5px solid var(--dsw-alias-border-l2);border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,.18)}
.dss-volrange{width:104px;height:16px;background:transparent;cursor:pointer;-webkit-appearance:none;appearance:none;margin:0;--dss-vol-pct:100%;--dss-vol-fill:rgba(96,165,250,.9)}
.dss-volrange::-webkit-slider-runnable-track{height:3px;border-radius:2px;background:linear-gradient(90deg,var(--dss-vol-fill) var(--dss-vol-pct),var(--dsw-alias-border-l2) var(--dss-vol-pct))}
.dss-volrange::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:12px;height:12px;border-radius:50%;background:var(--dss-vol-fill);margin-top:-4.5px;box-shadow:0 0 0 1px rgba(0,0,0,.08);transition:background .15s ease,transform .12s ease}
.dss-volrange:hover::-webkit-slider-thumb{transform:scale(1.12)}
.dss-volrange[data-muted=true]{--dss-vol-fill:var(--dsw-alias-label-quaternary)}
.dss-volrange[data-muted=true]::-webkit-slider-runnable-track{background:var(--dsw-alias-border-l2)}
.dss-iconbtn.dss-rotating svg{animation:dss-rotate .65s ease}
@keyframes dss-rotate{to{transform:rotate(360deg)}}
.dss-status{flex:none;padding:4px 10px;color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 8%,transparent);font-size:10px;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dss-viewport{flex:1;min-height:0;display:flex;position:relative;background:var(--dsw-alias-bg-base)}
.dss-view{position:absolute;inset:0;display:flex;min-width:0;min-height:0}
.dss-view[data-active=false]{opacity:0;pointer-events:none;z-index:0}
.dss-view[data-active=true]{opacity:1;pointer-events:auto;z-index:1}
.dss-webview,.dss-iframe{flex:1;width:100%;height:100%;min-height:0;border:0;display:flex;background:var(--dsw-alias-bg-base)}
.dss-view[data-ready=false] .dss-webview,.dss-view[data-ready=false] .dss-iframe{visibility:hidden}
html:has([data-dockkit-pointer]) .dss-webview{pointer-events:none}
.dss-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:8px;color:var(--dsw-alias-label-tertiary);font-size:12px;background:var(--dsw-alias-bg-base)}
.dss-view[data-ready=true] .dss-loading{display:none}
.dss-spinner{width:20px;height:20px;flex:none;display:block;animation:dss-spin .9s linear infinite}
.dss-sp-bg{fill:none;stroke:var(--dsw-alias-border-l2);stroke-width:3}
.dss-sp-fg{fill:none;stroke:var(--dsw-alias-state-business-primary);stroke-width:3;stroke-linecap:round;stroke-dasharray:38 160}
@keyframes dss-spin{to{transform:rotate(360deg)}}
.dss-error{margin:auto;max-width:260px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:1.5;padding:24px;text-align:center}
.dss-body{flex:1;min-height:0;position:relative;display:flex}
.dss-settings{position:absolute;inset:0;z-index:5;overflow:auto;padding:10px;background:var(--dsw-alias-bg-base)}
.dss-set-title{font-size:12px;font-weight:600;margin:4px 0 8px}
.dss-set-row{display:flex;align-items:center;gap:4px;margin-bottom:6px}
.dss-set-over{box-shadow:inset 0 2px 0 var(--dsw-alias-state-business-primary)}
.dss-set-grip{width:16px;flex:none;text-align:center;color:var(--dsw-alias-label-quaternary);cursor:grab;font-size:15px;line-height:1;user-select:none}
.dss-set-grip:active{cursor:grabbing}
.dss-set-name{width:64px;flex:none}
.dss-set-url{flex:1;min-width:40px}
.dss-set-input{box-sizing:border-box;height:26px;font:inherit;font-size:11px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);border:.5px solid var(--dsw-alias-border-l2);border-radius:6px;padding:0 6px;outline:none}
.dss-set-select{height:26px;font:inherit;font-size:11px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);border:.5px solid var(--dsw-alias-border-l2);border-radius:6px;padding:0 2px}
.dss-set-mini{width:24px;height:26px;flex:none;border:.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);border-radius:6px;cursor:pointer;font-size:12px;padding:0}
.dss-set-mini:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dss-set-add{display:flex;gap:8px;margin-top:14px;padding-top:14px;border-top:.5px solid var(--dsw-alias-border-l3)}
.dss-set-add select{flex:1;min-width:0}
.dss-btn{border:.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:7px;height:28px;padding:0 12px;font:inherit;font-size:12px;cursor:pointer}
.dss-btn:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dss-btn-primary{background:var(--dsw-alias-state-business-primary);color:#fff;border-color:transparent}
.dss-btn-primary:hover{background:var(--dsw-alias-state-business-primary);color:#fff;filter:brightness(1.1)}
.dss-set-footer{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}
.dss-set-hint{color:var(--dsw-alias-label-quaternary);font-size:11px;line-height:1.5;margin-top:6px}
`;

		function ensureStyles() {
			if (typeof document === "undefined") return;
			const tagId = "dsh-tv/SocialPane.css";
			if (document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") !== null) return;
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-tv";
			tag.dataset.pluginCss = tagId;
			tag.textContent = SOCIAL_CSS;
			document.head.appendChild(tag);
		}
		//#endregion

		//#region sites/config
		const CONFIG_KEY = "dsh-social-sites.v2";
		const DEFAULT_ACTIVE = "douyin";
		/** Built-in, non-editable random global-TV entry, always pinned first. */
		const BUILTIN_GLOBAL = { id: "globaltv", label: "全球频道", builtin: "globaltv", url: "https://tv.garden/", mode: "desktop" };
		const DEFAULT_SITES = [
			{ ...BUILTIN_GLOBAL },
			{ id: "douyin", label: "抖音", url: "https://www.douyin.com/?recommend=1", mode: "desktop" },
			{ id: "duanju", label: "短剧", url: "https://hongguoduanju.com/", mode: "desktop" },
			{ id: "youtube", label: "YouTube", url: "https://www.youtube.com/shorts/", mode: "desktop" },
			{ id: "bilibili", label: "Bilibili", url: "https://www.bilibili.com/", mode: "desktop" },
			{ id: "instagram", label: "Instagram", url: "https://www.instagram.com/reels/", mode: "mobile" },
			{ id: "hackertube", label: "HackerTube", url: "https://hackertube.org/", mode: "mobile" }
		];
		const CATALOG = [
			{ label: "哔哩哔哩", url: "https://www.bilibili.com/", mode: "desktop" },
			{ label: "优酷", url: "https://www.youku.com/", mode: "desktop" },
			{ label: "爱奇艺", url: "https://www.iqiyi.com/", mode: "desktop" },
			{ label: "腾讯视频", url: "https://v.qq.com/", mode: "desktop" },
			{ label: "芒果TV", url: "https://www.mgtv.com/", mode: "desktop" },
			{ label: "西瓜视频", url: "https://www.ixigua.com/", mode: "mobile" },
			{ label: "快手", url: "https://www.kuaishou.com/", mode: "mobile" },
			{ label: "微博视频", url: "https://weibo.com/", mode: "desktop" },
			{ label: "小红书", url: "https://www.xiaohongshu.com/", mode: "mobile" },
			{ label: "央视频", url: "https://www.yangshipin.cn/", mode: "mobile" },
			{ label: "斗鱼", url: "https://www.douyu.com/", mode: "desktop" },
			{ label: "虎牙", url: "https://www.huya.com/", mode: "desktop" },
			{ label: "Twitch", url: "https://www.twitch.tv/", mode: "desktop" },
			{ label: "Vimeo", url: "https://vimeo.com/", mode: "desktop" },
			{ label: "Dailymotion", url: "https://www.dailymotion.com/", mode: "desktop" },
			{ label: "红果短剧", url: "https://hongguoduanju.com/", mode: "desktop" }
		];

		function normalizeSite(site, index) {
			const id = site && typeof site.id === "string" && site.id.length > 0 ? site.id : "s" + Date.now() + "_" + index;
			const out = {
				id: id,
				label: site && typeof site.label === "string" && site.label.length > 0 ? site.label : "未命名",
				url: site && typeof site.url === "string" ? site.url : "",
				mode: site && site.mode === "desktop" ? "desktop" : "mobile"
			};
			if (site && typeof site.builtin === "string") { out.builtin = site.builtin; out.label = "全球电视"; }
			return out;
		}
		function withBuiltin(sites) {
			// Drop any legacy/normalized "globaltv" duplicates, then pin one builtin first.
			const editable = sites.filter((s) => !s.builtin && s.id !== "globaltv");
			return [{ ...BUILTIN_GLOBAL }].concat(editable);
		}
		function loadConfig() {
			try {
				const raw = localStorage.getItem(CONFIG_KEY);
				if (raw) {
					const parsed = JSON.parse(raw);
					if (parsed !== null && typeof parsed === "object" && Array.isArray(parsed.sites) && parsed.sites.length > 0) {
						const sites = withBuiltin(parsed.sites.map(normalizeSite)).map((s) =>
							// Migration: Bilibili is a desktop-only site here; force desktop mode
							// even if an old persisted config stored it as mobile.
							(s.id === "bilibili" || /bilibili|哔哩/i.test(s.label)) ? { ...s, mode: "desktop" } : s
						);
						// Always start a fresh tab/session on 抖音 (if present), ignoring any
						// previously persisted active selection.
						let active = DEFAULT_ACTIVE;
						if (!sites.some((s) => s.id === active)) active = sites[0].id;
						return { sites: sites, active: active };
					}
				}
			} catch (e) {}
			return { sites: DEFAULT_SITES.map(normalizeSite), active: DEFAULT_ACTIVE };
		}
		function persistConfig(cfg) {
			try { localStorage.setItem(CONFIG_KEY, JSON.stringify({ sites: cfg.sites, active: cfg.active })); } catch (e) {}
		}

		// Per-site last URL / scroll / media position, persisted so a new DSH session or
		// an app restart resumes where the user left off instead of resetting to home.
		const VIEW_KEY = "dsh-tv-viewstate.v1";
		const VIEW_STATE = (() => {
			try {
				const raw = typeof localStorage !== "undefined" ? localStorage.getItem(VIEW_KEY) : null;
				if (raw) {
					const parsed = JSON.parse(raw);
					if (parsed !== null && typeof parsed === "object") return parsed;
				}
			} catch (e) {}
			return Object.create(null);
		})();
		let viewPersistTimer = null;
		function persistViewState() {
			if (viewPersistTimer !== null) return;
			viewPersistTimer = setTimeout(() => {
				viewPersistTimer = null;
				try { localStorage.setItem(VIEW_KEY, JSON.stringify(VIEW_STATE)); } catch (e) {}
			}, 400);
		}
		const SESSION_LOAD = "/dsh-social-session/load";
		const SESSION_SAVE = "/dsh-social-session/save";
		const SAVED = { data: Object.create(null), promise: null };
		const INJECTED = Object.create(null);
		const SNAPSHOT_JS =
			"(function(){try{var out={};var n=0;for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);var v=localStorage.getItem(k);if(k&&v!=null){out[k]=v;n+=k.length+v.length;}if(n>300000)break;}return JSON.stringify({cookie:document.cookie,localStorage:out});}catch(e){return '{}';}})()";

		function loadSaved() {
			if (SAVED.promise !== null) return SAVED.promise;
			SAVED.promise = (async () => {
				try {
					const res = await fetch(SESSION_LOAD, { cache: "no-store" });
					if (res.ok) {
						const json = await res.json();
						if (json !== null && typeof json === "object") SAVED.data = json;
					}
				} catch (e) {}
				return SAVED.data;
			})();
			return SAVED.promise;
		}
		function pushSaved(payload) {
			try {
				for (const [k, v] of Object.entries(payload)) SAVED.data[k] = v;
				fetch(SESSION_SAVE, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }).catch(() => {});
			} catch (e) {}
		}
		function injectSavedCode(saved) {
			const cookie = saved && typeof saved.cookie === "string" ? saved.cookie : "";
			const ls = saved && saved.localStorage && typeof saved.localStorage === "object" ? saved.localStorage : {};
			return (
				"(function(c,l){try{if(c){c.split('; ').forEach(function(p){var i=p.indexOf('=');if(i>0){var n=p.slice(0,i),v=p.slice(i+1);try{document.cookie=n+'='+v+'; path=/';}catch(e){}}});}if(l){Object.keys(l).forEach(function(k){try{localStorage.setItem(k,l[k]);}catch(e){}});}return true;}catch(e){return false;}})(" +
				JSON.stringify(cookie) + "," + JSON.stringify(ls) + ")"
			);
		}

		const MOBILE_UA =
			"Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
		const DESKTOP_UA =
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
		const DOUYIN_RECOMMEND_SCRIPT =
			"(function(){try{if(window.__dssTryRec)return;window.__dssTryRec=1;var n=0;var t=setInterval(function(){n++;try{var els=[].slice.call(document.querySelectorAll('a,div,span,li,button')).filter(function(e){return e.textContent&&e.textContent.trim()==='推荐'&&e.offsetParent!==null;});if(els.length){els[0].click();clearInterval(t);}}catch(e){}if(n>24)clearInterval(t);},500);}catch(e){}})()";

		function desktopBridge() {
			const carrier = typeof globalThis !== "undefined" ? globalThis.dshDesktop : void 0;
			if (carrier === void 0 || carrier.protocolVersion !== 1) return void 0;
			return carrier.browser;
		}
		//#endregion

		//#region manager
		function createManager(host, notify, onStatus, saved, sites) {
			const bridge = desktopBridge();
			const desktop = bridge !== void 0;
			const siteList = Array.isArray(sites) && sites.length > 0 ? sites : DEFAULT_SITES;
			const views = new Map();
			const cleanups = [];
			const savedStore = saved !== null && typeof saved === "object" ? saved : {};
			let disposed = false;
			let activeId = siteList[0].id;
			let volume = 1;
			let globalMuted = false;
			const report = typeof onStatus === "function" ? onStatus : () => {};

			function setActiveAttr(id) {
				for (const [sid, entry] of views) entry.wrapper.dataset.active = sid === id ? "true" : "false";
			}
			function activeEntry() {
				for (const [, entry] of views) if (entry.wrapper.dataset.active === "true") return entry;
			}
			function stateOf(id) { return VIEW_STATE[id] || (VIEW_STATE[id] = { url: "", scroll: 0, time: 0, paused: true }); }
			function saveUrl(entry) {
				try { const u = entry.el.getURL(); if (u && u !== "about:blank") { stateOf(entry.id).url = u; persistViewState(); } } catch (e) {}
			}
			function captureScroll(id) {
				const entry = views.get(id);
				if (entry === void 0 || entry.el === null || entry.ready !== true || typeof entry.el.executeJavaScript !== "function") return;
				try {
					Promise.resolve(entry.el.executeJavaScript("window.scrollY||document.documentElement.scrollTop||0"))
						.then((y) => { if (typeof y === "number") { stateOf(id).scroll = y; persistViewState(); } }).catch(() => {});
				} catch (e) {}
			}
			function captureMedia(id) {
				const entry = views.get(id);
				// Live streams (global TV) must never be seeked/resumed.
				if (entry !== void 0 && entry.site && entry.site.builtin === "globaltv") return;
				if (entry === void 0 || entry.el === null || entry.ready !== true || typeof entry.el.executeJavaScript !== "function") return;
				try {
					Promise.resolve(entry.el.executeJavaScript("(function(){try{var v=document.querySelector('video');if(!v)return '';return JSON.stringify({t:v.currentTime||0,p:!!v.paused});}catch(e){return '';}})()"))
						.then((text) => {
							if (typeof text !== "string" || text.length < 2) return;
							const parsed = JSON.parse(text);
							if (parsed && typeof parsed.t === "number") { stateOf(id).time = parsed.t; stateOf(id).paused = parsed.p === true; persistViewState(); }
						}).catch(() => {});
				} catch (e) {}
			}
			function restoreScroll(id) {
				const st = VIEW_STATE[id];
				const entry = views.get(id);
				if (st === void 0 || !st.scroll || entry === void 0 || entry.el === null || typeof entry.el.executeJavaScript !== "function") return;
				try { Promise.resolve(entry.el.executeJavaScript("window.scrollTo(0," + Number(st.scroll) + ")")).catch(() => {}); } catch (e) {}
			}
			function restoreMedia(id) {
				const st = VIEW_STATE[id];
				const entry = views.get(id);
				if (entry !== void 0 && entry.site && entry.site.builtin === "globaltv") return;
				if (st === void 0 || !(st.time > 1) || entry === void 0 || entry.el === null || typeof entry.el.executeJavaScript !== "function") return;
				const code = "(function(){try{var v=document.querySelector('video');if(!v)return;if(Math.abs(v.currentTime-(" + Number(st.time) + "))>2){v.currentTime=" + Number(st.time) + ";}if(" + (st.paused === true ? "false" : "true") + "){v.play().catch(function(){});}}catch(e){}})()";
				try { setTimeout(() => { try { Promise.resolve(entry.el.executeJavaScript(code)).catch(() => {}); } catch (e) {} }, 400); } catch (e) {}
			}
			function applyAudio(id) {
				for (const [sid, entry] of views) {
					if (entry.el && entry.ready === true && typeof entry.el.setAudioMuted === "function") {
						try { entry.el.setAudioMuted(globalMuted ? true : sid !== id); } catch (e) {}
					}
				}
			}
			function applyVolume() {
				for (const [, entry] of views) {
					if (entry.el && entry.ready === true && typeof entry.el.executeJavaScript === "function") {
						try {
							const code = "(function(){try{var v=" + volume + ";document.querySelectorAll('video,audio').forEach(function(m){try{m.volume=v;if(v>0&&m.muted){m.muted=false;}}catch(e){}});}catch(e){}})()";
							Promise.resolve(entry.el.executeJavaScript(code)).catch(() => {});
						} catch (e) {}
					}
				}
			}
			async function snapshot(id) {
				const entry = views.get(id);
				if (entry === void 0 || entry.el === null || entry.ready !== true || typeof entry.el.executeJavaScript !== "function") return;
				try {
					const text = await entry.el.executeJavaScript(SNAPSHOT_JS);
					if (typeof text !== "string" || text.length < 2) return;
					const parsed = JSON.parse(text);
					if (parsed !== null && typeof parsed === "object") return parsed;
				} catch (e) {}
			}
			function exportSite(id) {
				snapshot(id).then((data) => {
					if (data === void 0 || disposed) return;
					pushSaved({ [id]: { cookie: data.cookie || "", localStorage: data.localStorage || {}, ts: Date.now() } });
				}).catch(() => {});
			}
			const saveTimer = setInterval(() => {
				for (const [id, entry] of views) {
					if (entry.ready === true) {
						exportSite(id);
						captureMedia(id);
						captureScroll(id);
					}
				}
			}, 30000);

			async function createView(site) {
				const mode = site.mode === "desktop" ? "desktop" : "mobile";
				const userAgent = mode === "desktop" ? DESKTOP_UA : MOBILE_UA;
				const cached = VIEW_STATE[site.id] && VIEW_STATE[site.id].url;
				// Ignore cached loopback/internal player addresses left over from earlier builds.
				const cachedUsable = cached && !/^https?:\/\/(?:127\.0\.0\.1|localhost)(?::|\/)/i.test(cached);
				let startUrl = cachedUsable ? cached : (site.url || "about:blank");
				// 短剧 always uses the official site now (drop any stale internal cache).
				if (site.id === "duanju") startUrl = site.url || "about:blank";
				if (site.builtin === "globaltv") {
					// Built-in random global TV: load the host-served player.
					try {
						const res = await fetch("/dsh-tv/info", { cache: "no-store" });
						const info = await res.json();
						if (info && typeof info.base === "string" && info.base.length > 0) startUrl = info.base + "/player";
					} catch (e) {}
				}
				const wrapper = document.createElement("div");
				wrapper.className = "dss-view";
				wrapper.dataset.active = "false";
				wrapper.dataset.ready = "false";
				host.appendChild(wrapper);
				const loading = document.createElement("div");
				loading.className = "dss-loading";
				loading.innerHTML = "<svg class='dss-spinner' viewBox='0 0 24 24' aria-hidden='true'><circle class='dss-sp-bg' cx='12' cy='12' r='9'></circle><circle class='dss-sp-fg' cx='12' cy='12' r='9'></circle></svg>";
				wrapper.appendChild(loading);
				const entry = { id: site.id, site, wrapper, el: null, lease: null, ready: false, navigated: false };
				views.set(site.id, entry);

				if (desktop) {
					try {
						const reservation = await bridge.acquire("dsh-social-media");
						if (disposed || views.get(site.id) !== entry) {
							try { await bridge.release(reservation.lease); } catch (e) {}
							if (!views.has(site.id)) wrapper.remove();
							return;
						}
						entry.lease = reservation.lease;
						const el = document.createElement("webview");
						el.className = "dss-webview";
						el.setAttribute("data-sidebar-browser-frame", "webview");
						el.setAttribute("name", reservation.lease);
						el.setAttribute("partition", reservation.partition);
						el.setAttribute("allowpopups", "");
						el.setAttribute("useragent", userAgent);
						el.setAttribute("src", "about:blank#" + reservation.lease);

						const offOpen = bridge.onOpenRequested(reservation.lease, (url) => {
							try { el.loadURL(url, { userAgent: userAgent }); } catch (e) { try { el.loadURL(url); } catch (e2) {} }
						});
						cleanups.push(offOpen);

						el.addEventListener("dom-ready", () => {
							entry.ready = true;
							if (entry.navigated !== true) {
								entry.navigated = true;
								try { if (typeof el.setUserAgent === "function") el.setUserAgent(userAgent); } catch (e) {}
								try { el.loadURL(startUrl, { userAgent: userAgent }); } catch (e) { try { el.loadURL(startUrl); } catch (e2) {} }
								// Watchdog: some sites keep resources/long-connections open and never
								// fire did-stop-loading, so stop the spinner after a cap regardless.
								setTimeout(() => {
									if (disposed || entry.wrapper.dataset.ready === "true") return;
									try { entry.wrapper.dataset.ready = "true"; } catch (e) {}
									notify();
								}, 12000);
							}
							applyAudio(activeId);
							notify();
						});
						el.addEventListener("did-navigate", () => saveUrl(entry));
						el.addEventListener("did-navigate-in-page", () => saveUrl(entry));
						el.addEventListener("did-finish-load", () => {
							let cur = "";
							try { cur = el.getURL(); } catch (e) {}
							// Ignore the initial about:blank guest bootstrap; it fires before the
							// real site loads and must not hide the loading spinner early.
							if (!cur || cur.indexOf("about:") === 0) return;
							entry.failed = false;
							entry.retries = 0;
							entry.wrapper.dataset.ready = "true";
							report(site.id, "");
							notify();
						});
						el.addEventListener("did-stop-loading", () => {
							saveUrl(entry);
							const savedSite = savedStore[site.id];
							const hasSaved = savedSite !== null && typeof savedSite === "object" &&
								((typeof savedSite.cookie === "string" && savedSite.cookie.length > 0) ||
									(savedSite.localStorage !== null && typeof savedSite.localStorage === "object" && Object.keys(savedSite.localStorage).length > 0));
							if (hasSaved && INJECTED[site.id] !== true) {
								INJECTED[site.id] = true;
								try {
									Promise.resolve(el.executeJavaScript(injectSavedCode(savedSite)))
										.then(() => { try { el.reload(); } catch (e) {} }).catch(() => {});
								} catch (e) {}
							} else {
								exportSite(site.id);
							}
							applyVolume();
							restoreScroll(site.id);
							restoreMedia(site.id);
							// Fallback: if the site finished loading but never fired a usable
							// did-finish-load, stop the spinner anyway once it is past about:blank.
							let cur = "";
							try { cur = el.getURL(); } catch (e) {}
							if (entry.navigated === true && cur && cur.indexOf("about:") !== 0) entry.wrapper.dataset.ready = "true";
							if (site.id === "douyin" && entry.recommendTried !== true) {
								entry.recommendTried = true;
								try { Promise.resolve(el.executeJavaScript(DOUYIN_RECOMMEND_SCRIPT)).catch(() => {}); } catch (e) {}
							}
							notify();
						});
						el.addEventListener("media-started-playing", () => { report(site.id, ""); notify(); });
						el.addEventListener("did-fail-load", (event) => {
							if (!(event && event.isMainFrame) || event.errorCode === -3) return;
							const code = event.errorCode;
							const transient = code === -101 || code === -105 || code === -100 || code === -102 || code === -7;
							if (transient && (entry.retries || 0) < 2) {
								entry.retries = (entry.retries || 0) + 1;
								setTimeout(() => { try { el.loadURL(startUrl, { userAgent: userAgent }); } catch (e) {} }, 1200);
								return;
							}
							entry.failed = true;
							// Stop the spinner so the failure (and the red status line) is visible.
							entry.wrapper.dataset.ready = "true";
							report(site.id, "页面加载失败 (" + code + ") " + (event.errorDescription || ""));
							notify();
						});

						wrapper.appendChild(el);
						entry.el = el;
					} catch (error) {
						console.error("[dsh-tv] webview open failed", site.id, error);
						const err = document.createElement("div");
						err.className = "dss-error";
						err.textContent = "无法打开 " + site.label + "，请点刷新重试。";
						loading.remove();
						wrapper.appendChild(err);
					}
					return;
				}

				const frame = document.createElement("iframe");
				frame.className = "dss-iframe";
				frame.setAttribute("sandbox", "allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox");
				frame.setAttribute("referrerpolicy", "no-referrer");
				frame.addEventListener("load", () => { entry.wrapper.dataset.ready = "true"; notify(); });
				frame.src = site.url;
				wrapper.appendChild(frame);
				entry.el = frame;
				entry.ready = true;
			}

			async function activate(id) {
				const site = siteList.find((s) => s.id === id);
				if (site === void 0) return;
				if (activeId !== id) { captureScroll(activeId); captureMedia(activeId); }
				activeId = id;
				setActiveAttr(id);
				if (!views.has(id)) await createView(site);
				if (disposed) return;
				setActiveAttr(id);
				applyAudio(id);
				applyVolume();
				restoreScroll(id);
			}
			function back() {
				const entry = activeEntry();
				if (entry === void 0 || entry.el === null || entry.ready !== true) return;
				try { if (entry.el.canGoBack && entry.el.canGoBack()) entry.el.goBack(); } catch (e) {}
			}
			function reload() {
				const entry = activeEntry();
				if (entry === void 0 || entry.el === null) return;
				entry.wrapper.dataset.ready = "false";
				try { entry.el.reload(); } catch (e) {}
			}
			function setMuted(muted) { globalMuted = muted; applyAudio(activeId); }
			function setVolume(value) { volume = value; applyVolume(); }
			function dispose() {
				disposed = true;
				clearInterval(saveTimer);
				for (const [id, entry] of views) {
					if (entry.ready === true) { exportSite(id); captureMedia(id); captureScroll(id); }
				}
				for (const off of cleanups) { try { off(); } catch (e) {} }
				cleanups.length = 0;
				for (const [, entry] of views) {
					try { entry.wrapper.remove(); } catch (e) {}
					if (entry.lease !== null && bridge !== void 0) {
						try { Promise.resolve(bridge.release(entry.lease)).catch(() => {}); } catch (e) {}
					}
				}
				views.clear();
			}
			return { activate, back, reload, setMuted, setVolume, dispose };
		}
		//#endregion

		//#region icons
		function SocialIcon(props) {
			const size = props && props.size ? props.size : 22;
			const cls = props && props.className ? props.className : void 0;
			return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", className: cls, "aria-hidden": "true" },
				h("rect", { x: 2.5, y: 5, width: 19, height: 14, rx: 2.5, stroke: "currentColor", strokeWidth: 1.6 }),
				h("path", { d: "M10 9.5 L15 12 L10 14.5 Z", fill: "currentColor" }));
		}
		function RefreshIcon() {
			return h("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" },
				h("path", { d: "M4 12a8 8 0 0 1 13.66-5.66L20 8.68", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" }),
				h("path", { d: "M20 4v4.68h-4.68", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" }),
				h("path", { d: "M20 12a8 8 0 0 1-13.66 5.66L4 15.32", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" }),
				h("path", { d: "M4 20v-4.68h4.68", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" }));
		}
		function GearIcon() {
			return h("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" },
				h("circle", { cx: 12, cy: 12, r: 3, stroke: "currentColor", strokeWidth: 1.6 }),
				h("path", { d: "M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 8.9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" }));
		}
		function VolumeIcon(props) {
			const muted = props && props.muted;
			return h("svg", { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" },
				h("path", { d: "M4 9.5v5h3.2L12 18V6L7.2 9.5H4z", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" }),
				muted
					? h("path", { d: "M16 9l4 6M20 9l-4 6", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" })
					: [h("path", { key: "a", d: "M15.5 9.5a3.5 3.5 0 0 1 0 5", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" }),
						h("path", { key: "b", d: "M17.8 7.2a7 7 0 0 1 0 9.6", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" })]);
		}
		// Built-in sites use real favicons bundled into the plugin (served by the host);
		// user-added sites fall back to the live favicon proxy.
		const BUNDLED_ICONS = { globaltv: 1, douyin: 1, bilibili: 1, youtube: 1, instagram: 1, hackertube: 1, duanju: 1 };
		const BUNDLED_BY_HOST = {
			"tv.garden": "globaltv", "www.tv.garden": "globaltv",
			"douyin.com": "douyin", "www.douyin.com": "douyin",
			"bilibili.com": "bilibili", "www.bilibili.com": "bilibili", "m.bilibili.com": "bilibili",
			"youtube.com": "youtube", "www.youtube.com": "youtube", "m.youtube.com": "youtube",
			"instagram.com": "instagram", "www.instagram.com": "instagram",
			"hackertube.org": "hackertube", "www.hackertube.org": "hackertube",
			"hongguoduanju.com": "duanju", "www.hongguoduanju.com": "duanju"
		};
		function bundledIdFor(site) {
			if (!site) return "";
			if (site.id && BUNDLED_ICONS[site.id]) return site.id;
			let host = "";
			try { host = new URL(site.url || "").hostname.toLowerCase(); } catch (e) {}
			const key = BUNDLED_BY_HOST[host] || BUNDLED_BY_HOST[host.replace(/^www\./, "")];
			return key && BUNDLED_ICONS[key] ? key : "";
		}
		function fallbackGlyph(site) {
			if (!site || !site.label) return "?";
			return site.label.slice(0, 1).toUpperCase();
		}
		function fallbackHue(site) {
			const s = (site && (site.id || site.label)) || "";
			let h = 0;
			for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
			return h % 360;
		}
		function SiteFavicon(props) {
			const site = props.site;
			const [broken, setBroken] = react.useState(false);
			const bundled = bundledIdFor(site);
			const src = bundled
				? "/dsh-tv/asset?id=" + bundled
				: (site && site.url ? "/dsh-tv/favicon?u=" + encodeURIComponent(site.url) : "");
			if (broken || !src) {
				const hue = fallbackHue(site);
				return h("span", { className: "dss-fav-fallback", style: { background: "hsl(" + hue + ",58%,48%)", color: "#fff" } }, fallbackGlyph(site));
			}
			return h("img", { className: "dss-fav", src: src, alt: "", draggable: false, onError: () => setBroken(true) });
		}
		function SocialHeaderButton(props) {
			return h("button", { type: "button", className: "dss-topbtn", title: "DSH-TV", "aria-label": "DSH-TV", onClick: () => props.openSocial() }, h(SocialIcon, { size: 16 }));
		}
		function DshTvTitle() {
			return h("span", { className: "dss-tabtitle" }, "DSH-TV");
		}
		//#endregion

		//#region settings
		function SettingsView(props) {
			const [draft, setDraft] = react.useState(() => props.sites.map((s) => ({ ...s })));
			const [addIndex, setAddIndex] = react.useState(0);
			const [dragIndex, setDragIndex] = react.useState(-1);
			const [overIndex, setOverIndex] = react.useState(-1);
			const update = (index, patch) => setDraft((list) => list.map((s, i) => (i === index ? { ...s, ...patch } : s)));
			const moveTo = (from, to) => setDraft((list) => {
				if (from < 0 || to < 0 || from === to || from >= list.length || to >= list.length) return list;
				const next = list.slice();
				const [item] = next.splice(from, 1);
				next.splice(to, 0, item);
				return next;
			});
			const remove = (index) => setDraft((list) => list.filter((_, i) => i !== index));
			const add = () => {
				const item = CATALOG[addIndex];
				if (!item) return;
				setDraft((list) => list.concat([{ id: "c" + Date.now(), label: item.label, url: item.url, mode: item.mode }]));
			};
			const reset = () => setDraft(DEFAULT_SITES.filter((s) => !s.builtin).map((s) => ({ ...s })));
			const rows = draft.map((site, index) =>
				h("div", {
					className: "dss-set-row" + (overIndex === index && dragIndex !== index ? " dss-set-over" : ""),
					key: site.id,
					onDragOver: (e) => { e.preventDefault(); if (overIndex !== index) setOverIndex(index); },
					onDrop: (e) => { e.preventDefault(); moveTo(dragIndex, index); setDragIndex(-1); setOverIndex(-1); }
				},
					h("span", {
						className: "dss-set-grip", title: "拖动排序", draggable: true,
						onDragStart: (e) => { setDragIndex(index); try { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", String(index)); } catch (err) {} },
						onDragEnd: () => { setDragIndex(-1); setOverIndex(-1); }
					}, "\u28ff"),
					h("input", { className: "dss-set-input dss-set-url", value: site.url, placeholder: "https://…", onChange: (e) => update(index, { url: e.target.value }) }),
					h("select", { className: "dss-set-select", value: site.mode, onChange: (e) => update(index, { mode: e.target.value }) },
						h("option", { value: "mobile" }, "移动"),
						h("option", { value: "desktop" }, "桌面")),
					h("button", { type: "button", className: "dss-set-mini", title: "删除", onClick: () => remove(index) }, "\u00d7"))
			);
			return h("div", { className: "dss-settings" },
				rows,
				h("div", { className: "dss-set-add" },
					h("select", { className: "dss-set-select", value: String(addIndex), onChange: (e) => setAddIndex(Number(e.target.value)) },
						CATALOG.map((c, i) => h("option", { key: c.label + i, value: String(i) }, c.label))),
					h("button", { type: "button", className: "dss-btn", onClick: add }, "添加")),
				h("div", { className: "dss-set-footer" },
					h("button", { type: "button", className: "dss-btn", onClick: reset }, "恢复默认"),
					h("button", { type: "button", className: "dss-btn", onClick: () => props.onCancel() }, "取消"),
					h("button", { type: "button", className: "dss-btn dss-btn-primary", onClick: () => props.onApply(draft) }, "应用并关闭")));
		}
		//#endregion

		//#region SocialBody
		const AUDIO_KEY = "dsh-tv-audio.v2";
		const DEFAULT_VOLUME = 1 / 3;
		function loadAudio() {
			try {
				const raw = typeof localStorage !== "undefined" ? localStorage.getItem(AUDIO_KEY) : null;
				if (raw) {
					const parsed = JSON.parse(raw);
					if (parsed !== null && typeof parsed === "object") {
						return {
							muted: parsed.muted === true,
							volume: typeof parsed.volume === "number" ? Math.min(1, Math.max(0, parsed.volume)) : DEFAULT_VOLUME
						};
					}
				}
			} catch (e) {}
			// First run: start muted, one-third volume (user changes are remembered).
			return { muted: true, volume: DEFAULT_VOLUME };
		}
		function persistAudio(cfg) {
			try { localStorage.setItem(AUDIO_KEY, JSON.stringify({ muted: cfg.muted === true, volume: cfg.volume })); } catch (e) {}
		}
		function SocialBody() {
			const hostRef = react.useRef(null);
			const managerRef = react.useRef(null);
			const initialConfig = react.useMemo(() => loadConfig(), []);
			const initialAudio = react.useMemo(() => loadAudio(), []);
			const [sites, setSites] = react.useState(initialConfig.sites);
			const [active, setActive] = react.useState(initialConfig.active);
			const [settingsOpen, setSettingsOpen] = react.useState(false);
			const [status, setStatus] = react.useState({});
			const [muted, setMuted] = react.useState(initialAudio.muted);
			const [volume, setVolumeState] = react.useState(initialAudio.volume);
			const [showVol, setShowVol] = react.useState(false);
			const [refreshing, setRefreshing] = react.useState(false);
			const [, force] = react.useState(0);
			const statusTimer = react.useRef(null);
			const savedRef = react.useRef(Object.create(null));
			const cancelledRef = react.useRef(false);
			const audioRef = react.useRef(initialAudio);
			audioRef.current = { muted: muted, volume: volume };

			const reportStatus = (id, message) => {
				setStatus((s) => (s[id] === message ? s : { ...s, [id]: message }));
				if (statusTimer.current !== null) { clearTimeout(statusTimer.current); statusTimer.current = null; }
				if (message) {
					statusTimer.current = setTimeout(() => {
						statusTimer.current = null;
						setStatus((s) => (s[id] === message ? { ...s, [id]: "" } : s));
					}, 8000);
				}
			};

			const build = (siteList, activeId) => {
				const host = hostRef.current;
				if (host === null) return;
				if (managerRef.current !== null) { managerRef.current.dispose(); managerRef.current = null; }
				const manager = createManager(host, () => force((v) => v + 1), reportStatus, savedRef.current, siteList);
				managerRef.current = manager;
				manager.setVolume(audioRef.current.volume);
				manager.setMuted(audioRef.current.muted);
				manager.activate(activeId);
			};

			react.useLayoutEffect(() => {
				cancelledRef.current = false;
				loadSaved().then((saved) => {
					if (cancelledRef.current) return;
					savedRef.current = saved;
					build(initialConfig.sites, initialConfig.active);
				});
				return () => {
					cancelledRef.current = true;
					if (managerRef.current !== null) managerRef.current.dispose();
					managerRef.current = null;
					if (statusTimer.current !== null) { clearTimeout(statusTimer.current); statusTimer.current = null; }
				};
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			react.useEffect(() => {
				const manager = managerRef.current;
				if (manager !== null && manager !== void 0) manager.activate(active);
			}, [active]);

			const applySettings = (draft) => {
				const valid = draft.filter((s) => s && s.url);
				if (valid.length === 0) return;
				const merged = withBuiltin(valid);
				let nextActive = active;
				if (!merged.some((s) => s.id === nextActive)) nextActive = "douyin";
				if (!merged.some((s) => s.id === nextActive)) nextActive = merged[0].id;
				setSites(merged);
				setActive(nextActive);
				persistConfig({ sites: merged, active: nextActive });
				setSettingsOpen(false);
				build(merged, nextActive);
			};

			const toggleMute = () => {
				const next = !muted; setMuted(next);
				if (managerRef.current !== null) managerRef.current.setMuted(next);
				persistAudio({ muted: next, volume: volume });
			};
			const changeVolume = (value) => {
				setVolumeState(value);
				if (managerRef.current !== null) managerRef.current.setVolume(value);
				let nextMuted = muted;
				if (value > 0 && muted) { nextMuted = false; setMuted(false); if (managerRef.current !== null) managerRef.current.setMuted(false); }
				persistAudio({ muted: nextMuted, volume: value });
			};
			const doRefresh = () => {
				if (refreshing) return;
				setRefreshing(true);
				if (managerRef.current !== null) managerRef.current.reload();
				setTimeout(() => setRefreshing(false), 800);
			};

			const tabs = sites.map((site) =>
				h("button", {
					key: site.id, type: "button", role: "tab", "aria-selected": site.id === active,
					className: "dss-tab" + (site.id === active ? " dss-tab-active" : ""),
					title: site.label,
					onClick: () => { setActive(site.id); setSettingsOpen(false); }
				}, h(SiteFavicon, { site })));

			const volFill = muted ? "rgba(150,156,165,0.55)" : "rgba(96,165,250," + (0.25 + 0.65 * volume).toFixed(2) + ")";
			const volumePopover = showVol
				? h("div", { className: "dss-volpop" },
					h("button", { type: "button", className: "dss-iconbtn", title: muted ? "取消静音" : "静音", onClick: toggleMute }, h(VolumeIcon, { muted })),
					h("input", {
						type: "range", min: "0", max: "100",
						value: String(Math.round(volume * 100)),
						className: "dss-volrange",
						"data-muted": muted ? "true" : "false",
						"aria-label": "音量",
						style: { "--dss-vol-pct": Math.round(volume * 100) + "%", "--dss-vol-fill": volFill },
						onChange: (e) => changeVolume(Number(e.target.value) / 100)
					}))
				: null;

			const topRow = h("div", { className: "dss-tabsrow" },
				h("button", { type: "button", className: "dss-iconbtn", title: "设置", "aria-label": "设置", onClick: () => setSettingsOpen((v) => !v) }, h(GearIcon)),
				h("button", { type: "button", className: "dss-iconbtn" + (refreshing ? " dss-rotating" : ""), title: "刷新当前 tab", "aria-label": "刷新当前 tab", onClick: doRefresh }, h(RefreshIcon)),
				h("div", { className: "dss-tabs", role: "tablist" }, tabs),
				h("div", { className: "dss-volwrap" },
					h("button", { type: "button", className: "dss-iconbtn", title: "音量", "aria-label": "音量", onClick: () => setShowVol((s) => !s) }, h(VolumeIcon, { muted })),
					volumePopover));

			return h("div", { className: "dss-root" },
				topRow,
				status[active] ? h("div", { key: "status", className: "dss-status", title: status[active] }, status[active]) : null,
				h("div", { className: "dss-body" },
					h("div", { className: "dss-viewport", ref: hostRef }),
					settingsOpen ? h(SettingsView, { sites: sites.filter((s) => !s.builtin), onCancel: () => setSettingsOpen(false), onApply: applySettings }) : null));
		}
		//#endregion

		//#region plugin
		const PLUGIN_ID = "dsh-tv";
		const KIND = "social";
		const inject = ["slots", "sidebarRight", "sidebarRightTabs"];

		function apply(ctx) {
			ensureStyles();
			const desktop = desktopBridge() !== void 0;
			const openSocial = () => {
				try {
					const activeTab = ctx.sidebarRight.active();
					if (ctx.sidebarRight.isExpanded() && activeTab !== void 0 && activeTab.kind === KIND) { ctx.sidebarRight.toggleExpanded(); return; }
					ctx.sidebarRight.openTab(KIND);
				} catch (error) { console.error("[dsh-tv] open failed", error); }
			};
			ctx.effect(() => ctx.sidebarRightTabs.register({
				id: PLUGIN_ID, kind: KIND, priority: "extension", keepMounted: desktop,
				title: () => "DSH-TV"
			}), "dsh-tv.type");
			ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({ name: "sidebar.right.pane.tab", key: PLUGIN_ID }, SocialBody)), "dsh-tv.body");
			ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab.title", () => ctx.slots.register({ name: "sidebar.right.pane.tab.title", key: PLUGIN_ID }, DshTvTitle)), "dsh-tv.title");
			ctx.effect(() => ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register(
				{ name: "conversation.session.header.utilities", id: PLUGIN_ID, order: 20, inject: () => ({ openSocial }) },
				SocialHeaderButton
			)), "dsh-tv.header-button");
		}
		//#endregion

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
