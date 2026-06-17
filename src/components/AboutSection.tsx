/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Users2, GraduationCap, HeartHandshake, Eye, BookOpen, Compass, ShieldUser } from "lucide-react";
import { ProfilYayasan, StatistikAnak, Pengurus } from "../types";

interface AboutSectionProps {
  profil: ProfilYayasan;
  stats: StatistikAnak;
  pengurus: Pengurus[];
}

export default function AboutSection({ profil, stats, pengurus }: AboutSectionProps) {
  // Safe gender percentages calculation
  const totalAnak = stats.total || 1;
  const persentaseLaki = Math.round(((stats.lakiLaki || 0) / totalAnak) * 100);
  const persentasePerempuan = Math.round(((stats.perempuan || 0) / totalAnak) * 100);

  return (
    <div id="about-section" className="space-y-16 pb-12">
      {/* Introduction Sejarah / History */}
      <section id="sejarah" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-full uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            Sejarah Yayasan
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Kasih yang Menggerakkan <br />
            <span className="text-blue-700">Setiap Langkah Kami</span>
          </h2>
          <div className="h-1 w-16 bg-amber-500 rounded-full" />
          
          <p className="text-gray-700 text-sm md:text-base leading-relaxed text-justify">
            {profil.sejarah}
          </p>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-500 to-blue-600 rounded-3xl blur-md opacity-20" />
          <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&auto=format&fit=crop&q=80"
              alt="Anak-anak Belajar Bersama"
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <p className="font-serif italic text-sm text-amber-200">
                &ldquo;Biarlah anak-anak itu datang kepada-Ku, jangan menghalang-halangi mereka, sebab orang-orang yang seperti itulah yang empunya Kerajaan Allah.&rdquo;
              </p>
              <p className="text-xs text-right mt-1 font-semibold">— Markus 10:14</p>
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
            <h3 className="text-xl font-bold tracking-tight">Visi Yayasan</h3>
            <div className="h-0.5 w-12 bg-amber-400" />
            <p className="text-blue-100 text-sm md:text-base leading-relaxed text-left font-medium">
              &ldquo;{profil.visi}&rdquo;
            </p>
          </div>
        </div>

        <div className="md:col-span-7 bg-white p-8 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Misi Yayasan</h3>
            <div className="h-0.5 w-12 bg-blue-600" />
            
            <ul className="space-y-3.5">
              {profil.misi.map((m, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Data & Statistik Anak (Real-time & Dynamic layout) */}
      <section id="statistik-anak-detail" className="bg-gradient-to-br from-blue-50/50 via-teal-50/20 to-white rounded-3xl p-8 md:p-10 border border-blue-100/70 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 font-bold text-xs rounded-full uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            Demografi & Pendidikan
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-950">
            Perkembangan Pendidikan Anak Asuh
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm">
            Saat ini kami mendampingi {stats.total} jiwa anak asuh dengan latar belakang jenjang akademis yang beragam.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Gender Ratio Card */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-blue-100/50 shadow-xs space-y-6">
            <h4 className="font-bold text-gray-800 text-sm tracking-wider uppercase border-b pb-3 border-gray-100">
              Rasio Gender Anak Asuh
            </h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
                  <span>Laki-Laki</span>
                  <span>{stats.lakiLaki} Anak ({persentaseLaki}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${persentaseLaki}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
                  <span>Perempuan</span>
                  <span>{stats.perempuan} Anak ({persentasePerempuan}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${persentasePerempuan}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 rounded-xl p-4 flex items-center gap-3 border border-blue-100/30">
              <Users2 className="w-5 h-5 text-blue-600" />
              <div className="text-xs text-blue-800 leading-relaxed font-medium">
                Pondok asrama laki-laki dan asrama perempuan dikelola secara terpisah dengan pengawasan ketat pendamping asrama.
              </div>
            </div>
          </div>

          {/* Education Stages list */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-blue-100/50 shadow-xs">
            <h4 className="font-bold text-gray-800 text-sm tracking-wider uppercase border-b pb-3 border-gray-100 mb-6 font-sans">
              Jenjang Sekolah Aktif
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(stats)
                .filter(([key]) => !["total", "lakiLaki", "perempuan"].includes(key))
                .map(([key, value], idx) => {
                  const label = key === "belumSekolah" ? "Belum Sekolah" :
                                key === "sd" ? "Sekolah Dasar (SD)" :
                                key === "smp" ? "SMP / Sederajat" :
                                key === "sma" ? "SMA / SMK" :
                                key === "kuliah" ? "Perguruan Tinggi" : key;
                  
                  // Pick color scheme from rotating list
                  const colors = [
                    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", labelText: "text-emerald-800" },
                    { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-100", labelText: "text-cyan-800" },
                    { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100", labelText: "text-indigo-800" },
                    { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100", labelText: "text-purple-800" },
                    { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-100", labelText: "text-pink-800" },
                    { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-100", labelText: "text-sky-800" },
                    { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-100", labelText: "text-teal-800" },
                    { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", labelText: "text-amber-800" }
                  ];
                  const scheme = colors[idx % colors.length];

                  return (
                    <div key={key} className={`p-4 ${scheme.bg} rounded-xl text-center border ${scheme.border} space-y-1 group transition-all duration-300 hover:shadow-xs`}>
                      <span className={`text-2xl font-extrabold ${scheme.text} block transition-transform group-hover:scale-110`}>
                        {Number(value) || 0}
                      </span>
                      <span className={`text-[10px] sm:text-xs font-semibold ${scheme.labelText} uppercase tracking-wider`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-xs text-amber-850 leading-relaxed font-semibold">
                Anak asuh yang cerdas berprestasi dan rindu mengabdi dibiayai penuh untuk melanjutkan pendidikan ke jenjang Sekolah Tinggi Teologia (STT) maupun Universitas lokal Kristen di Sumatera Utara.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Susunan Pengurus / Board Member Profiles */}
      <section id="susunan-pengurus" className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100 text-teal-700 font-bold text-xs rounded-full uppercase tracking-wider">
            <ShieldUser className="w-3.5 h-3.5" />
            Pengurus Yayasan
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Pelayan & Pengurus Kasih
          </h2>
          <div className="h-1 w-20 bg-amber-500 mx-auto rounded-full" />
          <p className="text-gray-600 max-w-xl mx-auto text-sm">
            Mengenal tokoh-tokoh utama yang berjuang keras mengorbankan waktu, tenaga, dan pikiran demi kelangsungan hidup anak-anak panti asuhan.
          </p>
        </div>

        {pengurus.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-medium bg-gray-50 rounded-2xl border">
            Belum ada data pengurus yang ditambahkan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {pengurus.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center p-6 text-center space-y-4"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 shadow-sm relative">
                  <img
                    src={p.foto}
                    alt={p.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-base">{p.nama}</h4>
                  <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-md">
                    {p.jabatan}
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 italic max-w-xs leading-relaxed">
                  {p.caption || "Melayani dengan sukacita dan membela hak-hak hidup masa depan anak binaan asrama."}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
