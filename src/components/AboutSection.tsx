/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Users2, GraduationCap, HeartHandshake, Eye, BookOpen, Compass, ShieldUser } from "lucide-react";
import { ProfilYayasan, StatistikAnak, Pengurus } from "../types";
import { translateText } from "../translation";

interface AboutSectionProps {
  profil: ProfilYayasan;
  stats: StatistikAnak;
  pengurus: Pengurus[];
  lang?: "id" | "en";
  isDark?: boolean;
}

export default function AboutSection({ profil, stats, pengurus, lang = "id", isDark = false }: AboutSectionProps) {
  const t = (txt: string) => translateText(txt, lang);

  // Safe gender percentages calculation
  const totalAnak = stats.total || 1;
  const persentaseLaki = Math.round(((stats.lakiLaki || 0) / totalAnak) * 100);
  const persentasePerempuan = Math.round(((stats.perempuan || 0) / totalAnak) * 100);

  return (
    <div id="about-section" className="space-y-16 pb-12 transition-colors duration-300">
      {/* Introduction Sejarah / History */}
      <section id="sejarah" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold text-xs rounded-full uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            {t("Sejarah Singkat")}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            {lang === "id" ? "Kasih yang Menggerakkan" : "Love That Drives"} <br />
            <span className="text-blue-700 dark:text-blue-400">{lang === "id" ? "Setiap Langkah Kami" : "Every Step We Take"}</span>
          </h2>
          <div className="h-1 w-16 bg-amber-500 rounded-full" />
          
          <p className="text-gray-700 dark:text-gray-305 text-sm md:text-base leading-relaxed text-justify">
            {t(profil.sejarah)}
          </p>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-500 to-blue-600 rounded-3xl blur-md opacity-20" />
          <div className="relative rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&auto=format&fit=crop&q=80"
              alt="Anak-anak Belajar Bersama"
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <p className="font-serif italic text-sm text-amber-200">
                {lang === "id" 
                  ? "“Biarlah anak-anak itu datang kepada-Ku, jangan menghalang-halangi mereka, sebab orang-orang yang seperti itulah yang empunya Kerajaan Allah.”"
                  : "“Let the little children come to me, and do not hinder them, for the kingdom of God belongs to such as these.”"}
              </p>
              <p className="text-xs text-right mt-1 font-semibold">
                {lang === "id" ? "— Markus 10:14" : "— Mark 10:14"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section id="visi-misi" className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 bg-gradient-to-br from-blue-900 to-blue-950 text-white p-8 rounded-2xl border border-blue-950 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-amber-300">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">{t("Visi")}</h3>
            <div className="h-0.5 w-12 bg-amber-400" />
            <p className="text-blue-100 text-sm md:text-base leading-relaxed text-left font-medium">
              &ldquo;{t(profil.visi)}&rdquo;
            </p>
          </div>
        </div>

        <div className="md:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-955/40 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{t("Misi")}</h3>
            <div className="h-0.5 w-12 bg-blue-600 dark:bg-blue-400" />
            
            <ul className="space-y-3.5">
              {profil.misi.map((m, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{t(m)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Data & Statistik Anak  */}
      <section id="statistik-anak-detail" className="bg-gradient-to-br from-blue-50/50 via-teal-50/20 to-white dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950 rounded-3xl p-8 md:p-10 border border-blue-100/70 dark:border-slate-800/80 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold text-xs rounded-full uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            {lang === "id" ? "Demografi & Pendidikan" : "Demography & Education"}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-950 dark:text-white">
            {t("Statistik Anak Binaan")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm">
            {lang === "id" 
              ? `Saat ini kami mendampingi ${stats.total} jiwa anak asuh dengan latar belakang jenjang akademis yang beragam.`
              : `At the moment we nurture and support ${stats.total} children with various academic backgrounds.`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Gender Ratio Card */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-blue-100/50 dark:border-slate-800 shadow-xs space-y-6">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm tracking-wider uppercase border-b pb-3 border-gray-100 dark:border-slate-800">
              {lang === "id" ? "Rasio Gender Anak Asuh" : "Gender Distribution"}
            </h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  <span>{t("Laki-Laki")}</span>
                  <span>{stats.lakiLaki} {lang === "id" ? "Anak" : "Children"} ({persentaseLaki}%)</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${persentaseLaki}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  <span>{t("Perempuan")}</span>
                  <span>{stats.perempuan} {lang === "id" ? "Anak" : "Children"} ({persentasePerempuan}%)</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${persentasePerempuan}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-990/20 rounded-xl p-4 flex items-center gap-3 border border-blue-100/30 dark:border-slate-800/40">
              <Users2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed font-medium">
                {lang === "id"
                  ? "Pondok asrama laki-laki dan asrama perempuan dikelola secara terpisah dengan pengawasan ketat pendamping asrama."
                  : "Boys and girls dormitories are managed separately under the vigilant supervision of dormitory parent managers."}
              </div>
            </div>
          </div>

          {/* Education Stages list */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-blue-100/50 dark:border-slate-800 shadow-xs">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm tracking-wider uppercase border-b pb-3 border-gray-100 dark:border-slate-800 mb-6 font-sans">
              {lang === "id" ? "Jenjang Sekolah Aktif" : "Active School enrollment"}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(stats)
                .filter(([key]) => !["total", "lakiLaki", "perempuan"].includes(key))
                .map(([key, value], idx) => {
                  const label = key === "belumSekolah" ? "Belum Sekolah" :
                                key === "sd" ? "Pendidikan SD" :
                                key === "smp" ? "Pendidikan SMP" :
                                key === "sma" ? "Pendidikan SMA/SMK" :
                                key === "kuliah" ? "Perguruan Tinggi / Kuliah" : key;
                  
                  // Pick color scheme from rotating list
                  const colors = [
                    { bg: "bg-emerald-50 dark:bg-emerald-955/20", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-900/30", labelText: "text-emerald-800 dark:text-emerald-300" },
                    { bg: "bg-cyan-50 dark:bg-cyan-955/20", text: "text-cyan-700 dark:text-cyan-400", border: "border-cyan-100 dark:border-cyan-900/30", labelText: "text-cyan-800 dark:text-cyan-300" },
                    { bg: "bg-indigo-50 dark:bg-indigo-955/20", text: "text-indigo-700 dark:text-indigo-400", border: "border-indigo-100 dark:border-indigo-900/30", labelText: "text-indigo-800 dark:text-indigo-300" },
                    { bg: "bg-purple-50 dark:bg-purple-955/20", text: "text-purple-700 dark:text-purple-400", border: "border-purple-100 dark:border-purple-900/30", labelText: "text-purple-800 dark:text-purple-300" },
                    { bg: "bg-pink-50 dark:bg-pink-955/20", text: "text-pink-700 dark:text-pink-400", border: "border-pink-100 dark:border-pink-900/30", labelText: "text-pink-800 dark:text-pink-300" },
                    { bg: "bg-sky-50 dark:bg-sky-955/20", text: "text-sky-700 dark:text-sky-400", border: "border-sky-100 dark:border-sky-900/30", labelText: "text-sky-800 dark:text-sky-300" },
                    { bg: "bg-teal-50 dark:bg-teal-955/20", text: "text-teal-700 dark:text-teal-400", border: "border-teal-100 dark:border-teal-900/30", labelText: "text-teal-800 dark:text-teal-300" },
                    { bg: "bg-amber-50 dark:bg-amber-955/20", text: "text-amber-700 dark:text-amber-400", border: "border-amber-100 dark:border-amber-900/30", labelText: "text-amber-800 dark:text-amber-300" }
                  ];
                  const scheme = colors[idx % colors.length];

                  return (
                    <div key={key} className={`p-4 ${scheme.bg} rounded-xl text-center border ${scheme.border} space-y-1 group transition-all duration-300 hover:shadow-xs`}>
                      <span className={`text-2xl font-extrabold ${scheme.text} block transition-transform group-hover:scale-110`}>
                        {Number(value) || 0}
                      </span>
                      <span className={`text-[10px] sm:text-xs font-semibold ${scheme.labelText} uppercase tracking-wider`}>
                        {t(label)}
                      </span>
                    </div>
                  );
                })}
            </div>

            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-990/10 rounded-xl border border-amber-100 dark:border-slate-800/60 flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div className="text-xs text-amber-850 dark:text-amber-300 leading-relaxed font-semibold">
                {lang === "id"
                  ? "Anak asuh yang cerdas berprestasi dan rindu mengabdi dibiayai penuh untuk melanjutkan pendidikan ke jenjang Sekolah Tinggi Teologia (STT) maupun Universitas lokal Kristen di Sumatera Utara."
                  : "Bright academic achievers who long to serve are fully sponsored to pursue higher education at theological seminaries (STT) or top regional Christian universities in North Sumatra."}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Susunan Pengurus / Board Member Profiles */}
      <section id="susunan-pengurus" className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 font-bold text-xs rounded-full uppercase tracking-wider">
            <ShieldUser className="w-3.5 h-3.5" />
            {t("Struktur Kepengurusan")}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {lang === "id" ? "Pelayan & Pengurus Kasih" : "Servants & Officers of Love"}
          </h2>
          <div className="h-1 w-20 bg-amber-500 mx-auto rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm">
            {lang === "id" 
              ? "Mengenal tokoh-tokoh utama yang berjuang keras mengorbankan waktu, tenaga, dan pikiran demi kelangsungan hidup anak-anak panti asuhan."
              : "Acquaint yourself with the core pillars who devote their lives, energy, and wisdom to support our orphanage as peaceful Christian shepherds."}
          </p>
        </div>

        {pengurus.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-medium bg-gray-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-800">
            {t("Belum ada data pengurus yang ditambahkan.")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {pengurus.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center p-6 text-center space-y-4"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 dark:border-slate-850 shadow-sm relative">
                  <img
                    src={p.foto}
                    alt={p.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-base">{p.nama}</h4>
                  <div className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-md">
                    {t(p.jabatan)}
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 italic max-w-xs leading-relaxed">
                  {p.caption ? t(p.caption) : t("Melayani dengan sukacita dan membela hak-hak hidup masa depan anak binaan asrama.")}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
