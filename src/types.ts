/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Kegiatan {
  id: string;
  judul: string;
  tanggal: string;
  foto: string;
  deskripsi: string;
}

export interface StatistikAnak {
  total: number;
  lakiLaki: number;
  perempuan: number;
  belumSekolah: number;
  sd: number;
  smp: number;
  sma: number;
  kuliah: number;
  [customStage: string]: number;
}

export interface Pengurus {
  id: string;
  nama: string;
  jabatan: string;
  foto: string;
  caption?: string;
}

export interface RekeningDonasi {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface ProfilYayasan {
  sejarah: string;
  visi: string;
  misi: string[];
  alamat: string;
  telepon: string;
  email: string;
  mapsIframe: string; // Embed iframe src or full URL
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  logoUrl?: string;
  heroBadge?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroBgUrl?: string;
  donasiLogistikTitle?: string;
  donasiLogistikSubtitle?: string;
  donasiLogistikItems?: string[];
  donasiLogistikShipping?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

export interface HistoryAktivitas {
  id: string;
  timestamp: string;
  adminName: string;
  deskripsiAktivitas: string;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DatabaseState {
  kegiatan: Kegiatan[];
  statistikAnak: StatistikAnak;
  pengurus: Pengurus[];
  rekeningDonasi: RekeningDonasi[];
  profilYayasan: ProfilYayasan;
  admins: { [username: string]: { user: AdminUser; passwordHash: string } };
  history: HistoryAktivitas[];
  ulasan?: Review[];
}

export function getWhatsAppUrl(phoneStr: string, message?: string): string {
  // Hapus semua karakter yang bukan angka untuk membersihkan nomor telepon
  let cleaned = phoneStr.replace(/[^0-9]/g, '');
  
  // Jika nomornya berawalan '0', ganti menjadi kode negara '62' (Indonesia)
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (cleaned.startsWith('8')) {
    // Jika langsung angka 8, biasanya nomor hp lokal Indonesia tanpa angka 0 di depan
    cleaned = '62' + cleaned;
  }
  
  const textParam = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${cleaned}${textParam}`;
}

