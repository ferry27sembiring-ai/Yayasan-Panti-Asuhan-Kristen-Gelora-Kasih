/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Heart, Menu, X, Landmark, Compass, Calendar, Phone, Mail, 
  MapPin, ShieldAlert, Facebook, Instagram, Youtube, Sparkles,
  Globe, Sun, Moon
} from "lucide-react";
import { Kegiatan, StatistikAnak, Pengurus, RekeningDonasi, ProfilYayasan, Review, getWhatsAppUrl } from "./types";

// Import custom sections
import HomeSection from "./components/HomeSection";
import AboutSection from "./components/AboutSection";
import ActivitiesSection from "./components/ActivitiesSection";
import ContactSection from "./components/ContactSection";
import AdminPanel from "./components/AdminPanel";

// Fallback skeleton default state before first load finishes
const defaultStats: StatistikAnak = {
  total: 35,
  lakiLaki: 16,
  perempuan: 19,
  belumSekolah: 0,
  sd: 12,
  smp: 11,
  sma: 9,
  kuliah: 3
};

const defaultProfil: ProfilYayasan = {
  sejarah: "Yayasan Panti Asuhan Kristen Gelora Kasih didirikan atas panggilan pelayanan membina anak yatim piatu, terlantar, dan tidak mampu di Sibolangit, Sumatera Utara.",
  visi: "Menjadi wadah pembinaan berkarakter iman Kristiani yang unggul, cerdas, mandiri, dan berbudaya kasih.",
  misi: ["Menyediakan asrama sehat kondusif", "Mengupayakan pendidikan formal tinggi", "Membina pertumbuhan rohani sejati", "Manajemen transparan dapat dipercaya"],
  alamat: "Jl. Gelora Kasih No. 24, Sibolangit, Sumatera Utara, Indonesia",
  telepon: "+62 821-6543-9876",
  email: "kontak@gelorakasih.or.id",
  mapsIframe: "https://www.google.com/maps/embed?pb=...",
  facebookUrl: "https://facebook.com/PantiAsuhanGeloraKasih",
  instagramUrl: "https://instagram.com/panti.gelorakasih",
  youtubeUrl: "https://youtube.com/c/PantiAsuhanGeloraKasih",
  logoUrl: "",
  heroBadge: "Membangun Harapan Baru — Berasaskan Kasih",
  heroTitle: "Wujudkan Masa Depan Cerah bagi Anak Bangsa",
  heroDescription: "Selamat datang di Yayasan Panti Asuhan Kristen Gelora Kasih. Memberikan perlindungan, pendidikan, asrama sehat, dan kasih sayang yang berpusat pada nilai-nilai Kristiani bagi anak-anak yang membutuhkan.",
  heroBgUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80",
  donasiLogistikTitle: "Donasi Paket Logistik Sembako & Pakaian",
  donasiLogistikSubtitle: "Selain tunai, anak-anak asuh membutuhkan bantuan logistik harian seperti:",
  donasiLogistikItems: [
    "Sembako (Beras, Minyak Goreng, Gula, Susu, Mie Instan, dll).",
    "Pakaian ganti harian (anak umur 4 s.d. 18 tahun) yang masih layak pakai.",
    "Suku cadang peralatan kebersihan asrama, sabun, odol, detergen.",
    "Buku bacaan rohani Kristen, novel edukatif, atau perlengkapan melukis/musik."
  ],
  donasiLogistikShipping: "Barang dapat langsung dikirimkan lewat kurir (J&T, JNE, POS) atau diantar langsung ke alamat panti asuhan Kristen Gelora Kasih di Sibolangit."
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Translation & Dark Theme States
  const [lang, setLang] = useState<"id" | "en">((): "id" | "en" => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("lang");
      if (stored === "en" || stored === "id") return stored;
    }
    return "id";
  });

  const [isDark, setIsDark] = useState<boolean>((): boolean => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  // Sync translation lang selection
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  // Sync dark theme class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // States synchronized with Backend CMS database.json
  const [activities, setActivities] = useState<Kegiatan[]>([]);
  const [stats, setStats] = useState<StatistikAnak>(defaultStats);
  const [pengurus, setPengurus] = useState<Pengurus[]>([]);
  const [rekening, setRekening] = useState<RekeningDonasi[]>([]);
  const [profil, setProfil] = useState<ProfilYayasan>(defaultProfil);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Activities selection model
  const [selectedActivity, setSelectedActivity] = useState<Kegiatan | null>(null);

  // Load public data from full-stack API
  const loadPublicData = async () => {
    try {
      const res = await fetch("/api/public-data");
      if (res.ok) {
        const data = await res.json();
        setActivities(data.kegiatan || []);
        if (data.statistikAnak) setStats(data.statistikAnak);
        setPengurus(data.pengurus || []);
        setRekening(data.rekeningDonasi || []);
        if (data.profilYayasan) setProfil(data.profilYayasan);
        setReviews(data.ulasan || []);
      }
    } catch (err) {
      console.error("Gagal memuat data publik panti asuhan:", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    loadPublicData();
  }, []);

  // Set selected activity from any page and transition to Kegiatan tab
  const handleSelectActivity = (act: Kegiatan | null) => {
    setSelectedActivity(act);
    setCurrentTab("kegiatan");
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleTabNavigation = (tab: string) => {
    setCurrentTab(tab);
    setIsMobileMenuOpen(false);
    // Dismiss selected activity if navigating directly
    if (tab !== "kegiatan") {
      setSelectedActivity(null);
    }
    // Scroll to top upon transition
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen ${isDark ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-gray-800"} flex flex-col font-sans antialiased selection:bg-blue-105 selection:text-blue-900 transition-colors duration-300`}>
      
      {/* Dynamic Loading Header */}
      {isDataLoading && (
        <div className="bg-amber-400 text-blue-950 text-center py-2 text-xs font-bold flex items-center justify-center gap-2">
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {lang === "id" ? "Menghubungkan ke Pusat Data Gelora Kasih Sibolangit..." : "Synching with Gelora Kasih centralized data nodes..."}
        </div>
      )}

      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-blue-105 dark:border-slate-800 py-4 px-6 md:px-12 flex justify-between items-center shadow-sm transition-colors duration-300">
        
        {/* Brand Logo Identity */}
        <div 
          onClick={() => handleTabNavigation("home")}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {/* Elegant Christian Cross Badge or Custom Logo Image */}
          {profil.logoUrl ? (
            <img 
              src={profil.logoUrl} 
              alt="Logo Gelora Kasih" 
              className="h-10 w-auto max-w-[150px] object-contain transition-transform group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/10 transition-transform group-hover:scale-105">
              ✝
            </div>
          )}
          <div>
            <h1 className="text-sm md:text-base font-bold leading-none text-blue-900 dark:text-white tracking-tight">
              Gelora Kasih
            </h1>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-600 dark:text-amber-450 block mt-1">
              {lang === "id" ? "Yayasan Panti Asuhan Kristen" : "Christian Orphanage Foundation"}
            </span>
          </div>
        </div>

        {/* Desktop Web Navigation bar */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-slate-500 dark:text-gray-400 uppercase">
          <button
            onClick={() => handleTabNavigation("home")}
            className={`transition cursor-pointer ${currentTab === "home" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 px-1 pb-1 font-bold" : "hover:text-blue-600 dark:hover:text-blue-400"}`}
          >
            {lang === "id" ? "Beranda" : "Home"}
          </button>
          
          <button
            onClick={() => handleTabNavigation("tentang")}
            className={`transition cursor-pointer ${currentTab === "tentang" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 px-1 pb-1 font-bold" : "hover:text-blue-600 dark:hover:text-blue-400"}`}
          >
            {lang === "id" ? "Tentang Kami" : "About Us"}
          </button>

          <button
            onClick={() => handleTabNavigation("kegiatan")}
            className={`transition cursor-pointer ${currentTab === "kegiatan" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 px-1 pb-1 font-bold" : "hover:text-blue-600 dark:hover:text-blue-400"}`}
          >
            {lang === "id" ? "Kegiatan" : "Activities"}
          </button>

          <button
            onClick={() => handleTabNavigation("kontak")}
            className={`transition cursor-pointer ${currentTab === "kontak" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 px-1 pb-1 font-bold" : "hover:text-blue-600 dark:hover:text-blue-400"}`}
          >
            {lang === "id" ? "Kontak & Donasi" : "Contact & Support"}
          </button>
        </nav>

        {/* Desktop Controls (Translation, Theme, Portal) */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Translation Button Selector */}
          <button
            onClick={() => setLang(lang === "id" ? "en" : "id")}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-slate-800 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-bold transition text-gray-700 dark:text-gray-300 cursor-pointer shadow-xs"
            title={lang === "id" ? "Switch to English" : "Ubah ke Bahasa Indonesia"}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span>{lang === "id" ? "EN / ID" : "ID / EN"}</span>
          </button>

          {/* Dark Theme toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 border border-gray-200 dark:border-slate-800 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-350 transition cursor-pointer shadow-xs"
            title={isDark ? "Mode Terang" : "Mode Gelap"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          <button
            onClick={() => handleTabNavigation("kontak")}
            className="px-5 py-2 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-955/35 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 fill-current text-rose-500 animate-pulse" />
            {lang === "id" ? "DONASI" : "DONATE"}
          </button>
          
          <button
            onClick={() => handleTabNavigation("admin")}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              currentTab === "admin"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-blue-105 dark:border-slate-700 hover:bg-blue-100 dark:hover:bg-slate-750"
            }`}
            title="Portal Administrator"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu Toggle Hamburger button (or state triggers) */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Theme Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 border border-gray-200 dark:border-slate-800 rounded-full bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 shadow-xs"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-700 dark:text-white hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Dropdown menu with settings */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-blue-50 dark:border-slate-800 px-6 py-5 flex flex-col gap-4 text-xs font-bold tracking-wider text-gray-600 dark:text-gray-300 uppercase shadow-md animate-fade-in transition-colors duration-300">
          <button
            onClick={() => handleTabNavigation("home")}
            className={`text-left py-1 hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer ${currentTab === "home" ? "text-blue-700 pl-2 border-l-4 border-amber-500" : ""}`}
          >
            {lang === "id" ? "Beranda" : "Home"}
          </button>
          
          <button
            onClick={() => handleTabNavigation("tentang")}
            className={`text-left py-1 hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer ${currentTab === "tentang" ? "text-blue-700 pl-2 border-l-4 border-amber-500" : ""}`}
          >
            {lang === "id" ? "Tentang Kami" : "About Us"}
          </button>

          <button
            onClick={() => handleTabNavigation("kegiatan")}
            className={`text-left py-1 hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer ${currentTab === "kegiatan" ? "text-blue-700 pl-2 border-l-4 border-amber-500" : ""}`}
          >
            {lang === "id" ? "Kegiatan" : "Activities"}
          </button>

          <button
            onClick={() => handleTabNavigation("kontak")}
            className={`text-left py-1 hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer ${currentTab === "kontak" ? "text-blue-700 pl-2 border-l-4 border-amber-500" : ""}`}
          >
            {lang === "id" ? "Kontak & Donasi" : "Contact & Support"}
          </button>

          {/* Quick controls in mobile dropdown */}
          <div className="border-t dark:border-slate-850 pt-4 flex items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl">
            <span className="text-gray-400 uppercase font-semibold">{lang === "id" ? "Bahasa:" : "Language:"}</span>
            <button
              onClick={() => setLang(lang === "id" ? "en" : "id")}
              className="flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-blue-600 dark:text-blue-400 text-[11px] font-bold"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === "id" ? "EN (English)" : "ID (Indonesia)"}
            </button>
          </div>

          <div className="border-t dark:border-slate-850 pt-2 flex flex-col gap-2">
            <button
              onClick={() => handleTabNavigation("admin")}
              className={`w-full py-2.5 rounded-xl text-center font-extrabold cursor-pointer transition flex items-center justify-center gap-1.5 ${
                currentTab === "admin"
                  ? "bg-blue-900 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-slate-200 dark:hover:bg-slate-750"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              {lang === "id" ? "Portal Pengurus" : "Staff Portal"}
            </button>
          </div>
        </div>
      )}

      {/* Master Content Area with transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 pt-8 md:pt-10">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {currentTab === "home" && (
            <HomeSection
              stats={stats}
              activities={activities}
              onNavigate={handleTabNavigation}
              onSelectActivity={handleSelectActivity}
              profil={profil}
              lang={lang}
              isDark={isDark}
            />
          )}

          {currentTab === "tentang" && (
            <AboutSection
              profil={profil}
              stats={stats}
              pengurus={pengurus}
              lang={lang}
              isDark={isDark}
            />
          )}

          {currentTab === "kegiatan" && (
            <ActivitiesSection
              activities={activities}
              selectedActivity={selectedActivity}
              onSelectActivity={setSelectedActivity}
              lang={lang}
              isDark={isDark}
            />
          )}

          {currentTab === "kontak" && (
            <ContactSection
              profil={profil}
              rekening={rekening}
              reviews={reviews}
              onUlasanSubmit={loadPublicData}
              lang={lang}
              isDark={isDark}
            />
          )}

          {currentTab === "admin" && (
            <AdminPanel
              onDataRefresh={loadPublicData}
              publicData={{
                kegiatan: activities,
                statistikAnak: stats,
                pengurus: pengurus,
                rekeningDonasi: rekening,
                profilYayasan: profil,
                ulasan: reviews
              }}
              lang={lang}
              isDark={isDark}
            />
          )}
        </motion.div>
      </main>

      {/* Master Footer Section */}
      <footer className="bg-gradient-to-b from-blue-950 to-blue-990 text-white/90 border-t border-blue-950">
        <div className="max-w-7xl w-full mx-auto px-6 md:px-12 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-xs">
          
          {/* Identity Column */}
          <div className="md:col-span-5 space-y-4">
            <div 
              onClick={() => handleTabNavigation("home")}
              className="flex items-center gap-3 cursor-pointer select-none group hover:opacity-90 transition-opacity"
            >
              {profil.logoUrl ? (
                <img 
                  src={profil.logoUrl} 
                  alt="Logo Gelora Kasih" 
                  className="h-8 w-auto max-w-[120px] object-contain group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 bg-amber-500 text-blue-950 font-bold rounded-lg flex items-center justify-center text-base group-hover:scale-105 transition-transform">
                  ✝
                </div>
              )}
              <h4 className="font-extrabold text-white tracking-tight">YAYASAN PANTI ASUHAN GELORA KASIH SIBOLANGIT</h4>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-sm">
              {lang === "id"
                ? "Yayasan Panti Asuhan Kristen Gelora Kasih merupakan lembaga pengasuhan sosial berasas kasih Kristiani, membina masa depan cerah bagi anak yatim, piatu, terlantar secara sah."
                : "The Gelora Kasih Christian Orphanage Foundation is a social care institution founded on Christian love, nurturing a bright future for orphans and neglected children."}
            </p>
            
            {/* Live DB Social Media Icons */}
            <div className="flex gap-3 text-white">
              {profil.facebookUrl && (
                <a
                  href={profil.facebookUrl}
                  target="_blank"
                  rel="no-referrer"
                  className="p-2 bg-white/10 hover:bg-white/20 hover:text-amber-300 rounded-lg transition"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {profil.instagramUrl && (
                <a
                  href={profil.instagramUrl}
                  target="_blank"
                  rel="no-referrer"
                  className="p-2 bg-white/10 hover:bg-white/20 hover:text-amber-300 rounded-lg transition"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profil.youtubeUrl && (
                <a
                  href={profil.youtubeUrl}
                  target="_blank"
                  rel="no-referrer"
                  className="p-2 bg-white/10 hover:bg-white/20 hover:text-amber-300 rounded-lg transition"
                  title="Youtube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs border-b pb-1.5 border-white/10">
              {lang === "id" ? "Navigasi Halaman" : "Page Navigation"}
            </h5>
            <ul className="space-y-2 font-medium text-gray-300 text-[11px]">
              <li>
                <button onClick={() => handleTabNavigation("home")} className="hover:text-amber-300 transition text-left cursor-pointer">
                  {lang === "id" ? "Beranda Website" : "Home Website"}
                </button>
              </li>
              <li>
                <button onClick={() => handleTabNavigation("tentang")} className="hover:text-amber-300 transition text-left cursor-pointer">
                  {lang === "id" ? "Visi, Misi & Pengurus" : "Our Vision, Mission & Board"}
                </button>
              </li>
              <li>
                <button onClick={() => handleTabNavigation("kegiatan")} className="hover:text-amber-300 transition text-left cursor-pointer">
                  {lang === "id" ? "Aktivitas & Berita Panti" : "Orphanage News & Activities"}
                </button>
              </li>
              <li>
                <button onClick={() => handleTabNavigation("kontak")} className="hover:text-amber-300 transition text-left cursor-pointer">
                  {lang === "id" ? "Hubungi Kontak & Donasi" : "Contact & Donations"}
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Address Column */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs border-b pb-1.5 border-white/10">
              {lang === "id" ? "Alamat & Kontak" : "Address & Contact"}
            </h5>
            <div className="space-y-3 font-medium text-gray-300 text-[11px] leading-relaxed">
              <div className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{profil.alamat}</span>
              </div>
              <a 
                href={getWhatsAppUrl(profil.telepon, "Halo, Admin Panti Asuhan Gelora Kasih...")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center hover:text-amber-400 transition-colors cursor-pointer group"
              >
                <Phone className="w-4 h-4 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="flex items-center gap-1.5">
                  {profil.telepon} 
                  <span className="text-[9px] px-1 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded font-bold">WA</span>
                </span>
              </a>
              <a 
                href={`mailto:${profil.email}`}
                className="flex gap-2 items-center hover:text-amber-400 transition-colors cursor-pointer group"
              >
                <Mail className="w-4 h-4 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="break-all">{profil.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Outer bottom copyright with discreet CMS entry */}
        <div className="bg-blue-995/60 py-6 px-6 md:px-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
          <span>&copy; {new Date().getFullYear()} Yayasan Panti Asuhan Kristen Gelora Kasih. {lang === "id" ? "Hak Cipta Dilindungi." : "All Rights Reserved."}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTabNavigation("admin")}
              className="text-gray-400 hover:text-amber-400 transition cursor-pointer flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded border border-white/10"
            >
              <Compass className="w-3.5 h-3.5" /> {lang === "id" ? "Portal System Admin Internal" : "Internal System Admin Portal"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
