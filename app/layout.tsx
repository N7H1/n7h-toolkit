"use client";

import React, { useState, useEffect } from "react";

interface UserAccount {
  id: string;
  name: string;
  role: string;
  pass: string;
}

interface ReportItem {
  id: string;
  number: number;
  timestamp: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
}

const ACCOUNTS: UserAccount[] = [
  { id: "n7h", name: "N7H", role: "الأدمن", pass: "N7H5005" },
  { id: "azzam", name: "عزام", role: "عضو", pass: "AZM18" },
  { id: "rakan", name: "راكان", role: "عضو", pass: "RKN20" },
  { id: "farraj", name: "فراج", role: "عضو", pass: "FRG66" },
  { id: "mohammed", name: "محمد", role: "عضو", pass: "M7D9" },
  { id: "raad", name: "رعد", role: "عضو", pass: "R3D33" },
];

export default function N7HPCPage() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [loginAccountId, setLoginAccountId] = useState<string>("n7h");
  const [loginPass, setLoginPass] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  // Navigation state
  const [activeTab, setActiveTab] = useState<string>("general");
  const [subTab, setSubTab] = useState<string>("chat"); // "chat" | "unknown1" .. "unknown5"
  const [memberSubTab, setMemberSubTab] = useState<"reports" | "notes">("reports");

  // Local storage stored data
  const [reportsMap, setReportsMap] = useState<Record<string, ReportItem[]>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Form states
  const [inputReportNum, setInputReportNum] = useState<string>("");
  const [reportError, setReportError] = useState<string>("");
  const [chatText, setChatText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load Initial Data
  useEffect(() => {
    const savedUser = localStorage.getItem("n7h_current_user");
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch (e) {}
    }
    const savedReports = localStorage.getItem("n7h_reports");
    if (savedReports) {
      try { setReportsMap(JSON.parse(savedReports)); } catch (e) {}
    }
    const savedNotes = localStorage.getItem("n7h_notes");
    if (savedNotes) {
      try { setNotesMap(JSON.parse(savedNotes)); } catch (e) {}
    }
    const savedChat = localStorage.getItem("n7h_chat");
    if (savedChat) {
      try { setChatMessages(JSON.parse(savedChat)); } catch (e) {}
    }
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem("n7h_reports", JSON.stringify(reportsMap));
  }, [reportsMap]);

  useEffect(() => {
    localStorage.setItem("n7h_notes", JSON.stringify(notesMap));
  }, [notesMap]);

  useEffect(() => {
    localStorage.setItem("n7h_chat", JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const account = ACCOUNTS.find((a) => a.id === loginAccountId);
    if (account && account.pass === loginPass) {
      setCurrentUser(account);
      localStorage.setItem("n7h_current_user", JSON.stringify(account));
      setLoginPass("");
      setLoginError("");
    } else {
      setLoginError("كلمة المرور غير صحيحة!");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("n7h_current_user");
  };

  // Report logic
  const handleAddReport = () => {
    if (!currentUser) return;
    const num = parseInt(inputReportNum, 10);
    if (isNaN(num) || num < 1 || num > 100) {
      setReportError("الرجاء إدخال رقم صحيح من 1 إلى 100");
      return;
    }
    setReportError("");

    const newReport: ReportItem = {
      id: Date.now().toString(),
      number: num,
      timestamp: new Date().toLocaleString("ar-SA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const userReports = reportsMap[currentUser.id] || [];
    setReportsMap({
      ...reportsMap,
      [currentUser.id]: [newReport, ...userReports],
    });
    setInputReportNum("");
  };

  const handleResetReports = () => {
    if (!currentUser) return;
    setReportsMap({
      ...reportsMap,
      [currentUser.id]: [],
    });
  };

  // Note logic
  const handleNoteChange = (text: string) => {
    if (!currentUser) return;
    setNotesMap({
      ...notesMap,
      [currentUser.id]: text,
    });
  };

  // Chat logic
  const handleSendMessage = () => {
    if (!currentUser || (!chatText.trim() && !selectedFile)) return;

    let fileUrl: string | undefined = undefined;
    let fileName: string | undefined = undefined;

    if (selectedFile) {
      fileUrl = URL.createObjectURL(selectedFile);
      fileName = selectedFile.name;
    }

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: chatText,
      fileUrl,
      fileName,
      timestamp: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatText("");
    setSelectedFile(null);
  };

  // 1. Render Login Form if Not Authenticated
  if (!currentUser) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              N7H PC TOOLKIT
            </h1>
            <p className="text-slate-400 text-xs mt-1">يرجى تسجيل الدخول للوصول إلى أدوات الحساب</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">اختر الحساب:</label>
              <select
                value={loginAccountId}
                onChange={(e) => setLoginAccountId(e.target.value)}
                className="w-full bg-[#070a12] border border-slate-800 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              >
                {ACCOUNTS.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">كلمة المرور:</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="أدخل كلمة المرور..."
                className="w-full bg-[#070a12] border border-slate-800 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {loginError && <p className="text-red-400 text-xs text-center font-medium">{loginError}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all text-sm shadow-lg shadow-blue-600/30"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Current active user's saved data
  const currentReports = reportsMap[currentUser.id] || [];
  const currentNote = notesMap[currentUser.id] || "";

  return (
    <div dir="rtl" className="min-h-screen bg-[#070a12] text-slate-100 font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
            N
          </div>
          <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            N7H <span className="text-xs text-slate-400 font-normal">PC TOOLKIT</span>
          </span>
        </div>

        {/* Search Bar matching design */}
        <div className="hidden md:flex items-center bg-[#111726] border border-slate-800 rounded-xl px-4 py-1.5 w-96">
          <svg className="w-4 h-4 text-slate-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="ابحث عن أداة أو اسم..."
            className="bg-transparent text-xs w-full text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#111726] border border-slate-800 px-3 py-1.5 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 font-bold text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-100">{currentUser.name}</div>
              <div className="text-[10px] text-blue-400">{currentUser.role}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl transition-all"
          >
            خروج
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Right Sidebar - Tools Navigation */}
        <aside className="w-64 bg-[#0b0f19] border-l border-slate-800/80 p-4 flex flex-col gap-2 shrink-0">
          <div className="text-[11px] font-semibold text-slate-500 uppercase px-3 mb-1">الأدوات الرئيسية</div>

          {/* General Tool */}
          <button
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "general"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold"
                : "text-slate-400 hover:bg-[#111726] hover:text-slate-200"
            }`}
          >
            <span className="text-base">🌐</span>
            <span>عام</span>
          </button>

          <div className="text-[11px] font-semibold text-slate-500 uppercase px-3 mt-4 mb-1">الحسابات والأعضاء</div>

          {/* Member Accounts List */}
          {ACCOUNTS.map((acc) => {
            const isActive = activeTab === acc.id;
            const isMe = currentUser.id === acc.id;
            return (
              <button
                key={acc.id}
                onClick={() => setActiveTab(acc.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold"
                    : "text-slate-400 hover:bg-[#111726] hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs">👤</span>
                  <span>{acc.name}</span>
                </div>
                {isMe && (
                  <span className="text-[9px] bg-blue-500/30 border border-blue-400/40 text-blue-200 px-1.5 py-0.5 rounded">
                    حسابك
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 bg-[#070a12] p-6 overflow-y-auto">
          {/* ---------------- GENERAL TOOL TAB ---------------- */}
          {activeTab === "general" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Top Sub-navigation for General Tool */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
                <button
                  onClick={() => setSubTab("chat")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    subTab === "chat"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-[#0d1322] text-slate-400 border border-slate-800 hover:bg-[#131b30]"
                  }`}
                >
                  💬 شات
                </button>
                {[1, 2, 3, 4, 5].map((i) => {
                  const key = `unknown${i}`;
                  return (
                    <button
                      key={key}
                      onClick={() => setSubTab(key)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        subTab === key
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "bg-[#0d1322] text-slate-400 border border-slate-800 hover:bg-[#131b30]"
                      }`}
                    >
                      ⚙️ مجهول {i}
                    </button>
                  );
                })}
              </div>

              {/* Sub-tab 1: CHAT */}
              {subTab === "chat" && (
                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[600px]">
                  <h2 className="text-md font-bold text-slate-200 border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                    <span>💬</span> الشات العام
                  </h2>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-[#070a12] rounded-xl border border-slate-800/60 mb-4">
                    {chatMessages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                        لا توجد رسائل في الشات العام حالياً.
                      </div>
                    ) : (
                      chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-xl border max-w-lg ${
                            msg.senderId === currentUser.id
                              ? "mr-auto bg-blue-950/40 border-blue-800/50 text-slate-100"
                              : "ml-auto bg-[#111726] border-slate-800 text-slate-200"
                          }`}
                        >
                          <div className="flex justify-between items-center gap-4 mb-1">
                            <span className="font-bold text-xs text-blue-400">{msg.senderName}</span>
                            <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                          </div>
                          {msg.text && <p className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">{msg.text}</p>}

                          {/* File Attachment Output */}
                          {msg.fileUrl && (
                            <div className="mt-2 pt-2 border-t border-slate-800">
                              {msg.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <img src={msg.fileUrl} alt="attachment" className="max-h-48 rounded-lg border border-slate-700 object-cover" />
                              ) : (
                                <a
                                  href={msg.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-xs text-blue-400 hover:underline bg-[#070a12] p-2 rounded-lg border border-slate-800"
                                >
                                  📎 {msg.fileName || "تحميل الملف المرفق"}
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Attachment Preview */}
                  {selectedFile && (
                    <div className="mb-2 px-3 py-1.5 bg-[#111726] border border-slate-800 rounded-lg flex items-center justify-between text-xs text-slate-300">
                      <span>📎 المرفق: {selectedFile.name}</span>
                      <button onClick={() => setSelectedFile(null)} className="text-red-400 hover:underline text-xs">
                        إلغاء
                      </button>
                    </div>
                  )}

                  {/* Input Box */}
                  <div className="flex items-center gap-2 bg-[#070a12] p-2 rounded-xl border border-slate-800">
                    <label className="cursor-pointer bg-[#111726] hover:bg-slate-800 text-slate-300 p-2 rounded-lg border border-slate-800 transition-all text-xs flex items-center justify-center">
                      📎
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>

                    <input
                      type="text"
                      value={chatText}
                      onChange={(e) => setChatText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="اكتب رسالتك هنا..."
                      className="flex-1 bg-transparent border-0 text-slate-100 placeholder-slate-500 text-xs focus:outline-none px-2"
                    />

                    <button
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-md shadow-blue-600/30"
                    >
                      إرسال
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-tabs 2-6: UNKNOWN */}
              {subTab.startsWith("unknown") && (
                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
                  <div className="text-4xl mb-3">🛠️</div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">جاري العمل على السكربت</h3>
                  <p className="text-slate-500 text-xs">هذه الأداة قيد التطوير والتحديث وسوف تتاح قريباً.</p>
                </div>
              )}
            </div>
          )}

          {/* ---------------- MEMBER ACCOUNT TABS ---------------- */}
          {activeTab !== "general" && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Account Title Header */}
              <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-100">
                    حساب: {ACCOUNTS.find((a) => a.id === activeTab)?.name}
                  </h1>
                  <p className="text-slate-500 text-xs mt-1">
                    {currentUser.id === activeTab ? "أنت في قسمك الخاص" : "أنت تتصفح هذا القسم كـ زائر / عضو آخر"}
                  </p>
                </div>

                {/* Sub-tools Switcher */}
                <div className="flex bg-[#070a12] p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setMemberSubTab("reports")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      memberSubTab === "reports" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    📊 تقاريري
                  </button>
                  <button
                    onClick={() => setMemberSubTab("notes")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      memberSubTab === "notes" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    📝 الملاحظات
                  </button>
                </div>
              </div>

              {/* 1. REPORTS SUB-TAB */}
              {memberSubTab === "reports" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Right Input Form (Only for account owner) */}
                  <div className="md:col-span-1 bg-[#0d1322] border border-slate-800 rounded-2xl p-5 shadow-lg h-fit">
                    <h3 className="text-sm font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">
                      إضافة تقرير جديد
                    </h3>

                    {currentUser.id === activeTab ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">أدخل رقم التقرير (1 - 100):</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={inputReportNum}
                            onChange={(e) => setInputReportNum(e.target.value)}
                            placeholder="مثال: 45"
                            className="w-full bg-[#070a12] border border-slate-800 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                          />
                          {reportError && <p className="text-red-400 text-[11px] mt-1">{reportError}</p>}
                        </div>

                        <button
                          onClick={handleAddReport}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-blue-600/20"
                        >
                          تأكيد التقرير
                        </button>

                        <button
                          onClick={handleResetReports}
                          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-2 rounded-xl text-xs transition-all mt-2"
                        >
                          إعادة تعيين
                        </button>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-xs text-center py-6">
                        🔒 لا يمكنك إضافة أو تعديل تقارير هذا الحساب (فقط صاحب الحساب يستطيع التحكم).
                      </div>
                    )}
                  </div>

                  {/* Left Output List (Visible) */}
                  <div className="md:col-span-2 bg-[#0d1322] border border-slate-800 rounded-2xl p-5 shadow-lg min-h-[300px]">
                    <h3 className="text-sm font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">
                      سجلات التقارير المرسلة
                    </h3>

                    {currentReports.length === 0 ? (
                      <div className="text-center text-slate-600 text-xs py-16">لا توجد تقارير مسجلة حتى الآن.</div>
                    ) : (
                      <div className="space-y-3">
                        {currentReports.map((item) => (
                          <div
                            key={item.id}
                            className="bg-[#070a12] border border-slate-800/80 p-4 rounded-xl flex justify-between items-center"
                          >
                            <div>
                              <div className="text-sm font-bold text-blue-400">تقرير رقم [{item.number}]</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">التاريخ والوقت: {item.timestamp}</div>
                            </div>
                            <span className="text-xs bg-blue-500/10 border border-blue-500/30 text-blue-300 px-2.5 py-1 rounded-lg">
                              مكتمل
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. NOTES SUB-TAB (Confidential) */}
              {memberSubTab === "notes" && (
                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <h3 className="text-sm font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2 flex items-center justify-between">
                    <span>📝 الملاحظات السرية</span>
                    {currentUser.id === activeTab && <span className="text-[10px] text-emerald-400">🔒 خاصة بك فقط</span>}
                  </h3>

                  {currentUser.id === activeTab ? (
                    <div>
                      <textarea
                        value={currentNote}
                        onChange={(e) => handleNoteChange(e.target.value)}
                        placeholder="اكتب ملاحظاتك الخاصة هنا... (تُحفظ تلقائياً)"
                        rows={8}
                        className="w-full bg-[#070a12] border border-slate-800 rounded-xl p-4 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 leading-relaxed"
                      />
                      <p className="text-[10px] text-slate-500 mt-2">* جميع الملاحظات تنحفظ تلقائياً ولا يستطيع أي شخص آخر رؤيتها.</p>
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-[#070a12] rounded-xl border border-slate-800/60 p-6">
                      <div className="text-3xl mb-2">🔒</div>
                      <h4 className="text-sm font-bold text-slate-300 mb-1">الملاحظات سرية</h4>
                      <p className="text-slate-500 text-xs">لا يمكنك رؤية ملاحظات هذا الحساب لأنها خاصة بصاحب الحساب فقط.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
