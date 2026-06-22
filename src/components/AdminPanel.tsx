/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Lock, LogIn, LayoutDashboard, Calendar, Users, Settings, UserPlus, 
  Plus, Edit2, Trash2, Save, LogOut, CheckCircle2, AlertCircle, FileText,
  Upload, Landmark, RefreshCw, Eye, EyeOff, MessageSquare, Star, Mail, Send, ArrowLeft
} from "lucide-react";
import { AdminUser, Kegiatan, Pengurus, RekeningDonasi, ProfilYayasan, HistoryAktivitas, Review } from "../types";

interface AdminPanelProps {
  onDataRefresh: () => void;
  publicData: {
    kegiatan: Kegiatan[];
    statistikAnak: any;
    pengurus: Pengurus[];
    rekeningDonasi: RekeningDonasi[];
    profilYayasan: ProfilYayasan;
    ulasan?: Review[];
  };
  lang?: "id" | "en";
  isDark?: boolean;
}

export default function AdminPanel({ onDataRefresh, publicData, lang = "id", isDark = false }: AdminPanelProps) {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showDefaultInfo, setShowDefaultInfo] = useState(false);
  const [isVerifyingSecurity, setIsVerifyingSecurity] = useState(false);
  const [securityCodeInput, setSecurityCodeInput] = useState("");
  const [securityError, setSecurityError] = useState("");

  // Request PIN states
  const [isRequestingByEmail, setIsRequestingByEmail] = useState(false);
  const [pinEmailInput, setPinEmailInput] = useState("");
  const [pinEmailLoading, setPinEmailLoading] = useState(false);
  const [pinEmailSuccess, setPinEmailSuccess] = useState(false);
  const [pinEmailError, setPinEmailError] = useState("");

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "kegiatan" | "statistik" | "pengurus" | "profil" | "admins">("dashboard");

  // Admin Logs/Logs History list
  const [logs, setLogs] = useState<HistoryAktivitas[]>([]);
  const [adminsList, setAdminsList] = useState<AdminUser[]>([]);

  // Response Status notices
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // --- CRUD States ---
  
  // 1. Kegiatan / Postings States
  const [editingKegiatanId, setEditingKegiatanId] = useState<string | null>(null);
  const [formKegiatan, setFormKegiatan] = useState({
    judul: "",
    tanggal: new Date().toISOString().split("T")[0],
    foto: "",
    deskripsi: ""
  });

  // 2. Statistik Anak States
  const [formStats, setFormStats] = useState<Record<string, number>>({
    total: 0,
    lakiLaki: 0,
    perempuan: 0,
    belumSekolah: 0,
    sd: 0,
    smp: 0,
    sma: 0,
    kuliah: 0
  });

  const [newStageName, setNewStageName] = useState("");
  const [showAddStage, setShowAddStage] = useState(false);

  // 3. Pengurus States
  const [editingPengurusId, setEditingPengurusId] = useState<string | null>(null);
  const [formPengurus, setFormPengurus] = useState({
    nama: "",
    jabatan: "",
    foto: "",
    caption: ""
  });

  // 4. Profil States
  const [formProfil, setFormProfil] = useState({
    sejarah: "",
    visi: "",
    misiString: "", // Textarea newline separated
    alamat: "",
    telepon: "",
    email: "",
    mapsIframe: "",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    logoUrl: "",
    heroBadge: "",
    heroTitle: "",
    heroDescription: "",
    heroBgUrl: "",
    donasiLogistikTitle: "",
    donasiLogistikSubtitle: "",
    donasiLogistikItemsString: "",
    donasiLogistikShipping: ""
  });

  // 5. Rekening Donasi States (Sub-CRUD in settings)
  const [editingRekeningId, setEditingRekeningId] = useState<string | null>(null);
  const [formRekening, setFormRekening] = useState({
    bankName: "",
    accountName: "",
    accountNumber: ""
  });

  // 6. Register Admin States
  const [formNewAdmin, setFormNewAdmin] = useState({
    username: "",
    password: "",
    name: "",
    role: "Admin"
  });

  // Check existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("gelorakasih_admin_token");
    const savedUser = localStorage.getItem("gelorakasih_admin_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch admin logs & full admin lists upon login or tab change
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchAdminLogs();
      fetchAdminsList();
    }
  }, [isLoggedIn, token, activeTab]);

  // Load public data into CRUD forms when data is received
  useEffect(() => {
    if (publicData) {
      // Load stats
      if (publicData.statistikAnak) {
        setFormStats({
          total: 0,
          lakiLaki: 0,
          perempuan: 0,
          belumSekolah: 0,
          sd: 0,
          smp: 0,
          sma: 0,
          kuliah: 0,
          ...publicData.statistikAnak
        });
      }
      // Load Profil
      if (publicData.profilYayasan) {
        setFormProfil({
          sejarah: publicData.profilYayasan.sejarah || "",
          visi: publicData.profilYayasan.visi || "",
          misiString: publicData.profilYayasan.misi ? publicData.profilYayasan.misi.join("\n") : "",
          alamat: publicData.profilYayasan.alamat || "",
          telepon: publicData.profilYayasan.telepon || "",
          email: publicData.profilYayasan.email || "",
          mapsIframe: publicData.profilYayasan.mapsIframe || "",
          facebookUrl: publicData.profilYayasan.facebookUrl || "",
          instagramUrl: publicData.profilYayasan.instagramUrl || "",
          youtubeUrl: publicData.profilYayasan.youtubeUrl || "",
          logoUrl: publicData.profilYayasan.logoUrl || "",
          heroBadge: publicData.profilYayasan.heroBadge || "",
          heroTitle: publicData.profilYayasan.heroTitle || "",
          heroDescription: publicData.profilYayasan.heroDescription || "",
          heroBgUrl: publicData.profilYayasan.heroBgUrl || "",
          donasiLogistikTitle: publicData.profilYayasan.donasiLogistikTitle || "",
          donasiLogistikSubtitle: publicData.profilYayasan.donasiLogistikSubtitle || "",
          donasiLogistikItemsString: publicData.profilYayasan.donasiLogistikItems ? publicData.profilYayasan.donasiLogistikItems.join("\n") : "",
          donasiLogistikShipping: publicData.profilYayasan.donasiLogistikShipping || ""
        });
      }
    }
  }, [publicData]);

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login Gagal. Silakan cek kredensial Anda.");
      }

      localStorage.setItem("gelorakasih_admin_token", data.token);
      localStorage.setItem("gelorakasih_admin_user", JSON.stringify(data.user));
      setToken(data.token);
      setCurrentUser(data.user);
      setIsLoggedIn(true);
      // Clear forms
      setUsername("");
      setPassword("");
    } catch (err: any) {
      setLoginError(err.message || "Kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  // Log out Admin
  const handleLogout = () => {
    localStorage.removeItem("gelorakasih_admin_token");
    localStorage.removeItem("gelorakasih_admin_user");
    setToken(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  // Call Admin Logs API
  const fetchAdminLogs = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/admin/history", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.history || []);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  // Call Admins List API
  const fetchAdminsList = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/admin/admins", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminsList(data.admins || []);
      }
    } catch (err) {
      console.error("Error fetching admins list:", err);
    }
  };

  // Display Notice
  const showNotice = (type: "success" | "error", msg: string) => {
    if (type === "success") {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(""), 4000);
    } else {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  // Convert uploaded image file to Base64 String Helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotice("error", "Ukuran berkas berkas terlalu besar. Batas maksimal adalah 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === "string") {
        callback(reader.result);
        showNotice("success", "Foto berhasil dimuat dari komputer.");
      }
    };
    reader.readAsDataURL(file);
  };

  // --- CRUD Handlers ---

  // 1. KELOLA KEGIATAN (CRUD)
  const handleKegiatanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKegiatan.judul || !formKegiatan.tanggal || !formKegiatan.deskripsi) {
      showNotice("error", "Harap isi semua kolom wajib.");
      return;
    }

    try {
      const method = editingKegiatanId ? "PUT" : "POST";
      const url = editingKegiatanId ? `/api/admin/kegiatan/${editingKegiatanId}` : "/api/admin/kegiatan";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formKegiatan)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal menyimpan kegiatan.");
      }

      showNotice("success", editingKegiatanId ? "Artikel kegiatan berhasil disunting!" : "Berita kegiatan baru berhasil dipublikasikan!");
      onDataRefresh();
      setEditingKegiatanId(null);
      setFormKegiatan({
        judul: "",
        tanggal: new Date().toISOString().split("T")[0],
        foto: "",
        deskripsi: ""
      });
    } catch (err: any) {
      showNotice("error", err.message);
    }
  };

  const startEditKegiatan = (act: Kegiatan) => {
    setEditingKegiatanId(act.id);
    setFormKegiatan({
      judul: act.judul,
      tanggal: act.tanggal,
      foto: act.foto,
      deskripsi: act.deskripsi
    });
  };

  const cancelEditKegiatan = () => {
    setEditingKegiatanId(null);
    setFormKegiatan({
      judul: "",
      tanggal: new Date().toISOString().split("T")[0],
      foto: "",
      deskripsi: ""
    });
  };

  const deleteKegiatan = async (id: string, judul: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus artikel kegiatan: "${judul}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/kegiatan/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menghapus.");
      }
      showNotice("success", "Artikel kegiatan telah dihapus.");
      onDataRefresh();
    } catch (err: any) {
      showNotice("error", err.message);
    }
  };

  // 2. KELOLA STATISTIK ANAK (Update)
  const handleAddStage = () => {
    const trimmed = newStageName.trim();
    if (!trimmed) return;

    const reserved = ["total", "lakilaki", "lakiLaki", "perempuan", "belumsekolah", "belumSekolah", "sd", "smp", "sma", "kuliah"];
    if (reserved.includes(trimmed.toLowerCase()) || formStats[trimmed] !== undefined) {
      showNotice("error", `Jenjang "${trimmed}" sudah ada atau tidak bisa digunakan.`);
      return;
    }

    setFormStats(prev => ({
      ...prev,
      [trimmed]: 0
    }));
    setNewStageName("");
    setShowAddStage(false);
    showNotice("success", `Jenjang "${trimmed}" ditambahkan. Silakan isi jumlah anak asuh lalu klik Simpan.`);
  };

  const handleRemoveStage = (key: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus jenjang sekolah "${key}"?`)) {
      setFormStats(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
      showNotice("success", `Jenjang "${key}" dihapus sementara. Silakan klik Simpan untuk memperbarui database.`);
    }
  };

  const handleStatsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto sync sum fields to verify
    let finalStats = { ...formStats };
    const totalGender = Number(formStats.lakiLaki) + Number(formStats.perempuan);
    if (Number(formStats.total) !== totalGender) {
      if (window.confirm(`Jumlah Laki-laki (${formStats.lakiLaki}) + Perempuan (${formStats.perempuan}) = ${totalGender}, sedangkan Total Anak diisi: ${formStats.total}. Apakah Anda ingin menyamakan angka Total Anak asuh menjadi ${totalGender}?`)) {
        finalStats.total = totalGender;
        setFormStats(prev => ({ ...prev, total: totalGender }));
      }
    }

    try {
      const res = await fetch("/api/admin/statistik-anak", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(finalStats)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal mengupdate statistik.");
      }
      showNotice("success", "Statistik anak asuh berhasil diperbarui secara real-time!");
      onDataRefresh();
    } catch (err: any) {
      showNotice("error", err.message);
    }
  };

  // 3. KELOLA PENGURUS (CRUD)
  const handlePengurusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPengurus.nama || !formPengurus.jabatan) {
      showNotice("error", "Harap isi nama dan jabatan pengurus.");
      return;
    }

    try {
      const method = editingPengurusId ? "PUT" : "POST";
      const url = editingPengurusId ? `/api/admin/pengurus/${editingPengurusId}` : "/api/admin/pengurus";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formPengurus)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menyimpan profil pengurus.");
      }
      showNotice("success", editingPengurusId ? "Profil pengurus berhasil disunting!" : "Pengurus baru sukses ditambahkan!");
      onDataRefresh();
      setEditingPengurusId(null);
      setFormPengurus({ nama: "", jabatan: "", foto: "", caption: "" });
    } catch (err: any) {
      showNotice("error", err.message);
    }
  };

  const startEditPengurus = (p: Pengurus) => {
    setEditingPengurusId(p.id);
    setFormPengurus({
      nama: p.nama,
      jabatan: p.jabatan,
      foto: p.foto,
      caption: p.caption || ""
    });
  };

  const cancelEditPengurus = () => {
    setEditingPengurusId(null);
    setFormPengurus({ nama: "", jabatan: "", foto: "", caption: "" });
  };

  const deletePengurus = async (id: string, nama: string) => {
    if (!window.confirm(`Apakah Anda yakin memecat/menghapus ${nama} dari daftar kepengurusan?`)) return;

    try {
      const res = await fetch(`/api/admin/pengurus/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menghapus pengurus.");
      }
      showNotice("success", `Profil pengurus "${nama}" berhasil dihapus.`);
      onDataRefresh();
    } catch (err: any) {
      showNotice("error", err.message);
    }
  };

  // 4. PENGATURAN PROFIL & SOSIAL MEDIA & MAPS
  const handleProfilSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Parse Misi newline string to array
    const misiArray = formProfil.misiString
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "");

    // Parse Logistics item list to array
    const logistikItemsArray = formProfil.donasiLogistikItemsString
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "");

    try {
      const res = await fetch("/api/admin/profil-yayasan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formProfil,
          misi: misiArray,
          donasiLogistikItems: logistikItemsArray
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal memperbarui profil website.");
      }
      showNotice("success", "Detail profil & kontak asrama berhasil diperbarui!");
      onDataRefresh();
    } catch (err: any) {
      showNotice("error", err.message);
    }
  };

  // 5. KELOLA REKENING DONASI (CRUD di Tab Profil)
  const handleRekeningSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRekening.bankName || !formRekening.accountName || !formRekening.accountNumber) {
      showNotice("error", "Harap isi semua kolom rekening.");
      return;
    }

    try {
      const method = editingRekeningId ? "PUT" : "POST";
      const url = editingRekeningId ? `/api/admin/rekening-donasi/${editingRekeningId}` : "/api/admin/rekening-donasi";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formRekening)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menyimpan rekening.");
      }
      showNotice("success", editingRekeningId ? "Rekening donasi diperbarui!" : "Rekening donasi baru ditambahkan!");
      onDataRefresh();
      setEditingRekeningId(null);
      setFormRekening({ bankName: "", accountName: "", accountNumber: "" });
    } catch (err: any) {
      showNotice("error", err.message);
    }
  };

  const startEditRekening = (rec: RekeningDonasi) => {
    setEditingRekeningId(rec.id);
    setFormRekening({
      bankName: rec.bankName,
      accountName: rec.accountName,
      accountNumber: rec.accountNumber
    });
  };

  const deleteRekening = async (id: string, bank: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus rekening ${bank}?`)) return;

    try {
      const res = await fetch(`/api/admin/rekening-donasi/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menghapus rekening donasi.");
      }
      showNotice("success", "Rekening donasi telah dihapus.");
      onDataRefresh();
    } catch (err: any) {
      showNotice("error", err.message);
    }
  };

  // 6. TAMBAH/KELOLA ADMINISTRATOR (CMS Access)
  const handleNewAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNewAdmin.username || !formNewAdmin.password || !formNewAdmin.name) {
      showNotice("error", "Username, Password, dan Nama Lengkap wajib diisi.");
      return;
    }

    try {
      const res = await fetch("/api/admin/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formNewAdmin)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mendaftarkan admin baru.");

      showNotice("success", `Administrator "${formNewAdmin.name}" sukses didaftarkan!`);
      setFormNewAdmin({ username: "", password: "", name: "", role: "Admin" });
      fetchAdminsList();
    } catch (err: any) {
      showNotice("error", err.message);
    }
  };

  const deleteAdminAccount = async (usernameToDelete: string, adName: string) => {
    if (!window.confirm(`Apakah Anda yakin memblokir & menghapus hak akses admin "${adName}" (${usernameToDelete})?`)) return;

    try {
      const res = await fetch("/api/admin/delete-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ username: usernameToDelete })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus admin.");

      showNotice("success", `Akses admin "${adName}" telah dicabut.`);
      fetchAdminsList();
    } catch (err: any) {
      showNotice("error", err.message);
    }
  };

  const handleDeleteReview = async (id: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus ulasan kegiatan dari pengulas "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus ulasan.");

      showNotice("success", `Ulasan kegiatan dari "${name}" berhasil dihapus.`);
      onDataRefresh();
    } catch (err: any) {
      showNotice("error", err.message);
    }
  };


  // --- RENDERING ACCORDING TO AUTHENTICATION ---

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div id="login-layout" className="min-h-[70vh] flex items-center justify-center py-10">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-blue-100 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={() => {
                setShowPortal(!showPortal);
                if (showPortal) {
                  setShowDefaultInfo(false);
                  setIsVerifyingSecurity(false);
                  setIsRequestingByEmail(false);
                }
              }}
              title={lang === "id" ? "Portal Keamanan" : "Security Portal"}
              className="w-12 h-12 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-full flex items-center justify-center mx-auto shadow-xs cursor-pointer select-none transition-all duration-300 active:scale-95 border-none outline-hidden"
            >
              <Lock className="w-5 h-5 animate-pulse" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight text-center uppercase md:text-2xl">
              {lang === "id" ? "Gelora Kasih System Admin" : "Gelora Kasih System Admin"}
            </h2>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              {lang === "id" 
                ? "Sistem Pengelolaan Konten Terpusat Yayasan Panti Asuhan Kristen Gelora Kasih" 
                : "Centralized Content Management Administration of Gelora Kasih Christian Orphanage"}
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 block">Username</label>
              <input
                id="input-username"
                type="text"
                placeholder="Masukkan username admin..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl focus:outline-hidden transition"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 block">Password</label>
              <div className="relative">
                <input
                  id="input-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl focus:outline-hidden transition pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer flex items-center justify-center p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              id="btn-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-blue-700/10"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Masuk ke Panel Admin
                </>
              )}
            </button>
          </form>

          {showPortal && (
            <div className="text-center text-[11px] text-gray-500 font-medium bg-gray-50 p-4 rounded-xl border border-gray-150 flex flex-col items-center justify-center gap-3 transition-all w-full max-w-sm mx-auto shadow-xs animate-fade-in">
            
            {/* Header Area */}
            <div className="flex items-center justify-between w-full text-xs text-gray-400 font-bold uppercase tracking-wider pb-1.5 border-b border-gray-200/50">
              <span className="flex items-center gap-1.5 text-gray-600 font-extrabold text-[11px]">
                🛡️ {lang === "id" ? "Portal Keamanan PIN" : "PIN Security Gateway"}
              </span>
              
              {/* Reset/Back Buttons depending on state */}
              {showDefaultInfo ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowDefaultInfo(false);
                    setIsVerifyingSecurity(false);
                    setIsRequestingByEmail(false);
                    setSecurityCodeInput("");
                    setSecurityError("");
                    setPinEmailSuccess(false);
                  }}
                  className="text-red-605 hover:text-red-800 transition cursor-pointer text-[10px] font-extrabold uppercase hover:underline"
                >
                  {lang === "id" ? "Kunci Kembali" : "Relock"}
                </button>
              ) : (isVerifyingSecurity || isRequestingByEmail) ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsVerifyingSecurity(false);
                    setIsRequestingByEmail(false);
                    setSecurityCodeInput("");
                    setSecurityError("");
                    setPinEmailSuccess(false);
                    setPinEmailError("");
                  }}
                  className="text-gray-500 hover:text-gray-700 transition cursor-pointer text-[10px] font-extrabold uppercase flex items-center gap-1 hover:underline"
                >
                  <ArrowLeft className="w-3 h-3" /> {lang === "id" ? "Batal" : "Cancel"}
                </button>
              ) : null}
            </div>

            {/* STATE 1: REVEALED credentials */}
            {showDefaultInfo && (
              <div className="w-full text-center space-y-2.5 transition-all animate-fade-in py-2">
                <div className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold uppercase inline-block border border-green-150 shadow-3xs">
                  🔓 {lang === "id" ? "Akses Terverifikasi" : "Access Verified"}
                </div>
                <div className="font-mono text-xs font-bold text-gray-800 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-2xs select-all">
                  admin / kasihgelora
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed max-w-xs mx-auto">
                  {lang === "id" 
                    ? "*Silakan gunakan kredensial di atas untuk masuk ke akun Super Admin Utama." 
                    : "*Please use the credentials above to log in to the Primary Super Admin account."}
                </p>
              </div>
            )}

            {/* STATE 2: VERIFICATION form (PIN validation) */}
            {!showDefaultInfo && isVerifyingSecurity && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = securityCodeInput.trim().toLowerCase();
                  if (val === "8899" || val === "kasihgelora" || val === "1969") {
                    setShowDefaultInfo(true);
                    setIsVerifyingSecurity(false);
                    setSecurityError("");
                  } else {
                    setSecurityError(lang === "id" ? "Kode PIN Keamanan salah!" : "Invalid PIN code!");
                  }
                }}
                className="w-full space-y-2.5 transition-all text-left py-1"
              >
                <div className="text-[10px] text-gray-400 leading-normal">
                  {lang === "id" 
                    ? "Sistem ini dilindungi gembok. Silakan masukkan PIN Keamanan Pengembang untuk melihat kredensial:" 
                    : "This system is locked. Enter the Developer security PIN to show credentials:"}
                </div>
                <div className="flex gap-2 w-full animate-fade-in">
                  <input
                    type="password"
                    placeholder="Masukkan PIN"
                    value={securityCodeInput}
                    onChange={(e) => setSecurityCodeInput(e.target.value)}
                    className="flex-1 font-mono text-xs text-center border bg-white border-gray-205 rounded-lg py-1.5 px-3 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-150"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1.5 px-4 rounded-lg transition shadow-3xs cursor-pointer flex items-center justify-center font-sans"
                  >
                    OK
                  </button>
                </div>
                {securityError && (
                  <p className="text-[10px] text-red-600 font-bold bg-red-50 py-1 rounded-md border border-red-150 text-center">
                    ❌ {securityError}
                  </p>
                )}
              </form>
            )}

            {/* STATE 3: REQUEST PIN BY EMAIL panel */}
            {!showDefaultInfo && isRequestingByEmail && (
              <div className="w-full space-y-2.5 transition-all text-left py-1 animate-fade-in">
                {pinEmailSuccess ? (
                  /* Request Success Display with Simulator */
                  <div className="space-y-3 animate-fade-in">
                    <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-3 text-center space-y-1.5">
                      <div className="flex justify-center text-emerald-500">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h5 className="font-bold text-emerald-800 text-[11px] uppercase tracking-wide">
                        {lang === "id" ? "Permintaan PIN Terkirim" : "PIN Email Dispatched"}
                      </h5>
                      <p className="text-[10px] text-emerald-700 leading-relaxed">
                        {lang === "id" 
                          ? `PIN Keamanan berhasil dikonfigurasi dan dikirim ke email: ${pinEmailInput}. Silakan cek kotak masuk.`
                          : `Security PIN successfully configured and dispatched to email: ${pinEmailInput}. Please check inbox.`}
                      </p>
                    </div>

                    {/* SMTP Simulator box */}
                    <div className="bg-slate-900 text-[10px] text-gray-300 font-mono rounded-xl p-3 border border-slate-800 shadow-lg space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-500 font-semibold text-[9px] uppercase tracking-wider">
                        <span>📬 Email Delivery Simulator</span>
                        <span className="text-emerald-500 flex items-center gap-1 font-bold">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                          Delivered
                        </span>
                      </div>
                      <div className="space-y-1 text-slate-400">
                        <div><span className="text-blue-400">From:</span> secure-gateway@panti-gelorakasih.or.id</div>
                        <div><span className="text-blue-400">To:</span> {pinEmailInput}</div>
                        <div><span className="text-blue-400">Subject:</span> [SECURITY] Developer Portal Access PIN</div>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-slate-300 whitespace-pre-line text-[9px] leading-relaxed">
                        {lang === "id" ? (
                          `Yth. Administrator/Pengembang,\n\nAnda menerima email ini karena ada permintaan PIN untuk autentikasi sistem.\n\nKODE PIN AKSES SISTEM ADALAH: 8899\n\nSilakan masukkan PIN di atas pada portal verifikasi untuk membuka gembok credentials.\n\n---\nLog pengiriman dicatat secara aman dalam basis data sistem.`
                        ) : (
                          `Dear Developer/Administrator,\n\nYou have received this because there was a security PIN query.\n\nSYSTEM SECURITY PIN: 8899\n\nPlease enter this PIN inside the system lock portal to bypass access locks.\n\n---\nLogged securely in database nodes.`
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPinEmailSuccess(false);
                        setIsRequestingByEmail(false);
                        setIsVerifyingSecurity(true); // Guide them immediately to validation
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 rounded-lg transition text-center shadow-3xs cursor-pointer block font-sans"
                    >
                      {lang === "id" ? "Masukkan PIN Sekarang &rarr;" : "Enter PIN Now &rarr;"}
                    </button>
                  </div>
                ) : (
                  /* Standard Email Request input form */
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!pinEmailInput.includes("@")) {
                        setPinEmailError(lang === "id" ? "Silakan masukkan alamat email yang valid." : "Please enter a valid email address.");
                        return;
                      }

                      setPinEmailLoading(true);
                      setPinEmailError("");

                      try {
                        const response = await fetch("/api/request-pin", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: pinEmailInput })
                        });

                        const resData = await response.json();
                        setPinEmailLoading(false);

                        if (response.ok) {
                          setPinEmailSuccess(true);
                        } else {
                          setPinEmailError(resData.error || (lang === "id" ? "Gagal memproses pengiriman PIN." : "Failed to request PIN."));
                        }
                      } catch (err) {
                        setPinEmailLoading(false);
                        setPinEmailError(lang === "id" ? "Kesalahan koneksi ke server." : "Server connection failure.");
                      }
                    }}
                    className="space-y-2 w-full animate-fade-in"
                  >
                    <div className="text-[10px] text-gray-400 leading-normal flex items-start gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span>
                        {lang === "id" 
                          ? "Masukkan email Anda untuk menerima PIN Keamanan secara aman:" 
                          : "Enter your email address to securely request the Access PIN:"}
                      </span>
                    </div>

                    <div className="flex gap-2 w-full">
                      <input
                        type="email"
                        placeholder="nama@email.com"
                        value={pinEmailInput}
                        onChange={(e) => setPinEmailInput(e.target.value)}
                        className="flex-1 font-mono text-xs border bg-white border-gray-250 rounded-lg py-1.5 px-3 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-150"
                        autoFocus
                        required
                      />
                      <button
                        type="submit"
                        disabled={pinEmailLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold text-xs py-1.5 px-3.5 rounded-lg transition shadow-3xs cursor-pointer flex items-center justify-center gap-1 font-sans"
                      >
                        {pinEmailLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        <span>{lang === "id" ? "Kirim" : "Send"}</span>
                      </button>
                    </div>

                    {pinEmailError && (
                      <p className="text-[10px] text-red-650 font-bold bg-red-50 py-1 rounded-md border border-red-150 text-center">
                        ❌ {pinEmailError}
                      </p>
                    )}

                    <p className="text-[9px] text-gray-400 italic">
                      {lang === "id" 
                        ? "*Mendukung kirim ke email penguji mana saja (misal: ferry27sembiring@gmail.com)" 
                        : "*Supports dispatch simulation to any tester email (e.g. ferry27sembiring@gmail.com)"}
                    </p>
                  </form>
                )}
              </div>
            )}

            {/* STATE 4: LOCKED DEFAULT TEMPLATE (Home selector) */}
            {!showDefaultInfo && !isVerifyingSecurity && !isRequestingByEmail && (
              <div className="w-full space-y-2.5 animate-fade-in py-1">
                <div className="font-mono text-xs text-gray-400 select-none bg-gray-150 border border-gray-200/50 px-2 py-1.5 rounded-lg w-full text-center relative overflow-hidden flex items-center justify-center gap-1.5">
                  <span className="opacity-40">🔒</span>
                  <span className="tracking-widest">ad&bull;&bull;&bull;&bull; / ka&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</span>
                </div>
                
                {/* Dual Action Button Panel */}
                <div className="grid grid-cols-2 gap-2 w-full pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsVerifyingSecurity(true);
                      setSecurityError("");
                    }}
                    className="bg-white border border-gray-200 hover:bg-gray-100/70 text-gray-700 font-extrabold text-[10px] py-2 px-2.5 rounded-lg transition text-center shadow-3xs cursor-pointer flex items-center justify-center gap-1 hover:border-gray-300 font-sans uppercase tracking-tight"
                  >
                    🔑 {lang === "id" ? "Masukkan PIN" : "Enter PIN"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRequestingByEmail(true);
                      setPinEmailError("");
                      setPinEmailSuccess(false);
                    }}
                    className="bg-blue-50 border border-blue-150 hover:bg-blue-100/70 text-blue-700 font-extrabold text-[10px] py-2 px-2.5 rounded-lg transition text-center shadow-3xs cursor-pointer flex items-center justify-center gap-1 hover:border-blue-200 font-sans uppercase tracking-tight"
                  >
                    ✉️ {lang === "id" ? "Minta via Email" : "Request via Email"}
                  </button>
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    );
  }

  // LOGGED-IN ADMIN DASHBOARD
  return (
    <div id="admin-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12">
      
      {/* CMS Left Navigation Panel */}
      <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="border-b pb-3 mb-2 px-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sedang Masuk:</div>
          <div className="font-extrabold text-blue-950 text-sm truncate">{currentUser?.name}</div>
          <div className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded mt-1">
            {currentUser?.role}
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full py-2.5 px-3 rounded-lg flex items-center justify-start gap-2.5 text-xs font-semibold transition cursor-pointer ${
              activeTab === "dashboard" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard & Log
          </button>

          <button
            onClick={() => setActiveTab("kegiatan")}
            className={`w-full py-2.5 px-3 rounded-lg flex items-center justify-start gap-2.5 text-xs font-semibold transition cursor-pointer ${
              activeTab === "kegiatan" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Kelola Kegiatan/Berita
          </button>

          <button
            onClick={() => setActiveTab("statistik")}
            className={`w-full py-2.5 px-3 rounded-lg flex items-center justify-start gap-2.5 text-xs font-semibold transition cursor-pointer ${
              activeTab === "statistik" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Users className="w-4 h-4" />
            Kelola Demografi Anak
          </button>

          <button
            onClick={() => setActiveTab("pengurus")}
            className={`w-full py-2.5 px-3 rounded-lg flex items-center justify-start gap-2.5 text-xs font-semibold transition cursor-pointer ${
              activeTab === "pengurus" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Users className="w-4 h-4 font-normal" />
            Kelola Profil Pengurus
          </button>

          <button
            onClick={() => setActiveTab("profil")}
            className={`w-full py-2.5 px-3 rounded-lg flex items-center justify-start gap-2.5 text-xs font-semibold transition cursor-pointer ${
              activeTab === "profil" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Settings className="w-4 h-4" />
            Profil & Rekening Donasi
          </button>

          <button
            onClick={() => setActiveTab("ulasan")}
            className={`w-full py-2.5 px-3 rounded-lg flex items-center justify-start gap-2.5 text-xs font-semibold transition cursor-pointer ${
              activeTab === "ulasan" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            Kelola Ulasan Pengunjung
          </button>

          <button
            onClick={() => setActiveTab("admins")}
            className={`w-full py-2.5 px-3 rounded-lg flex items-center justify-start gap-2.5 text-xs font-semibold transition cursor-pointer ${
              activeTab === "admins" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Tambah / Akun Admin
          </button>
        </nav>

        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 hover:bg-rose-50 text-rose-600 rounded-lg flex items-center justify-start gap-2.5 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Keluar (Logout)
          </button>
        </div>
      </div>

      {/* CMS Right Modules Content Panel */}
      <div className="lg:col-span-9 space-y-6">
        
        {/* Real-time Status notifications */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs font-bold border border-emerald-100 shadow-xs animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-rose-50 rounded-2xl flex items-center gap-2.5 text-rose-800 text-xs font-bold border border-rose-100 shadow-xs animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* --- MODULE 1: DASHBOARD & LOGS --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-150">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Sistem</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-2xl font-extrabold text-blue-900">{publicData.kegiatan.length}</div>
                  <div className="text-xs font-semibold text-blue-700">Artikel Berita</div>
                </div>

                <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                  <div className="text-2xl font-extrabold text-teal-900">{publicData.statistikAnak.total}</div>
                  <div className="text-xs font-semibold text-teal-700">Anak Asuh</div>
                </div>

                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="text-2xl font-extrabold text-indigo-900">{publicData.pengurus.length}</div>
                  <div className="text-xs font-semibold text-indigo-700">Pengurus Terdaftar</div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="text-2xl font-extrabold text-amber-950">{publicData.rekeningDonasi.length}</div>
                  <div className="text-xs font-semibold text-amber-700">Rekening Donasi</div>
                </div>
              </div>
            </div>

            {/* History logs / System Notifications */}
            <div className="bg-white p-6 rounded-2xl border border-gray-150 space-y-4">
              <div className="flex justify-between items-center border-b pb-3 border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Histori & Notifikasi Log Aktivitas</h3>
                <button
                  onClick={fetchAdminLogs}
                  className="p-1 px-2 hover:bg-gray-50 border border-gray-200 rounded text-[10px] font-bold text-gray-600 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Perbarui Log
                </button>
              </div>

              <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-2 space-y-3">
                {logs.length === 0 ? (
                  <div className="text-center font-medium text-xs text-gray-400 py-6">
                    Belum ada riwayat aktivitas log.
                  </div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="pt-3 first:pt-0 flex justify-between gap-4 items-start text-xs text-gray-600">
                      <div>
                        <span className="font-extrabold text-blue-800">[{log.adminName}] </span>
                        <span>{log.deskripsiAktivitas}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono shrink-0">
                        {new Date(log.timestamp).toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- MODULE 2: KELOLA KEGIATAN --- */}
        {activeTab === "kegiatan" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b pb-2 border-gray-100">
                {editingKegiatanId ? "Edit Artikel Kegiatan" : "Tambah Kegiatan Baru"}
              </h3>

              <form onSubmit={handleKegiatanSubmit} className="space-y-4 text-xs font-bold text-gray-600">
                <div className="space-y-1">
                  <label className="block text-gray-600">Judul Kegiatan/Berita *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pembagian Sembako..."
                    value={formKegiatan.judul}
                    onChange={(e) => setFormKegiatan({ ...formKegiatan, judul: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block">Tanggal Dilaksanakan *</label>
                  <input
                    type="date"
                    required
                    value={formKegiatan.tanggal}
                    onChange={(e) => setFormKegiatan({ ...formKegiatan, tanggal: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block">Foto Ilustrasi/Kegiatan</label>
                  
                  {/* File Upload to Base64 */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center hover:bg-gray-50 transition cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (base64) => setFormKegiatan({ ...formKegiatan, foto: base64 }))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <span className="text-[10px] text-gray-500 block">Pilih / Seret foto dari komputer (Maks 5MB)</span>
                  </div>

                  {/* Or Manual URL Text Input */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-gray-400 font-semibold block text-center uppercase">ATAU masukkan URL tautan foto</span>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={formKegiatan.foto.startsWith("data:") ? "" : formKegiatan.foto}
                      onChange={(e) => setFormKegiatan({ ...formKegiatan, foto: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg font-medium focus:border-blue-500 focus:outline-hidden text-[11px]"
                    />
                  </div>

                  {/* Photo Preview inside Form */}
                  {formKegiatan.foto && (
                    <div className="rounded-lg overflow-hidden border aspect-video relative h-20 mx-auto">
                      <img src={formKegiatan.foto} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormKegiatan({ ...formKegiatan, foto: "" })}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded p-1 text-[9px] font-bold"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block">Deskripsi Lengkap Kegiatan *</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Ceritakan jalannya acara, rasa sukacita anak-anak, donatur terkait, dsb..."
                    value={formKegiatan.deskripsi}
                    onChange={(e) => setFormKegiatan({ ...formKegiatan, deskripsi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-bold cursor-pointer text-xs flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Berita
                  </button>
                  {editingKegiatanId && (
                    <button
                      type="button"
                      onClick={cancelEditKegiatan}
                      className="py-2 px-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-250 font-bold"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b pb-2 border-gray-100">Daftar Terposting</h3>
              
              <div className="divide-y divide-gray-100 overflow-y-auto max-h-[60vh] pr-2 space-y-3">
                {publicData.kegiatan.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 font-medium">Belum ada kegiatan terposting.</div>
                ) : (
                  publicData.kegiatan.map((act) => (
                    <div key={act.id} className="pt-3 first:pt-0 flex gap-4 items-start justify-between">
                      <div className="flex gap-3">
                        <img src={act.foto} alt="" className="w-16 aspect-video rounded-md object-cover border shrink-0" />
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs line-clamp-1">{act.judul}</h4>
                          <span className="text-[10px] text-gray-400 font-medium">{new Date(act.tanggal).toLocaleDateString("id-ID")}</span>
                          <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed mt-0.5">{act.deskripsi}</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => startEditKegiatan(act)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteKegiatan(act.id, act.judul)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- MODULE 3: STATISTIK ANAK DEMOGRAFI --- */}
        {activeTab === "statistik" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 max-w-xl mx-auto shadow-xs space-y-6">
            <div className="border-b pb-3">
              <h3 className="text-base font-bold text-gray-900">Kelola Demografi & Angka Statistik Anak Asuh</h3>
              <p className="text-[10px] text-gray-400 mt-1">Gunakan form ini untuk memperbarui jumlah anak asuh di depan secara live.</p>
            </div>

            <form onSubmit={handleStatsSubmit} className="space-y-4 text-xs font-bold text-gray-650">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-blue-800">Total Anak Asuh *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStats.total}
                    onChange={(e) => setFormStats({ ...formStats, total: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-blue-200 bg-blue-50/20 rounded-lg text-sm text-blue-900 focus:outline-hidden"
                  />
                </div>
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100 flex items-center justify-center text-[10px] text-amber-800 font-semibold leading-relaxed">
                  Catatan: Jumlah Laki-laki + Perempuan sebaiknya pas dengan Total Anak.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="space-y-1">
                  <label className="block text-gray-600">Jumlah Laki-laki</label>
                  <input
                    type="number"
                    min="0"
                    value={formStats.lakiLaki}
                    onChange={(e) => setFormStats({ ...formStats, lakiLaki: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-600">Jumlah Perempuan</label>
                  <input
                    type="number"
                    min="0"
                    value={formStats.perempuan}
                    onChange={(e) => setFormStats({ ...formStats, perempuan: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Berdasarkan Jenjang Sekolah</span>
                  {!showAddStage && (
                    <button
                      type="button"
                      onClick={() => setShowAddStage(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold transition flex items-center gap-1 cursor-pointer bg-blue-50 px-2.5 py-1 rounded-md"
                    >
                      <Plus className="w-3 h-3" /> Tambah Jenjang
                    </button>
                  )}
                </div>

                {showAddStage && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-2.5">
                    <label className="block text-xs text-blue-800 font-bold">Nama Jenjang Sekolah Baru</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Contoh: TK, PAUD, STT, dll."
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-blue-200 bg-white rounded-lg text-xs text-gray-800 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleAddStage}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                      >
                        Tambah
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddStage(false);
                          setNewStageName("");
                        }}
                        className="px-2.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg text-xs transition cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.keys(formStats)
                    .filter((key) => !["total", "lakiLaki", "perempuan"].includes(key))
                    .map((key) => {
                      const isDefault = ["belumSekolah", "sd", "smp", "sma", "kuliah"].includes(key);
                      const displayLabel = key === "belumSekolah" ? "Belum Sekolah" :
                                           key === "sd" ? "SD" :
                                           key === "smp" ? "SMP" :
                                           key === "sma" ? "SMA / SMK" :
                                           key === "kuliah" ? "Kuliah" : key;

                      return (
                        <div key={key} className="space-y-1 relative bg-gray-50/60 p-3 rounded-xl border border-gray-150 group/item transition-colors hover:bg-white hover:border-gray-300">
                          <div className="flex justify-between items-center gap-1">
                            <label className="block text-gray-700 capitalize text-xs font-bold truncate" title={displayLabel}>
                              {displayLabel}
                            </label>
                            {!isDefault && (
                              <button
                                type="button"
                                onClick={() => handleRemoveStage(key)}
                                className="text-rose-500 hover:text-rose-700 p-0.5 rounded cursor-pointer transition-colors"
                                title="Hapus jenjang ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <input
                            type="number"
                            min="0"
                            value={formStats[key]}
                            onChange={(e) => setFormStats({ ...formStats, [key]: Number(e.target.value) })}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-center text-sm font-semibold text-gray-800 focus:outline-hidden"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Simpan Perubahan Statistik
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- MODULE 4: KELOLA PENGURUS --- */}
        {activeTab === "pengurus" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b pb-2 border-gray-100">
                {editingPengurusId ? "Sunting Profil Pengurus" : "Tambah Pengurus Baru"}
              </h3>

              <form onSubmit={handlePengurusSubmit} className="space-y-4 text-xs font-bold text-gray-600">
                <div className="space-y-1">
                  <label className="block">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Grace Sembiring, S.Pd."
                    value={formPengurus.nama}
                    onChange={(e) => setFormPengurus({ ...formPengurus, nama: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block">Jabatan / Peran Pengurus *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sekretaris Asrama..."
                    value={formPengurus.jabatan}
                    onChange={(e) => setFormPengurus({ ...formPengurus, jabatan: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1 font-bold text-xs text-gray-600">
                  <label className="block text-gray-700">Caption / Kutipan Melayani (Opsional)</label>
                  <textarea
                    placeholder="Contoh: Melayani dengan sukacita dan membela hak-hak hidup masa depan anak binaan asrama."
                    value={formPengurus.caption}
                    onChange={(e) => setFormPengurus({ ...formPengurus, caption: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-normal text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={2}
                  />
                  <span className="text-[10px] text-gray-400 font-normal block">Teks deskripsi / moto pelayanan masing-masing pengurus yang tampil di halaman Tentang Kami.</span>
                </div>

                <div className="space-y-2">
                  <label className="block">Foto Profil Pengurus</label>
                  
                  {/* File Upload to Base64 */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center hover:bg-gray-50 transition cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (base64) => setFormPengurus({ ...formPengurus, foto: base64 }))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <span className="text-[10px] text-gray-500 block">Unggah foto format JPG/PNG</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-gray-400 font-semibold block text-center uppercase">Atau URL Link foto online</span>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={formPengurus.foto.startsWith("data:") ? "" : formPengurus.foto}
                      onChange={(e) => setFormPengurus({ ...formPengurus, foto: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-[11px]"
                    />
                  </div>

                  {formPengurus.foto && (
                    <div className="w-16 h-16 rounded-full overflow-hidden border mx-auto">
                      <img src={formPengurus.foto} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-bold cursor-pointer text-xs flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Pengurus
                  </button>
                  {editingPengurusId && (
                    <button
                      type="button"
                      onClick={cancelEditPengurus}
                      className="py-2 px-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-bold"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b pb-2 border-gray-100">Susunan Pengurus Aktif</h3>
              
              <div className="divide-y divide-gray-100 overflow-y-auto max-h-[60vh] pr-2 space-y-3">
                {publicData.pengurus.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 font-medium">Belum ada pengurus di input.</div>
                ) : (
                  publicData.pengurus.map((p) => (
                    <div key={p.id} className="pt-3 first:pt-0 flex gap-4 items-center justify-between">
                      <div className="flex gap-3 items-center">
                        <img src={p.foto} alt="" className="w-12 h-12 rounded-full object-cover border shrink-0 bg-gray-50" />
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs">{p.nama}</h4>
                          <div className="flex flex-col items-start gap-1 mt-0.5">
                            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">{p.jabatan}</span>
                            {p.caption && (
                              <p className="text-[10px] text-gray-400 font-normal italic max-w-sm truncate" title={p.caption}>
                                "{p.caption}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => startEditPengurus(p)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Suntik"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePengurus(p.id, p.nama)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- MODULE 5: PROFIL YAYASAN & REKENING (CRUD) --- */}
        {activeTab === "profil" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Profil Settings Form */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b pb-2 border-gray-100">Sunting Narasi & Profil Yayasan</h3>
              
              <form onSubmit={handleProfilSubmit} className="space-y-4 text-xs font-bold text-gray-600">
                <div className="space-y-1">
                  <label className="block">Sejarah Singkat Pendirian</label>
                  <textarea
                    rows={4}
                    value={formProfil.sejarah}
                    onChange={(e) => setFormProfil({ ...formProfil, sejarah: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block">Visi Yayasan</label>
                  <textarea
                    rows={2}
                    value={formProfil.visi}
                    onChange={(e) => setFormProfil({ ...formProfil, visi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block">Misi Yayasan (Pisahkan dengan garis baru / baris baru)</label>
                  <span className="text-[10px] text-gray-400 font-normal block mb-1">Setiap baris teks yang Anda enter akan didaftarkan sebagai bullet point tersendiri di halaman depan.</span>
                  <textarea
                    rows={4}
                    placeholder="Menyekolahkan seluruh anak...&#10;Melatih bakat bapak..."
                    value={formProfil.misiString}
                    onChange={(e) => setFormProfil({ ...formProfil, misiString: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                  <div className="space-y-1">
                    <label className="block">Alamat Sekretariat</label>
                    <input
                      type="text"
                      value={formProfil.alamat}
                      onChange={(e) => setFormProfil({ ...formProfil, alamat: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block">Nomor Telepon WA</label>
                    <input
                      type="text"
                      value={formProfil.telepon}
                      onChange={(e) => setFormProfil({ ...formProfil, telepon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block">Alamat Email Resmi</label>
                    <input
                      type="email"
                      value={formProfil.email}
                      onChange={(e) => setFormProfil({ ...formProfil, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block">Google Maps Iframe Src</label>
                    <input
                      type="text"
                      value={formProfil.mapsIframe}
                      onChange={(e) => setFormProfil({ ...formProfil, mapsIframe: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t pt-4">
                  <div className="space-y-1">
                    <label className="block">Facebook URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formProfil.facebookUrl}
                      onChange={(e) => setFormProfil({ ...formProfil, facebookUrl: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-[11px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block">Instagram URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formProfil.instagramUrl}
                      onChange={(e) => setFormProfil({ ...formProfil, instagramUrl: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-[11px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block">Youtube URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formProfil.youtubeUrl}
                      onChange={(e) => setFormProfil({ ...formProfil, youtubeUrl: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-[11px]"
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">Kustomisasi Logo & Banner Beranda</h4>
                  
                  {/* Panduan Unggah Gambar Eksternal */}
                  <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-2 text-[11px] leading-relaxed">
                    <h5 className="font-extrabold text-amber-900 flex items-center gap-1.5 text-[12px]">
                      <Plus className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      Cara Menambahkan Foto dari Komputer Anda:
                    </h5>
                    <p className="text-gray-650">
                      Karena pengaturan ini membutuhkan sebuah tautan (URL), Anda tidak bisa langsung mengunggah file mentah dari komputer Anda. Agar gambar di komputer Anda dapat digunakan sebagai logo atau latar belakang, silakan gunakan langkah mudah berikut:
                    </p>
                    <ol className="list-decimal pl-4.5 space-y-1 text-gray-700 font-medium">
                      <li>
                        Kunjungi situs pengunggah gambar gratis tepercaya seperti <a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="text-blue-700 font-bold hover:underline">Postimages.org</a>, <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 font-bold hover:underline">ImgBB.com</a>, atau <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 font-bold hover:underline">Imgur.com</a>.
                      </li>
                      <li>
                        Unggah file gambar/foto dari komputer Anda melalui tombol <strong className="text-blue-900">Choose Images</strong> atau <strong className="text-blue-900">Mulai Mengunggah</strong>.
                      </li>
                      <li>
                        Setelah selesai mengunggah, salin tautan yang tertulis pada bagian <strong className="text-amber-850">"Tautan Langsung" (Direct Link)</strong>. Pastikan tautan tersebut berakhiran format gambar (seperti <code className="bg-white/80 px-1 py-0.5 border rounded text-rose-600 font-mono text-[10px]">.jpg</code>, <code className="bg-white/80 px-1 py-0.5 border rounded text-rose-600 font-mono text-[10px]">.png</code>, atau <code className="bg-white/80 px-1 py-0.5 border rounded text-rose-600 font-mono text-[10px]">.jpeg</code>).
                      </li>
                      <li>
                        Tempelkan (paste) tautan langsung tersebut ke kolom <strong className="text-blue-950 font-bold">URL Gambar Logo Kustom</strong> atau <strong className="text-blue-950 font-bold">URL Gambar Latar Belakang</strong> di bawah ini.
                      </li>
                    </ol>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700">URL Gambar Logo Kustom (Saran Rasio 1:1)</label>
                    <span className="text-[10px] text-gray-400 font-normal block">Masukkan link gambar logo Anda. Kosongkan untuk kembali menggunakan lambang kotak biru salib (✝) bawaan.</span>
                    <div className="flex gap-3 items-center mt-1">
                      <input
                        type="text"
                        placeholder="Contoh: https://i.imgur.com/your-logo.png"
                        value={formProfil.logoUrl}
                        onChange={(e) => setFormProfil({ ...formProfil, logoUrl: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg font-medium"
                      />
                      {formProfil.logoUrl && (
                        <div className="w-10 h-10 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 flex-none shadow-sm">
                          <img 
                            src={formProfil.logoUrl} 
                            alt="Preview Logo" 
                            className="w-full h-full object-contain" 
                            onError={(e) => {(e.target as HTMLElement).style.display = 'none'}}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-gray-700">Lencana Pendek (Hero Badge)</label>
                      <input
                        type="text"
                        placeholder="Contoh: Membangun Harapan Baru — Berasaskan Kasih"
                        value={formProfil.heroBadge}
                        onChange={(e) => setFormProfil({ ...formProfil, heroBadge: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-gray-700">URL Gambar Latar Belakang (Hero Background)</label>
                      <input
                        type="text"
                        placeholder="Contoh: https://images.unsplash.com/your-photo"
                        value={formProfil.heroBgUrl}
                        onChange={(e) => setFormProfil({ ...formProfil, heroBgUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700">Judul Utama Beranda (Hero Title)</label>
                    <input
                      type="text"
                      placeholder="Contoh: Wujudkan Masa Depan Cerah bagi Anak Bangsa"
                      value={formProfil.heroTitle}
                      onChange={(e) => setFormProfil({ ...formProfil, heroTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700">Deskripsi Utama Beranda (Hero Description)</label>
                    <textarea
                      rows={3}
                      placeholder="Masukkan narasi penyambutan atau misi singkat di banner depan..."
                      value={formProfil.heroDescription}
                      onChange={(e) => setFormProfil({ ...formProfil, heroDescription: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                    />
                  </div>

                  {formProfil.heroBgUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100 flex items-center justify-center">
                      <img 
                        src={formProfil.heroBgUrl} 
                        alt="Hero Preview" 
                        className="absolute inset-0 w-full h-full object-cover opacity-60" 
                        onError={(e) => {(e.target as HTMLElement).style.display = 'none'}}
                        referrerPolicy="no-referrer"
                      />
                      <div className="relative z-10 text-[10px] text-gray-800 font-extrabold bg-white/80 px-2 py-0.5 rounded shadow-xs">Pratinjau Gambar Latar Beranda</div>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">Kustomisasi Donasi Paket Logistik & Pakaian</h4>
                  
                  <div className="space-y-1">
                    <label className="block text-gray-700">Judul Donasi Logistik</label>
                    <input
                      type="text"
                      placeholder="Contoh: Donasi Paket Logistik Sembako & Pakaian"
                      value={formProfil.donasiLogistikTitle}
                      onChange={(e) => setFormProfil({ ...formProfil, donasiLogistikTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700">Subjudul Penjelasan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Selain tunai, anak-anak asuh membutuhkan bantuan logistik harian seperti:"
                      value={formProfil.donasiLogistikSubtitle}
                      onChange={(e) => setFormProfil({ ...formProfil, donasiLogistikSubtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700">Daftar Barang Kebutuhan (Satu per baris)</label>
                    <span className="text-[10px] text-gray-400 font-normal block">Masukkan barang-barang yang dibutuhkan. Pisahkan setiap barang dengan baris baru (tekan Enter).</span>
                    <textarea
                      rows={4}
                      placeholder="Contoh:&#10;Sembako (Beras, Minyak, Mie Instan)&#10;Pakaian anak umur 4-18 tahun&#10;Peralatan mandi & kebersihan"
                      value={formProfil.donasiLogistikItemsString}
                      onChange={(e) => setFormProfil({ ...formProfil, donasiLogistikItemsString: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700">Petunjuk Pengiriman Barang</label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Barang dapat langsung dikirim lewat kurir atau diantar langsung ke alamat..."
                      value={formProfil.donasiLogistikShipping}
                      onChange={(e) => setFormProfil({ ...formProfil, donasiLogistikShipping: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Perubahan Narasi Profil & Beranda
                  </button>
                </div>
              </form>
            </div>

            {/* Donation Accounts CRUD Column */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Form to Add Account */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-gray-900 border-b pb-2 border-gray-100 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-blue-700" />
                  {editingRekeningId ? "Edit Rekening" : "Tambah No Rekening Donasi"}
                </h3>

                <form onSubmit={handleRekeningSubmit} className="space-y-4 text-xs font-bold text-gray-650">
                  <div className="space-y-1">
                    <label className="block">Nama Bank *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: BANK MANDIRI, BANK BCA..."
                      value={formRekening.bankName}
                      onChange={(e) => setFormRekening({ ...formRekening, bankName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block">Nama Pemilik Rekening *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Yayasan Gelora Kasih"
                      value={formRekening.accountName}
                      onChange={(e) => setFormRekening({ ...formRekening, accountName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block">Nomor Rekening Perbankan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan kombinasi angka..."
                      value={formRekening.accountNumber}
                      onChange={(e) => setFormRekening({ ...formRekening, accountNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm tracking-wider font-mono"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold rounded-lg cursor-pointer"
                    >
                      {editingRekeningId ? "Selesai Edit" : "Daftarkan Rekening Baru"}
                    </button>
                    {editingRekeningId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRekeningId(null);
                          setFormRekening({ bankName: "", accountName: "", accountNumber: "" });
                        }}
                        className="py-2 px-3 bg-gray-100 text-gray-600 rounded-lg"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List of current accounts */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider block">Daftar Rekening Yayasan</h4>
                
                <div className="divide-y divide-gray-100 space-y-3">
                  {publicData.rekeningDonasi.length === 0 ? (
                    <div className="text-center py-6 text-gray-450 font-medium">Belum ada rekening didaftarkan.</div>
                  ) : (
                    publicData.rekeningDonasi.map((rec) => (
                      <div key={rec.id} className="pt-3 first:pt-0 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-blue-900">{rec.bankName}</div>
                          <div className="font-mono text-gray-700 font-semibold text-xs mt-0.5">{rec.accountNumber}</div>
                          <div className="text-[10px] text-gray-400">An. {rec.accountName}</div>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditRekening(rec)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteRekening(rec.id, rec.bankName)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODULE 6: ADMIN USER MANAGEMENT CMS --- */}
        {activeTab === "admins" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Create Admin Form */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b pb-2 border-gray-100 flex items-center gap-1.5">
                <UserPlus className="w-5 h-5 text-blue-700" />
                Registrasi Admin Baru
              </h3>

              <form onSubmit={handleNewAdminSubmit} className="space-y-4 text-xs font-bold text-gray-600">
                <div className="space-y-1">
                  <label className="block">Nama Lengkap Administrator *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pdt. John Sembiring..."
                    value={formNewAdmin.name}
                    onChange={(e) => setFormNewAdmin({ ...formNewAdmin, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block">Username Unik (Tanpa Spasi) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: john_panti"
                    value={formNewAdmin.username}
                    onChange={(e) => setFormNewAdmin({ ...formNewAdmin, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-mono lowercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block">Password / Kata Sandi *</label>
                  <input
                    type="password"
                    required
                    placeholder="Masukkan sandi kuat baru..."
                    value={formNewAdmin.password}
                    onChange={(e) => setFormNewAdmin({ ...formNewAdmin, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block">Peran / Jabatan Akses</label>
                  <select
                    value={formNewAdmin.role}
                    onChange={(e) => setFormNewAdmin({ ...formNewAdmin, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-semibold text-gray-700"
                  >
                    <option value="Admin">Admin Biasa</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    id="btn-add-admin-submit"
                    type="submit"
                    className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg cursor-pointer"
                  >
                    Daftarkan Akun Baru
                  </button>
                </div>
              </form>
            </div>

            {/* List of Admins Column */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900 border-b pb-2 border-gray-100">Daftar Akun Administrator Berwenang</h3>
              
              <div className="divide-y divide-gray-100 mt-2">
                {adminsList.map((ad) => (
                  <div key={ad.id} className="py-3 first:pt-0 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-extrabold text-gray-900 flex items-center gap-1.5">
                        {ad.name}
                        {ad.username === "admin" && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Utama</span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">Username: {ad.username}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Peran: {ad.role}</div>
                    </div>

                    {ad.username !== "admin" && (
                      <button
                        onClick={() => deleteAdminAccount(ad.username, ad.name)}
                        className="p-1 px-2 hover:bg-rose-50 rounded border border-rose-100 text-[10px] font-bold text-rose-600 cursor-pointer flex items-center gap-1"
                        title="Cabut Akses Admin"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- MODULE 7: VISITOR REVIEWS MANAGEMENT CMS --- */}
        {activeTab === "ulasan" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 border-gray-100 gap-4">
              <div>
                <h3 className="text-base font-extrabold text-blue-950 flex items-center gap-1.5 animate-fade-in">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  Kelola Kesan & Ulasan Kegiatan
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Pantau, baca, dan kelola semua testimoni, masukan, asupan doa, dan ulasan pelayanan dari para pengunjung panti.
                </p>
              </div>

              {/* Summary Stats */}
              <div className="flex gap-4 text-xs font-bold text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100/80">
                <div className="text-center px-1">
                  <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Total</span>
                  <span className="text-base font-black text-blue-900">{publicData.ulasan?.length || 0} Ulasan</span>
                </div>
                <div className="border-l border-gray-200"></div>
                <div className="text-center px-1">
                  <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Rata-Rata</span>
                  <span className="text-base font-black text-amber-600 flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 inline" />
                    {publicData.ulasan && publicData.ulasan.length > 0 
                      ? (publicData.ulasan.reduce((acc, current) => acc + current.rating, 0) / publicData.ulasan.length).toFixed(1)
                      : "0.0"}
                  </span>
                </div>
              </div>
            </div>

            {!publicData.ulasan || publicData.ulasan.length === 0 ? (
              <div className="py-12 text-center text-gray-400 border border-dashed rounded-xl space-y-2 border-gray-200">
                <MessageSquare className="w-8 h-8 mx-auto text-gray-300 animate-pulse" />
                <p className="text-xs font-semibold">Belum terpantau ada ulasan dari pengunjung yang masuk.</p>
              </div>
            ) : (
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-100">
                      <th className="py-3 px-4 font-bold">Pengulas & Tanggal</th>
                      <th className="py-3 px-4 font-bold">Bintang</th>
                      <th className="py-3 px-4 font-bold">Ulasan / Pesan Kasih</th>
                      <th className="py-3 px-4 font-bold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {publicData.ulasan.map((rev) => (
                      <tr key={rev.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-gray-900 block">{rev.authorName}</span>
                          <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                            {new Date(rev.createdAt).toLocaleString("id-ID")} WIB
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 max-w-sm">
                          <p className="line-clamp-3 text-gray-600 leading-relaxed text-justify">
                            {rev.comment}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteReview(rev.id, rev.authorName)}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 border border-rose-100 rounded-lg cursor-pointer transition inline-flex items-center gap-1 text-[10px] font-bold"
                            title="Hapus Ulasan Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
