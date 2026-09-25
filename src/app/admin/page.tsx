"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, addDoc, getDocs, query, doc, deleteDoc, orderBy, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Message } from "@/types";
import { formatDateArabic, getEgyptTodayString } from "@/lib/date";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    setDate(getEgyptTodayString());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllMessages();
    }
  }, [isAuthenticated]);

  const fetchAllMessages = async () => {
    try {
      // Sort by date desc then createdAt desc so multiple same-day messages are ordered correctly
      const q = query(collection(db, "messages"), orderBy("date", "desc"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetched: Message[] = [];
      querySnapshot.forEach((docSnap) => {
        fetched.push({ id: docSnap.id, ...docSnap.data() } as Message);
      });
      setAllMessages(fetched);
    } catch (error) {
      // Fallback: sort only by date if composite index not ready
      try {
        const q = query(collection(db, "messages"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const fetched: Message[] = [];
        querySnapshot.forEach((docSnap) => {
          fetched.push({ id: docSnap.id, ...docSnap.data() } as Message);
        });
        // Sort in memory by date desc, then createdAt desc
        fetched.sort((a, b) => {
          if (b.date !== a.date) return b.date.localeCompare(a.date);
          return (b.createdAt || "").localeCompare(a.createdAt || "");
        });
        setAllMessages(fetched);
      } catch (e) {
        console.error("Error fetching messages:", e);
      }
    }
  };

  const handleDelete = async (msg: Message) => {
    const confirmation = confirm(`هل أنت متأكد من رغبتك في حذف رسالة تاريخ (${formatDateArabic(msg.date)}) نهائياً من قاعدة البيانات السحابية؟`);
    if (confirmation) {
      try {
        await deleteDoc(doc(db, "messages", msg.id));
        fetchAllMessages();
      } catch (error) {
        console.error("Error deleting message:", error);
        alert("حدث خطأ أثناء الحذف");
      }
    }
  };

  const startEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditDate(msg.date);
    setEditTitle(msg.title || "");
    setEditDescription(msg.description || "");
    setEditMessage(msg.message);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDate("");
    setEditTitle("");
    setEditDescription("");
    setEditMessage("");
  };

  const handleSaveEdit = async (msgId: string) => {
    if (!editDate || !editMessage.trim()) return;
    setEditLoading(true);
    try {
      const updateData: Partial<Message> = {
        date: editDate,
        message: editMessage.trim(),
        title: editTitle.trim(),
        description: editDescription.trim(),
      };
      await updateDoc(doc(db, "messages", msgId), updateData);
      setEditingId(null);
      fetchAllMessages();
    } catch (error) {
      console.error("Error updating message:", error);
      alert("حدث خطأ أثناء التعديل");
    } finally {
      setEditLoading(false);
    }
  };

  const handleExportBackup = () => {
    if (allMessages.length === 0) {
      alert("لا توجد رسائل لتنزيلها حالياً");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allMessages, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lolo-messages-backup-${getEgyptTodayString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "laila") {
      setIsAuthenticated(true);
    } else {
      setStatus("كلمة المرور خاطئة!");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !message.trim()) {
      setStatus("يرجى إدخال التاريخ والرسالة!");
      return;
    }

    setLoading(true);
    setStatus("جاري الحفظ في السحابة...");

    try {
      await addDoc(collection(db, "messages"), {
        date,
        title: title.trim() || "",
        description: description.trim() || "",
        message: message.trim(),
        createdAt: new Date().toISOString()
      });
      setStatus("تم نشر الرسالة بنجاح وحفظها في السحابة للأبد! ✅");
      setTitle("");
      setDescription("");
      setMessage("");
      fetchAllMessages();
      setTimeout(() => setStatus(""), 4000);
    } catch (error) {
      console.error("Error saving message:", error);
      setStatus("حدث خطأ أثناء الحفظ! ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-bg-color">
        <div className="bg-card-bg p-8 rounded-3xl shadow-[var(--shadow)] border border-border-color w-full max-w-md text-center backdrop-blur-md">
          <div className="w-16 h-16 bg-wine/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose/30">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="font-aref text-3xl text-wine mb-2 font-bold">لوحة التحكم السريّة</h1>
          <p className="font-markazi text-lg text-text-muted mb-6">أدخل كلمة المرور لإدارة الرسائل اليومية</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور..."
              className="p-3.5 rounded-xl border border-border-color text-center font-markazi text-xl bg-card-bg/60 text-text-main focus:outline-none focus:ring-2 focus:ring-rose/40 transition-all"
              dir="ltr"
              autoFocus
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-wine to-wine-deep text-paper border-none py-3.5 px-6 rounded-xl font-markazi text-2xl font-bold cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              تسجيل الدخول &larr;
            </button>
            {status && <p className="text-rose font-markazi text-xl mt-2">{status}</p>}
          </form>
        </div>
      </div>
    );
  }

  const todayString = getEgyptTodayString();

  return (
    <div className="flex flex-col items-center min-h-screen p-3 sm:p-6 md:p-8 bg-bg-color transition-colors duration-300">
      {/* Top Bar */}
      <div className="w-full max-w-2xl flex justify-between items-center bg-card-bg/80 border border-border-color px-4 py-2.5 rounded-2xl backdrop-blur-md shadow-sm mb-5">
        <Link
          href="/"
          className="font-markazi text-xl text-wine hover:text-rose transition-colors flex items-center gap-2 no-underline"
        >
          <span className="text-base">&rarr;</span>
          <span>عودة للموقع الرئيسي</span>
        </Link>
        <ThemeToggle className="w-9 h-9 text-lg" />
      </div>

      {/* Main Form Box */}
      <div className="bg-card-bg/90 p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl shadow-[var(--shadow)] border border-border-color w-full max-w-2xl backdrop-blur-md">
        <div className="border-b border-border-color/60 pb-3 mb-5 flex items-center justify-between">
          <h1 className="font-aref text-xl sm:text-2xl text-wine font-bold flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-wine/10 dark:bg-wine/25 border border-wine/20 flex items-center justify-center text-base">✍️</span>
            <span>كتابة رسالة جديدة لليلى</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-markazi text-xl text-text-main font-semibold flex items-center gap-2">
              <span>🗓️</span> تاريخ النشر:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-3 rounded-xl border border-border-color font-markazi text-xl bg-card-bg/70 text-text-main focus:outline-none focus:ring-2 focus:ring-rose/40 transition-all shadow-inner w-full"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-markazi text-xl text-text-main font-semibold flex items-center gap-2">
              <span>✨</span> عنوان الزرار الكبير: <span className="text-text-muted text-base">(اختياري)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: بحب افرحك يا لولي"
              className="p-3 rounded-xl border border-border-color font-markazi text-xl bg-card-bg/70 text-text-main focus:outline-none focus:ring-2 focus:ring-rose/40 transition-all shadow-inner w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-markazi text-xl text-text-main font-semibold flex items-center gap-2">
              <span>💬</span> وصف بسيط للرسالة: <span className="text-text-muted text-base">(اختياري)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: يوم غيّر حياتي..."
              className="p-3 rounded-xl border border-border-color font-markazi text-xl bg-card-bg/70 text-text-main focus:outline-none focus:ring-2 focus:ring-rose/40 transition-all shadow-inner w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-markazi text-xl text-text-main font-semibold flex items-center gap-2">
              <span>💌</span> نص الرسالة:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك لليلى هنا بكل حب..."
              rows={6}
              className="p-3.5 sm:p-4 rounded-xl border border-border-color font-markazi text-xl bg-card-bg/70 text-text-main focus:outline-none focus:ring-2 focus:ring-rose/40 min-h-[140px] sm:min-h-[160px] leading-relaxed resize-y scrollbar-timeline transition-all shadow-inner w-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-wine to-wine-deep text-paper border-none py-3 px-6 rounded-xl font-markazi text-2xl font-bold cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] transition-all disabled:opacity-50 mt-1 shadow-[0_4px_15px_rgba(108,63,160,0.25)] flex items-center justify-center gap-2"
          >
            <span>✨</span>
            <span>{loading ? "جاري الحفظ والنشر..." : "نشر الرسالة الآن في السحابة"}</span>
          </button>

          {status && (
            <div className={`p-3 rounded-xl font-markazi text-xl text-center border ${
              status.includes('خطأ') 
                ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                : 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
            }`}>
              {status}
            </div>
          )}
        </form>
      </div>

      {/* Messages Management */}
      <div className="bg-card-bg/90 p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl shadow-[var(--shadow)] border border-border-color w-full max-w-2xl mt-5 sm:mt-6 backdrop-blur-md">
        <div className="border-b border-border-color/60 pb-3 mb-4 sm:mb-5 flex items-center justify-between gap-2 flex-wrap">
          <h2 className="font-aref text-xl sm:text-2xl text-wine font-bold flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-wine/10 dark:bg-wine/25 border border-wine/20 flex items-center justify-center text-base">🗂️</span>
            <span>إدارة الرسائل المحفوظة ({allMessages.length})</span>
          </h2>
          <button
            onClick={handleExportBackup}
            className="font-markazi text-base text-wine dark:text-rose-pale bg-wine/10 dark:bg-rose/15 hover:bg-wine/20 px-3 py-1 rounded-xl border border-wine/20 dark:border-rose/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            title="تنزيل نسخة احتياطية من كل الرسائل"
          >
            <span>💾</span>
            <span>نسخة احتياطية</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pl-1 pr-1 scrollbar-timeline">
          {allMessages.map(msg => {
            const isFuture = msg.date > todayString;
            const isEditing = editingId === msg.id;

            return (
              <div
                key={msg.id}
                className="border border-border-color rounded-2xl bg-card-bg/60 hover:bg-card-bg hover:border-rose/40 transition-all shadow-sm group"
              >
                {isEditing ? (
                  /* ─── EDIT MODE ─── */
                  <div className="p-3 sm:p-4 flex flex-col gap-3">
                    <p className="font-aref text-base text-wine font-bold">تعديل الرسالة:</p>
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="p-2.5 rounded-xl border border-border-color font-markazi text-lg bg-card-bg text-text-main focus:outline-none focus:ring-2 focus:ring-rose/40 w-full"
                    />
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="عنوان الزرار (اختياري)..."
                      className="p-2.5 rounded-xl border border-border-color font-markazi text-lg bg-card-bg text-text-main focus:outline-none focus:ring-2 focus:ring-rose/40 w-full"
                    />
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="وصف بسيط (اختياري)..."
                      className="p-2.5 rounded-xl border border-border-color font-markazi text-lg bg-card-bg text-text-main focus:outline-none focus:ring-2 focus:ring-rose/40 w-full"
                    />
                    <textarea
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      rows={5}
                      className="p-2.5 rounded-xl border border-border-color font-markazi text-lg bg-card-bg text-text-main focus:outline-none focus:ring-2 focus:ring-rose/40 min-h-[120px] resize-y w-full leading-relaxed"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="font-markazi text-base text-text-muted bg-card-bg/60 border border-border-color px-3 py-1.5 rounded-xl hover:bg-card-bg transition-all cursor-pointer"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={() => handleSaveEdit(msg.id)}
                        disabled={editLoading}
                        className="font-markazi text-base text-white bg-gradient-to-r from-wine to-wine-deep px-4 py-1.5 rounded-xl hover:shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                      >
                        <span>💾</span>
                        <span>{editLoading ? "جاري الحفظ..." : "حفظ التعديل"}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ─── VIEW MODE ─── */
                  <div className="p-3 sm:p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-aref text-base sm:text-lg text-wine font-bold whitespace-nowrap">
                            {formatDateArabic(msg.date)}
                          </span>
                          {isFuture && (
                            <span className="font-markazi text-xs text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                              ⏳ مجدولة
                            </span>
                          )}
                        </div>
                        {msg.title && (
                          <span className="font-markazi text-base text-rose dark:text-[#F9C88A] font-semibold truncate">
                            ✨ {msg.title}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => startEdit(msg)}
                          className="bg-wine/10 text-wine hover:bg-wine hover:text-white px-2.5 py-1 rounded-xl transition-all font-markazi text-base border border-wine/30 flex items-center gap-1 cursor-pointer active:scale-95"
                          title="تعديل هذه الرسالة"
                        >
                          <span className="text-sm">✏️</span>
                          <span>تعديل</span>
                        </button>
                        <button
                          onClick={() => handleDelete(msg)}
                          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-2.5 py-1 rounded-xl transition-all font-markazi text-base border border-red-500/30 flex items-center gap-1 cursor-pointer active:scale-95"
                          title="حذف هذه الرسالة"
                        >
                          <span className="text-sm">🗑️</span>
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                    <p className="font-markazi text-text-main/90 text-lg line-clamp-3 leading-relaxed whitespace-pre-wrap select-text">
                      {msg.message}
                    </p>
                    {(msg.reply || msg.reaction) && (
                      <div className="mt-2 bg-wine/5 dark:bg-rose/10 p-2.5 rounded-xl border border-wine/10 dark:border-rose/20 flex justify-between items-start sm:items-center gap-2 flex-col sm:flex-row">
                        <div className="flex flex-col gap-1">
                          {msg.reply && <span className="font-markazi text-wine-deep dark:text-[#E0AAEF] text-lg">💬 {msg.reply}</span>}
                          {msg.reaction && <span className="text-lg">تفاعل: {msg.reaction}</span>}
                        </div>
                        <button
                          onClick={async () => {
                            if (window.confirm("متأكد إنك عاوز تمسح الرد والتفاعل بتوع ليلى على الرسالة دي؟")) {
                              try {
                                const { updateDoc, doc } = await import("firebase/firestore");
                                await updateDoc(doc(db, "messages", msg.id), { reply: "", reaction: "" });
                                fetchAllMessages();
                              } catch(e) { alert("حصل مشكلة في مسح الرد"); }
                            }
                          }}
                          className="text-xs bg-red-500/10 text-red-500 px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors shrink-0 font-markazi"
                        >
                          مسح الرد 🗑️
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {allMessages.length === 0 && (
            <div className="text-center font-markazi text-xl text-text-muted py-8">
              لا توجد رسائل مسجلة حالياً.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
