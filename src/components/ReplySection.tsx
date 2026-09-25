"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Message } from "@/types";

const EMOJIS = ["❤️", "🥺", "✨", "😂", "🌸", "🦋", "🥰", "🍒"];

interface ReplySectionProps {
  message: Message;
  onReplySaved?: (reply: string, reaction: string) => void;
}

export default function ReplySection({ message, onReplySaved }: ReplySectionProps) {
  const [replyText, setReplyText] = useState(message.reply || "");
  const [selectedEmoji, setSelectedEmoji] = useState(message.reaction || "");
  const [savedReply, setSavedReply] = useState(message.reply || "");
  const [savedReaction, setSavedReaction] = useState(message.reaction || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(!!(message.reply || message.reaction));

  const handleEmojiSelect = async (emoji: string) => {
    const newEmoji = selectedEmoji === emoji ? "" : emoji;
    setSelectedEmoji(newEmoji);
    setSavedReaction(newEmoji);
    try {
      await updateDoc(doc(db, "messages", message.id), {
        reaction: newEmoji,
      });
      if (onReplySaved) {
        onReplySaved(replyText.trim(), newEmoji);
      }
    } catch (error) {
      console.error("Error saving reaction:", error);
    }
  };

  const handleSaveText = async () => {
    if (!replyText.trim()) return;

    setIsSaving(true);
    try {
      await updateDoc(doc(db, "messages", message.id), {
        reply: replyText.trim(),
      });
      setSavedReply(replyText.trim());
      setIsSaved(true);
      if (onReplySaved) {
        onReplySaved(replyText.trim(), selectedEmoji);
      }
    } catch (error) {
      console.error("Error saving reply:", error);
      alert("حصل مشكلة في حفظ الرد يا حبيبتي، جربي تاني 🥺");
    } finally {
      setIsSaving(false);
    }
  };

  const openWhatsApp = () => {
    let text = "";
    if (replyText.trim()) text += replyText.trim();
    if (selectedEmoji) text += (text ? " " : "") + selectedEmoji;
    
    if (!text) return;
    
    const url = `https://wa.me/201270535210?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };



  return (
    <div className="mt-8 pt-8 border-t border-rose/30 flex flex-col gap-6 animate-fade-in-up relative">
      {/* Decorative stars */}
      <div className="absolute top-4 -left-2 text-rose-pale text-xl opacity-60 animate-pulse">✨</div>
      <div className="absolute top-4 -right-2 text-rose-pale text-xl opacity-60 animate-pulse delay-300">✨</div>

      <div className="bg-gradient-to-br from-white/80 to-cream/50 dark:from-[#261738]/80 dark:to-[#1E142B]/60 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-rose/40 dark:border-[#b99ae6]/30 shadow-[0_8px_30px_rgba(142,74,159,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative overflow-hidden">
        
        {/* Subtle inner corner decorations */}
        <div className="absolute top-2 left-2 text-2xl opacity-20">💮</div>
        <div className="absolute bottom-2 right-2 text-2xl opacity-20">🌸</div>

        <h3 className="font-aref text-xl sm:text-2xl text-wine dark:text-[#E0AAEF] flex items-center justify-center gap-2 font-bold mb-5 drop-shadow-sm text-center leading-relaxed">
          <span className="text-3xl">✍️</span>
          <span>اكتبي رد او سيبي ريأكت يا عيون قلبي 🫶🏻</span>
          <span className="text-3xl">✨</span>
        </h3>

        <div className="flex flex-col gap-4 relative z-10">
        {/* Emojis */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start bg-card-bg/40 p-3.5 rounded-2xl border border-rose/20 shadow-inner">
          {EMOJIS.map(emoji => {
            const isSelected = selectedEmoji === emoji;
            return (
              <button
                key={emoji}
                onClick={() => handleEmojiSelect(emoji)}
                className={`text-2xl sm:text-3xl p-2 rounded-xl transition-all duration-300 relative ${isSelected
                  ? 'scale-125 z-10 drop-shadow-[0_0_15px_rgba(255,105,180,0.8)]'
                  : 'opacity-50 hover:opacity-100 hover:scale-110 hover:bg-rose/10'
                  }`}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose-pale to-rose rounded-xl opacity-40 animate-pulse" />
                )}
                <span className="relative z-10">{emoji}</span>
              </button>
            );
          })}
        </div>

        {/* Reply editor */}
        <div className="flex items-center justify-between gap-3 px-1">
          <label htmlFor={`reply-${message.id}`} className="font-markazi text-lg sm:text-xl font-bold text-wine-deep dark:text-[#E0AAEF]">
            اكتبي ردك هنا
          </label>
          <span className="font-markazi text-sm text-text-muted tabular-nums" aria-live="polite">
            {replyText.length} حرف
          </span>
        </div>
        <textarea
          id={`reply-${message.id}`}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="نفسك تقوليلي إيه؟ 🥺"
          dir="rtl"
          aria-label="اكتبي ردك على الرسالة"
          rows={4}
          style={{ minHeight: '132px', maxHeight: '320px' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${Math.min(target.scrollHeight, 320)}px`;
            target.style.overflowY = target.scrollHeight > 320 ? 'auto' : 'hidden';
          }}
          className="w-full p-4 sm:p-5 rounded-2xl border border-rose/35 dark:border-[#b99ae6]/30 font-markazi text-xl bg-white/75 dark:bg-[#1E142B]/75 text-wine-deep dark:text-[#F8F4FF] text-right focus:outline-none focus:ring-2 focus:ring-rose/60 focus:border-rose/60 shadow-inner resize-y overflow-y-auto placeholder:text-wine/45 dark:placeholder:text-[#F8F4FF]/45 transition-all duration-200 leading-relaxed"
        />

        <button
          onClick={handleSaveText}
          disabled={isSaving || !replyText.trim() || replyText.trim() === savedReply}
          className="w-full sm:w-auto self-stretch sm:self-center bg-gradient-to-r from-wine to-wine-deep dark:from-[#b99ae6] dark:to-[#8E4A9F] text-white px-6 py-3 rounded-2xl sm:rounded-full font-markazi text-xl font-bold shadow-[0_4px_15px_rgba(142,74,159,0.3)] hover:shadow-[0_4px_20px_rgba(142,74,159,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isSaving ? "بحفظ ردك الحلو..." : (replyText.trim() === savedReply && replyText.trim() !== "" ? "ردك محفوظ يا قلبي ✨" : "احفظي ردك مع الرسالة دي للأبد ✨")}
        </button>

        {/* WhatsApp Action */}
        {savedReply.trim() !== "" && replyText.trim() === savedReply && (
          <button
            onClick={openWhatsApp}
            className="mt-2 self-start md:self-center flex items-center gap-2 bg-gradient-to-r from-wine/90 to-wine-deep/90 dark:from-[#b99ae6]/20 dark:to-[#8E4A9F]/20 border border-transparent dark:border-[#b99ae6]/30 text-white dark:text-[#F8F4FF] px-6 py-3 rounded-full font-markazi text-xl sm:text-2xl shadow-[0_4px_15px_rgba(142,74,159,0.3)] hover:shadow-[0_4px_25px_rgba(142,74,159,0.5)] transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            <span> ابعتيلي المسدج واتس يا قلبي لو حابة</span>
            <span className="text-2xl">🥰</span>
          </button>
        )}
      </div>
      </div>
    </div>
  );
}
