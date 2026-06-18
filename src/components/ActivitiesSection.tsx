/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Search, ArrowRight, X, Image as ImageIcon, Sparkles } from "lucide-react";
import { Kegiatan } from "../types";
import { translateText } from "../translation";

interface ActivitiesSectionProps {
  activities: Kegiatan[];
  selectedActivity: Kegiatan | null;
  onSelectActivity: (activity: Kegiatan | null) => void;
  lang?: "id" | "en";
  isDark?: boolean;
}

export default function ActivitiesSection({ activities, selectedActivity, onSelectActivity, lang = "id", isDark = false }: ActivitiesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const t = (txt: string) => translateText(txt, lang);

  // Filter activities based on search
  const filteredActivities = activities.filter((act) => {
    const title = lang === "id" ? act.judul : (act.judulEn || act.judul);
    const desc = lang === "id" ? act.deskripsi : (act.deskripsiEn || act.deskripsi);
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           desc.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div id="activities-section" className="space-y-8 pb-12 transition-colors duration-300">
      {/* Hero Banner Grid / Search Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b pb-6 border-gray-100 dark:border-slate-800">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-950 dark:text-white flex items-center gap-2">
            {lang === "id" ? "Dokumentasi & Kegiatan Panti" : "Orphanage Documentations & News"}
            <Sparkles className="w-5 h-5 text-amber-500 fill-current" />
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {lang === "id" 
              ? "Melihat perjalanan kebahagiaan, pertumbuhan rohani & sosial anak-anak kami." 
              : "Witness the joyful journey, character shaping, and spiritual growth of our boys and girls."}
          </p>
        </div>
        
        {/* Search Input Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={lang === "id" ? "Cari berita atau kegiatan..." : "Search updates or activities..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 focus:border-blue-500 focus:outline-hidden rounded-xl shadow-xs transition text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Main activities Grid */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl space-y-3">
          <ImageIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-lg">
            {lang === "id" ? "Tidak ada kegiatan ditemukan" : "No updates found"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-450 max-w-sm mx-auto">
            {lang === "id" 
              ? "Coba gunakan kata kunci pencarian yang lain atau periksa koneksimu." 
              : "Try using different search keywords or check back later."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
              onClick={() => onSelectActivity(act)}
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={act.foto}
                  alt={lang === "id" ? act.judul : (act.judulEn || act.judul)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-blue-900/90 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                  {new Date(act.tanggal).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3 bg-white dark:bg-slate-900">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {lang === "id" ? act.judul : (act.judulEn || act.judul)}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-3 leading-relaxed">
                    {lang === "id" ? act.deskripsi : (act.deskripsiEn || act.deskripsi)}
                  </p>
                </div>
                <div className="text-blue-600 dark:text-blue-450 font-bold text-xs flex items-center gap-1 group-hover:underline pt-2">
                  {lang === "id" ? "Lihat Selengkapnya" : "Read Full Story"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Details Modal / Detail Overlay */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onSelectActivity(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              // Prevent modal closing when clicking modal card itself
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col relative border dark:border-slate-800"
            >
              <button
                onClick={() => onSelectActivity(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image Header */}
              <div className="relative aspect-video w-full bg-gray-50 dark:bg-slate-950">
                <img
                  src={selectedActivity.foto}
                  alt={lang === "id" ? selectedActivity.judul : (selectedActivity.judulEn || selectedActivity.judul)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent flex items-end p-6">
                  <div className="space-y-1 text-white">
                    <div className="inline-flex items-center gap-1.5 bg-amber-500 text-blue-950 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                      {lang === "id" ? "Dokumentasi Gelora Kasih" : "Gelora Kasih Documentations"}
                    </div>
                    <h2 className="text-lg md:text-xl font-bold tracking-tight">
                      {lang === "id" ? selectedActivity.judul : (selectedActivity.judulEn || selectedActivity.judul)}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Modal Contents */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 border-b pb-3 border-gray-100 dark:border-slate-800">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{lang === "id" ? "Diterbitkan pada:" : "Published on:"}</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {new Date(selectedActivity.tanggal).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>

                <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed text-justify whitespace-pre-line">
                  {lang === "id" ? selectedActivity.deskripsi : (selectedActivity.deskripsiEn || selectedActivity.deskripsi)}
                </div>
              </div>

              {/* Modal Footer signature */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Panti Asuhan Gelora Kasih</span>
                <button
                  onClick={() => onSelectActivity(null)}
                  className="px-4 py-1.5 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 cursor-pointer text-xs"
                >
                  {lang === "id" ? "Tutup Artikel" : "Close Article"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
