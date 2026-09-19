"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

interface Message {
  id: string;
  date: string;
  message: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Set today's date as default
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
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
    // A simple password for now. The user can change this in the code.
    if (password === "Laila2026") {
      setIsAuthenticated(true);
    } else {
      setStatus("كلمة المرور خاطئة!");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !message) {
      setStatus("يرجى إدخال التاريخ والرسالة!");
      return;
    }

    setLoading(true);
    setStatus("جاري الحفظ...");

    try {
      // Check if a message for this date already exists
      const q = query(collection(db, "messages"), where("date", "==", date));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Update existing message
        const docRef = doc(db, "messages", querySnapshot.docs[0].id);
        await updateDoc(docRef, { message });
        setStatus("تم تحديث رسالة هذا اليوم بنجاح! ✅");
      } else {
        // Create new message
        await addDoc(collection(db, "messages"), {
          date,
          message
        });
        setStatus("تم إضافة رسالة اليوم بنجاح! ✅");
      }

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

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-bg-color">
        <div className="bg-card-bg p-8 rounded-2xl shadow-[var(--shadow)] border border-border-color w-full max-w-md text-center">
          <h1 className="font-aref text-3xl text-wine mb-6">لوحة التحكم السريّة 🔐</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور..."
              className="p-3 rounded-xl border border-border-color text-center font-markazi text-xl bg-bg-color text-text-main focus:outline-none focus:border-rose"
              dir="ltr"
            />
            <button type="submit" className="bg-wine text-paper border-none py-3 px-6 rounded-xl font-markazi text-xl cursor-pointer hover:bg-wine-deep transition-colors">
              دخول
            </button>
            {status && <p className="text-rose font-markazi text-lg mt-2">{status}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-bg-color">
      <div className="bg-card-bg p-8 rounded-2xl shadow-[var(--shadow)] border border-border-color w-full max-w-md">
        <h1 className="font-aref text-3xl text-wine mb-6 text-center">إضافة رسالة جديدة 💌</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-markazi text-xl text-text-main">تاريخ الرسالة:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-3 rounded-xl border border-border-color font-markazi text-xl bg-bg-color text-text-main focus:outline-none focus:border-rose"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-markazi text-xl text-text-main">نص الرسالة:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك لليلى هنا..."
              className="p-3 rounded-xl border border-border-color font-markazi text-xl bg-bg-color text-text-main focus:outline-none focus:border-rose min-h-[150px] resize-y"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-wine text-paper border-none py-3 px-6 rounded-xl font-markazi text-2xl font-bold cursor-pointer hover:bg-wine-deep transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "جاري الحفظ..." : "نشر الرسالة ✨"}
          </button>

          {status && (
            <p className={`font-markazi text-xl text-center mt-2 ${status.includes('خطأ') ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
              {status}
            </p>
          )}
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="font-markazi text-lg text-wine hover:underline">
            &rarr; العودة للموقع
          </a>
        </div>
      </div>
      
      {/* إدارة الرسائل السابقة */}
      <div className="bg-card-bg p-6 rounded-2xl shadow-[var(--shadow)] border border-border-color w-full max-w-md mt-8">
        <h2 className="font-aref text-2xl text-wine mb-4 text-center">إدارة الرسائل 🗂️</h2>
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
          {allMessages.map(msg => (
            <div key={msg.id} className="border border-border-color p-3 rounded-xl flex flex-col gap-2 bg-bg-color/50">
              <div className="flex justify-between items-center border-b border-border-color pb-2">
                <span className="font-markazi text-lg text-wine font-bold">{msg.date}</span>
                <button 
                  onClick={() => handleDelete(msg.id)}
                  className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded-lg transition-colors font-markazi text-lg border border-red-500/30"
                >
                  حذف 🗑️
                </button>
              </div>
              <p className="font-markazi text-text-muted text-lg line-clamp-2 leading-tight">
                {msg.message}
              </p>
            </div>
          ))}
          {allMessages.length === 0 && (
            <p className="text-center font-markazi text-text-muted">لا توجد رسائل حالياً.</p>
          )}
        </div>
      </div>
    </div>
  );
}
