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
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(!!(message.reply || message.reaction));

  const handleSave = async () => {
    if (!replyText.trim() && !selectedEmoji) return;

    setIsSaving(true);
    try {
      await updateDoc(doc(db, "messages", message.id), {
        reply: replyText.trim(),
        reaction: selectedEmoji,
      });
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
    const text = `حبيبي، أنا رديت على رسالة يوم ${message.date}:\n\n${replyText}\n\n${selectedEmoji}`;
    const url = `https://wa.me/201270535210?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (isSaved && !isSaving && (message.reply || replyText || message.reaction || selectedEmoji)) {
    return (
      <div className="mt-8 pt-6 border-t border-rose/30 flex flex-col gap-4 animate-fade-in-up">
        <h3 className="font-aref text-xl text-wine dark:text-[#F8F4FF] flex items-center gap-2 drop-shadow-sm">
          <span className="text-2xl">💌</span> ردك الجميل متسجل:
        </h3>
        {(!replyText && !message.reply) && (selectedEmoji || message.reaction) ? (
          <div className="flex justify-center my-4">
            <div className="text-6xl sm:text-7xl drop-shadow-[0_0_20px_rgba(255,105,180,0.6)] animate-bounce-slow">
              {selectedEmoji || message.reaction}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-rose-pale/80 to-white/90 dark:from-[#2A1B3D]/90 dark:to-[#1F162B]/90 border border-rose/40 dark:border-[#b99ae6]/40 p-4 sm:p-5 rounded-2xl shadow-[0_4px_15px_rgba(142,74,159,0.15)] relative">
            <div className="font-markazi text-xl sm:text-2xl text-wine-deep dark:text-[#F8F4FF] leading-relaxed whitespace-pre-wrap">
              {replyText || message.reply}
            </div>
            {(selectedEmoji || message.reaction) && (
              <div className="absolute -top-4 -right-4 text-4xl sm:text-5xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] animate-bounce-slow z-10">
                {selectedEmoji || message.reaction}
              </div>
            )}
          </div>
        )}
        <button
          onClick={openWhatsApp}
          className="mt-2 self-start md:self-center flex items-center gap-2 bg-gradient-to-r from-wine/90 to-wine-deep/90 dark:from-[#b99ae6]/20 dark:to-[#8E4A9F]/20 border border-transparent dark:border-[#b99ae6]/30 text-white dark:text-[#F8F4FF] px-6 py-3 rounded-full font-markazi text-xl sm:text-2xl shadow-[0_4px_15px_rgba(142,74,159,0.3)] hover:shadow-[0_4px_25px_rgba(142,74,159,0.5)] transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
        >
          <span> ابعتيلي المسدج واتس يا قلبي لو حابة</span>
          <span className="text-2xl">🥰</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-rose/30 flex flex-col gap-5 animate-fade-in-up">
      <h3 className="font-aref text-xl md:text-2xl text-wine dark:text-[#F8F4FF] flex items-center gap-2 font-bold">
        <span>✍️</span> اكتبيلي رد أو سيبيلي رياكت هنا:
      </h3>

      <div className="flex flex-col gap-4">
        {/* Emojis */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start bg-card-bg/40 p-3.5 rounded-2xl border border-rose/20 shadow-inner">
          {EMOJIS.map(emoji => {
            const isSelected = selectedEmoji === emoji;
            return (
              <button
                key={emoji}
                onClick={() => setSelectedEmoji(isSelected ? "" : emoji)}
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

        {/* Text Area */}
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="نفسك تقوليلي إيه؟ 🥺"
          rows={1}
          style={{ minHeight: '60px' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
          className="w-full p-4 rounded-2xl border border-rose/30 font-markazi text-xl bg-white/60 dark:bg-[#1E142B]/60 text-wine-deep dark:text-[#F8F4FF] focus:outline-none focus:ring-2 focus:ring-rose/50 shadow-inner resize-none overflow-hidden placeholder:text-wine/40 dark:placeholder:text-[#F8F4FF]/40 transition-all duration-300 leading-relaxed"
        />

        {/* Save Action */}
        <button
          onClick={handleSave}
          disabled={isSaving || (!replyText.trim() && !selectedEmoji)}
          className="bg-gradient-to-r from-wine to-wine-deep dark:from-[#b99ae6] dark:to-[#8E4A9F] text-white px-6 py-3 rounded-full font-markazi text-xl font-bold shadow-[0_4px_15px_rgba(142,74,159,0.3)] hover:shadow-[0_4px_20px_rgba(142,74,159,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isSaving ? "بحفظ ردك الحلو..." : "احفظي ردك مع الرسالة دي للأبد ✨"}
        </button>
      </div>
    </div>
  );
}
