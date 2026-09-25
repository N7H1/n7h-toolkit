"use client";

import React, { useState, useEffect, useRef } from "react";

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
  { label: "اختصار الحبتين", command: 'bind keyboard "Z" "e peace"' },
  { label: "اختصار فتح الكبوت", command: 'bind keyboard "1" "Hood"' },
  { label: "اختصار فتح الشنطة", command: 'bind keyboard "2" "Trunk"' },
  { label: "اختصار تصفير", command: 'bind keyboard 0 "e whistle"' },
  { label: "اختصار الصفعة", command: 'bind keyboard 0 "e slap"' },
  { label: "اختصار الانبطاح", command: 'bind keyboard 0 "e prone"' },
  { label: "اختصار جلوس تصوير", command: 'bind keyboard 0 "e amsitpost"' },
  { label: "اختصار الحبتين", command: 'bind keyboard 0 "e vsign"' },
  { label: "اختصار الحضن", command: 'bind keyboard 0 "e hug"' },
  { label: "اختصار السيلفي", command: 'bind keyboard 0 "e selfie4"' },
  { label: "اختصار التحية", command: 'bind keyboard "q" "e salute"' },
];

export default function N7HToolkit() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(USERS[0]);
  const [selectedTab, setSelectedTab] = useState<string>("general");
  const [generalSubTab, setGeneralSubTab] = useState<"chat" | "commands">("chat");

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [attachedFile, setAttachedFile] = useState<{ url: string; name: string; type: "image" | "file" } | null>(null);

  const [userPrivateData, setUserPrivateData] = useState<Record<string, UserPrivateData>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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
        importantNote: "",
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

  const handleSendMessage = () => {
    if (!newMessageText.trim() && !attachedFile) return;

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

  const handleCopyCommand = (commandText: string, index: number) => {
    navigator.clipboard.writeText(commandText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // ترتيب الحساب الحالي ليظهر أولاً في القائمة
  const sortedUsers = [currentUser, ...USERS.filter((u) => u.id !== currentUser.id)];

  return (
    <div dir="rtl" style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>N7H Toolkit</h1>
          <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>منصة الأدوات والتواصل المشتركة</p>
        </div>
        <div style={{ textAlign: "left" }}>
          <span style={{ fontSize: "20px" }}>{currentUser.avatar}</span>
          <span style={{ fontWeight: "bold", marginRight: "5px" }}>{currentUser.name}</span>
          <div style={{ fontSize: "12px", color: "#666" }}>حساب نشط حالياً ({currentUser.role})</div>
        </div>
      </header>

      <hr />

      {/* Content Layout */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* Right Sidebar */}
        <aside style={{ width: "220px" }}>
          <h3>الأعضاء والأقسام</h3>
          <button
            onClick={() => setSelectedTab("general")}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              fontWeight: selectedTab === "general" ? "bold" : "normal",
              cursor: "pointer",
            }}
          >
            🌐 العام
          </button>

          <h4>اختر الحساب (حسابك بالأعلى):</h4>
          {sortedUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                handleSelectUser(user);
                setSelectedTab(user.id);
              }}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "5px",
                textAlign: "right",
                fontWeight: currentUser.id === user.id ? "bold" : "normal",
                cursor: "pointer",
              }}
            >
              {user.avatar} {user.name} {currentUser.id === user.id ? "(حسابك)" : ""}
            </button>
          ))}
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1 }}>
          {selectedTab === "general" && (
            <div>
              {/* Tabs inside General */}
              <div style={{ marginBottom: "15px" }}>
                <button
                  onClick={() => setGeneralSubTab("chat")}
                  style={{
                    padding: "8px 16px",
                    marginLeft: "10px",
                    fontWeight: generalSubTab === "chat" ? "bold" : "normal",
                    cursor: "pointer",
                  }}
                >
                  💬 الشات العام
                </button>
                <button
                  onClick={() => setGeneralSubTab("commands")}
                  style={{
                    padding: "8px 16px",
                    fontWeight: generalSubTab === "commands" ? "bold" : "normal",
                    cursor: "pointer",
                  }}
                >
                  📜 الأوامر
                </button>
              </div>

              {/* General Chat View */}
              {generalSubTab === "chat" && (
                <div>
                  <div style={{ minHeight: "300px", border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                    {chatMessages.length === 0 ? (
                      <p style={{ color: "#888" }}>لا توجد رسائل في الشات العام.</p>
                    ) : (
                      chatMessages.map((msg) => (
                        <div key={msg.id} style={{ marginBottom: "10px" }}>
                          <strong>{msg.senderName}:</strong> {msg.text}
                          <span style={{ fontSize: "10px", color: "#888", marginRight: "10px" }}>{msg.timestamp}</span>
                          {msg.fileUrl && (
                            <div style={{ marginTop: "5px" }}>
                              {msg.fileType === "image" ? (
                                <img src={msg.fileUrl} alt="مرفق" style={{ maxWidth: "200px", display: "block" }} />
                              ) : (
                                <a href={msg.fileUrl} download={msg.fileName}>
                                  📎 {msg.fileName}
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {attachedFile && (
                    <div style={{ marginBottom: "5px", fontSize: "12px", color: "green" }}>
                      ملف مرفق جاهز للإرسال: {attachedFile.name}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "5px" }}>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      style={{ width: "180px" }}
                    />
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder="اكتب رسالتك هنا..."
                      style={{ flex: 1, padding: "8px" }}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage} style={{ padding: "8px 15px", cursor: "pointer" }}>
                      إرسال
                    </button>
                  </div>
                </div>
              )}

              {/* Commands View */}
              {generalSubTab === "commands" && (
                <div>
                  <h3>أوامر واختصارات FiveM السريعة</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {COMMANDS_LIST.map((cmd, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justify: "space-between",
                          alignItems: "center",
                          padding: "8px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <div>
                          <strong>{cmd.label}:</strong> <code dir="ltr">{cmd.command}</code>
                        </div>
                        <button onClick={() => handleCopyCommand(cmd.command, idx)} style={{ cursor: "pointer" }}>
                          {copiedIndex === idx ? "تم النسخ!" : "نسخ"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Private Space */}
          {selectedTab !== "general" && (
            <div>
              <h2>قسم العضو: {currentUser.name}</h2>
              <hr />

              {/* 1. Important Section (Private ONLY to account owner) */}
              <div style={{ marginTop: "15px", border: "1px solid red", padding: "10px" }}>
                <h3 style={{ color: "red", marginTop: 0 }}>[مهم] - ملاحظة سرية خاصة</h3>
                <p style={{ fontSize: "12px", color: "#666" }}>
                  هذا القسم يظهر لك فقط ولن يستطيع باقي الأعضاء رؤيته.
                </p>
                <textarea
                  value={getCurrentPrivateData().importantNote}
                  onChange={(e) => updateCurrentPrivateData({ importantNote: e.target.value })}
                  placeholder="اكتب ملاحظاتك المهمة هنا..."
                  rows={3}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              {/* 2. Current Report */}
              <div style={{ marginTop: "15px", border: "1px solid #ccc", padding: "10px" }}>
                <h3>كتابة تقرير</h3>
                <textarea
                  value={getCurrentPrivateData().currentReport}
                  onChange={(e) => updateCurrentPrivateData({ currentReport: e.target.value })}
                  placeholder="اكتب تقريرك هنا..."
                  rows={3}
                  style={{ width: "100%", padding: "8px" }}
                />
                <button
                  onClick={handleSaveReportToHistory}
                  style={{ marginTop: "5px", padding: "8px 15px", cursor: "pointer" }}
                >
                  حفظ التقرير في الأرشيف
                </button>
              </div>

              {/* 3. Report History */}
              <div style={{ marginTop: "15px", border: "1px solid #ccc", padding: "10px" }}>
                <h3>سجل التقارير والأرشيف</h3>
                {getCurrentPrivateData().reportHistory.length === 0 ? (
                  <p style={{ color: "#888" }}>لا يوجد أرشيف تقارير سابقة.</p>
                ) : (
                  getCurrentPrivateData().reportHistory.map((entry) => (
                    <div key={entry.id} style={{ borderBottom: "1px solid #eee", padding: "5px 0" }}>
                      <small style={{ color: "#666" }}>تاريخ الحفظ: {entry.timestamp}</small>
                      <p style={{ margin: "5px 0" }}>{entry.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
