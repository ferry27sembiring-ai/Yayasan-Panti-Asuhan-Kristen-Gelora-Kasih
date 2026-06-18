/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Heart, BookOpen, ShieldCheck, ArrowRight, Sparkles, Smile } from "lucide-react";
import { Kegiatan, StatistikAnak, ProfilYayasan } from "../types";
import { translateText } from "../translation";

interface HomeSectionProps {
  stats: StatistikAnak;
  activities: Kegiatan[];
  onNavigate: (tab: string) => void;
  onSelectActivity: (activity: Kegiatan) => void;
  profil: ProfilYayasan;
  lang?: "id" | "en";
  isDark?: boolean;
}

export default function HomeSection({ stats, activities, onNavigate, onSelectActivity, profil, lang = "id", isDark = false }: HomeSectionProps) {
  // Get latest 2 activities for preview
  const recentActivities = activities.slice(0, 2);
  const t = (txt: string) => translateText(txt, lang);

  return (
    <div id="home-section" className="space-y-16 pb-12 transition-colors duration-300">
      {/* Hero Banner Section */}
      <section id="hero" className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 bg-blue-600 text-white min-h-[380px] md:min-h-[440px] flex items-center">
        {/* Sleek image backdrop with modern blend-mode for standard professional feel */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-700/95 via-blue-600/90 to-blue-500/40 z-10" />
        <img
          src={profil.heroBgUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80"}
          alt="Anak-anak Panti Asuhan Bersukacita"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        
        <div className="relative w-full z-20 px-6 sm:px-12 md:px-16 py-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl space-y-5"
          >
            {(profil.heroBadge || "Membangun Harapan Baru — Berasaskan Kasih") && (
              <span className="inline-block px-3 py-1 bg-blue-500/50 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {t(profil.heroBadge || "Membangun Harapan Baru — Berasaskan Kasih")}
              </span>
            )}
            
            <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              {t(profil.heroTitle || "Wujudkan Masa Depan Cerah bagi Anak Bangsa")}
            </h2>
            
            <p className="text-blue-100 text-xs md:text-sm leading-relaxed max-w-lg">
              {t(profil.heroDescription || "Selamat datang di Yayasan Panti Asuhan Kristen Gelora Kasih. Memberikan perlindungan, pendidikan, asrama sehat, dan kasih sayang yang berpusat pada nilai-nilai Kristiani bagi anak-anak yang membutuhkan.")}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="btn-nav-donasi"
                onClick={() => onNavigate("kontak")}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                {t("Donasi Sekarang")}
              </button>
              <button
                id="btn-nav-kegiatan"
                onClick={() => onNavigate("tentang")}
                className="px-6 py-2.5 bg-white text-blue-700 font-bold rounded-xl text-xs hover:bg-blue-50 transition-all cursor-pointer shadow-sm"
              >
                {lang === "id" ? "Lihat Profil Kami" : "View Our Profile"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Core statistics panel */}
      <section id="quick-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-900/60 p-6 rounded-2xl border border-blue-100 dark:border-slate-800 flex items-center gap-5 shadow-xs">
          <div className="p-4 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 rounded-xl">
            <Smile className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-blue-900 dark:text-white">{stats.total}</div>
            <div className="text-sm font-medium text-blue-700 dark:text-blue-400">{t("Total Anak")}</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50/50 to-white dark:from-slate-900 dark:to-slate-900/60 p-6 rounded-2xl border border-amber-100 dark:border-slate-800 flex items-center gap-5 shadow-xs">
          <div className="p-4 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-blue-900 dark:text-white">
              {Object.entries(stats)
                .filter(([key]) => !["total", "lakiLaki", "perempuan"].includes(key))
                .reduce((acc, [_, val]) => acc + (Number(val) || 0), 0)}
            </div>
            <div className="text-sm font-medium text-amber-700 dark:text-amber-400">
              {lang === "id" ? "Dalam Jenjang Sekolah" : "Currently in Education"}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50/50 to-white dark:from-slate-900 dark:to-slate-900/60 p-6 rounded-2xl border border-teal-100 dark:border-slate-800 flex items-center gap-5 shadow-xs">
          <div className="p-4 bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-blue-900 dark:text-white">100%</div>
            <div className="text-sm font-medium text-teal-700 dark:text-teal-400">
              {lang === "id" ? "Transparansi Laporan" : "Transparent Accounts"}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Why Gelora Kasih */}
      <section id="values-bento" className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {lang === "id" ? "Pilar Pembinaan Karakter Kami" : "Our Character Building Pillars"}
          </h2>
          <div className="h-1 w-20 bg-amber-500 mx-auto rounded-full" />
          <p className="text-gray-600 dark:text-gray-450 max-w-xl mx-auto text-sm">
            {lang === "id" 
              ? "Kami tidak hanya memberikan tempat berteduh, tetapi berfokus pada perkembangan fisik, akademis, spiritual, dan emosional anak."
              : "We don't just provide standard shelter, but rather focus fully on the physical, academic, spiritual, and emotional development of each child."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow duration-200 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-955/40 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {lang === "id" ? "Kasih Kristus Seyogianya" : "Christlike Love First"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {lang === "id"
                ? "Membangun fondasi iman yang teguh melalui ibadah harian, doa bersama, dan pembinaan karakter rohani Kristiani yang penuh cinta damai."
                : "Building a solid foundation of faith through daily fellowship sessions, communal prayer, and nurturing peaceful Christian morals."}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow duration-200 text-center space-y-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-955/40 text-blue-500 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("Pendidikan Tanpa Batas")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {lang === "id"
                ? "Mengharuskan dan membiayai seluruh anak asuh menempuh jalur sekolah formal, kursus bahasa inggris, keterampilan komputer, dan musik."
                : "Empowering and funding all our children through formal schooling, professional English courses, computing skills, and music classes."}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow duration-200 text-center space-y-4">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-955/40 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("Akuntabilitas & Integritas")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {lang === "id"
                ? "Seluruh arus dana donasi, bantuan sembako, dan pengeluaran pendidikan dikelola secara terbuka dan dapat dipantau oleh para simpatisan."
                : "All donor funding, food contributions, and educational expenditures are managed with absolute transparency and monitored openly."}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Activities Section */}
      <section id="home-activities" className="space-y-6">
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {lang === "id" ? "Aktivitas & Kabar Terbaru" : "Latest Updates & Activities"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-450">
              {t("Kabar terbaru, sukacita, perayaan rohani, kunjungan kasih, dan kegiatan sehari-hari di asrama.")}
            </p>
          </div>
          <button
            onClick={() => onNavigate("kegiatan")}
            className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-semibold transition-colors duration-200 cursor-pointer"
          >
            {lang === "id" ? "Lihat Semua Berita" : "View All Updates"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer"
              onClick={() => onSelectActivity(act)}
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={act.foto}
                  alt={act.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-blue-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                  {new Date(act.tanggal).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-white dark:bg-slate-900">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {lang === "id" ? act.judul : (act.judulEn || act.judul)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                    {lang === "id" ? act.deskripsi : (act.deskripsiEn || act.deskripsi)}
                  </p>
                </div>
                <div className="text-blue-600 dark:text-blue-400 font-semibold text-xs flex items-center gap-1 group-hover:underline">
                  {lang === "id" ? "Baca Selengkapnya" : "Read Full Story"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Invitation to visit */}
      <section id="invitation-banner" className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-8 md:p-12 text-center text-white space-y-6 shadow-lg relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight max-w-xl mx-auto">
          {lang === "id" ? "Ingin Berkunjung atau Beribadah Bersama Anak-Anak?" : "Want to Visit or Hold Fellowship with Our Children?"}
        </h2>
        <p className="text-blue-100/90 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          {lang === "id"
            ? "Pintu asrama kami selalu terbuka lebar bagi siapapun yang rindu membagikan senyuman, kasih, maupun firman Tuhan secara langsung di Sibolangit. Hubungi pengurus asrama terlebih dahulu untuk menjadwalkan kunjungan kasih Anda."
            : "The doors of our dormitory are always wide open for those who long to share a smile, love, or the Word of God directly with the children in Sibolangit. Please contact our dormitory team beforehand to schedule."}
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate("kontak")}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold rounded-xl shadow-md transition-transform duration-200 cursor-pointer active:scale-95 inline-flex items-center gap-2 text-xs"
          >
            {lang === "id" ? "Hubungi Pengurus / Cari Lokasi" : "Contact Staff / View Directions"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
