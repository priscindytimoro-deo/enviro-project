"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle, Share2 } from "lucide-react";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openWhatsApp = () => {
    const phone = "+6282236611208";
    const message = encodeURIComponent(
      "Halo, saya ingin menanyakan tentang Monitor Patuh-LH"
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          text: "Monitor Patuh-LH - DLH TTS",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link berhasil disalin");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">

      {/* SHARE */}
      <button
        onClick={handleShare}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
        title="Share"
      >
        <Share2 size={20} />
      </button>

      {/* WHATSAPP */}
      <button
        onClick={openWhatsApp}
        className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
        title="WhatsApp"
      >
        <MessageCircle size={20} />
      </button>

      {/* BACK TO TOP */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="bg-gray-900 hover:bg-black text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          title="Kembali ke atas"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}