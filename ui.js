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


// --- 🍞 吐司提示 ---
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const iconHtml = toastIcons[type] || toastIcons.info;
    toast.innerHTML = `${iconHtml}<span>${message}</span>`;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 2500);
}


// --- 📖 使用說明 Modal ---
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
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
}

function checkFirstVisit() {
    if (!localStorage.getItem('hasVisitedHelp')) {
        document.getElementById('helpBtn').classList.add('first-visit-glow');
    }
}


// --- 💰 抖內提示 Modal ---
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

function closeDonateModal() {
    const modal = document.getElementById('donateModal');
    const content = document.getElementById('donateModalContent');
    modal.classList.add('opacity-0');
    content.classList.add('scale-95');
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
}


// --- 🔄 同步備份 Modal ---
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
    setTimeout(() => { modal.classList.add('hidden'); }, 300);
}