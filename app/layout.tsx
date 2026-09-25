"use client";

import React, { useState, useEffect } from "react";

interface UserAccount {
  id: string;
  name: string;
  pass: string;
}

interface ReportItem {
  id: string;
  number: number;
  timestamp: string;
}

interface NoteItem {
  id: string;
  text: string;
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderJob?: string;
  text: string;
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
}

const ACCOUNTS: UserAccount[] = [
  { id: "n7h", name: "N7H", pass: "N7HLL" },
  { id: "azzam", name: "عزام", pass: "AZM18" },
  { id: "rakan", name: "راكان", pass: "RKN20" },
  { id: "farraj", name: "فراج", pass: "FRG66" },
  { id: "mohammed", name: "محمد", pass: "M7D9" },
  { id: "raad", name: "رعد", pass: "R3D33" },
];

const JOBS = [
  "الهلال الاحمر",
  "الامن العام",
  "الرقابة و التفتيش",
  "حرس الحدود",
  "كراج الميكانيك",
  "الامن الدبلوماسي",
];

export default function N7HPCPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [showJobMenu, setShowJobMenu] = useState<boolean>(false);

  const [loginAccountId, setLoginAccountId] = useState<string>("n7h");
  const [loginPass, setLoginPass] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  const [activeTab, setActiveTab] = useState<string>("general");
  const [chatSubTab, setChatSubTab] = useState<string>("chat");

  const [reportsMap, setReportsMap] = useState<Record<string, ReportItem[]>>({});
  const [notesMap, setNotesMap] = useState<Record<string, NoteItem[]>>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [inputReportNum, setInputReportNum] = useState<string>("");
  const [reportError, setReportError] = useState<string>("");
  const [noteText, setNoteText] = useState<string>("");
  const [noteFile, setNoteFile] = useState<File | null>(null);

  const [chatText, setChatText] = useState<string>("");
  const [chatFile, setChatFile] = useState<File | null>(null);

  // Audio / Mic / Network State Simulation
  const [micActive, setMicActive] = useState(false);
  const [ping, setPing] = useState(18);

  useEffect(() => {
    const savedUser = localStorage.getItem("n7h_user");
    if (savedUser) try { setCurrentUser(JSON.parse(savedUser)); } catch (e) {}

    const savedJob = localStorage.getItem("n7h_job");
    if (savedJob) setSelectedJob(savedJob);

    const savedReports = localStorage.getItem("n7h_reports_data");
    if (savedReports) try { setReportsMap(JSON.parse(savedReports)); } catch (e) {}

    const savedNotes = localStorage.getItem("n7h_notes_data");
    if (savedNotes) try { setNotesMap(JSON.parse(savedNotes)); } catch (e) {}

    const savedChat = localStorage.getItem("n7h_chat_data");
    if (savedChat) try { setChatMessages(JSON.parse(savedChat)); } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem("n7h_reports_data", JSON.stringify(reportsMap));
  }, [reportsMap]);

  useEffect(() => {
    localStorage.setItem("n7h_notes_data", JSON.stringify(notesMap));
  }, [notesMap]);

  useEffect(() => {
    localStorage.setItem("n7h_chat_data", JSON.stringify(chatMessages));
  }, [chatMessages]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const account = ACCOUNTS.find((a) => a.id === loginAccountId);
    if (account && account.pass === loginPass) {
      setCurrentUser(account);
      localStorage.setItem("n7h_user", JSON.stringify(account));
      setLoginPass("");
      setLoginError("");
    } else {
      setLoginError("كلمة المرور غير صحيحة!");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedJob("");
    localStorage.removeItem("n7h_user");
    localStorage.removeItem("n7h_job");
  };

  const handleSelectJob = (job: string) => {
    setSelectedJob(job);
    localStorage.setItem("n7h_job", job);
    setShowJobMenu(false);
  };

  const handleAddReport = () => {
    if (!currentUser) return;
    const num = parseInt(inputReportNum, 10);
    if (isNaN(num) || num < 0 || num > 100) {
      setReportError("يرجى كتابة رقم صحيح من 0 إلى 100");
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

  const handleAddNote = () => {
    if (!currentUser || (!noteText.trim() && !noteFile)) return;

    let fileUrl: string | undefined;
    let fileName: string | undefined;

    if (noteFile) {
      fileUrl = URL.createObjectURL(noteFile);
      fileName = noteFile.name;
    }

    const newNote: NoteItem = {
      id: Date.now().toString(),
      text: noteText,
      fileUrl,
      fileName,
      timestamp: new Date().toLocaleString("ar-SA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const userNotes = notesMap[currentUser.id] || [];
    setNotesMap({
      ...notesMap,
      [currentUser.id]: [newNote, ...userNotes],
    });
    setNoteText("");
    setNoteFile(null);
  };

  const handleSendMessage = () => {
    if (!currentUser || (!chatText.trim() && !chatFile)) return;

    let fileUrl: string | undefined;
    let fileName: string | undefined;

    if (chatFile) {
      fileUrl = URL.createObjectURL(chatFile);
      fileName = chatFile.name;
    }

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderJob: selectedJob || undefined,
      text: chatText,
      fileUrl,
      fileName,
      timestamp: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatText("");
    setChatFile(null);
  };

  const shareReportToChat = (num: number) => {
    if (!currentUser) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderJob: selectedJob || undefined,
      text: `📢 تم مشاركة تقرير رقم [ ${num} ]`,
      timestamp: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setActiveTab("general");
    setChatSubTab("chat");
  };

  // Login Screen
  if (!currentUser) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              N7H PC TOOLKIT
            </h1>
            <p className="text-slate-400 text-xs mt-1">تسجيل الدخول للنظام الرئيسي</p>
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
                    {acc.name}
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

  const activeAccountReports = reportsMap[activeTab] || [];
  const activeAccountNotes = notesMap[activeTab] || [];
  const latestReport = activeAccountReports[0];

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

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-[#111726] border border-slate-800 rounded-xl px-4 py-1.5 w-80">
          <input
            type="text"
            placeholder="ابحث عن أداة أو اسم..."
            className="bg-transparent text-xs w-full text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Job Selection Menu Button (أعلى يمين/يسار الهيدر) */}
          <div className="relative">
            <button
              onClick={() => setShowJobMenu(!showJobMenu)}
              className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <span>💼 {selectedJob ? selectedJob : "اختر الوظيفه"}</span>
              <span className="text-[10px]">▼</span>
            </button>

            {showJobMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0d1322] border border-slate-800 rounded-xl shadow-2xl p-1 z-50">
                {JOBS.map((job) => (
                  <button
                    key={job}
                    onClick={() => handleSelectJob(job)}
                    className={`w-full text-right px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedJob === job ? "bg-blue-600 text-white font-bold" : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {job}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account Info */}
          <div className="flex items-center gap-2 bg-[#111726] border border-slate-800 px-3 py-1.5 rounded-xl">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-100">{currentUser.name}</div>
              {selectedJob && <div className="text-[10px] text-blue-400">{selectedJob}</div>}
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
        {/* Right Sidebar */}
        <aside className="w-64 bg-[#0b0f19] border-l border-slate-800/80 p-4 flex flex-col gap-2 shrink-0">
          <div className="text-[11px] font-semibold text-slate-500 uppercase px-3 mb-1">الأدوات العامة</div>

          <button
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "general"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold"
                : "text-slate-400 hover:bg-[#111726] hover:text-slate-200"
            }`}
          >
            🌐 <span>عام</span>
          </button>

          <div className="text-[11px] font-semibold text-slate-500 uppercase px-3 mt-4 mb-1">الأعضاء والتقارير</div>

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
                <span>{acc.name}</span>
                {isMe && (
                  <span className="text-[9px] bg-blue-500/30 border border-blue-400/40 text-blue-200 px-1.5 py-0.5 rounded">
                    حسابك
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 bg-[#070a12] p-6 overflow-y-auto">
          {/* GENERAL TAB */}
          {activeTab === "general" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* General Sub Navigation */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
                <button
                  onClick={() => setChatSubTab("chat")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    chatSubTab === "chat"
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
                      onClick={() => setChatSubTab(key)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        chatSubTab === key
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "bg-[#0d1322] text-slate-400 border border-slate-800 hover:bg-[#131b30]"
                      }`}
                    >
                      ⚙️ مجهول {i}
                    </button>
                  );
                })}
              </div>

              {/* Chat Sub-Tab */}
              {chatSubTab === "chat" && (
                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[550px]">
                  <h2 className="text-md font-bold text-slate-200 border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                    <span>💬 الشات العام</span>
                    {selectedJob && <span className="text-xs text-blue-400 font-normal">الوظيفة: {selectedJob}</span>}
                  </h2>

                  <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-[#070a12] rounded-xl border border-slate-800/60 mb-4">
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
                            <span className="font-bold text-xs text-blue-400">
                              {msg.senderName} {msg.senderJob && `[${msg.senderJob}]`}
                            </span>
                            <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                          </div>
                          {msg.text && <p className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">{msg.text}</p>}

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

                  {chatFile && (
                    <div className="mb-2 px-3 py-1 bg-[#111726] border border-slate-800 rounded-lg flex items-center justify-between text-xs text-slate-300">
                      <span>📎 مرفق: {chatFile.name}</span>
                      <button onClick={() => setChatFile(null)} className="text-red-400 text-xs">إلغاء</button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 bg-[#070a12] p-2 rounded-xl border border-slate-800">
                    <label className="cursor-pointer bg-[#111726] hover:bg-slate-800 text-slate-300 p-2 rounded-lg border border-slate-800 transition-all text-xs">
                      📎
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => e.target.files && setChatFile(e.target.files[0])}
                      />
                    </label>

                    <input
                      type="text"
                      value={chatText}
                      onChange={(e) => setChatText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="اكتب رسالتك..."
                      className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-xs focus:outline-none px-2"
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

              {chatSubTab.startsWith("unknown") && (
                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
                  <div className="text-4xl mb-3">🛠️</div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">جاري العمل على السكربت</h3>
                  <p className="text-slate-500 text-xs">هذه الأداة قيد التطوير حالياً.</p>
                </div>
              )}

              {/* Hardware & PC Diagnostics Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-4">
                  <h3 className="text-xs font-bold text-slate-300 mb-3">🔊 اختبار المايك والسماعة</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setMicActive(!micActive)}
                      className={`w-full py-2 rounded-xl text-xs font-bold border transition-all ${
                        micActive ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-[#070a12] border-slate-800 text-slate-400"
                      }`}
                    >
                      {micActive ? "🎙️ المايك شغال (إيقاف)" : "🎙️ فحص المايك"}
                    </button>
                  </div>
                </div>

                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-4">
                  <h3 className="text-xs font-bold text-slate-300 mb-3">🌐 اختبار الشبكة</h3>
                  <div className="flex items-center justify-between bg-[#070a12] p-2.5 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400">Ping الاتصال:</span>
                    <span className="text-xs font-bold text-emerald-400">{ping} ms</span>
                  </div>
                </div>

                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-4">
                  <h3 className="text-xs font-bold text-slate-300 mb-3">🔧 حل مشاكل الكمبيوتر</h3>
                  <p className="text-[11px] text-slate-500">تشخيص أخطاء FPS، المايك، والشاشة السوداء.</p>
                </div>
              </div>
            </div>
          )}

          {/* MEMBER ACCOUNT TAB */}
          {activeTab !== "general" && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Account Header */}
              <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-100">
                    حساب: {ACCOUNTS.find((a) => a.id === activeTab)?.name}
                  </h1>
                  <p className="text-slate-500 text-xs mt-1">
                    {currentUser.id === activeTab ? "قسمك الخاص بالتقارير والملاحظات" : "تتصفح تقارير هذا العضو (قراءة فقط)"}
                  </p>
                </div>

                {/* Big Report Number View (Top Left) */}
                <div className="bg-[#070a12] border border-slate-800 px-5 py-3 rounded-2xl text-left">
                  <div className="text-[10px] text-slate-500 font-medium">التقرير الحالي</div>
                  <div className="text-2xl font-black text-blue-400">
                    تقرير رقم [{latestReport ? latestReport.number : 0}]
                  </div>
                </div>
              </div>

              {/* Main Content Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Right Box: Reports Section */}
                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">📊 تقريري</h3>

                  {/* Input Form (Account Owner Only) */}
                  {currentUser.id === activeTab ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">أدخل رقم التقرير (0 - 100):</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={inputReportNum}
                          onChange={(e) => setInputReportNum(e.target.value)}
                          placeholder="مثال: 50"
                          className="w-full bg-[#070a12] border border-slate-800 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                        />
                        {reportError && <p className="text-red-400 text-[11px] mt-1">{reportError}</p>}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleAddReport}
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-blue-600/20"
                        >
                          تأكيد
                        </button>
                        <button
                          onClick={handleResetReports}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-4 py-2.5 rounded-xl text-xs transition-all"
                        >
                          إعادة تعيين
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs py-2">🔒 لا يمكنك تعديل تقارير هذا الحساب.</p>
                  )}

                  {/* Reports List */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-slate-400">سجل التقارير:</div>
                    {activeAccountReports.length === 0 ? (
                      <div className="text-slate-600 text-xs py-6 text-center">لا توجد تقارير مسجلة.</div>
                    ) : (
                      activeAccountReports.map((item) => (
                        <div key={item.id} className="bg-[#070a12] border border-slate-800/80 p-3 rounded-xl space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-bold text-blue-400">تقرير رقم [{item.number}]</span>
                            <button
                              onClick={() => shareReportToChat(item.number)}
                              className="text-[10px] bg-blue-600/20 border border-blue-500/30 text-blue-300 px-2 py-0.5 rounded-lg hover:bg-blue-600/40"
                            >
                              مشاركة بالشات
                            </button>
                          </div>
                          {/* Timestamp at bottom left */}
                          <div className="text-[10px] text-slate-500 text-leftDir dir-ltr text-left">
                            {item.timestamp}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Left Box: Notes Section */}
                <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex justify-between items-center">
                    <span>📝 الملاحظات</span>
                    {currentUser.id === activeTab && <span className="text-[10px] text-emerald-400">🔒 سرية وخاصة بك</span>}
                  </h3>

                  {currentUser.id === activeTab ? (
                    <div className="space-y-3">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="اكتب ملاحظاتك..."
                        rows={3}
                        className="w-full bg-[#070a12] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />

                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer bg-[#070a12] hover:bg-slate-800 text-slate-300 p-2 rounded-xl border border-slate-800 text-xs">
                          📎 إرفاق ملف/صورة
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => e.target.files && setNoteFile(e.target.files[0])}
                          />
                        </label>
                        {noteFile && <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{noteFile.name}</span>}

                        <button
                          onClick={handleAddNote}
                          className="mr-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all"
                        >
                          حفظ
                        </button>
                      </div>

                      <div className="space-y-2 pt-2">
                        {activeAccountNotes.map((note) => (
                          <div key={note.id} className="bg-[#070a12] border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                            <p className="text-slate-200">{note.text}</p>
                            {note.fileUrl && (
                              <div className="pt-1">
                                {note.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                  <img src={note.fileUrl} alt="note pic" className="max-h-32 rounded border border-slate-700" />
                                ) : (
                                  <a href={note.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-[11px]">
                                    📎 {note.fileName}
                                  </a>
                                )}
                              </div>
                            )}
                            <div className="text-[9px] text-slate-500 text-left">{note.timestamp}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      🔒 هذه الملاحظات سرية ولا يمكن لأحد رؤيتها سوى صاحب الحساب.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
