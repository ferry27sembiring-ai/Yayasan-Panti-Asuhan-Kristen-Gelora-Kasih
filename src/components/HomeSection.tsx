/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Heart, BookOpen, ShieldCheck, ArrowRight, Sparkles, Smile } from "lucide-react";
import { Kegiatan, StatistikAnak, ProfilYayasan } from "../types";

interface HomeSectionProps {
  stats: StatistikAnak;
  activities: Kegiatan[];
  onNavigate: (tab: string) => void;
  onSelectActivity: (activity: Kegiatan) => void;
  profil: ProfilYayasan;
}

export default function HomeSection({ stats, activities, onNavigate, onSelectActivity, profil }: HomeSectionProps) {
  // Get latest 2 activities for preview
  const recentActivities = activities.slice(0, 2);

  return (
    <div id="home-section" className="space-y-16 pb-12">
      {/* Hero Banner Section */}
      <section id="hero" className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 bg-blue-600 text-white min-h-[380px] md:min-h-[440px] flex items-center">
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
                {profil.heroBadge || "Membangun Harapan Baru — Berasaskan Kasih"}
              </span>
            )}
            
            <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              {profil.heroTitle || "Wujudkan Masa Depan Cerah bagi Anak Bangsa"}
            </h2>
            
            <p className="text-blue-100 text-xs md:text-sm leading-relaxed max-w-lg">
              {profil.heroDescription || "Selamat datang di Yayasan Panti Asuhan Kristen Gelora Kasih. Memberikan perlindungan, pendidikan, asrama sehat, dan kasih sayang yang berpusat pada nilai-nilai Kristiani bagi anak-anak yang membutuhkan."}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="btn-nav-donasi"
                onClick={() => onNavigate("kontak")}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-650 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                Donasi Sekarang
              </button>
              <button
                id="btn-nav-kegiatan"
                onClick={() => onNavigate("tentang")}
                className="px-6 py-2.5 bg-white text-blue-700 font-bold rounded-xl text-xs hover:bg-blue-50 transition-all cursor-pointer shadow-sm"
              >
                Lihat Profil Kami
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Core statistics panel */}
      <section id="quick-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100 flex items-center gap-5 shadow-xs">
          <div className="p-4 bg-blue-100 text-blue-700 rounded-xl">
            <Smile className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-blue-900">{stats.total}</div>
            <div className="text-sm font-medium text-blue-700">Anak Asuh Dibimbing</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50/50 to-white p-6 rounded-2xl border border-amber-100 flex items-center gap-5 shadow-xs">
          <div className="p-4 bg-amber-100 text-amber-600 rounded-xl">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-blue-900">
              {Object.entries(stats)
                .filter(([key]) => !["total", "lakiLaki", "perempuan"].includes(key))
                .reduce((acc, [_, val]) => acc + (Number(val) || 0), 0)}
            </div>
            <div className="text-sm font-medium text-amber-700">Dalam Jenjang Sekolah</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50/50 to-white p-6 rounded-2xl border border-teal-100 flex items-center gap-5 shadow-xs">
          <div className="p-4 bg-teal-100 text-teal-600 rounded-xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-blue-900">100%</div>
            <div className="text-sm font-medium text-teal-700">Transparansi Laporan</div>
          </div>
        </div>
      </section>

      {/* Core Values / Why Gelora Kasih */}
      <section id="values-bento" className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Pilar Pembinaan Karakter Kami
          </h2>
          <div className="h-1 w-20 bg-amber-500 mx-auto rounded-full" />
          <p className="text-gray-600 max-w-xl mx-auto text-sm">
            Kami tidak hanya memberikan tempat berteduh, tetapi berfokus pada perkembangan fisik, akademis, spiritual, dan emosional anak.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow duration-200 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Kasih Kristus Seyogianya</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Membangun fondasi iman yang teguh melalui ibadah harian, doa bersama, dan pembinaan karakter rohani Kristiani yang penuh cinta damai.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow duration-200 text-center space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Pendidikan Tanpa Batas</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Mengharuskan dan membiayai seluruh anak asuh menempuh jalur sekolah formal, kursus bahasa inggris, keterampilan komputer, dan musik.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow duration-200 text-center space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Akuntabilitas & Integritas</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Seluruh arus dana donasi, bantuan sembako, dan pengeluaran pendidikan dikelola secara terbuka dan dapat dipantau oleh para simpatisan.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Activities Section */}
      <section id="home-activities" className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">Aktivitas & Kabar Terbaru</h2>
            <p className="text-sm text-gray-500">Melihat sukacita dan perkembangan rohani-sosial anak asuh sehari-hari</p>
          </div>
          <button
            onClick={() => onNavigate("kegiatan")}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors duration-200 cursor-pointer"
          >
            Lihat Semua Berita
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group cursor-pointer"
              onClick={() => onSelectActivity(act)}
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={act.foto}
                  alt={act.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-blue-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                  {new Date(act.tanggal).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors">
                    {act.judul}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {act.deskripsi}
                  </p>
                </div>
                <div className="text-blue-600 font-semibold text-xs flex items-center gap-1 group-hover:underline">
                  Baca Selengkapnya
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
          Ingin Berkunjung atau Beribadah Bersama Anak-Anak?
        </h2>
        <p className="text-blue-100/90 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Pintu asrama kami selalu terbuka lebar bagi siapapun yang rindu membagikan senyuman, kasih, maupun firman Tuhan secara langsung di Sibolangit. Hubungi pengurus asrama terlebih dahulu untuk menjadwalkan kunjungan kasih Anda.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate("kontak")}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold rounded-xl shadow-md transition-transform duration-200 cursor-pointer active:scale-95 inline-flex items-center gap-2"
          >
            Hubungi Pengurus / Cari Lokasi
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
