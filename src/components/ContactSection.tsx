/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MapPin, Phone, Mail, CreditCard, Copy, Check, Heart, MailOpen, Landmark, ExternalLink, HelpCircle, Star, MessageSquare, Send, Calendar } from "lucide-react";
import { ProfilYayasan, RekeningDonasi, Review, getWhatsAppUrl } from "../types";

interface ContactSectionProps {
  profil: ProfilYayasan;
  rekening: RekeningDonasi[];
  reviews: Review[];
  onUlasanSubmit: () => void;
}

export default function ContactSection({ profil, rekening, reviews, onUlasanSubmit }: ContactSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Review & Testimony States
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      setReviewError("Nama dan ulasan wajib diisi.");
      return;
    }
    setSubmittingReview(true);
    setReviewError("");
    setReviewSuccess(false);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName, rating, comment })
      });
      if (!res.ok) {
        throw new Error("Gagal mengirim ulasan.");
      }
      setReviewSuccess(true);
      setAuthorName("");
      setComment("");
      setRating(5);
      onUlasanSubmit();
      
      // Auto clear success indicator
      setTimeout(() => {
        setReviewSuccess(false);
      }, 5000);
    } catch (err) {
      setReviewError("Gagal mengirim ulasan. Coba beberapa saat lagi.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div id="contact-section" className="space-y-12 pb-12">
      {/* Page Header */}
      <div className="text-center space-y-2 border-b pb-6 border-gray-100">
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-950 flex justify-center items-center gap-2">
          Kontak & Dukungan Donasi
          <Heart className="w-6 h-6 text-rose-500 fill-current animate-pulse" />
        </h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Mendukung masa depan anak asuh kami melalui doa, kunjungan sukarela, dana pendidikan, maupun bantuan kebutuhan pangan harian (Sembako).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Contact Information & Google Maps */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100">
              Informasi Sekretariat
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Alamat Asrama</h4>
                  <p className="text-sm text-gray-800 leading-relaxed font-medium mt-0.5">{profil.alamat}</p>
                </div>
              </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href={getWhatsAppUrl(profil.telepon, "Halo Pengurus Panti Asuhan, saya ingin bertanya mengenai...")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 hover:bg-teal-50/40 p-2 -m-2 rounded-xl transition-colors group cursor-pointer"
                >
                  <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-hover:text-teal-600 transition-colors">Hubungi Kami</h4>
                    <p className="text-sm text-teal-950 leading-relaxed font-bold mt-0.5 flex items-center gap-1.5 flex-wrap">
                      {profil.telepon}
                      <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500 text-white rounded font-bold uppercase tracking-wide">WA</span>
                    </p>
                  </div>
                </a>

                <a 
                  href={`mailto:${profil.email}`}
                  className="flex items-start gap-4 hover:bg-indigo-50/40 p-2 -m-2 rounded-xl transition-colors group cursor-pointer"
                >
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Alamat Email</h4>
                    <p className="text-sm text-indigo-950 leading-relaxed font-bold mt-0.5 break-all">{profil.email}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Integrated Google Maps Iframe */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3">
            <div className="flex justify-between items-center px-2">
              <span className="font-bold text-sm text-gray-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                Lokasi Google Maps
              </span>
              <a
                href={profil.mapsIframe}
                target="_blank"
                rel="no-referrer"
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                Buka Peta Besar
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <div className="rounded-xl overflow-hidden border bg-gray-50">
              <iframe
                title="Peta Lokasi Yayasan Gelora Kasih"
                src={profil.mapsIframe}
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Ulasan Kegiatan & Testimoni Pengunjung */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-5">
            <div className="space-y-1">
              <h3 className="text-sm md:text-base font-extrabold text-blue-950 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-700 hover:scale-110 transition-transform" />
                Cerita Kasih & Ulasan Kegiatan
              </h3>
              <p className="text-[11px] text-gray-400">
                Bagikan kesan, doa, dukungan kasih, atau pengalaman berharga Anda saat berinteraksi atau berkunjung langsung ke panti asuhan kami.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              {/* Form Tulis Ulasan */}
              <div className="bg-gradient-to-br from-blue-50/40 to-indigo-50/20 p-4.5 rounded-xl border border-blue-100/50 space-y-3.5">
                <h4 className="font-bold text-[12px] text-blue-900 border-b pb-1.5 border-blue-100 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current animate-pulse" />
                  Berikan Kesan & Ulasan
                </h4>

                <form onSubmit={handleSubmitReview} className="space-y-3 text-[11px]">
                  {reviewSuccess && (
                     <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 font-semibold leading-normal">
                       Puji Tuhan! Terima kasih atas kesan & ulasan kasih Anda yang sangat berharga bagi kami. Ulasan Anda telah diterbitkan.
                     </div>
                  )}

                  {reviewError && (
                     <div className="p-2 bg-rose-50 text-rose-800 rounded-lg border border-rose-100 font-semibold">
                       {reviewError}
                     </div>
                  )}

                  <div className="space-y-1">
                    <label className="block font-bold text-gray-750 text-gray-700">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Grace Anastasia"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg font-medium focus:ring-1 focus:ring-blue-500 outline-none hover:border-gray-300 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-gray-700">Nilai Pelayanan</label>
                    <div className="flex gap-1 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="cursor-pointer transition-transform duration-100 hover:scale-115 focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= rating 
                                ? "text-amber-400 fill-amber-400" 
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-1.5 font-bold text-amber-600">({rating} / 5)</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-gray-700">Isi Pesan & Kesan</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tuliskan pengalaman kunjungan, kesaksian, saran konstruktif, atau doa dukungan..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg font-medium focus:ring-1 focus:ring-blue-500 outline-none resize-none leading-relaxed hover:border-gray-300 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-350 text-white font-bold rounded-lg cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submittingReview ? "Mengirimkan..." : "Kirim Respon Kasih"}
                  </button>
                </form>
              </div>

              {/* List Ulasan Terdaftar */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center border-b pb-1.5">
                  <h4 className="font-bold text-[12px] text-gray-800 flex items-center gap-1.5">
                    Daftar Ulasan ({reviews?.length || 0})
                  </h4>
                  {reviews && reviews.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-[11px] font-bold text-gray-700">
                        {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} / 5.0
                      </span>
                    </div>
                  )}
                </div>

                {!reviews || reviews.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed text-[11px] border-gray-200">
                    <HelpCircle className="w-5 h-5 mx-auto mb-1.5 text-gray-300" />
                    Belum ada ulasan kegiatan dari pengunjung. Jadilah yang pertama memberikan kesan dukungan!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[355px] overflow-y-auto pr-1.5 custom-scrollbar">
                    {reviews.map((rev) => (
                      <div 
                        key={rev.id} 
                        className="p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-100/80 shadow-[0_1px_5px_-2px_rgba(0,0,0,0.05)] transition-all space-y-1.5 relative overflow-hidden text-[11px]"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-extrabold text-gray-900 block">{rev.authorName}</span>
                            <span className="text-[9px] text-gray-400 font-medium flex items-center gap-0.5">
                              <Calendar className="w-2.5 h-2.5 text-gray-300" />
                              {new Date(rev.createdAt).toLocaleString("id-ID", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </span>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rev.rating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-650 leading-relaxed text-justify italic pl-2 border-l-2 border-blue-200 bg-gray-50/40 py-1 pr-1.5 rounded">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Donation payment details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white p-6 md:p-8 rounded-3xl shadow-lg border border-blue-950 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500 text-blue-950 text-[10px] font-bold rounded-sm uppercase tracking-widest">
                Donasi Edukasi & Sembako
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">Saluran Kasih Rekening Pendanaan</h3>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Salurkan bantuan finansial secara transparan dan aman melalui rekening perbankan resmi atas nama Yayasan berikut:
              </p>
            </div>

            {/* List of dynamic donation accounts */}
            {rekening.length === 0 ? (
              <div className="text-center py-6 text-blue-200/60 font-semibold border-b border-white/10">
                Tidak ada rekening tersedia saat ini.
              </div>
            ) : (
              <div className="space-y-4">
                {rekening.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-white/10 hover:bg-white/15 p-4 rounded-xl border border-white/15 relative space-y-3 transition duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-amber-300" />
                        <span className="text-xs font-bold uppercase text-amber-300 tracking-wider">
                          {rec.bankName}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleCopy(rec.id, rec.accountNumber)}
                        className="p-1.5 hover:bg-white/15 rounded-md text-white/80 hover:text-white transition cursor-pointer"
                        title="Salin Nomor Rekening"
                      >
                        {copiedId === rec.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="text-lg font-bold tracking-wider font-mono text-white">
                        {rec.accountNumber}
                      </div>
                      <div className="text-xs text-blue-200/90 leading-tight">
                        An. <span className="font-semibold">{rec.accountName}</span>
                      </div>
                    </div>
                    
                    {copiedId === rec.id && (
                      <div className="absolute right-3 bottom-2 text-[10px] text-green-300 font-semibold animate-fade-in">
                        No. Rekening berhasil disalin!
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-white/10 space-y-3">
              <span className="text-xs text-blue-200/80 uppercase font-semibold tracking-wider block">
                Prosedur Konfirmasi Donasi:
              </span>
              <p className="text-[11px] text-blue-100/80 leading-relaxed text-justify">
                Setelah mengirimkan dukungan kasih, mohon konfirmasikan donasi Anda dengan mengirimkan foto bukti transfer ke kontak WhatsApp pengurus: <a href={getWhatsAppUrl(profil.telepon, "Shalom, saya ingin mengonfirmasi bukti transfer donasi untuk Panti Asuhan Gelora Kasih...")} target="_blank" rel="noopener noreferrer" className="text-amber-400 font-extrabold hover:underline hover:text-amber-300 transition-colors">{profil.telepon}</a> atau via email: <a href={`mailto:${profil.email}`} className="text-amber-400 font-extrabold hover:underline hover:text-amber-300 transition-colors block sm:inline mt-1 sm:mt-0">{profil.email}</a> demi kelancaran pencatatan laporan kas bulanan. Terima kasih, Tuhan Yesus memberkati!
              </p>
            </div>
          </div>

          {/* Staple Food Supplies / Sembako Donation explanation card */}
          <div className="bg-white p-6 rounded-2xl border border-amber-100/85 hover:border-amber-200 bg-amber-50/20 shadow-xs space-y-4">
            <h4 className="font-extrabold text-blue-950 text-sm flex items-center gap-2">
              <MailOpen className="w-4 h-4 text-amber-600 animate-bounce" />
              {profil.donasiLogistikTitle || "Donasi Paket Logistik Sembako & Pakaian"}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed text-justify">
              {profil.donasiLogistikSubtitle || "Selain tunai, anak-anak asuh membutuhkan bantuan logistik harian seperti:"}
            </p>
            <ul className="text-xs text-gray-700 font-semibold space-y-2 pl-4 list-disc">
              {profil.donasiLogistikItems && profil.donasiLogistikItems.length > 0 ? (
                profil.donasiLogistikItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <>
                  <li>Sembako (Beras, Minyak Goreng, Gula, Susu, Mie Instan, dll).</li>
                  <li>Pakaian ganti harian (anak umur 4 s.d. 18 tahun) yang masih layak pakai.</li>
                  <li>Suku cadang peralatan kebersihan asrama, sabun, odol, detergen.</li>
                  <li>Buku bacaan rohani Kristen, novel edukatif, atau perlengkapan melukis/musik.</li>
                </>
              )}
            </ul>
            <div className="text-[11px] text-gray-500 italic border-t pt-2 mt-2 leading-normal">
              {profil.donasiLogistikShipping || "Barang dapat langsung dikirimkan lewat kurir (J&T, JNE, POS) atau diantar langsung ke alamat panti asuhan Kristen Gelora Kasih di Sibolangit."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
