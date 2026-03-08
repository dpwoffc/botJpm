# WhatsApp Bot

Bot WhatsApp berbasis **Node.js** menggunakan library **Baileys** untuk menghubungkan WhatsApp Web dan menjalankan berbagai fitur otomatis.

## 🚀 Fitur
- WhatsApp Bot menggunakan Baileys
- Pairing Code Login
- Pengiriman pesan otomatis
- Sistem database JSON
- Support pengiriman pesan ke grup yang tersimpan
- Struktur kode sederhana dan mudah dikembangkan

## 📂 Struktur Project
.
├── index.js

├── dpwoffc.js

├── package.json

├── database

│   ├── grupTarget.json

│   └── grupUrl.json

## ⚙️ Install & Jalankan

Install dependencies:
npm install

Jalankan bot:
node index.js

Setelah bot berjalan, lakukan **pairing code** untuk menghubungkan bot dengan WhatsApp.

## 📦 Database
Database menggunakan file **JSON** yang berada di folder `/database`.

File yang digunakan:
- `grupTarget.json` → menyimpan daftar grup target
- `grupUrl.json` → menyimpan data URL grup

## ⚠️ Catatan
Gunakan bot ini dengan bijak dan jangan digunakan untuk spam atau aktivitas yang melanggar kebijakan WhatsApp.

## 👨‍💻 Credit
@dpwoffc  
Dwi Putra Wibowo
