/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Search, ArrowRight, X, Image as ImageIcon, Sparkles } from "lucide-react";
import { Kegiatan } from "../types";

interface ActivitiesSectionProps {
  activities: Kegiatan[];
  selectedActivity: Kegiatan | null;
  onSelectActivity: (activity: Kegiatan | null) => void;
}

export default function ActivitiesSection({ activities, selectedActivity, onSelectActivity }: ActivitiesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter activities based on search
  const filteredActivities = activities.filter((act) =>
    act.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    act.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="activities-section" className="space-y-8 pb-12">
      {/* Hero Banner Grid / Search Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b pb-6 border-gray-100">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-950 flex items-center gap-2">
            Dokumentasi & Update Kegiatan
            <Sparkles className="w-5 h-5 text-amber-500 fill-current" />
          </h2>
          <p className="text-sm text-gray-500">Melihat perjalanan kebahagiaan, pertumbuhan rohani & sosial anak-anak kami.</p>
        </div>
        
        {/* Search Input Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari berita atau kegiatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 focus:border-blue-500 focus:outline-hidden rounded-xl shadow-xs transition"
          />
        </div>
      </div>

      {/* Main activities Grid */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 border border-gray-100 rounded-3xl space-y-3">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-semibold text-gray-700 text-lg">Tidak ada kegiatan ditemukan</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">Coba gunakan kata kunci pencarian yang lain atau periksa koneksi Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
              onClick={() => onSelectActivity(act)}
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={act.foto}
                  alt={act.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-blue-900/90 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                  {new Date(act.tanggal).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors">
                    {act.judul}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">
                    {act.deskripsi}
                  </p>
                </div>
                <div className="text-blue-600 font-bold text-xs flex items-center gap-1 group-hover:underline pt-2">
                  Lihat Selengkapnya
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
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col relative"
            >
              <button
                onClick={() => onSelectActivity(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image Header */}
              <div className="relative aspect-video w-full bg-gray-50">
                <img
                  src={selectedActivity.foto}
                  alt={selectedActivity.judul}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent flex items-end p-6">
                  <div className="space-y-1 text-white">
                    <div className="inline-flex items-center gap-1.5 bg-amber-500 text-blue-950 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                      Gelora Kasih Dokumentasi
                    </div>
                    <h2 className="text-lg md:text-xl font-bold tracking-tight">{selectedActivity.judul}</h2>
                  </div>
                </div>
              </div>

              {/* Modal Contents */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 border-b pb-3 border-gray-100">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Diterbitkan pada:</span>
                  <span className="font-semibold text-gray-700">
                    {new Date(selectedActivity.tanggal).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>

                <div className="text-gray-700 text-sm leading-relaxed text-justify whitespace-pre-line">
                  {selectedActivity.deskripsi}
                </div>
              </div>

              {/* Modal Footer signature */}
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center text-xs">
                <span className="text-gray-500 font-semibold uppercase tracking-wider">Panti Asuhan Gelora Kasih</span>
                <button
                  onClick={() => onSelectActivity(null)}
                  className="px-4 py-1.5 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 cursor-pointer"
                >
                  Tutup Artikel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
