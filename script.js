// Kelimeleri ve ayarları localStorage'da saklamak için anahtarlar
const WORDS_KEY = "kelimeler";
const SETTINGS_KEY = "settings";

// Arayüzde kelime listesini güncelle
function renderWords() {
  let kelimeler = JSON.parse(localStorage.getItem(WORDS_KEY) || '[]');
  const wordList = document.getElementById('wordList');
  const listBadge = document.getElementById('listBadge');
  wordList.innerHTML = '';
  kelimeler.forEach((item, idx) => {
    let li = document.createElement('li');
    li.className = "flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded px-3 py-2";
    li.innerHTML = `<span>${item.word} <small class="ml-2 text-gray-400">${item.interval}s</small></span>
      <button class="btn btn-xs btn-danger" onclick="deleteWord(${idx})">Sil</button>`;
    wordList.appendChild(li);
  });
  listBadge.textContent = kelimeler.length;
}

// Kelime ekle
function addWord() {
  const wordInput = document.getElementById("wordInput");
  const intervalInput = document.getElementById("intervalInput");
  const word = wordInput.value.trim();
  const interval = parseInt(intervalInput.value.trim());
  if (!word || isNaN(interval) || interval <= 0) {
    showToast("Lütfen kelime ve süre giriniz!", true);
    return;
  }
  let kelimeler = JSON.parse(localStorage.getItem(WORDS_KEY) || '[]');
  kelimeler.push({ word, interval, ogrenildi: false });
  localStorage.setItem(WORDS_KEY, JSON.stringify(kelimeler));
  wordInput.value = '';
  intervalInput.value = '';
  renderWords();
  showToast("Kelime eklendi!");
}

// Kelime sil
function deleteWord(idx) {
  let kelimeler = JSON.parse(localStorage.getItem(WORDS_KEY) || '[]');
  kelimeler.splice(idx, 1);
  localStorage.setItem(WORDS_KEY, JSON.stringify(kelimeler));
  renderWords();
}

// Tüm kelimeleri sil
function clearAllWords() {
  if (confirm("Tüm kelimeleri silmek istediğinize emin misiniz?")) {
    localStorage.removeItem(WORDS_KEY);
    renderWords();
  }
}

// Kelimeleri dışa aktar (JSON)
function exportWordsAsJSON() {
  let kelimeler = localStorage.getItem(WORDS_KEY) || '[]';
  const blob = new Blob([kelimeler], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kelimeler.json';
  a.click();
  URL.revokeObjectURL(url);
}

// JSON dosyasından kelimeleri içe aktar
function uploadFile() {
  const input = document.getElementById('fileInput');
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        localStorage.setItem(WORDS_KEY, JSON.stringify(imported));
        renderWords();
        showToast("Dosya başarıyla yüklendi!");
      } else {
        showToast("Geçersiz dosya formatı!", true);
      }
    } catch {
      showToast("Dosya okunamadı!", true);
    }
  };
  reader.readAsText(file);
}

// Bildirim başlat/durdur (örnek, tarayıcı Notification API kullanır)
let notificationIntervalId = null;
function updateNotifications() {
  if (!("Notification" in window)) {
    showToast("Tarayıcınız bildirimleri desteklemiyor!", true);
    return;
  }
  Notification.requestPermission().then(permission => {
    if (permission !== "granted") {
      showToast("Bildirim izni verilmedi!", true);
      return;
    }
    startPeriodicNotifications();
    showToast("Bildirimler başlatıldı!");
  });
}
function startPeriodicNotifications() {
  stopAllNotifications();
  let kelimeler = JSON.parse(localStorage.getItem(WORDS_KEY) || '[]');
  if (kelimeler.length === 0) return;
  let idx = 0;
  const interval = parseInt(document.getElementById('notificationInterval').value) || 60;
  if (interval <= 0) return;
  notificationIntervalId = setInterval(() => {
    const kelime = kelimeler[idx % kelimeler.length];
    new Notification("Kelime Bildirimi", { body: `${kelime.word} (${kelime.interval}s)` });
    idx++;
  }, interval * 60000); // dakika cinsinden
}
function stopAllNotifications() {
  if (notificationIntervalId) clearInterval(notificationIntervalId);
  notificationIntervalId = null;
  showToast("Bildirimler durduruldu.");
}

// Basit Quiz başlat (örnek)
function startQuiz() {
  let kelimeler = JSON.parse(localStorage.getItem(WORDS_KEY) || '[]');
  if (kelimeler.length === 0) {
    showToast("Önce kelime ekleyin!", true);
    return;
  }
  const random = kelimeler[Math.floor(Math.random() * kelimeler.length)];
  openQuizModal(random.word);
}

// Quiz cevapla (örnek)
function submitQuizAnswer() {
  showToast("Cevabınız kaydedildi!");
  closeQuizModal();
}
function closeQuizModal() {
  document.getElementById('quizModal').classList.add('hidden');
}

// Flashcard başlat (örnek)
let flashcardIndex = 0;
function showFlashcardSection() {
  flashcardIndex = 0;
  renderFlashcard();
}
function renderFlashcard() {
  let kelimeler = JSON.parse(localStorage.getItem(WORDS_KEY) || '[]');
  const box = document.getElementById('flashcardBox');
  if (!kelimeler.length) {
    box.innerHTML = "<div>Kelime yok.</div>";
    return;
  }
  const kelime = kelimeler[flashcardIndex % kelimeler.length];
  box.innerHTML = `<div class="text-2xl">${kelime.word}</div>`;
  document.getElementById('flashcardBadge').textContent = kelimeler.length;
}
function prevFlashcard() {
  let kelimeler = JSON.parse(localStorage.getItem(WORDS_KEY) || '[]');
  flashcardIndex = (flashcardIndex - 1 + kelimeler.length) % kelimeler.length;
  renderFlashcard();
}
function nextFlashcard() {
  let kelimeler = JSON.parse(localStorage.getItem(WORDS_KEY) || '[]');
  flashcardIndex = (flashcardIndex + 1) % kelimeler.length;
  renderFlashcard();
}
function toggleFlashcard() {
  // Basit çevirme - ileri seviye için geliştirilebilir
  showToast("Çevir özelliği eklenecek.");
}
function markLearned() {
  let kelimeler = JSON.parse(localStorage.getItem(WORDS_KEY) || '[]');
  if (!kelimeler[flashcardIndex]) return;
  kelimeler[flashcardIndex].ogrenildi = true;
  localStorage.setItem(WORDS_KEY, JSON.stringify(kelimeler));
  renderFlashcard();
  showToast("Öğrenildi olarak işaretlendi!");
}
function addFlashcardNote() {
  showToast("Not ekleme özelliği eklenecek.");
}
function speakFlashcard() {
  let kelimeler = JSON.parse(localStorage.getItem(WORDS_KEY) || '[]');
  if (!kelimeler[flashcardIndex]) return;
  const utter = new SpeechSynthesisUtterance(kelimeler[flashcardIndex].word);
  speechSynthesis.speak(utter);
}

// Profil fonksiyonları
function saveProfile() {
  const name = document.getElementById('profileName').value.trim();
  const bio = document.getElementById('profileBio').value.trim();
  localStorage.profileName = name;
  localStorage.profileBio = bio;
  showToast("Profil kaydedildi!");
  renderProfile();
}
function renderProfile() {
  document.getElementById('profileName').value = localStorage.profileName || "";
  document.getElementById('profileBio').value = localStorage.profileBio || "";
  document.getElementById('profileImage').src = localStorage.profileImage || "https://randomuser.me/api/portraits/men/32.jpg";
  document.getElementById('profileImagePreview').src = localStorage.profileImage || "https://randomuser.me/api/portraits/men/32.jpg";
  let kelimeList = JSON.parse(localStorage.kelimeler || '[]');
  document.getElementById('profileStatKelime').textContent = kelimeList.length;
  document.getElementById('profileStatOgrenildi').textContent = kelimeList.filter(w=>w.ogrenildi).length;
}
function updateProfileImage(e) {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    localStorage.profileImage = ev.target.result;
    document.getElementById('profileImage').src = ev.target.result;
    document.getElementById('profileImagePreview').src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

// Bildirim ve hata mesajı göstermek için
function showToast(msg, isError) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = isError ? "fixed right-4 bottom-4 bg-red-500 text-white px-4 py-3 rounded shadow-lg opacity-100 pointer-events-none transition z-50" :
    "fixed right-4 bottom-4 bg-green-500 text-white px-4 py-3 rounded shadow-lg opacity-100 pointer-events-none transition z-50";
  setTimeout(() => {
    toast.className = "fixed right-4 bottom-4 bg-green-500 text-white px-4 py-3 rounded shadow-lg opacity-0 pointer-events-none transition z-50";
  }, 2000);
}

// Arama filtreleme fonksiyonu
function filterWords() {
  let search = document.getElementById('wordSearch').value.trim().toLowerCase();
  let kelimeler = JSON.parse(localStorage.getItem(WORDS_KEY) || '[]');
  const wordList = document.getElementById('wordList');
  wordList.innerHTML = '';
  kelimeler.filter(item => item.word.toLowerCase().includes(search)).forEach((item, idx) => {
    let li = document.createElement('li');
    li.className = "flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded px-3 py-2";
    li.innerHTML = `<span>${item.word} <small class="ml-2 text-gray-400">${item.interval}s</small></span>
      <button class="btn btn-xs btn-danger" onclick="deleteWord(${idx})">Sil</button>`;
    wordList.appendChild(li);
  });
}

// Sayfa yüklendiğinde profil ve kelime listesini göster
document.addEventListener('DOMContentLoaded', function(){
  renderProfile();
  renderWords();
});
