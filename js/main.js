if('serviceWorker' in navigator) {
  console.log("Menginstal Service Worker");
  navigator.serviceWorker.register('/PWA-Kegiatan-KKLP/sw.js')
  .then(function(reg) {
    console.info('Service Worker Terinstal.', reg);
  })
  .catch(function() {
    console.error('Gagal Menginstal Service Worker.');
  });
}