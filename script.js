// ------------------- PROFIL FONKSIYONLARI -------------------
function showProfileSection() {
  const defaultName = localStorage.getItem('profileName') || "Kullanıcı Adı";
  const defaultEmail = localStorage.getItem('profileEmail') || "kullanici@mail.com";
  // Öğrenilen kelimeler varsa (örnek: learnedWords), yoksa tüm kelimeler
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
  let words = JSON.parse(localStorage.getItem('words') || '[]');
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

// ------------------- FLASHCARD VE DIGERLERI -------------------
// Buraya flashcard, quiz, bildirim, vs. gibi diğer fonksiyonlarınızı ekleyebilirsiniz

// ------------------- SAYFA AÇILINCA OTO YÜKLENENLER -------------------
window.addEventListener('DOMContentLoaded', () => {
  updateWordList();
  updateListBadge();
  updateFlashcardBadge();
  // Profil sekmesi açılırsa bilgileri güncelle
  if (window.location.hash === "#profil") showProfileSection();
});
