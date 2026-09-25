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

  // الحساب الحالي يظهر أولاً دائماً في القائمة الجانبية
  const sortedUsers = [currentUser, ...USERS.filter((u) => u.id !== currentUser.id)];
  const unknownTabs = Array.from({ length: 9 }, (_, i) => `unknown_${i + 1}`);

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: "#090d16", color: "#f1f5f9", fontFamily: "sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", padding: "20px", backgroundColor: "#1e293b66", border: "1px solid #334155", borderRadius: "16px", backdropFilter: "blur(8px)" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "bold", background: "linear-gradient(to right, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              N7H Toolkit
            </h1>
            <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "14px" }}>منصة الأدوات والتواصل المشتركة</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#0f172a99", padding: "10px 16px", borderRadius: "12px", border: "1px solid #334155" }}>
            <span style={{ fontSize: "24px" }}>{currentUser.avatar}</span>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "bold", color: "#f8fafc" }}>{currentUser.name}</div>
              <div style={{ fontSize: "12px", color: "#38bdf8" }}>{currentUser.role}</div>
            </div>
          </div>
        </header>

        {/* Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px" }}>
          
          {/* Sidebar */}
          <aside style={{ backgroundColor: "#1e293b66", padding: "20px", borderRadius: "16px", border: "1px solid #334155", height: "fit-content" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#94a3b8" }}>الأقسام والأعضاء</h3>
            
            <button
              onClick={() => setSelectedTab("general")}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "20px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                textAlign: "right",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: selectedTab === "general" ? "#0284c7" : "#0f172a",
                color: "#fff",
                transition: "0.2s"
              }}
            >
              🌐 عام
            </button>

            <h4 style={{ fontSize: "14px", color: "#64748b", marginBottom: "12px" }}>الأعضاء (حسابك بالأعلى):</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {sortedUsers.map((user) => {
                const isSelected = currentUser.id === user.id && selectedTab === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      handleSelectUser(user);
                      setSelectedTab(user.id);
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid",
                      borderColor: currentUser.id === user.id ? "#38bdf8" : "#334155",
                      backgroundColor: isSelected ? "#1e293b" : "#0f172a66",
                      color: "#e2e8f0",
                      cursor: "pointer",
                      textAlign: "right",
                      display: "flex",
                      justify: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span>{user.avatar} {user.name}</span>
                    {currentUser.id === user.id && <span style={{ fontSize: "11px", backgroundColor: "#0369a1", padding: "2px 6px", borderRadius: "4px" }}>حسابك</span>}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Workspace */}
          <main style={{ backgroundColor: "#1e293b66", padding: "24px", borderRadius: "16px", border: "1px solid #334155" }}>
            
            {/* General Section */}
            {selectedTab === "general" && (
              <div>
                {/* Tabs Bar */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px", borderBottom: "1px solid #334155", paddingBottom: "16px" }}>
                  <button
                    onClick={() => setGeneralSubTab("chat")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: generalSubTab === "chat" ? "#38bdf8" : "#0f172a",
                      color: generalSubTab === "chat" ? "#0f172a" : "#94a3b8",
                      fontWeight: "bold"
                    }}
                  >
                    💬 شات
                  </button>

                  {unknownTabs.map((tabKey, idx) => (
                    <button
                      key={tabKey}
                      onClick={() => setGeneralSubTab(tabKey)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: generalSubTab === tabKey ? "#38bdf8" : "#0f172a",
                        color: generalSubTab === tabKey ? "#0f172a" : "#94a3b8",
                        fontWeight: generalSubTab === tabKey ? "bold" : "normal"
                      }}
                    >
                      ❓ مجهول {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Chat Display */}
                {generalSubTab === "chat" && (
                  <div>
                    <div style={{ height: "380px", overflowY: "auto", backgroundColor: "#0f172aaa", border: "1px solid #334155", borderRadius: "12px", padding: "16px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      {chatMessages.length === 0 ? (
                        <div style={{ color: "#64748b", textAlign: "center", marginTop: "140px" }}>لا توجد رسائل في الشات العام حالياً.</div>
                      ) : (
                        chatMessages.map((msg) => (
                          <div key={msg.id} style={{ backgroundColor: "#1e293b", padding: "12px", borderRadius: "10px", borderRight: "4px solid #38bdf8" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                              <span style={{ fontWeight: "bold", color: "#38bdf8" }}>{msg.senderName}</span>
                              <span style={{ fontSize: "11px", color: "#64748b" }}>{msg.timestamp}</span>
                            </div>
                            <div style={{ color: "#f1f5f9" }}>{msg.text}</div>
                            {msg.fileUrl && (
                              <div style={{ marginTop: "8px" }}>
                                {msg.fileType === "image" ? (
                                  <img src={msg.fileUrl} alt="مرفق" style={{ maxWidth: "240px", borderRadius: "8px", border: "1px solid #334155" }} />
                                ) : (
                                  <a href={msg.fileUrl} download={msg.fileName} style={{ color: "#38bdf8", fontSize: "13px" }}>📎 {msg.fileName}</a>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Chat Input */}
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input type="file" onChange={handleChatFileUpload} style={{ color: "#94a3b8", fontSize: "12px", width: "180px" }} />
                      <input
                        type="text"
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        placeholder="اكتب رسالتك..."
                        style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #334155", backgroundColor: "#0f172a", color: "#fff" }}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <button onClick={handleSendMessage} style={{ padding: "12px 24px", borderRadius: "10px", border: "none", backgroundColor: "#0284c7", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
                        إرسال
                      </button>
                    </div>
                  </div>
                )}

                {/* Unknown Script Screen */}
                {generalSubTab !== "chat" && (
                  <div style={{ padding: "80px 20px", textAlign: "center", backgroundColor: "#0f172aaa", borderRadius: "12px", border: "1px dashed #334155" }}>
                    <h2 style={{ color: "#38bdf8", margin: "0 0 10px 0" }}>⚙️ جاري البرمجة على السكربت...</h2>
                    <p style={{ color: "#94a3b8", margin: 0 }}>هذا القسم قيد التطوير والتجهيز حالياً وسيتم تفعيله قريباً.</p>
                  </div>
                )}
              </div>
            )}

            {/* Member Private Space */}
            {selectedTab !== "general" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <h2 style={{ margin: 0, color: "#f8fafc" }}>قسم العضو: {currentUser.name}</h2>
                
                {/* 1. Private Notes */}
                <div style={{ backgroundColor: "#0f172aaa", padding: "16px", borderRadius: "12px", border: "1px solid #38bdf855" }}>
                  <h3 style={{ margin: "0 0 8px 0", color: "#38bdf8" }}>📌 [الملاحظات]</h3>
                  <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px" }}>خاص بك فقط، ولا يمكن لأي عضو آخر الاطلاع عليه.</p>
                  <textarea
                    value={getCurrentPrivateData().note}
                    onChange={(e) => updateCurrentPrivateData({ note: e.target.value })}
                    placeholder="اكتب ملاحظاتك السرية هنا..."
                    rows={3}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #334155", backgroundColor: "#1e293b", color: "#fff", marginBottom: "10px" }}
                  />
                  <div>
                    <label style={{ fontSize: "12px", color: "#94a3b8", display: "block", marginBottom: "6px" }}>إرفاق صورة أو ملف مع الملاحظة:</label>
                    <input type="file" onChange={handleNoteFileUpload} style={{ color: "#94a3b8", fontSize: "12px" }} />
                    {getCurrentPrivateData().noteFileUrl && (
                      <div style={{ marginTop: "10px" }}>
                        {getCurrentPrivateData().noteFileType === "image" ? (
                          <img src={getCurrentPrivateData().noteFileUrl} alt="ملاحظة مصورة" style={{ maxWidth: "200px", borderRadius: "8px" }} />
                        ) : (
                          <a href={getCurrentPrivateData().noteFileUrl} download={getCurrentPrivateData().noteFileName} style={{ color: "#38bdf8" }}>📎 {getCurrentPrivateData().noteFileName}</a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Current Report */}
                <div style={{ backgroundColor: "#0f172aaa", padding: "16px", borderRadius: "12px", border: "1px solid #334155" }}>
                  <h3 style={{ margin: "0 0 12px 0", color: "#f8fafc" }}>كتابة تقرير</h3>
                  <textarea
                    value={getCurrentPrivateData().currentReport}
                    onChange={(e) => updateCurrentPrivateData({ currentReport: e.target.value })}
                    placeholder="اكتب تفاصيل التقرير..."
                    rows={3}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #334155", backgroundColor: "#1e293b", color: "#fff", marginBottom: "10px" }}
                  />
                  <button onClick={handleSaveReportToHistory} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "#16a34a", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
                    حفظ التقرير في الأرشيف
                  </button>
                </div>

                {/* 3. Reports History */}
                <div style={{ backgroundColor: "#0f172aaa", padding: "16px", borderRadius: "12px", border: "1px solid #334155" }}>
                  <h3 style={{ margin: "0 0 12px 0", color: "#f8fafc" }}>سجل التقارير والأرشيف</h3>
                  {getCurrentPrivateData().reportHistory.length === 0 ? (
                    <p style={{ color: "#64748b", margin: 0 }}>لا يوجد أرشيف تقارير سابقة.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {getCurrentPrivateData().reportHistory.map((entry) => (
                        <div key={entry.id} style={{ backgroundColor: "#1e293b", padding: "12px", borderRadius: "8px", borderRight: "3px solid #16a34a" }}>
                          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>تاريخ الحفظ: {entry.timestamp}</div>
                          <div style={{ color: "#f1f5f9" }}>{entry.text}</div>
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
  );
}
