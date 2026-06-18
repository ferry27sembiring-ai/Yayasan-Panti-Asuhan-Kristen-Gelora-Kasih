/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { DatabaseState, AdminUser, Kegiatan, Pengurus, RekeningDonasi, ProfilYayasan } from "./src/types";

const app = express();
const PORT = 3000;

// Set request limit to 10MB to support large Base64 photo uploads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Path to persistent data
const DB_PATH = path.join(process.cwd(), "database.json");

// Default initial data for the Orphanage
const defaultData: DatabaseState = {
  kegiatan: [
    {
      id: "activity-1",
      judul: "Ibadah Syukur Awal Tahun & Pembagian Perlengkapan Sekolah Baru",
      tanggal: "2026-01-05",
      foto: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60",
      deskripsi: "Panti Asuhan Gelora Kasih mengadakan ibadah syukur menyambut tahun ajaran baru. Pada kesempatan ini, donatur tetap kami membagikan seragam, tas, buku tulis, dan perlengkapan sekolah lengkap kepada seluruh anak asuh. Acara ditutup dengan makan bersama dan doa berkat untuk kelancaran masa depan anak-anak."
    },
    {
      id: "activity-2",
      judul: "Kunjungan Kasih Komunitas Pemuda Kristen & Pelatihan Keterampilan Komputer",
      tanggal: "2026-03-22",
      foto: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&auto=format&fit=crop&q=60",
      deskripsi: "Rekan-rekan dari Komunitas Pemuda GBI berkunjung untuk memberikan kelas kilat pengenalan komputer dan pemrograman dasar kepada anak-anak SMP dan SMA. Pelatihan digital ini bertujuan membekali anak-anak dengan keterampilan praktis teknologi agar siap bersaing di era digital."
    },
    {
      id: "activity-3",
      judul: "Pesta Sederhana Ulang Tahun Bersama Anak-Anak Panti",
      tanggal: "2026-05-18",
      foto: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=60",
      deskripsi: "Kehangatan dan tawa menyelimuti aula panti saat salah satu keluarga donatur datang untuk merayakan ulang tahun putra mereka bersama seluruh anak asuh. Acara diisi dengan bernyanyi lagu pujian bersama, kuis interaktif berhadiah, potong tumpeng, serta pembagian bingkisan kasih."
    }
  ],
  statistikAnak: {
    total: 35,
    lakiLaki: 16,
    perempuan: 19,
    belumSekolah: 0,
    sd: 12,
    smp: 11,
    sma: 9,
    kuliah: 3
  },
  pengurus: [
    {
      id: "pengurus-1",
      nama: "Pdt. John Sembiring, S.Th.",
      jabatan: "Ketua Yayasan & Pembina Rohani",
      foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "pengurus-2",
      nama: "Grace Sembiring, S.Pd.",
      jabatan: "Sekretaris & Kepala Asrama",
      foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60"
    },
    {
      id: "pengurus-3",
      nama: "Yohanes Ginting, S.E.",
      jabatan: "Bendahara & Kepala Operasional",
      foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60"
    }
  ],
  rekeningDonasi: [
    {
      id: "rec-1",
      bankName: "BANK BCA",
      accountName: "Yayasan Panti Asuhan Kristen Gelora Kasih",
      accountNumber: "829-1092-341"
    },
    {
      id: "rec-2",
      bankName: "BANK MANDIRI",
      accountName: "Yayasan Panti Asuhan Kristen Gelora Kasih",
      accountNumber: "116-000-982134-2"
    }
  ],
  profilYayasan: {
    sejarah: "Yayasan Panti Asuhan Kristen Gelora Kasih didirikan pada tahun 2012 atas panggilan hati kudus pelayanan untuk menampung, menyayangi, dan mendidik anak-anak yatim piatu, terlantar, dan kurang mampu. Berawal dari menyewa rumah kecil keluarga sederhana, yayasan ini terus mengalami kemurahan Tuhan melalui uluran tangan para donatur, sehingga kini dapat mendirikan asrama tetap yang layak demi masa depan anak-anak harapan bangsa.",
    visi: "Menjadi wadah pembinaan anak-anak asuh yang penuh kasih karunia, berkarakter Kristiani yang unggul, mandiri, berpendidikan cerdas, serta berdaya guna bagi gereja, masyarakat, dan bangsa.",
    misi: [
      "Menyediakan asrama yang aman, sehat, dan kondusif untuk tumbuh kembang mental dan rohani anak.",
      "Mengupayakan jaminan pendidikan formal setinggi-tingginya dan pelatihan keterampilan vokasional mandiri.",
      "Membina kerohanian anak berasaskan kasih Kristus melalui ibadah, karakter kebersamaan, dan kepedulian sosial.",
      "Membangun manajemen yayasan yang transparan, profesional, kredibel, dan akuntabel kepada masyarakat luas."
    ],
    alamat: "Jl. Jamin Ginting KM. 45, Sibolangit, Deli Serdang, Sumatera Utara, Indonesia",
    telepon: "+62 821-6543-9876",
    email: "kontak@gelorakasih.or.id",
    mapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1986.6661!2d98.56847!3d3.2925567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30311f93f64c6799%3A0xe5a3c20ba52fb822!2sSibolangit%2C%20Deli%20Serdang%20Regency%2C%20North%20Sumatra!5e0!3m2!1sid!2sid!4v1718582040000!5m2!1sid!2sid",
    facebookUrl: "https://facebook.com/PantiAsuhanGeloraKasih",
    instagramUrl: "https://instagram.com/panti.gelorakasih",
    youtubeUrl: "https://youtube.com/c/PantiAsuhanGeloraKasih"
  },
  admins: {
    admin: {
      user: {
        id: "admin-root",
        username: "admin",
        name: "Pengurus Inti Gelora Kasih",
        role: "Super Admin"
      },
      passwordHash: "kasihgelora" // Simple direct check logic, password matches "kasihgelora"
    }
  },
  history: [
    {
      id: "hist-1",
      timestamp: "2026-06-16T12:00:00Z",
      adminName: "Sistem",
      deskripsiAktivitas: "Sistem database diinisialisasi untuk Yayasan Panti Asuhan Kristen Gelora Kasih."
    }
  ],
  ulasan: [
    {
      id: "rev-1",
      authorName: "Budi Santoso",
      rating: 5,
      comment: "Sangat diberkati melihat pelayanan tulus pengurus di Gelora Kasih. Anak-anak asuh nampak ceria, mandiri, dan asrama terjaga sangat bersih.",
      createdAt: "2026-06-16T08:30:00.000Z"
    },
    {
      id: "rev-2",
      authorName: "Irene Sitorus",
      rating: 5,
      comment: "Kami berkunjung membawa sembako minggu lalu. Manajemen asrama sangat profesional dan terbuka dalam mengelola bantuan kasih.",
      createdAt: "2026-06-16T15:45:00.000Z"
    }
  ]
};

// Function to load the DB
function getDatabase(): DatabaseState {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), "utf-8");
      return defaultData;
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(data);
    // Ensure all structures are present
    return { ...defaultData, ...parsed };
  } catch (err) {
    console.error("Error reading database file, using fallback:", err);
    return defaultData;
  }
}

// Function to save the DB
function saveDatabase(db: DatabaseState) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database file:", err);
  }
}

// Secure Stable Key for stateless session verify
const SESSION_SECRET = process.env.SESSION_SECRET || "gelorakasih-super-secret-key-1963-sibolangit";

function createToken(username: string, role: string): string {
  const payload = {
    username: username.toLowerCase(),
    role,
    expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000 // 365 days expiration
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadStr)
    .digest("base64url");
  return `${payloadStr}.${signature}`;
}

function verifyToken(token: string): { username: string; role: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadStr, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payloadStr)
      .digest("base64url");
    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString("utf-8"));
    if (Date.now() > payload.expiresAt) {
      return null; // Expired
    }
    return { username: payload.username, role: payload.role };
  } catch (err) {
    return null;
  }
}

// API - Public Data fetch (All public data loaded at once)
app.get("/api/public-data", (req, res) => {
  const db = getDatabase();
  res.json({
    kegiatan: db.kegiatan,
    statistikAnak: db.statistikAnak,
    pengurus: db.pengurus,
    rekeningDonasi: db.rekeningDonasi,
    profilYayasan: db.profilYayasan,
    ulasan: db.ulasan || []
  });
});

// API - Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username dan Password wajib diisi." });
    return;
  }

  const db = getDatabase();
  const account = db.admins[username.toLowerCase()];
  if (account && account.passwordHash === password) {
    const token = createToken(username, account.user.role);
    res.json({
      token,
      user: account.user
    });
  } else {
    res.status(401).json({ error: "Username atau Password salah." });
  }
});

// API - Request PIN via Email
app.post("/api/request-pin", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    res.status(400).json({ error: "Format email tidak valid." });
    return;
  }

  // Record the request in system log history
  const db = getDatabase();
  const log = {
    id: `log-${Math.random().toString(36).substr(2)}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    adminName: "Keamanan Sistem",
    deskripsiAktivitas: `Permintaan PIN Akses sistem dikirimkan ke email: ${email.trim()}`
  };
  db.history.unshift(log);
  if (db.history.length > 100) {
    db.history = db.history.slice(0, 100);
  }
  saveDatabase(db);

  res.json({
    success: true,
    email: email.trim(),
    message: `PIN Keamanan Sistem (8899) berhasil diproses untuk dikirim ke email ${email.trim()}.`
  });
});

// Authentication middleware
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Akses ditolak. Token tidak ditemukan." });
    return;
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: "Sesi kedaluwarsa atau tidak valid. Silakan login kembali." });
    return;
  }
  // Attach admin details to request
  const db = getDatabase();
  const account = db.admins[decoded.username];
  if (!account) {
    res.status(401).json({ error: "Sesi tidak valid. Pengguna tidak terdaftar." });
    return;
  }
  (req as any).adminUser = account.user;
  next();
};

// API - Verify Auth
app.post("/api/admin/verify", authMiddleware, (req, res) => {
  res.json({ user: (req as any).adminUser });
});

// API - Log helper
function addLog(adminName: string, desc: string) {
  const db = getDatabase();
  const log = {
    id: `log-${Math.random().toString(36).substr(2)}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    adminName,
    deskripsiAktivitas: desc
  };
  db.history.unshift(log);
  // Keep last 100 history elements only
  if (db.history.length > 100) {
    db.history = db.history.slice(0, 100);
  }
  saveDatabase(db);
}

// API - Get Admin Logs/Activity
app.get("/api/admin/history", authMiddleware, (req, res) => {
  const db = getDatabase();
  res.json({ history: db.history });
});

// API - Get Admins List
app.get("/api/admin/admins", authMiddleware, (req, res) => {
  const db = getDatabase();
  const adminList = Object.values(db.admins).map(acc => acc.user);
  res.json({ admins: adminList });
});

// API - Create Admin
app.post("/api/admin/create-admin", authMiddleware, (req, res) => {
  const { username, password, name, role } = req.body;
  if (!username || !password || !name) {
    res.status(400).json({ error: "Data admin tidak lengkap. Isilah semua kolom wajib." });
    return;
  }

  const db = getDatabase();
  const cleanUsername = username.trim().toLowerCase();
  if (db.admins[cleanUsername]) {
    res.status(400).json({ error: "Username sudah terdaftar." });
    return;
  }

  const newUser: AdminUser = {
    id: `admin-${Math.random().toString(36).substr(2)}`,
    username: cleanUsername,
    name: name.trim(),
    role: role || "Admin"
  };

  db.admins[cleanUsername] = {
    user: newUser,
    passwordHash: password
  };

  saveDatabase(db);
  const operatorName = (req as any).adminUser.name;
  addLog(operatorName, `Menambahkan administrator baru: ${newUser.name} (${newUser.username})`);
  res.json({ user: newUser });
});

// API - Delete Admin
app.post("/api/admin/delete-admin", authMiddleware, (req, res) => {
  const { username } = req.body;
  const currentAdmin = (req as any).adminUser;

  if (username.toLowerCase() === "admin") {
    res.status(400).json({ error: "Super Admin utama tidak dapat dihapus." });
    return;
  }

  if (username.toLowerCase() === currentAdmin.username.toLowerCase()) {
    res.status(400).json({ error: "Anda tidak dapat menghapus akun Anda sendiri saat sedang masuk." });
    return;
  }

  const db = getDatabase();
  const cleanUsername = username.toLowerCase();
  const deletedUser = db.admins[cleanUsername];
  if (!deletedUser) {
    res.status(404).json({ error: "Admin tidak ditemukan." });
    return;
  }

  delete db.admins[cleanUsername];
  saveDatabase(db);
  addLog(currentAdmin.name, `Menghapus administrator: ${deletedUser.user.name}`);
  res.json({ success: true });
});

// CRUD - Kegiatan (Blog/Galeri)
app.post("/api/admin/kegiatan", authMiddleware, (req, res) => {
  const { judul, tanggal, foto, deskripsi } = req.body;
  if (!judul || !tanggal || !deskripsi) {
    res.status(400).json({ error: "Kolom Judul, Tanggal, dan Deskripsi wajib diisi." });
    return;
  }

  const db = getDatabase();
  const item: Kegiatan = {
    id: `kegiatan-${Math.random().toString(36).substr(2)}-${Date.now()}`,
    judul: judul.trim(),
    tanggal,
    foto: foto || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60", // dynamic default if empty
    deskripsi: deskripsi.trim()
  };

  db.kegiatan.unshift(item);
  saveDatabase(db);
  addLog((req as any).adminUser.name, `Menambah artikel kegiatan baru: "${item.judul}"`);
  res.json(item);
});

app.put("/api/admin/kegiatan/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { judul, tanggal, foto, deskripsi } = req.body;

  const db = getDatabase();
  const index = db.kegiatan.findIndex(k => k.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Kegiatan tidak ditemukan." });
    return;
  }

  const previousTitle = db.kegiatan[index].judul;
  db.kegiatan[index] = {
    id,
    judul: judul ? judul.trim() : db.kegiatan[index].judul,
    tanggal: tanggal || db.kegiatan[index].tanggal,
    foto: foto || db.kegiatan[index].foto,
    deskripsi: deskripsi ? deskripsi.trim() : db.kegiatan[index].deskripsi
  };

  saveDatabase(db);
  addLog((req as any).adminUser.name, `Mengedit kegiatan: Dari "${previousTitle}" menjadi "${db.kegiatan[index].judul}"`);
  res.json(db.kegiatan[index]);
});

app.delete("/api/admin/kegiatan/:id", authMiddleware, (req, res) => {
  const { id } = req.params;

  const db = getDatabase();
  const index = db.kegiatan.findIndex(k => k.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Kegiatan tidak ditemukan." });
    return;
  }

  const deletedTitle = db.kegiatan[index].judul;
  db.kegiatan.splice(index, 1);
  saveDatabase(db);
  addLog((req as any).adminUser.name, `Menghapus artikel kegiatan: "${deletedTitle}"`);
  res.json({ success: true });
});

// UPDATE - Statistik Anak
app.put("/api/admin/statistik-anak", authMiddleware, (req, res) => {
  const { total, lakiLaki, perempuan } = req.body;

  const db = getDatabase();
  
  // Create an object with the standard core properties
  const updatedStats: any = {
    total: Number(total) || 0,
    lakiLaki: Number(lakiLaki) || 0,
    perempuan: Number(perempuan) || 0,
  };

  // Dynamically attach all other educational stage keys sent by the client
  const standardKeys = ["total", "lakiLaki", "perempuan"];
  for (const key of Object.keys(req.body)) {
    if (!standardKeys.includes(key)) {
      updatedStats[key] = Number(req.body[key]) || 0;
    }
  }

  // Ensure default stages are represented if they are missing
  const defaultStages = ["belumSekolah", "sd", "smp", "sma", "kuliah"];
  for (const stage of defaultStages) {
    if (updatedStats[stage] === undefined) {
      updatedStats[stage] = 0;
    }
  }

  db.statistikAnak = updatedStats;

  saveDatabase(db);
  addLog((req as any).adminUser.name, `Memperbarui statistik anak asuh: Total ${db.statistikAnak.total} anak`);
  res.json(db.statistikAnak);
});

// CRUD - Pengurus
app.post("/api/admin/pengurus", authMiddleware, (req, res) => {
  const { nama, jabatan, foto, caption } = req.body;
  if (!nama || !jabatan) {
    res.status(400).json({ error: "Nama dan Jabatan pengurus wajib diisi." });
    return;
  }

  const db = getDatabase();
  const item: Pengurus = {
    id: `pengurus-${Math.random().toString(36).substr(2)}-${Date.now()}`,
    nama: nama.trim(),
    jabatan: jabatan.trim(),
    foto: foto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60", // Default profile photo placeholder
    caption: caption ? caption.trim() : ""
  };

  db.pengurus.push(item);
  saveDatabase(db);
  addLog((req as any).adminUser.name, `Menambah pengurus baru: "${item.nama}" sebagai "${item.jabatan}"`);
  res.json(item);
});

app.put("/api/admin/pengurus/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { nama, jabatan, foto, caption } = req.body;

  const db = getDatabase();
  const index = db.pengurus.findIndex(p => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Pengurus tidak ditemukan." });
    return;
  }

  const previousName = db.pengurus[index].nama;
  db.pengurus[index] = {
    id,
    nama: nama ? nama.trim() : db.pengurus[index].nama,
    jabatan: jabatan ? jabatan.trim() : db.pengurus[index].jabatan,
    foto: foto || db.pengurus[index].foto,
    caption: typeof caption === "string" ? caption.trim() : db.pengurus[index].caption
  };

  saveDatabase(db);
  addLog((req as any).adminUser.name, `Mengubah profil pengurus: "${previousName}" menjadi "${db.pengurus[index].nama}"`);
  res.json(db.pengurus[index]);
});

app.delete("/api/admin/pengurus/:id", authMiddleware, (req, res) => {
  const { id } = req.params;

  const db = getDatabase();
  const index = db.pengurus.findIndex(p => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Pengurus tidak ditemukan." });
    return;
  }

  const deletedName = db.pengurus[index].nama;
  db.pengurus.splice(index, 1);
  saveDatabase(db);
  addLog((req as any).adminUser.name, `Menghapus pengurus: "${deletedName}"`);
  res.json({ success: true });
});

// UPDATE - Profil Yayasan (Sejarah, Visi, Misi, Kontak, Maps)
app.put("/api/admin/profil-yayasan", authMiddleware, (req, res) => {
  const { sejarah, visi, misi, alamat, telepon, email, mapsIframe, facebookUrl, instagramUrl, youtubeUrl, logoUrl, heroBadge, heroTitle, heroDescription, heroBgUrl, donasiLogistikTitle, donasiLogistikSubtitle, donasiLogistikItems, donasiLogistikShipping } = req.body;

  const db = getDatabase();
  db.profilYayasan = {
    sejarah: sejarah ? sejarah.trim() : db.profilYayasan.sejarah,
    visi: visi ? visi.trim() : db.profilYayasan.visi,
    misi: Array.isArray(misi) ? misi : db.profilYayasan.misi,
    alamat: alamat ? alamat.trim() : db.profilYayasan.alamat,
    telepon: telepon ? telepon.trim() : db.profilYayasan.telepon,
    email: email ? email.trim() : db.profilYayasan.email,
    mapsIframe: mapsIframe ? mapsIframe.trim() : db.profilYayasan.mapsIframe,
    facebookUrl: facebookUrl !== undefined ? facebookUrl.trim() : db.profilYayasan.facebookUrl,
    instagramUrl: instagramUrl !== undefined ? instagramUrl.trim() : db.profilYayasan.instagramUrl,
    youtubeUrl: youtubeUrl !== undefined ? youtubeUrl.trim() : db.profilYayasan.youtubeUrl,
    logoUrl: logoUrl !== undefined ? logoUrl.trim() : db.profilYayasan.logoUrl,
    heroBadge: heroBadge !== undefined ? heroBadge.trim() : db.profilYayasan.heroBadge,
    heroTitle: heroTitle !== undefined ? heroTitle.trim() : db.profilYayasan.heroTitle,
    heroDescription: heroDescription !== undefined ? heroDescription.trim() : db.profilYayasan.heroDescription,
    heroBgUrl: heroBgUrl !== undefined ? heroBgUrl.trim() : db.profilYayasan.heroBgUrl,
    donasiLogistikTitle: donasiLogistikTitle !== undefined ? donasiLogistikTitle.trim() : db.profilYayasan.donasiLogistikTitle,
    donasiLogistikSubtitle: donasiLogistikSubtitle !== undefined ? donasiLogistikSubtitle.trim() : db.profilYayasan.donasiLogistikSubtitle,
    donasiLogistikItems: Array.isArray(donasiLogistikItems) ? donasiLogistikItems : db.profilYayasan.donasiLogistikItems,
    donasiLogistikShipping: donasiLogistikShipping !== undefined ? donasiLogistikShipping.trim() : db.profilYayasan.donasiLogistikShipping
  };

  saveDatabase(db);
  addLog((req as any).adminUser.name, "Menyunting dan memperbarui detail Profil & Kontak Yayasan.");
  res.json(db.profilYayasan);
});

// CRUD - Rekening Donasi
app.post("/api/admin/rekening-donasi", authMiddleware, (req, res) => {
  const { bankName, accountName, accountNumber } = req.body;
  if (!bankName || !accountName || !accountNumber) {
    res.status(400).json({ error: "Nama Bank, Nama Pemilik Rekening, dan Nomor Rekening wajib diisi." });
    return;
  }

  const db = getDatabase();
  const rec: RekeningDonasi = {
    id: `rec-${Math.random().toString(36).substr(2)}-${Date.now()}`,
    bankName: bankName.trim(),
    accountName: accountName.trim(),
    accountNumber: accountNumber.trim()
  };

  db.rekeningDonasi.push(rec);
  saveDatabase(db);
  addLog((req as any).adminUser.name, `Menambahkan rekening donasi baru: ${rec.bankName} - No ${rec.accountNumber}`);
  res.json(rec);
});

app.put("/api/admin/rekening-donasi/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { bankName, accountName, accountNumber } = req.body;

  const db = getDatabase();
  const index = db.rekeningDonasi.findIndex(r => r.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Rekening donasi tidak ditemukan." });
    return;
  }

  db.rekeningDonasi[index] = {
    id,
    bankName: bankName ? bankName.trim() : db.rekeningDonasi[index].bankName,
    accountName: accountName ? accountName.trim() : db.rekeningDonasi[index].accountName,
    accountNumber: accountNumber ? accountNumber.trim() : db.rekeningDonasi[index].accountNumber
  };

  saveDatabase(db);
  addLog((req as any).adminUser.name, `Memperbarui rekening donasi: ${db.rekeningDonasi[index].bankName}`);
  res.json(db.rekeningDonasi[index]);
});

app.delete("/api/admin/rekening-donasi/:id", authMiddleware, (req, res) => {
  const { id } = req.params;

  const db = getDatabase();
  const index = db.rekeningDonasi.findIndex(r => r.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Rekening donasi tidak ditemukan." });
    return;
  }

  const deletedBank = db.rekeningDonasi[index].bankName;
  db.rekeningDonasi.splice(index, 1);
  saveDatabase(db);
  addLog((req as any).adminUser.name, `Menghapus rekening donasi: bank "${deletedBank}"`);
  res.json({ success: true });
});

// CREATE - Ulasan Baru (Public)
app.post("/api/reviews", (req, res) => {
  const { authorName, rating, comment } = req.body;
  if (!authorName || !rating || !comment) {
    res.status(400).json({ error: "Nama pengulas, nilai bintang, dan ulasan wajib diisi." });
    return;
  }
  const db = getDatabase();
  const newRev = {
    id: `rev-${Math.random().toString(36).substr(2)}-${Date.now()}`,
    authorName: authorName.trim(),
    rating: parseInt(rating) || 5,
    comment: comment.trim(),
    createdAt: new Date().toISOString()
  };
  if (!db.ulasan) db.ulasan = [];
  db.ulasan.unshift(newRev);
  saveDatabase(db);
  res.json(newRev);
});

// DELETE - Ulasan (Admin only)
app.delete("/api/admin/reviews/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  if (!db.ulasan) db.ulasan = [];
  const index = db.ulasan.findIndex(r => r.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Ulasan tidak ditemukan atau sudah dihapus." });
    return;
  }
  const deletedAuthor = db.ulasan[index].authorName;
  db.ulasan.splice(index, 1);
  saveDatabase(db);
  addLog((req as any).adminUser.name, `Menghapus ulasan kegiatan dari pengulas: "${deletedAuthor}"`);
  res.json({ success: true });
});


// Start custom server integration
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
