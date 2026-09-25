"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Lock,
  FileText,
  Send,
  Paperclip,
  Copy,
  Check,
  Terminal,
  User,
  Shield,
  Clock,
  Trash2,
  ChevronRight,
  Sparkles,
  Upload,
  LogOut,
  FolderArchive
} from "lucide-react";

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
  fileUrl?: string;
  fileName?: string;
}

interface UserPrivateData {
  importantNote: string;
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

const COMMANDS_LIST = [
  { label: "فتح شنطة", command: 'bind keyboard "0" "trunk"' },
  { label: "فتح كبوت", command: 'bind keyboard "0" "hood"' },
  { label: "حمل لاعب", command: 'bind keyboard "0" "carry"' },
  { label: "تهديد رهينة", command: 'bind KEYBOARD "0" "takehostage"' },
  { label: "إلغاء الاختصار", command: 'unbind keyboard 0' },
  { label: "يسوي ضغط", command: 'bind keyboard "1" "e pushup"' },
  { label: "اختصار التلفيت", command: 'bind keyboard "0" "quit"' },
  { label: "اختصار التبول", command: 'bind KEYBOARD 8 "e pee"' },
  { label: "اختصار الانبطاح", command: 'bind KEYBOARD 4 "e passout"' },
  { label: "اختصار التصبيع", command: 'bind KEYBOARD 7 "e finger2"' },
  { label: "اختصار الحبتين (1)", command: 'bind keyboard "Z" "e peace"' },
  { label: "اختصار فتح الكبوت (2)", command: 'bind keyboard "1" "Hood"' },
  { label: "اختصار فتح الشنطة (2)", command: 'bind keyboard "2" "Trunk"' },
  { label: "اختصار تصفير", command: 'bind keyboard 0 "e whistle"' },
  { label: "اختصار الصفعة", command: 'bind keyboard 0 "e slap"' },
  { label: "اختصار الانبطاح (2)", command: 'bind keyboard 0 "e prone"' },
  { label: "اختصار جلوس تصوير", command: 'bind keyboard 0 "e amsitpost"' },
  { label: "اختصار الحبتين (2)", command: 'bind keyboard 0 "e vsign"' },
  { label: "اختصار الحضن", command: 'bind keyboard 0 "e hug"' },
  { label: "اختصار السيلفي", command: 'bind keyboard 0 "e selfie4"' },
  { label: "اختصار التحية", command: 'bind keyboard "q" "e salute"' },
];

export default function N7HToolkit() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("general");
  const [generalSubTab, setGeneralSubTab] = useState<"chat" | "commands">("chat");

  // Chat States
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [attachedFile, setAttachedFile] = useState<{ url: string; name: string; type: "image" | "file" } | null>(null);

  // User Private Data States
  const [userPrivateData, setUserPrivateData] = useState<Record<string, UserPrivateData>>({});

  // UI States
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Load Initial Data from LocalStorage
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
    } else {
      setCurrentUser(USERS[0]);
    }
  }, []);

  // Save Chat to LocalStorage
  useEffect(() => {
    localStorage.setItem("n7h_chat_messages", JSON.stringify(chatMessages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Save Private Data to LocalStorage
  useEffect(() => {
    localStorage.setItem("n7h_private_data", JSON.stringify(userPrivateData));
  }, [userPrivateData]);

  // Handle Login / Switch User
  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem("n7h_current_user", JSON.stringify(user));
  };

  // Get current logged-in user private data
  const getCurrentPrivateData = (): UserPrivateData => {
    if (!currentUser) return { importantNote: "", currentReport: "", reportHistory: [] };
    return (
      userPrivateData[currentUser.id] || {
        importantNote: "",
        currentReport: "",
        reportHistory: [],
      }
    );
  };

  const updateCurrentPrivateData = (updates: Partial<UserPrivateData>) => {
    if (!currentUser) return;
    const currentData = getCurrentPrivateData();
    const updated = { ...currentData, ...updates };
    setUserPrivateData((prev) => ({
      ...prev,
      [currentUser.id]: updated,
    }));
  };

  // Handle File Upload Simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedFile({
        url: event.target?.result as string,
        name: file.name,
        type: isImage ? "image" : "file",
      });
    };
    reader.readAsDataURL(file);
  };

  // Send Chat Message
  const handleSendMessage = () => {
    if ((!newMessageText.trim() && !attachedFile) || !currentUser) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: newMessageText,
      fileUrl: attachedFile?.url,
      fileName: attachedFile?.name,
      fileType: attachedFile?.type,
      timestamp: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setNewMessageText("");
    setAttachedFile(null);
  };

  // Save Report to History
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

  // Copy Command Handler
  const handleCopyCommand = (commandText: string, index: number) => {
    navigator.clipboard.writeText(commandText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Sort users so current user appears first
  const sortedUsers = React.useMemo(() => {
    if (!currentUser) return USERS;
    return [currentUser, ...USERS.filter((u) => u.id !== currentUser.id)];
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans dir-rtl" dir="rtl">
      {/* Top Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-extrabold text-xl shadow-lg shadow-cyan-500/20">
            N7H
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              N7H Toolkit
            </h1>
            <p className="text-xs text-slate-400">منصة الأدوات والتواصل المشتركة</p>
          </div>
        </div>

        {/* Current Active User Profile Bar */}
        {currentUser && (
          <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 px-4 py-2 rounded-2xl backdrop-blur-sm">
            <span className="text-2xl">{currentUser.avatar}</span>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-200 flex items-center gap-1">
                {currentUser.name}
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-normal">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">حساب نشط حالياً</p>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Right Sidebar (Users Navigation) */}
        <aside className="w-72 bg-slate-900/50 border-l border-slate-800/60 p-4 flex flex-col gap-3 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
            الأعضاء والأقسام
          </div>

          {/* General Tab */}
          <button
            onClick={() => setSelectedTab("general")}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
              selectedTab === "general"
                ? "bg-gradient-to-r from-cyan-600/30 to-blue-600/20 border-cyan-500/50 text-cyan-200 shadow-lg shadow-cyan-500/10"
                : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/50 text-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                🌐
              </div>
              <span className="font-bold text-sm">العام</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform ${selectedTab === "general" ? "rotate-90 text-cyan-400" : "text-slate-500"}`} />
          </button>

          <div className="h-px bg-slate-800/80 my-2" />

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
            اختيار الحساب (النشط بالأعلى)
          </div>

          {/* Users List (Current user appears on top) */}
          {sortedUsers.map((user) => {
            const isCurrent = currentUser?.id === user.id;
            const isSelected = selectedTab === user.id;

            return (
              <button
                key={user.id}
                onClick={() => {
                  handleSelectUser(user);
                  setSelectedTab(user.id);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 backdrop-blur-sm ${
                  isCurrent
                    ? "bg-slate-800/80 border-cyan-500/40 text-slate-100 shadow-md ring-1 ring-cyan-500/20"
                    : isSelected
                    ? "bg-slate-800/50 border-slate-700 text-slate-200"
                    : "bg-slate-900/30 border-slate-800/60 hover:bg-slate-800/40 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{user.avatar}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      {user.name}
                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="متواجد حالياً" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">{user.role}</span>
                  </div>
                </div>
                {isCurrent && (
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                    حسابك
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Main Workspace Content */}
        <main className="flex-1 bg-slate-950 p-6 overflow-y-auto flex flex-col">
          {/* GENERAL SECTION */}
          {selectedTab === "general" && (
            <div className="flex-1 flex flex-col gap-4">
              {/* General Sub-Tabs (Chat vs Commands) */}
              <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 w-fit backdrop-blur-sm">
                <button
                  onClick={() => setGeneralSubTab("chat")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    generalSubTab === "chat"
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  الشات العام
                </button>
                <button
                  onClick={() => setGeneralSubTab("commands")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    generalSubTab === "commands"
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  الأوامر
                </button>
              </div>

              {/* Chat Tab View */}
              {generalSubTab === "chat" && (
                <div className="flex-1 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-4 flex flex-col justify-between backdrop-blur-md shadow-inner">
                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto space-y-4 p-2 max-h-[calc(100vh-280px)]">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-slate-500 py-16">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">لا توجد رسائل في الشات العام بعد.</p>
                      </div>
                    ) : (
                      chatMessages.map((msg) => {
                        const isMe = msg.senderId === currentUser?.id;
                        return (
                          <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            <div className="flex items-center gap-2 mb-1 text-xs text-slate-400 px-1">
                              <span className="font-bold text-slate-300">{msg.senderName}</span>
                              <span>•</span>
                              <span>{msg.timestamp}</span>
                            </div>
                            <div
                              className={`max-w-lg p-3.5 rounded-2xl text-sm border shadow-md space-y-2 ${
                                isMe
                                  ? "bg-cyan-600/20 border-cyan-500/40 text-cyan-50 rounded-br-none"
                                  : "bg-slate-800/80 border-slate-700/60 text-slate-200 rounded-bl-none"
                              }`}
                            >
                              {msg.text && <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>}
                              {msg.fileUrl && (
                                <div className="mt-2 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950/40 p-2">
                                  {msg.fileType === "image" ? (
                                    <img src={msg.fileUrl} alt="صورة مرفقة" className="max-h-60 rounded-lg object-contain w-full" />
                                  ) : (
                                    <a
                                      href={msg.fileUrl}
                                      download={msg.fileName}
                                      className="flex items-center gap-2 text-cyan-400 hover:underline text-xs"
                                    >
                                      <Paperclip className="w-4 h-4" />
                                      {msg.fileName || "تحميل الملف المرفق"}
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Attached File Preview */}
                  {attachedFile && (
                    <div className="flex items-center justify-between bg-slate-800/80 border border-cyan-500/30 p-2.5 rounded-xl mb-3 text-xs text-cyan-300">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        <span>تم إرفاق: {attachedFile.name}</span>
                      </div>
                      <button onClick={() => setAttachedFile(null)} className="text-rose-400 hover:text-rose-300 font-bold">
                        إلغاء
                      </button>
                    </div>
                  )}

                  {/* Message Input Box */}
                  <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-2 rounded-2xl">
                    <input
                      type="file"
                      ref={(ref) => setFileInputRef(ref)}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef?.click()}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                      title="إرفاق صورة أو ملف"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="اكتب رسالتك في الشات العام..."
                      className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition shadow-lg shadow-cyan-500/20"
                    >
                      <Send className="w-4 h-4" />
                      إرسال
                    </button>
                  </div>
                </div>
              )}

              {/* Commands Tab View */}
              {generalSubTab === "commands" && (
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-100">أوامر واختصارات FiveM السريعة</h2>
                      <p className="text-xs text-slate-400">اضغط على زر النسخ لاستخدام الأمر مباشرة في اللعبة</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {COMMANDS_LIST.map((cmd, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/30 transition group backdrop-blur-sm"
                      >
                        <div className="space-y-1">
                          <span className="text-xs text-slate-400 font-medium">{cmd.label}</span>
                          <p className="font-mono text-sm text-cyan-300 dir-ltr text-right">{cmd.command}</p>
                        </div>
                        <button
                          onClick={() => handleCopyCommand(cmd.command, idx)}
                          className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                            copiedIndex === idx
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                          }`}
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              تم النسخ!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              نسخ
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* USER SPECIFIC PRIVATE SECTION */}
          {selectedTab !== "general" && (
            <div className="space-y-6">
              {/* Privileged Identity Header */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{currentUser?.avatar}</span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">قسم العضو: {currentUser?.name}</h2>
                    <p className="text-xs text-slate-400">الملاحظات الخاصة وسجل التقارير الحصري</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-400 text-xs font-semibold">
                  <Shield className="w-4 h-4" />
                  مساحة محمية ومشفرة
                </div>
              </div>

              {/* 1. Important Private Note (Visible ONLY to Account Owner) */}
              <div className="bg-slate-900/40 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-md space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Lock className="w-4 h-4" />
                  <h3>[مهم] - ملاحظة شخصية سرية جداً</h3>
                </div>
                <p className="text-xs text-slate-400">
                  هذا القسم محمي ومشفر بالكامل، ولا يمكن لأي عضو آخر الاطلاع عليه إطلاقاً.
                </p>
                <textarea
                  value={getCurrentPrivateData().importantNote}
                  onChange={(e) => updateCurrentPrivateData({ importantNote: e.target.value })}
                  placeholder="اكتب ملاحظاتك المهمة أو الأسرار الخاصة بك هنا..."
                  rows={4}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition resize-none"
                />
              </div>

              {/* 2. Current Active Report */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                    <FileText className="w-4 h-4" />
                    <h3>كتابة تقرير جديد</h3>
                  </div>
                  <button
                    onClick={handleSaveReportToHistory}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
                  >
                    <FolderArchive className="w-4 h-4" />
                    حفظ في السجل الأرشيفي
                  </button>
                </div>
                <textarea
                  value={getCurrentPrivateData().currentReport}
                  onChange={(e) => updateCurrentPrivateData({ currentReport: e.target.value })}
                  placeholder="ادخل تفاصيل التقرير الحالي هنا، ثم اضغط حفظ للتأرشيف..."
                  rows={4}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition resize-none"
                />
              </div>

              {/* 3. Reports History & Archive */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <h3>سجل التقارير والأرشيف السابِق</h3>
                </div>

                {getCurrentPrivateData().reportHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">لا يوجد أرشيف تقارير سابقة حتى الآن.</p>
                ) : (
                  <div className="space-y-3">
                    {getCurrentPrivateData().reportHistory.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl space-y-2 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/60 pb-2">
                          <span className="font-semibold text-cyan-400">تقرير مؤرّخ</span>
                          <span>{entry.timestamp}</span>
                        </div>
                        <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{entry.text}</p>
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
  );
}
