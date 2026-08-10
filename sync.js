// --- 匯出資料 ---
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

// --- 匯入資料 ---
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