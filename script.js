// ------------------- PROFIL FONKSIYONLARI -------------------
function showProfileSection() {
  const defaultName = localStorage.getItem('profileName') || "Kullanıcı Adı";
  const defaultEmail = localStorage.getItem('profileEmail') || "kullanici@mail.com";
  let learnedCount = 0;
  if (localStorage.getItem('learnedWords')) {
    learnedCount = JSON.parse(localStorage.getItem('learnedWords')).length;
  } else if (localStorage.getItem('words')) {
    learnedCount = JSON.parse(localStorage.getItem('words')).length;
  }
  document.getElementById('profileName').textContent = defaultName;
  document.getElementById('profileEmail').textContent = defaultEmail;
  document.getElementById('learnedCount').textContent = learnedCount;
  document.getElementById('profileTheme').textContent = document.documentElement.classList.contains('dark') ? "Koyu" : "Açık";
  document.getElementById('profileNameInput').value = defaultName;
  document.getElementById('profileEmailInput').value = defaultEmail;
  // Profil fotoğrafını yükle
  const avatar = localStorage.getItem('profileAvatar');
  if (avatar) document.getElementById('profileAvatar').src = avatar;
}

function updateProfileName() {
  const val = document.getElementById('profileNameInput').value.trim();
  if (val.length > 0) {
    localStorage.setItem('profileName', val);
    document.getElementById('profileName').textContent = val;
    showToast('Profil adı güncellendi!');
  }
}

// ------------------- TOAST MESAJI -------------------
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.opacity = "1";
  toast.classList.remove('pointer-events-none');
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.classList.add('pointer-events-none');
  }, 2000);
}

// ------------------- KELIME EKLEME & LISTELEME -------------------
function addWord() {
  const wordInput = document.getElementById('wordInput');
  const intervalInput = document.getElementById('intervalInput');
  const word = wordInput.value.trim();
  const interval = parseInt(intervalInput.value, 10) || 0;
  if (!word) {
    showToast("Kelime boş olamaz!");
    return;
  }
  if (interval < 1) {
    showToast("Süre 1 saniyeden küçük olamaz!");
    return;
  }
  let words = JSON.parse(localStorage.getItem('words') || '[]');
  if (words.some(w => w.word === word)) {
    showToast("Bu kelime zaten ekli!");
    return;
  }
  words.push({ word, interval, addedAt: Date.now() });
  localStorage.setItem('words', JSON.stringify(words));
  wordInput.value = "";
  intervalInput.value = "";
  showToast("Kelime eklendi!");
  updateWordList();
  updateListBadge();
  updateFlashcardBadge();
}

function updateWordList() {
  const wordListEl = document.getElementById('wordList');
  if (!wordListEl) return;
  const words = JSON.parse(localStorage.getItem('words') || '[]');
  wordListEl.innerHTML = words.map((w, i) =>
    `<li class="flex justify-between items-center bg-white/70 dark:bg-gray-700 px-4 py-2 rounded">
      <span>${w.word}</span>
      <button class="btn btn-danger btn-xs" onclick="deleteWord(${i})">Sil</button>
    </li>`
  ).join('');
}

function deleteWord(index) {
  let words = JSON.parse(localStorage.getItem('words') || '[]');
  words.splice(index, 1);
  localStorage.setItem('words', JSON.stringify(words));
  updateWordList();
  updateListBadge();
  updateFlashcardBadge();
  showToast("Kelime silindi.");
}

function clearAllWords() {
  if (!confirm("Tüm kelimeler silinecek. Emin misiniz?")) return;
  localStorage.removeItem('words');
  updateWordList();
  updateListBadge();
  updateFlashcardBadge();
  showToast("Tüm kelimeler silindi.");
}

function updateListBadge() {
  const words = JSON.parse(localStorage.getItem('words') || '[]');
  const badge = document.getElementById('listBadge');
  if (badge) {
    badge.textContent = words.length;
    badge.classList.add('bounce');
    setTimeout(() => badge.classList.remove('bounce'), 400);
  }
}

function updateFlashcardBadge() {
  const words = JSON.parse(localStorage.getItem('words') || '[]');
  const badge = document.getElementById('flashcardBadge');
  if (badge) badge.textContent = words.length;
}

// Sade bir dışa aktar (JSON)
function exportWordsAsJSON() {
  const words = localStorage.getItem('words');
  if (!words) {
    showToast("Kelime bulunamadı!");
    return;
  }
  const blob = new Blob([words], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "kelimeler.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("JSON olarak dışa aktarıldı!");
}

// Dosya yükleme (şimdilik pasif)
function uploadFile() {
  showToast("Dosya yükleme özelliği henüz aktif değil!");
}

// Basit filtreleme
function filterWords() {
  const search = document.getElementById('wordSearch').value.trim().toLowerCase();
  const wordListEl = document.getElementById('wordList');
  const words = JSON.parse(localStorage.getItem('words') || '[]');
  wordListEl.innerHTML = words
    .map((w, i) =>
      w.word.toLowerCase().includes(search) ?
      `<li class="flex justify-between items-center bg-white/70 dark:bg-gray-700 px-4 py-2 rounded">
        <span>${w.word}</span>
        <button class="btn btn-danger btn-xs" onclick="deleteWord(${i})">Sil</button>
      </li>` : ''
    ).join('');
}

// ------------------- BILDIRIM, QUIZ, FLASHCARD VS. YERLERI EKLEYEBILIRSIN -------------------

// ------------------- SAYFA AÇILINCA OTO YÜKLENENLER -------------------
window.addEventListener('DOMContentLoaded', () => {
  updateWordList();
  updateListBadge();
  updateFlashcardBadge();
  showProfileSection();
});
