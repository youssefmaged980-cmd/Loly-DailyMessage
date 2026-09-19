"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, doc, deleteDoc, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

interface Message {
  id: string;
  date: string;
  message: string;
  createdAt?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    // Set today's date as default
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);

    const themeAttr = document.documentElement.getAttribute('data-theme');
    if (themeAttr === 'light') {
      setIsDark(false);
    } else if (themeAttr === 'dark') {
      setIsDark(true);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllMessages();
    }
  }, [isAuthenticated]);

  const fetchAllMessages = async () => {
    try {
      const q = query(collection(db, "messages"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const fetched: Message[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Message);
      });
      setAllMessages(fetched);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الرسالة نهائياً؟")) {
      try {
        await deleteDoc(doc(db, "messages", id));
        fetchAllMessages();
      } catch (error) {
        console.error("Error deleting message:", error);
        alert("حدث خطأ أثناء الحذف");
      }
    }
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
    setStatus("جاري الحفظ...");

    try {
      // Always add as a new message so previous messages go to archive rather than being overwritten
      await addDoc(collection(db, "messages"), {
        date,
        message: message.trim(),
        createdAt: new Date().toISOString()
      });
      setStatus("تم نشر الرسالة بنجاح وحفظها! ✅");

      setMessage(""); // Clear message field
      fetchAllMessages();
      setTimeout(() => setStatus(""), 4000);
    } catch (error) {
      console.error("Error saving message:", error);
      setStatus("حدث خطأ أثناء الحفظ! ❌");
    } finally {
      setLoading(false);
    }
  };

  const formatDateArabic = (dateString: string) => {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('ar-EG-u-nu-latn', options);
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const themeName = nextDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeName);
    try {
      localStorage.setItem('theme', themeName);
    } catch (e) {}
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

  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 bg-bg-color">
      {/* Top Bar */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <a
          href="/"
          className="font-markazi text-xl text-wine hover:text-rose transition-colors flex items-center gap-2 bg-card-bg/70 px-4 py-2 rounded-full border border-border-color backdrop-blur-sm no-underline shadow-sm hover:-translate-y-0.5"
        >
          &rarr; عودة للموقع الرئيسي
        </a>

        <button
          onClick={toggleTheme}
          className="bg-card-bg/70 border border-border-color p-2.5 rounded-full text-wine hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-sm flex items-center justify-center w-10 h-10 text-xl"
          title={isDark ? "التبديل إلى الوضع الصباحي (Light Mode) ☀️" : "التبديل إلى الوضع الليلي (Dark Mode) 🌙"}
          aria-label="تبديل المظهر"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Main Form Box */}
      <div className="bg-card-bg/90 p-6 sm:p-8 rounded-3xl shadow-[var(--shadow)] border border-border-color w-full max-w-2xl backdrop-blur-md">
        <div className="border-b border-border-color pb-4 mb-6 flex items-center justify-between">
          <h1 className="font-aref text-2xl sm:text-3xl text-wine font-bold flex items-center gap-3">
            <span>✍️</span>
            <span>كتابة رسالة جديدة لليلى</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-markazi text-xl text-text-main font-semibold flex items-center gap-2">
              <span>📅</span> تاريخ النشر:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-3.5 rounded-xl border border-border-color font-markazi text-xl bg-card-bg/70 text-text-main focus:outline-none focus:ring-2 focus:ring-rose/40 transition-all shadow-inner"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-markazi text-xl text-text-main font-semibold flex items-center gap-2">
              <span>💌</span> نص الرسالة:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك لليلى هنا بكل حب..."
              rows={7}
              className="p-4 rounded-xl border border-border-color font-markazi text-xl bg-card-bg/70 text-text-main focus:outline-none focus:ring-2 focus:ring-rose/40 min-h-[170px] leading-relaxed resize-y scrollbar-timeline transition-all shadow-inner"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-wine to-wine-deep text-paper border-none py-3.5 px-6 rounded-xl font-markazi text-2xl font-bold cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] transition-all disabled:opacity-50 mt-2 shadow-[0_4px_15px_rgba(108,63,160,0.25)]"
          >
            {loading ? "جاري الحفظ والنشر..." : "نشر الرسالة الآن ✨"}
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

      {/* إدارة الرسائل السابقة */}
      <div className="bg-card-bg/90 p-6 sm:p-8 rounded-3xl shadow-[var(--shadow)] border border-border-color w-full max-w-2xl mt-8 backdrop-blur-md">
        <div className="border-b border-border-color pb-4 mb-6 flex items-center justify-between">
          <h2 className="font-aref text-2xl sm:text-3xl text-wine font-bold flex items-center gap-3">
            <span>🗂️</span>
            <span>إدارة الرسائل</span>
          </h2>
          <span className="font-markazi text-lg text-rose bg-wine/10 px-3.5 py-1 rounded-full border border-rose/30">
            {allMessages.length} رسائل مسجلة
          </span>
        </div>

        <div className="flex flex-col gap-3.5 max-h-[55vh] overflow-y-auto pr-1 scrollbar-timeline">
          {allMessages.map(msg => (
            <div 
              key={msg.id} 
              className="border border-border-color p-4 rounded-2xl flex flex-col gap-2.5 bg-card-bg/60 hover:bg-card-bg hover:border-rose/40 transition-all shadow-sm group"
            >
              <div className="flex justify-between items-center border-b border-border-color/60 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-aref text-xl text-wine font-bold">
                    {formatDateArabic(msg.date)}
                  </span>
                  <span className="font-markazi text-sm text-text-muted bg-wine/10 px-2 py-0.5 rounded-md border border-border-color">
                    {msg.date}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3.5 py-1 rounded-xl transition-all font-markazi text-lg border border-red-500/30 flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="حذف هذه الرسالة"
                >
                  <span>🗑️</span>
                  <span>حذف</span>
                </button>
              </div>

              <p className="font-markazi text-text-muted text-lg line-clamp-3 leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </p>
            </div>
          ))}

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
