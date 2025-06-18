// --- Gelişmiş Bildirimler Başlangıç ---

let notificationTimers = [];

function requestNotificationPermission() {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

// Ayarları kaydet
function updateNotificationSettings() {
  const times = document.getElementById('notificationTimes').value.trim();
  const interval = parseInt(document.getElementById('notificationInterval').value, 10) || 0;
  localStorage.notificationTimes = times;
  localStorage.notificationInterval = interval;
}

function clearNotificationTimers() {
  for (const t of notificationTimers) clearTimeout(t);
  for (const t of notificationTimers) clearInterval(t);
  notificationTimers = [];
}

// Bildirimleri başlat
function updateNotifications() {
  updateNotificationSettings();
  requestNotificationPermission();
  clearNotificationTimers();
  scheduleNotifications();
  document.getElementById('toast').textContent = "Bildirimler başlatıldı!";
  document.getElementById('toast').style.opacity = 1;
  setTimeout(() => document.getElementById('toast').style.opacity = 0, 2000);
}

// Bildirimleri durdur
function stopAllNotifications() {
  clearNotificationTimers();
  document.getElementById('toast').textContent = "Bildirimler durduruldu!";
  document.getElementById('toast').style.opacity = 1;
  setTimeout(() => document.getElementById('toast').style.opacity = 0, 2000);
}

// Saat ve aralık ile bildirimi kur
function scheduleNotifications() {
  // Saat bazlı bildirimler
  const times = (localStorage.notificationTimes || "").split(",").map(s=>s.trim()).filter(Boolean);
  for (const t of times) {
    if (/^\d{2}:\d{2}$/.test(t)) {
      scheduleNotificationAtTime(t);
    }
  }
  // Periyodik (aralıklı) bildirimler
  const interval = parseInt(localStorage.notificationInterval, 10) || 0;
  if (interval > 0) {
    let intervalId = setInterval(() => {
      showWordNotification();
    }, interval * 60 * 1000);
    notificationTimers.push(intervalId);
  }
}

// Saatte bildirimi kur
function scheduleNotificationAtTime(time) {
  const [h, m] = time.split(":").map(Number);
  const now = new Date();
  let notifTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
  if (notifTime < now) notifTime.setDate(notifTime.getDate() + 1); // Geçtiyse yarına ayarla
  const timeout = notifTime - now;
  let timerId = setTimeout(() => {
    showWordNotification();
    scheduleNotificationAtTime(time); // Ertesi gün için tekrar kur
  }, timeout);
  notificationTimers.push(timerId);
}

// Bildirim gönder
function showWordNotification() {
  if (Notification.permission !== "granted") return;
  let kelimeler = JSON.parse(localStorage.kelimeler || "[]");
  if (!kelimeler.length) return;
  const count = parseInt(localStorage.notificationWordCount, 10) || 1;
  // Rastgele count kadar kelime seç
  let kelimeList = [];
  let used = new Set();
  while (kelimeList.length < count && kelimeList.length < kelimeler.length) {
    let idx = Math.floor(Math.random()*kelimeler.length);
    if (!used.has(idx)) {
      kelimeList.push(kelimeler[idx]);
      used.add(idx);
    }
  }
  let body = kelimeList.map(k=>`${k.kelime}${k.anlam ? " - " + k.anlam : ""}`).join("\n");
  new Notification("Kelime Hatırlatma", {
    body: body,
    icon: "/icon.png"
  });
}

// Ayarlar ekrana geldiğinde inputları doldur
document.addEventListener('DOMContentLoaded', function() {
  if(document.getElementById("notificationTimes")){
    document.getElementById("notificationTimes").value = localStorage.notificationTimes || "";
    document.getElementById("notificationInterval").value = localStorage.notificationInterval || "60";
    document.getElementById("notificationWordCount").value = localStorage.notificationWordCount || "1";
    // inputlarda değişiklikte kaydet
    document.getElementById("notificationTimes").onchange = updateNotificationSettings;
    document.getElementById("notificationInterval").onchange = updateNotificationSettings;
    document.getElementById("notificationWordCount").onchange = function() {
      localStorage.notificationWordCount = document.getElementById("notificationWordCount").value;
    };
  }
});

// --- Gelişmiş Bildirimler Son ---

// (Diğer mevcut script fonksiyonların burada yer almaya devam edecek)
