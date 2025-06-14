// Basit kelime ekleme ve bildirim işlevleri
let words = [];
const wordInput = document.getElementById('wordInput');
const intervalInput = document.getElementById('intervalInput');
const wordList = document.getElementById('wordList');
const errorDiv = document.getElementById('error');

// Menü göster/gizle
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
}

// Tema değiştirme
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Kelime ekle
function addWord() {
    const word = wordInput.value.trim();
    if (!word) {
        showError("Kelime boş olamaz!");
        return;
    }
    words.push(word);
    renderWords();
    wordInput.value = "";
    hideError();
}

// Kelime listesini güncelle
function renderWords() {
    wordList.innerHTML = words.map(w => `<li>${w}</li>`).join('');
}

// Hata mesajı göster
function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
}
function hideError() {
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
}

// Tümünü sil
function clearAllWords() {
    words = [];
    renderWords();
    hideError();
}

// Dosya yükleme (dummy)
function uploadFile() {
    showError("Dosya yükleme henüz aktif değil.");
}

// Bildirim ayarlarını güncelle (dummy)
function updateNotifications() {
    alert("Bildirim ayarları kaydedildi.");
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    renderWords();
    hideError();
});