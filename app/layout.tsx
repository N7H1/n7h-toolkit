"use client";

import React, { useState, useEffect } from "react";

interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  pass: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

interface UserData {
  note: string;
  report: string;
}

const USERS: UserProfile[] = [
  { id: "n7h", name: "N7H", role: "الأدمن", avatar: "👑", pass: "1234" },
  { id: "azzam", name: "عزام", role: "عضو", avatar: "⚡", pass: "1234" },
  { id: "rakan", name: "راكان", role: "عضو", avatar: "🛡️", pass: "1234" },
  { id: "farraj", name: "فراج", role: "عضو", avatar: "🔥", pass: "1234" },
  { id: "mohammed", name: "محمد", role: "عضو", avatar: "🎯", pass: "1234" },
  { id: "raad", name: "رعد", role: "عضو", avatar: "⚡", pass: "1234" },
];

export default function N7HToolkit() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("general");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [userDataMap, setUserDataMap] = useState<Record<string, UserData>>({});

  // Login Modal States
  const [loginModalUser, setLoginModalUser] = useState<UserProfile | null>(null);
  const [inputPassword, setInputPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const savedChat = localStorage.getItem("n7h_chat_messages");
    if (savedChat) {
      try { setChatMessages(JSON.parse(savedChat)); } catch (e) {}
    }
    const savedData = localStorage.getItem("n7h_user_data");
    if (savedData) {
      try { setUserDataMap(JSON.parse(savedData)); } catch (e) {}
    }
    const savedUser = localStorage.getItem("n7h_current_user");
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("n7h_chat_messages", JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem("n7h_user_data", JSON.stringify(userDataMap));
  }, [userDataMap]);

  const handleSelectUserRequest = (user: UserProfile) => {
    if (currentUser?.id === user.id) {
      setSelectedTab(user.id);
      return;
    }
    // فتح نافذة كلمة المرور
    setLoginModalUser(user);
    setInputPassword("");
    setPasswordError("");
  };

  const handleConfirmLogin = () => {
    if (!loginModalUser) return;
    
    if (inputPassword === loginModalUser.pass) {
      setCurrentUser(loginModalUser);
      localStorage.setItem("n7h_current_user", JSON.stringify(loginModalUser));
      setSelectedTab(loginModalUser.id);
      setLoginModalUser(null);
      setInputPassword("");
      setPasswordError("");
    } else {
      setPasswordError("كلمة المرور غير صحيحة!");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("n7h_current_user");
    setSelectedTab("general");
  };

  const getUserData = (userId: string): UserData => {
    return userDataMap[userId] || { note: "", report: "" };
  };

  const updateUserData = (userId: string, updates: Partial<UserData>) => {
    const currentData = getUserData(userId);
    setUserDataMap((prev) => ({
      ...prev,
      [userId]: { ...currentData, ...updates },
    }));
  };

  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;

    const senderName = currentUser ? currentUser.name : "زائر";
    const senderId = currentUser ? currentUser.id : "guest";

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId,
      senderName,
      text: newMessageText,
      timestamp: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setNewMessageText("");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 font-sans relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md shadow-lg">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
                <span className="text-2xl">{currentUser.avatar}</span>
                <div className="text-right">
                  <div className="font-bold text-slate-100">{currentUser.name}</div>
                  <div className="text-xs text-sky-400 font-medium">{currentUser.role}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg transition-all"
              >
                تسجيل الخروج
              </button>
            </div>
          ) : (
            <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-slate-400 text-sm">
              غير مسجل الدخول (زائر)
            </div>
          )}

          <div className="text-center">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              N7H Toolkit
            </h1>
            <p className="text-slate-400 text-sm mt-1">منصة الأدوات والتواصل المشتركة</p>
          </div>
        </header>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Main Content */}
          <main className="md:col-span-3 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-xl">
            
            {/* General Section */}
            {selectedTab === "general" && (
              <div>
                <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-3 mb-4">عام شات</h2>
                
                <div className="h-[420px] overflow-y-auto bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-4 space-y-3">
                  {chatMessages.length === 0 ? (
                    <div className="text-slate-500 text-center mt-40">لا توجد رسائل في الشات العام حالياً.</div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div key={msg.id} className="bg-slate-900 border-r-4 border-sky-500 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sky-400 text-sm">{msg.senderName}</span>
                          <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                        </div>
                        <div className="text-slate-200 text-sm">{msg.text}</div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2 items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder={currentUser ? "اكتب رسالتك..." : "اكتب رسالتك كزائر..."}
                    className="flex-1 bg-transparent border-0 text-slate-100 placeholder-slate-500 focus:outline-none text-sm px-3"
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage} className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-5 py-2 rounded-lg text-sm transition-all">
                    إرسال
                  </button>
                </div>
              </div>
            )}

            {/* User Section */}
            {selectedTab !== "general" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-3">
                  قسم العضو: {USERS.find((u) => u.id === selectedTab)?.name}
                </h2>
                
                <div className="bg-slate-950/60 p-4 rounded-xl border border-sky-500/30">
                  <h3 className="text-md font-bold text-sky-400 mb-1">📌 [مهم]</h3>
                  <textarea
                    value={getUserData(selectedTab).note}
                    onChange={(e) => updateUserData(selectedTab, { note: e.target.value })}
                    placeholder="اكتب الملاحظات الهامة هنا..."
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-md font-bold text-slate-200 mb-3">كتابة تقرير</h3>
                  <textarea
                    value={getUserData(selectedTab).report}
                    onChange={(e) => updateUserData(selectedTab, { report: e.target.value })}
                    placeholder="اكتب تفاصيل التقرير..."
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            )}

          </main>

          {/* Sidebar */}
          <aside className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 h-fit">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">الأقسام والأعضاء</h3>
            
            <button
              onClick={() => setSelectedTab("general")}
              className={`w-full p-3 rounded-xl mb-6 font-bold flex items-center justify-between transition-all ${
                selectedTab === "general" ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30" : "bg-slate-950 text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span>🌐 عام شات</span>
            </button>

            <h4 className="text-xs text-slate-500 mb-3 font-semibold">تسجيل الدخول / اختيار الحساب:</h4>
            <div className="space-y-2">
              {USERS.map((user) => {
                const isCurrent = currentUser?.id === user.id;
                const isSelected = selectedTab === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUserRequest(user)}
                    className={`w-full p-3 rounded-xl border flex justify-between items-center transition-all ${
                      isCurrent ? "border-sky-500/50 bg-sky-950/20" : "border-slate-800 bg-slate-950/40"
                    } ${isSelected ? "bg-slate-800 border-sky-400" : "hover:bg-slate-800/60"}`}
                  >
                    <span className="font-medium text-slate-200">{user.avatar} {user.name}</span>
                    {isCurrent ? (
                      <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full font-semibold">
                        حسابك النشط
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 border border-slate-800 px-2 py-0.5 rounded-full">
                        🔒 دخول
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

        </div>

      </div>

      {/* Login Password Modal */}
      {loginModalUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{loginModalUser.avatar}</span>
              <div>
                <h3 className="text-lg font-bold text-slate-100">تسجيل الدخول: {loginModalUser.name}</h3>
                <p className="text-xs text-slate-400">أدخل كلمة المرور للوصول للحساب</p>
              </div>
            </div>

            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="كلمة المرور..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 mb-2 text-center text-lg"
              onKeyDown={(e) => e.key === "Enter" && handleConfirmLogin()}
              autoFocus
            />

            {passwordError && (
              <p className="text-red-400 text-xs mb-3 text-center">{passwordError}</p>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleConfirmLogin}
                className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl transition-all text-sm"
              >
                تأكيد الدخول
              </button>
              <button
                onClick={() => setLoginModalUser(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2.5 rounded-xl transition-all text-sm"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
