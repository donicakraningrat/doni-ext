Syarat Pendukung:
1. Terinstall Node.js di local machine

Installasi:
1. extract Chrome extensions
2. Buka Chrome 
    - tempelkan di address bar URI: "chrome://extensions/"
    - nyalahkan "Developer Mode"
    - klik tombol "Load unpacked" dan cari lokasi FOLDER dari chrome extensions yang sudah di extract
    - setelah di load copy id dari extensions 
3. ubah file .env di dalam folder sesuai konfigurasi yang di butuhkan:
    - port untuk menentukan port api 
    - CHROME_EXT idisi dengan chrome-extension://[ id extension yang sebelumnya di copy]

Installasi API:
1. Jalankan terminal dan arahkan sesuai lokasi applikasi yang sudah di extract.
2. Jalankan di terminal: npm Install
3. Jalankan di terminal: node index.js
    - hingga muncul pesan Server is running on port 3001

Menghidupkan API:
1. buka terminal arahkan lokasi chrome extensions
2. Jalankan di terminal: node index.js
    - hingga muncul pesan Server is running on port 3001