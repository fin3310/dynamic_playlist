let songsData = []; 
let currentFilteredSongs = []; 
let currentLanguage = '全部';
let currentSubTag = '全部';
let isSubTagsExpanded = false; 
let searchQuery = '';
let isCompactMode = window.innerWidth < 768;
let currentDisplayCount = 0;   
const BATCH_SIZE = 30;         
const NEW_SONG_DAYS = 15; // 🚀 定義新歌天數

let playedSongs = JSON.parse(localStorage.getItem('playedSongs') || '[]');
let myPlaylist = JSON.parse(localStorage.getItem('myPlaylist') || '[]');
let expandedSongs = new Set();

// --- SVG 圖示庫 ---
const svgSun = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>`;
const svgMoon = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>`;
const svgGrid = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>`;
const svgList = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>`;

const svgCheck = `<svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`;
const svgCopy = `<svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v9.25c0 .621-.504 1.125-1.125 1.125Z" /></svg>`;
const svgHeartSolid = `<svg class="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

const toastIcons = {
    success: `<svg class="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
    heart: `<svg class="w-5 h-5 text-rose-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    heartBroken: `<svg class="w-5 h-5 text-rose-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>`,
    info: `<svg class="w-5 h-5 text-sky-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>`,
    error: `<svg class="w-5 h-5 text-rose-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>`,
    reset: `<svg class="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>`
};

// --- 🌙 主題切換邏輯 ---
function updateThemeUI() {
    const isDark = document.documentElement.classList.contains('dark');
    document.getElementById('themeIcon').innerHTML = isDark ? svgSun : svgMoon;
    document.getElementById('themeText').innerText = isDark ? '切換亮色' : '切換暗色';
}

function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    updateThemeUI();
}

document.addEventListener('DOMContentLoaded', updateThemeUI);

// --- 顯示模式邏輯 ---
function updateViewModeUI() {
    document.getElementById('viewModeIcon').innerHTML = isCompactMode ? svgGrid : svgList;
    document.getElementById('viewModeText').innerText = isCompactMode ? '顯示大圖' : '緊湊列表';
}

function initView() {
    updateViewModeUI();
    const container = document.getElementById('songsContainer');
    if (isCompactMode) {
        container.className = 'grid grid-cols-1 md:grid-cols-2 gap-3 transition-all duration-300';
    } else {
        container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300';
    }
}

function toggleViewMode() {
    isCompactMode = !isCompactMode;
    expandedSongs.clear(); 
    initView();
    resetAndRender();
}

// 🚀 判定 15 天內新歌的函式
function isNewSong(dateString) {
    if (!dateString || dateString === '2026-07-01') return false;
    const addedDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - addedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= NEW_SONG_DAYS;
}

function generateSongHtml(song) {
    const displayCover = song.cover_url || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop';
    
    let tagsHtml = '';
    if (song.is_practicing) {
        tagsHtml += `<span class="px-2.5 py-1 bg-amber-100/90 dark:bg-amber-900/60 text-xs rounded-md text-amber-700 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-700/50 shadow-sm backdrop-blur-sm">練歌中</span>`;
    }
    tagsHtml += (song.tags || []).map(tag => `<span class="px-2.5 py-1 bg-white/70 dark:bg-slate-900/80 text-xs rounded-md text-sky-700 dark:text-sky-300 font-medium border border-sky-200 dark:border-slate-700 shadow-sm backdrop-blur-sm">${tag}</span>`).join('');
    
    const noteHtml = song.note ? `<p class="text-xs text-sky-600 dark:text-sky-400 mt-1 font-medium bg-sky-50 dark:bg-transparent px-2 py-1 rounded-md inline-block">♪ ${song.note}</p>` : '';

    const titleEsc = song.title.replace(/'/g, "\\'");
    const artistEsc = song.artist.replace(/'/g, "\\'");

    const isPlayed = playedSongs.includes(song.id);
    const isFav = myPlaylist.includes(song.id);
    const isExpanded = expandedSongs.has(song.id);
    const useNormalMode = !isCompactMode || isExpanded;

    const isNew = isNewSong(song.added_date);

    // 🚀 NEW 徽章設定
    const badgeCompact = isNew ? `<div class="absolute -top-2.5 left-4 bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-600 dark:to-blue-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm shadow-sky-500/30 flex items-center gap-1 border border-sky-200 dark:border-sky-500 tracking-wider z-10"><svg class="w-3 h-3 text-sky-100" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>NEW</div>` : '';
    const badgeGrid = isNew ? `<div class="absolute top-0 left-0 bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-600 dark:to-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-br-2xl rounded-tl-3xl z-20 shadow-md shadow-sky-500/30 flex items-center gap-1 border-b border-r border-sky-300/50 dark:border-sky-500/50 tracking-wider"><svg class="w-3.5 h-3.5 text-sky-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>NEW</div>` : '';
    
    const newCardBorder = isNew ? "ring-2 ring-sky-400/60 dark:ring-sky-500/60 shadow-md shadow-sky-500/10 dark:shadow-sky-900/40" : "";

    const undoSvg = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`;
    const favSvgSolid = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    const favSvgOutline = `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg>`;

    if (!useNormalMode) {
        const compactCheckSvg = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`;

        const btnClass = isPlayed 
            ? `px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full shadow-md transition-all active:scale-95 flex items-center justify-center` 
            : `px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-full shadow-md shadow-sky-200 dark:shadow-sky-900/50 transition-all active:scale-95 flex items-center justify-center`;
        const btnText = isPlayed ? compactCheckSvg : "點";
        
        const undoBtnClass = isPlayed
            ? `p-1.5 bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full transition-all active:scale-95`
            : `hidden p-1.5 bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full transition-all active:scale-95`;

        const favBtnClass = isFav 
            ? "text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 bg-rose-50 dark:bg-rose-500/10" 
            : "text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 bg-white/80 dark:bg-slate-900/50";

        const hasGlobalTag = song.is_practicing;
        
        const cardBgClass = hasGlobalTag
            ? "bg-amber-50/90 hover:bg-amber-100/90 dark:bg-[#3b261e] dark:hover:bg-[#7d3f16]/80 border-amber-200/80 dark:border-amber-700/80"
            : "bg-white/90 hover:bg-sky-50/90 dark:bg-slate-800 dark:hover:bg-slate-700/80 border-sky-200/80 dark:border-slate-700/80";

        const leftBorderClass = hasGlobalTag
            ? "border-amber-400 dark:border-amber-500"
            : (isNew ? "border-sky-500 dark:border-sky-400" : "border-sky-400 dark:border-sky-500");

        return `
            <div id="song-card-${song.id}" onclick="toggleExpand('${song.id}')" class="${cardBgClass} ${newCardBorder} rounded-2xl p-3 transition-colors flex items-center justify-between border shadow-sm group relative cursor-pointer backdrop-blur-sm" title="點擊展開詳細資訊">
                ${badgeCompact}
                <div class="flex-1 min-w-0 pr-2 pl-3 border-l-4 ${leftBorderClass} rounded-l-sm flex flex-col justify-center">
                    <div class="flex items-center mb-0.5">
                        <h3 class="text-base font-bold text-slate-800 dark:text-slate-100 truncate" title="${song.title}">${song.title}</h3>
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400 truncate">${song.artist}</p>
                </div>
                <div class="flex items-center gap-2 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button onclick="event.stopPropagation(); toggleFav('${song.id}')" class="p-2 rounded-full transition-colors active:scale-95 ${favBtnClass}" title="加入/移除歌單">${isFav ? favSvgSolid : favSvgOutline}</button>
                    ${song.youtube_url ? `<a href="${song.youtube_url}" target="_blank" onclick="event.stopPropagation()" class="p-2 rounded-full bg-white/80 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-colors" title="試聽"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></a>` : ''}
                    <button onclick="event.stopPropagation(); unplaySong('${song.id}')" class="${undoBtnClass}" title="取消紀錄">${undoSvg}</button>
                    <button onclick="event.stopPropagation(); handlePlay('${song.id}', '${titleEsc}', '${artistEsc}')" class="${btnClass}">${btnText}</button>
                </div>
            </div>`;
    } else {
        const btnClass = isPlayed 
            ? `flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl shadow-md transition-all active:scale-95 flex justify-center items-center` 
            : `flex-1 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl shadow-md shadow-sky-200 dark:shadow-sky-900/50 transition-all active:scale-95 flex justify-center items-center`;
        const btnText = isPlayed ? `${svgCheck} 已點播` : `${svgCopy} 複製點播`;

        const undoBtnClass = isPlayed
            ? `px-3 py-2 bg-white hover:bg-slate-100 dark:bg-slate-700 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-xl border border-sky-200 dark:border-slate-600 transition-colors flex justify-center items-center`
            : `hidden px-3 py-2 bg-white hover:bg-slate-100 dark:bg-slate-700 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-xl border border-sky-200 dark:border-slate-600 transition-colors flex justify-center items-center`;

        const favBtnClass = isFav 
            ? "bg-rose-500 text-white hover:bg-rose-600" 
            : "bg-white/90 dark:bg-slate-900/70 text-slate-400 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800/90";

        const pointerClass = isCompactMode ? "cursor-pointer" : "";
        const onClickAttr = isCompactMode ? `onclick="toggleExpand('${song.id}')"` : "";
        const titleAttr = isCompactMode ? `title="點擊收合卡片"` : "";

        return `
            <div id="song-card-${song.id}" ${onClickAttr} ${titleAttr} class="bg-white/90 dark:bg-slate-800 ${newCardBorder} rounded-3xl overflow-hidden shadow-sm border border-sky-200/80 dark:border-slate-700 hover:border-sky-400 dark:hover:border-slate-500 hover:shadow-lg transition-all duration-300 group flex flex-col relative backdrop-blur-sm ${pointerClass}">
                ${badgeGrid}
                <button onclick="event.stopPropagation(); toggleFav('${song.id}')" class="absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all active:scale-95 ${favBtnClass}" title="加入/移除歌單">${isFav ? favSvgSolid : favSvgOutline}</button>
                
                <div class="relative aspect-video overflow-hidden bg-sky-100 dark:bg-slate-900 border-b border-sky-100 dark:border-slate-800">
                    <img src="${displayCover}" alt="Cover" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-95 group-hover:opacity-100">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>
                    <div class="absolute bottom-3 left-3 right-3 flex gap-2 flex-wrap z-0">${tagsHtml}</div>
                </div>
                <div class="p-5 flex-1 flex flex-col">
                    <div class="flex items-center w-full mb-1">
                        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 truncate" title="${song.title}">${song.title}</h3>
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mb-2 line-clamp-1">${song.artist}</p>
                    ${noteHtml}
                    <div class="mt-auto pt-5 flex gap-2">
                        <button onclick="event.stopPropagation(); unplaySong('${song.id}')" class="${undoBtnClass}" title="取消紀錄">${undoSvg}</button>
                        <button onclick="event.stopPropagation(); handlePlay('${song.id}', '${titleEsc}', '${artistEsc}')" class="${btnClass}">${btnText}</button>
                        ${song.youtube_url ? `<a href="${song.youtube_url}" target="_blank" onclick="event.stopPropagation()" class="px-4 py-2 bg-white dark:bg-slate-700 hover:bg-red-500 dark:hover:bg-red-500 hover:text-white dark:hover:text-white text-slate-600 dark:text-slate-300 font-medium rounded-xl border border-sky-200 dark:border-slate-600 hover:border-red-500 dark:hover:border-red-500 transition-colors flex justify-center items-center" title="YouTube 試聽"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></a>` : ''}
                    </div>
                </div>
            </div>`;
    }
}

function updateCardDOM(songId) {
    const song = songsData.find(s => s.id === songId);
    if (song) {
        const card = document.getElementById(`song-card-${songId}`);
        if (card) {
            card.outerHTML = generateSongHtml(song);
        }
    }
}

function toggleExpand(songId) {
    if (expandedSongs.has(songId)) {
        expandedSongs.delete(songId);
    } else {
        expandedSongs.add(songId);
    }
    updateCardDOM(songId);
}

function openHelpModal() {
    const modal = document.getElementById('helpModal');
    const content = document.getElementById('helpModalContent');
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
    }, 10);

    if (!localStorage.getItem('hasVisitedHelp')) {
        localStorage.setItem('hasVisitedHelp', 'true');
        document.getElementById('helpBtn').classList.remove('first-visit-glow');
    }
}

function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    const content = document.getElementById('helpModalContent');
    
    modal.classList.add('opacity-0');
    content.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function checkFirstVisit() {
    if (!localStorage.getItem('hasVisitedHelp')) {
        const helpBtn = document.getElementById('helpBtn');
        helpBtn.classList.add('first-visit-glow');
    }
}

function toggleFav(songId) {
    const index = myPlaylist.indexOf(songId);
    const isRemoving = index > -1;

    if (isRemoving) {
        myPlaylist.splice(index, 1);
        showToast('已從我的歌單移除', 'heartBroken');
    } else {
        myPlaylist.push(songId);
        showToast('已加入我的歌單', 'heart');
    }
    localStorage.setItem('myPlaylist', JSON.stringify(myPlaylist));

    if (currentLanguage === '我的歌單' && isRemoving) {
        resetAndRender();
        return;
    }
    updateCardDOM(songId);
}

// 🚀 開啟抖內視窗
function openDonateModal(copiedText) {
    const modal = document.getElementById('donateModal');
    const content = document.getElementById('donateModalContent');
    document.getElementById('donateCopiedText').innerText = copiedText;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
    }, 10);
}

// 🚀 關閉抖內視窗
function closeDonateModal() {
    const modal = document.getElementById('donateModal');
    const content = document.getElementById('donateModalContent');
    
    modal.classList.add('opacity-0');
    content.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

async function handlePlay(songId, title, artist) {
    if (!playedSongs.includes(songId)) {
        playedSongs.push(songId);
        localStorage.setItem('playedSongs', JSON.stringify(playedSongs));
        updateCardDOM(songId);
    }

    const textToCopy = `${title} / ${artist}`;
    
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(textToCopy);
            openDonateModal(textToCopy);
            return; 
        } catch (err) {}
    }
    try {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        openDonateModal(textToCopy);
    } catch (err) {
        showToast('複製失敗', 'error');
    }
}

function unplaySong(songId) {
    playedSongs = playedSongs.filter(id => id !== songId);
    localStorage.setItem('playedSongs', JSON.stringify(playedSongs));
    updateCardDOM(songId);
    showToast('已取消點播紀錄', 'reset');
}

function resetPlayHistory() {
    if (playedSongs.length === 0) {
        showToast('目前沒有點播紀錄', 'info');
        return;
    }
    if (confirm('確定要清除所有在本機的「已點播」紀錄嗎？\n(您的個性歌單收藏不受影響)')) {
        playedSongs = [];
        localStorage.removeItem('playedSongs');
        resetAndRender(); 
        showToast('點歌紀錄已清除', 'reset');
    }
}

function openSyncModal() {
    const modal = document.getElementById('syncModal');
    const content = document.getElementById('syncModalContent');
    document.getElementById('syncCodeInput').value = '';
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
    }, 10);
}

function closeSyncModal() {
    const modal = document.getElementById('syncModal');
    const content = document.getElementById('syncModalContent');
    
    modal.classList.add('opacity-0');
    content.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

async function exportSyncData() {
    const dataToExport = {
        p: playedSongs,
        f: myPlaylist
    };
    
    try {
        const encodedData = btoa(JSON.stringify(dataToExport));
        const inputElement = document.getElementById('syncCodeInput');
        inputElement.value = encodedData;
        
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(encodedData);
            showToast('匯出代碼已產生並複製！', 'success');
        } else {
            inputElement.select();
            document.execCommand('copy');
            showToast('匯出代碼已產生並複製！', 'success');
        }
    } catch (error) {
        showToast('匯出失敗，請重試', 'error');
    }
}

function importSyncData(isMerge) {
    const code = document.getElementById('syncCodeInput').value.trim();
    if (!code) {
        showToast('請先輸入匯入代碼', 'info');
        return;
    }

    try {
        const decodedJsonStr = atob(code);
        const importedData = JSON.parse(decodedJsonStr);
        
        if (!importedData.p || !importedData.f || !Array.isArray(importedData.p) || !Array.isArray(importedData.f)) {
            throw new Error('代碼格式錯誤');
        }

        if (isMerge) {
            playedSongs = Array.from(new Set([...playedSongs, ...importedData.p]));
            myPlaylist = Array.from(new Set([...myPlaylist, ...importedData.f]));
            showToast('合併匯入成功！', 'success');
        } else {
            if(!confirm('確定要完全覆蓋現有的資料嗎？\n這將會清除您本機當前所有的「紀錄」與「歌單」。')) return;
            playedSongs = importedData.p;
            myPlaylist = importedData.f;
            showToast('覆蓋匯入成功！', 'reset');
        }

        localStorage.setItem('playedSongs', JSON.stringify(playedSongs));
        localStorage.setItem('myPlaylist', JSON.stringify(myPlaylist));
        
        closeSyncModal();
        resetAndRender();

    } catch (error) {
        showToast('代碼無效或格式錯誤', 'error');
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const iconHtml = toastIcons[type] || toastIcons.info;
    toast.innerHTML = `${iconHtml}<span>${message}</span>`;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 2500);
}

function renderFilters() {
    const langContainer = document.getElementById('langFilterContainer');
    const subContainer = document.getElementById('subTagFilterContainer');
    const defaultLangs = ['日文', '中文', '英文', '韓文'];
    
    langContainer.innerHTML = '';
    
    const favContainer = document.createElement('div');
    favContainer.className = 'w-full md:w-auto flex-shrink-0';
    
    const langsContainer = document.createElement('div');
    langsContainer.className = 'flex flex-wrap gap-2.5 flex-1';

    const mainLangs = ['我的歌單', ...defaultLangs, '全部'];
    
    const shortMap = {
        '日文': '日',
        '中文': '中',
        '英文': '英',
        '韓文': '韓',
        '全部': '全'
    };

    mainLangs.forEach(lang => {
        const btn = document.createElement('button');
        
        if (lang === '我的歌單') {
            btn.innerHTML = `${svgHeartSolid} <span>我的歌單</span>`;
        } else if (shortMap[lang]) {
            btn.innerHTML = `<span class="md:hidden">${shortMap[lang]}</span><span class="hidden md:inline">${lang}</span>`;
        } else {
            btn.innerText = lang;
        }

        btn.onclick = () => {
            currentLanguage = lang;
            currentSubTag = '全部'; 
            isSubTagsExpanded = false; 
            renderFilters(); 
            resetAndRender();
        };
        
        if (lang === currentLanguage) {
            const activeColor = lang === '我的歌單' ? 'bg-rose-500 shadow-rose-200 dark:shadow-rose-900/50 text-white' : 'bg-sky-500 shadow-sky-200 dark:shadow-sky-900/50 text-white';
            btn.className = `filter-btn active py-2 rounded-full text-sm whitespace-nowrap shadow-md font-medium border border-transparent transition-all flex items-center justify-center ${activeColor}`;
        } else {
            btn.className = "filter-btn py-2 rounded-full bg-white/90 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-sky-100 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-300 text-sm whitespace-nowrap border border-sky-200 dark:border-slate-600 shadow-sm transition-all flex items-center justify-center";
        }

        if (lang === '我的歌單') {
            btn.classList.add('w-full', 'md:px-6');
            favContainer.appendChild(btn);
        } else {
            btn.classList.add('px-4', 'md:px-6');
            langsContainer.appendChild(btn);
        }
    });
    
    langContainer.appendChild(favContainer);
    langContainer.appendChild(langsContainer);

    subContainer.innerHTML = '';
    
    if (currentLanguage === '全部' || currentLanguage === '我的歌單') {
        subContainer.classList.add('hidden');
        return;
    }

    const songsForCurrentLang = songsData.filter(song => song.language === currentLanguage);
    
    const tagCounts = {};
    songsForCurrentLang.forEach(song => {
        if (song.tags && Array.isArray(song.tags)) {
            song.tags.forEach(tag => {
                if (!defaultLangs.includes(tag)) {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                }
            });
        }
    });

    const sortedSubTags = Object.keys(tagCounts).sort((a, b) => {
        if (tagCounts[b] !== tagCounts[a]) return tagCounts[b] - tagCounts[a];
        return a.localeCompare(b);
    });

    if (sortedSubTags.length > 0) {
        subContainer.classList.remove('hidden');
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = "md:hidden w-full flex items-center justify-between px-4 py-2.5 bg-sky-100/90 dark:bg-slate-700/50 hover:bg-sky-200 dark:hover:bg-slate-700 rounded-xl text-sky-700 dark:text-sky-300 font-medium text-sm mb-3 transition-colors border border-sky-200 dark:border-slate-600 shadow-sm";
        toggleBtn.innerHTML = `
            <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                進階分類標籤 <span class="bg-sky-200 dark:bg-slate-600 text-sky-800 dark:text-sky-200 py-0.5 px-2 rounded-full text-xs ml-1">${sortedSubTags.length}</span>
            </span>
            <svg class="w-5 h-5 transform transition-transform ${isSubTagsExpanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        `;
        toggleBtn.onclick = () => {
            isSubTagsExpanded = !isSubTagsExpanded;
            renderFilters(); 
        };
        subContainer.appendChild(toggleBtn);
        
        const tagsWrapper = document.createElement('div');
        tagsWrapper.className = `flex-wrap gap-2 ${isSubTagsExpanded ? 'flex' : 'hidden md:flex'}`;
        
        const finalSubTags = [...sortedSubTags, '全部'];
        
        finalSubTags.forEach(tag => {
            const btn = document.createElement('button');
            const count = tag === '全部' ? songsForCurrentLang.length : tagCounts[tag];
            
            btn.innerText = tag;
            btn.title = `包含 ${count} 首歌曲`;
            btn.onclick = () => {
                currentSubTag = tag;
                renderFilters(); 
                resetAndRender(); 
            };
            
            if (tag === currentSubTag) {
                btn.className = "filter-btn active px-4 py-1.5 rounded-full bg-sky-400 hover:bg-sky-500 text-white text-xs whitespace-nowrap shadow-sm shadow-sky-200 dark:shadow-sky-900/50 font-medium border border-transparent transition-all";
            } else {
                btn.className = "filter-btn px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 hover:bg-sky-100 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-300 text-xs whitespace-nowrap border border-sky-200 dark:border-slate-700 shadow-sm transition-all";
            }
            tagsWrapper.appendChild(btn);
        });
        
        subContainer.appendChild(tagsWrapper);
        
    } else {
        subContainer.classList.add('hidden');
    }
}

const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    
    if (searchQuery.length > 0) {
        clearSearchBtn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
        clearSearchBtn.classList.add('opacity-0', 'pointer-events-none');
    }
    
    resetAndRender();
});

function clearSearch() {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.classList.add('opacity-0', 'pointer-events-none');
    resetAndRender();
    searchInput.focus(); 
}

function resetAndRender() {
    currentDisplayCount = 0;
    expandedSongs.clear(); 
    document.getElementById('songsContainer').innerHTML = '';
    document.getElementById('loadingIndicator').classList.remove('hidden');

    currentFilteredSongs = songsData.filter(song => {
        if (currentLanguage === '我的歌單') {
            if (!myPlaylist.includes(song.id)) return false;
            const searchTarget = (song.title + song.artist + song.note + (song.tags ? song.tags.join('') : '')).toLowerCase();
            return searchTarget.includes(searchQuery);
        }

        const matchLang = currentLanguage === '全部' || song.language === currentLanguage;
        const matchSubTag = currentSubTag === '全部' || (song.tags && song.tags.includes(currentSubTag));
        const searchTarget = (song.title + song.artist + song.note + (song.tags ? song.tags.join('') : '')).toLowerCase();
        const matchSearch = searchTarget.includes(searchQuery);
        
        return matchLang && matchSubTag && matchSearch;
    });

    // 🚀 讓 15 天內的新歌優先排序在最前面
    currentFilteredSongs.sort((a, b) => {
        const aIsNew = isNewSong(a.added_date);
        const bIsNew = isNewSong(b.added_date);
        
        if (aIsNew && !bIsNew) return -1;
        if (!aIsNew && bIsNew) return 1;
        if (aIsNew && bIsNew) {
            return new Date(b.added_date) - new Date(a.added_date);
        }
        return 0;
    });

    let filterStatus = currentLanguage;
    if (currentSubTag !== '全部') {
        filterStatus += ` > ${currentSubTag}`;
    }
    if (searchQuery) {
        filterStatus += ` (搜尋: "${searchQuery}")`;
    }
    document.getElementById('currentFilterText').innerText = filterStatus;
    
    const countDisplay = document.getElementById('songCountDisplay');
    if (countDisplay) {
        countDisplay.innerText = `共 ${currentFilteredSongs.length} 首`;
    }

    if (currentFilteredSongs.length === 0) {
        if (currentLanguage === '我的歌單' && searchQuery === '') {
            document.getElementById('songsContainer').innerHTML = '<div class="col-span-full text-center py-16 text-slate-500 font-medium">目前還沒有加入任何歌曲喔<br><span class="text-sm mt-3 block opacity-80">點擊歌曲卡片上的愛心即可加入我的歌單</span></div>';
        } else {
            document.getElementById('songsContainer').innerHTML = '<div class="col-span-full text-center py-16 text-slate-500 font-medium">找不到符合條件的歌曲</div>';
        }
        document.getElementById('loadingIndicator').classList.add('hidden');
        return;
    }

    loadMoreSongs();
}

function loadMoreSongs() {
    if (currentDisplayCount >= currentFilteredSongs.length) {
        document.getElementById('loadingIndicator').classList.add('hidden');
        return;
    }

    const container = document.getElementById('songsContainer');
    const nextBatch = currentFilteredSongs.slice(currentDisplayCount, currentDisplayCount + BATCH_SIZE);
    
    let batchHtml = '';
    nextBatch.forEach(song => {
        batchHtml += generateSongHtml(song);
    });

    container.insertAdjacentHTML('beforeend', batchHtml);
    currentDisplayCount += nextBatch.length;
    
    if (currentDisplayCount >= currentFilteredSongs.length) {
        document.getElementById('loadingIndicator').classList.add('hidden');
    }
}

const observerOptions = {
    root: null,
    rootMargin: '300px', 
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        loadMoreSongs();
    }
}, observerOptions);

observer.observe(document.getElementById('loadMoreTrigger'));

async function loadSongsData() {
    try {
        initView();
        checkFirstVisit(); 

        const timestamp = new Date().getTime();
        const response = await fetch(`./playlist.json?t=${timestamp}`, { cache: 'no-store' });
        
        if (!response.ok) throw new Error('無法讀取資料');
        
        songsData = await response.json();
        
        renderFilters();
        resetAndRender();
        
    } catch (error) {
        console.error("載入失敗：", error);
        document.getElementById('songsContainer').innerHTML = '<div class="col-span-full text-center py-16 text-slate-500 font-medium">讀取歌單資料失敗，請確認 playlist.json 是否已成功上傳</div>';
        document.getElementById('loadingIndicator').classList.add('hidden');
    }
}

loadSongsData();