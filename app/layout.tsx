"use client";

import React, { useState, useEffect } from "react";

interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
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
  { id: "n7h", name: "N7H", role: "الأدمن", avatar: "👑" },
  { id: "azzam", name: "عزام", role: "عضو", avatar: "⚡" },
  { id: "rakan", name: "راكان", role: "عضو", avatar: "🛡️" },
  { id: "farraj", name: "فراج", role: "عضو", avatar: "🔥" },
  { id: "mohammed", name: "محمد", role: "عضو", avatar: "🎯" },
  { id: "raad", name: "رعد", role: "عضو", avatar: "⚡" },
];

export default function N7HToolkit() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(USERS[0]);
  const [selectedTab, setSelectedTab] = useState<string>("general");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [userDataMap, setUserDataMap] = useState<Record<string, UserData>>({});

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

  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem("n7h_current_user", JSON.stringify(user));
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

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: newMessageText,
      timestamp: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setNewMessageText("");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-2xl">{currentUser.avatar}</span>
            <div className="text-right">
              <div className="font-bold text-slate-100">{currentUser.name}</div>
              <div className="text-xs text-sky-400 font-medium">{currentUser.role}</div>
            </div>
          </div>

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
                    placeholder="اكتب رسالتك..."
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
                <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-3">قسم العضو: {USERS.find(u => u.id === selectedTab)?.name}</h2>
                
                <div className="bg-slate-950/60 p-4 rounded-xl border border-sky-500/30">
                  <h3 className="text-md font-bold text-sky-400 mb-1">📌 [مهم]</h3>
                  <textarea
                    value={getUserData(selectedTab).note}
                    onChange={(e) => updateUserData(selectedTab, { note: e.target.value })}
                    placeholder="اكتب الملاحظات الملاحظات الهامة هنا..."
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

            <h4 className="text-xs text-slate-500 mb-3 font-semibold">اختر الحساب:</h4>
            <div className="space-y-2">
              {USERS.map((user) => {
                const isCurrent = currentUser.id === user.id;
                const isSelected = selectedTab === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      handleSelectUser(user);
                      setSelectedTab(user.id);
                    }}
                    className={`w-full p-3 rounded-xl border flex justify-between items-center transition-all ${
                      isCurrent ? "border-sky-500/50 bg-sky-950/20" : "border-slate-800 bg-slate-950/40"
                    } ${isSelected ? "bg-slate-800 border-sky-400" : "hover:bg-slate-800/60"}`}
                  >
                    <span className="font-medium text-slate-200">{user.avatar} {user.name}</span>
                    {isCurrent && (
                      <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full font-semibold">
                        حسابك
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}
