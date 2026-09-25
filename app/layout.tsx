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
  fileUrl?: string;
  fileName?: string;
  fileType?: "image" | "file";
  timestamp: string;
}

interface ReportEntry {
  id: string;
  text: string;
  timestamp: string;
}

interface UserPrivateData {
  note: string;
  noteFileUrl?: string;
  noteFileName?: string;
  noteFileType?: "image" | "file";
  currentReport: string;
  reportHistory: ReportEntry[];
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
  const [generalSubTab, setGeneralSubTab] = useState<string>("chat");

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [attachedChatFile, setAttachedChatFile] = useState<{ url: string; name: string; type: "image" | "file" } | null>(null);

  const [userPrivateData, setUserPrivateData] = useState<Record<string, UserPrivateData>>({});

  useEffect(() => {
    const savedChat = localStorage.getItem("n7h_chat_messages");
    if (savedChat) {
      try { setChatMessages(JSON.parse(savedChat)); } catch (e) {}
    }
    const savedPrivate = localStorage.getItem("n7h_private_data");
    if (savedPrivate) {
      try { setUserPrivateData(JSON.parse(savedPrivate)); } catch (e) {}
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
    localStorage.setItem("n7h_private_data", JSON.stringify(userPrivateData));
  }, [userPrivateData]);

  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem("n7h_current_user", JSON.stringify(user));
  };

  const getCurrentPrivateData = (): UserPrivateData => {
    return (
      userPrivateData[currentUser.id] || {
        note: "",
        currentReport: "",
        reportHistory: [],
      }
    );
  };

  const updateCurrentPrivateData = (updates: Partial<UserPrivateData>) => {
    const currentData = getCurrentPrivateData();
    setUserPrivateData((prev) => ({
      ...prev,
      [currentUser.id]: { ...currentData, ...updates },
    }));
  };

  const handleChatFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedChatFile({
        url: event.target?.result as string,
        name: file.name,
        type: isImage ? "image" : "file",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleNoteFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const reader = new FileReader();
    reader.onload = (event) => {
      updateCurrentPrivateData({
        noteFileUrl: event.target?.result as string,
        noteFileName: file.name,
        noteFileType: isImage ? "image" : "file",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = () => {
    if (!newMessageText.trim() && !attachedChatFile) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: newMessageText,
      fileUrl: attachedChatFile?.url,
      fileName: attachedChatFile?.name,
      fileType: attachedChatFile?.type,
      timestamp: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setNewMessageText("");
    setAttachedChatFile(null);
  };

  const handleSaveReportToHistory = () => {
    const data = getCurrentPrivateData();
    if (!data.currentReport.trim()) return;

    const newEntry: ReportEntry = {
      id: Date.now().toString(),
      text: data.currentReport,
      timestamp: new Date().toLocaleString("ar-SA"),
    };

    updateCurrentPrivateData({
      reportHistory: [newEntry, ...data.reportHistory],
      currentReport: "",
    });
  };

  const sortedUsers = [currentUser, ...USERS.filter((u) => u.id !== currentUser.id)];
  const unknownTabs = Array.from({ length: 9 }, (_, i) => `unknown_${i + 1}`);

  return (
    <>
      {/* استدعاء وتفعيل التصميم الداكن الفخم مباشرة */}
      <script src="https://cdn.tailwindcss.com"></script>
      <div dir="rtl" className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 font-sans">
        <div className="max-w-7xl mx-auto">
          
          {/* الهيدر */}
          <header className="flex justify-between items-center mb-8 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md shadow-lg">
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                N7H Toolkit
              </h1>
              <p className="text-slate-400 text-sm mt-1">منصة الأدوات والتواصل المشتركة</p>
            </div>
            <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-2xl">{currentUser.avatar}</span>
              <div className="text-right">
                <div className="font-bold text-slate-100">{currentUser.name}</div>
                <div className="text-xs text-sky-400 font-medium">{currentUser.role}</div>
              </div>
            </div>
          </header>

          {/* التخطيط الرئيسي */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* القائمة الجانبية */}
            <aside className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 h-fit">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">الأقسام والأعضاء</h3>
              
              <button
                onClick={() => setSelectedTab("general")}
                className={`w-full p-3 rounded-xl mb-6 font-bold flex items-center justify-between transition-all ${
                  selectedTab === "general" ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30" : "bg-slate-950 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span>🌐 عام</span>
              </button>

              <h4 className="text-xs text-slate-500 mb-3 font-semibold">الأعضاء (حسابك بالأعلى):</h4>
              <div className="space-y-2">
                {sortedUsers.map((user) => {
                  const isSelected = currentUser.id === user.id && selectedTab === user.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        handleSelectUser(user);
                        setSelectedTab(user.id);
                      }}
                      className={`w-full p-3 rounded-xl border flex justify-between items-center transition-all ${
                        currentUser.id === user.id ? "border-sky-500/50 bg-sky-950/20" : "border-slate-800 bg-slate-950/40"
                      } ${isSelected ? "bg-slate-800 border-sky-400" : "hover:bg-slate-800/60"}`}
                    >
                      <span className="font-medium text-slate-200">{user.avatar} {user.name}</span>
                      {currentUser.id === user.id && (
                        <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full font-semibold">
                          حسابك
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* محتوى الصفحة الرئيسي */}
            <main className="md:col-span-3 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-xl">
              
              {/* قسم عام */}
              {selectedTab === "general" && (
                <div>
                  {/* أزرار التنقل العليا */}
                  <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-800">
                    <button
                      onClick={() => setGeneralSubTab("chat")}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        generalSubTab === "chat"
                          ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20"
                          : "bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      }`}
                    >
                      💬 شات
                    </button>

                    {unknownTabs.map((tabKey, idx) => (
                      <button
                        key={tabKey}
                        onClick={() => setGeneralSubTab(tabKey)}
                        className={`px-3 py-2 rounded-xl text-sm transition-all ${
                          generalSubTab === tabKey
                            ? "bg-sky-500 text-slate-950 font-bold"
                            : "bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        ❓ مجهول {idx + 1}
                      </button>
                    ))}
                  </div>

                  {/* الشات العام */}
                  {generalSubTab === "chat" && (
                    <div>
                      <div className="h-[400px] overflow-y-auto bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-4 space-y-3">
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
                              {msg.fileUrl && (
                                <div className="mt-2">
                                  {msg.fileType === "image" ? (
                                    <img src={msg.fileUrl} alt="مرفق" className="max-w-xs rounded-lg border border-slate-700" />
                                  ) : (
                                    <a href={msg.fileUrl} download={msg.fileName} className="text-sky-400 text-xs hover:underline flex items-center gap-1">
                                      📎 {msg.fileName}
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      {/* إدخال الرسالة */}
                      <div className="flex gap-2 items-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <input type="file" onChange={handleChatFileUpload} className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 max-w-[180px]" />
                        <input
                          type="text"
                          value={newMessageText}
                          onChange={(e) => setNewMessageText(e.target.value)}
                          placeholder="اكتب رسالتك..."
                          className="flex-1 bg-transparent border-0 text-slate-100 placeholder-slate-500 focus:outline-none text-sm px-2"
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <button onClick={handleSendMessage} className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-5 py-2 rounded-lg text-sm transition-all">
                          إرسال
                        </button>
                      </div>
                    </div>
                  )}

                  {/* شاشة جاري البرمجة */}
                  {generalSubTab !== "chat" && (
                    <div className="py-24 text-center bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                      <h2 className="text-2xl font-bold text-sky-400 mb-2">⚙️ جاري البرمجة على السكربت...</h2>
                      <p className="text-slate-500 text-sm">هذا القسم قيد التطوير والتجهيز حالياً وسيتم تفعيله قريباً.</p>
                    </div>
                  )}
                </div>
              )}

              {/* القسم الخاص بالعضو */}
              {selectedTab !== "general" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-3">قسم العضو: {currentUser.name}</h2>
                  
                  {/* 1. الملاحظات */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-sky-500/30">
                    <h3 className="text-md font-bold text-sky-400 mb-1">📌 [الملاحظات]</h3>
                    <p className="text-xs text-slate-500 mb-3">خاص بك فقط، ولا يمكن لأي عضو آخر الاطلاع عليه.</p>
                    <textarea
                      value={getCurrentPrivateData().note}
                      onChange={(e) => updateCurrentPrivateData({ note: e.target.value })}
                      placeholder="اكتب ملاحظاتك الشخصية السرية هنا..."
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 mb-3"
                    />
                    <div>
                      <label className="text-xs text-slate-400 block mb-2">إرفاق صورة أو ملف مع الملاحظة:</label>
                      <input type="file" onChange={handleNoteFileUpload} className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-slate-800 file:text-slate-200" />
                      {getCurrentPrivateData().noteFileUrl && (
                        <div className="mt-3">
                          {getCurrentPrivateData().noteFileType === "image" ? (
                            <img src={getCurrentPrivateData().noteFileUrl} alt="ملاحظة مصورة" className="max-w-xs rounded-lg border border-slate-700" />
                          ) : (
                            <a href={getCurrentPrivateData().noteFileUrl} download={getCurrentPrivateData().noteFileName} className="text-sky-400 text-xs hover:underline">
                              📎 {getCurrentPrivateData().noteFileName}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. كتابة تقرير */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-md font-bold text-slate-200 mb-3">كتابة تقرير</h3>
                    <textarea
                      value={getCurrentPrivateData().currentReport}
                      onChange={(e) => updateCurrentPrivateData({ currentReport: e.target.value })}
                      placeholder="اكتب تفاصيل التقرير..."
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 mb-3"
                    />
                    <button onClick={handleSaveReportToHistory} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all">
                      حفظ التقرير في الأرشيف
                    </button>
                  </div>

                  {/* 3. سجل التقارير */}
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-md font-bold text-slate-200 mb-3">سجل التقارير والأرشيف</h3>
                    {getCurrentPrivateData().reportHistory.length === 0 ? (
                      <p className="text-slate-500 text-sm">لا يوجد أرشيف تقارير سابقة.</p>
                    ) : (
                      <div className="space-y-2">
                        {getCurrentPrivateData().reportHistory.map((entry) => (
                          <div key={entry.id} className="bg-slate-900 p-3 rounded-lg border-r-4 border-emerald-500">
                            <div className="text-[10px] text-slate-500 mb-1">تاريخ ووقت الحفظ: {entry.timestamp}</div>
                            <div className="text-slate-200 text-sm">{entry.text}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

            </main>
          </div>

        </div>
      </div>
    </>
  );
}
