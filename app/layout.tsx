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
  
  // تبويبات العام (شات + 9 أيقونات مجهول)
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

  // رفع ملف في الشات العام
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

  // رفع ملف في قسم الملاحظات
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

  // ترتيب الحساب الحالي ليظهر أولاً في القائمة الجانبية
  const sortedUsers = [currentUser, ...USERS.filter((u) => u.id !== currentUser.id)];

  // قائمة 9 أيقونات مجهول
  const unknownTabs = Array.from({ length: 9 }, (_, i) => `unknown_${i + 1}`);

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

      {/* Main Layout */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* Sidebar */}
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
            🌐 عام
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

        {/* Content Area */}
        <main style={{ flex: 1 }}>
          {selectedTab === "general" && (
            <div>
              {/* General Sub-Tabs: 1 Chat + 9 Unknown Icons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "15px" }}>
                <button
                  onClick={() => setGeneralSubTab("chat")}
                  style={{
                    padding: "8px 14px",
                    fontWeight: generalSubTab === "chat" ? "bold" : "normal",
                    cursor: "pointer",
                    backgroundColor: generalSubTab === "chat" ? "#eee" : "#fff",
                    border: "1px solid #ccc"
                  }}
                >
                  💬 شات
                </button>

                {unknownTabs.map((tabKey, idx) => (
                  <button
                    key={tabKey}
                    onClick={() => setGeneralSubTab(tabKey)}
                    style={{
                      padding: "8px 12px",
                      fontWeight: generalSubTab === tabKey ? "bold" : "normal",
                      cursor: "pointer",
                      backgroundColor: generalSubTab === tabKey ? "#eee" : "#fff",
                      border: "1px solid #ccc"
                    }}
                  >
                    ❓ مجهول {idx + 1}
                  </button>
                ))}
              </div>

              {/* Chat View */}
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

                  {attachedChatFile && (
                    <div style={{ marginBottom: "5px", fontSize: "12px", color: "green" }}>
                      ملف مرفق جاهز للإرسال: {attachedChatFile.name}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "5px" }}>
                    <input type="file" onChange={handleChatFileUpload} style={{ width: "180px" }} />
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

              {/* Unknown Tabs Placeholder Message */}
              {generalSubTab !== "chat" && (
                <div style={{ border: "1px dashed #aaa", padding: "40px", textAlign: "center", marginTop: "20px" }}>
                  <h3 style={{ color: "#555" }}>⚙️ جاري البرمجة على السكربت...</h3>
                  <p style={{ color: "#888", fontSize: "14px" }}>هذا القسم قيد التطوير والتجهيز حالياً.</p>
                </div>
              )}
            </div>
          )}

          {/* User Specific Section */}
          {selectedTab !== "general" && (
            <div>
              <h2>قسم العضو: {currentUser.name}</h2>
              <hr />

              {/* 1. Notes Section (Private to current account owner) */}
              <div style={{ marginTop: "15px", border: "1px solid #333", padding: "12px" }}>
                <h3 style={{ marginTop: 0 }}>📌 [الملاحظات]</h3>
                <p style={{ fontSize: "12px", color: "#666" }}>
                  هذا القسم خاص بك فقط، ولا يمكن لأي عضو آخر الاطلاع عليه.
                </p>
                <textarea
                  value={getCurrentPrivateData().note}
                  onChange={(e) => updateCurrentPrivateData({ note: e.target.value })}
                  placeholder="اكتب ملاحظاتك الشخصية هنا..."
                  rows={3}
                  style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                />

                {/* Upload Image/File inside Notes */}
                <div>
                  <label style={{ fontSize: "12px", display: "block", marginBottom: "5px" }}>إرفاق صورة أو ملف مع الملاحظات:</label>
                  <input type="file" onChange={handleNoteFileUpload} />
                  {getCurrentPrivateData().noteFileUrl && (
                    <div style={{ marginTop: "10px" }}>
                      {getCurrentPrivateData().noteFileType === "image" ? (
                        <img src={getCurrentPrivateData().noteFileUrl} alt="ملاحظة مصورة" style={{ maxWidth: "200px", display: "block" }} />
                      ) : (
                        <a href={getCurrentPrivateData().noteFileUrl} download={getCurrentPrivateData().noteFileName}>
                          📎 {getCurrentPrivateData().noteFileName}
                        </a>
                      )}
                    </div>
                  )}
                </div>
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

              {/* 3. Reports History */}
              <div style={{ marginTop: "15px", border: "1px solid #ccc", padding: "10px" }}>
                <h3>سجل التقارير والأرشيف</h3>
                {getCurrentPrivateData().reportHistory.length === 0 ? (
                  <p style={{ color: "#888" }}>لا يوجد أرشيف تقارير سابقة.</p>
                ) : (
                  getCurrentPrivateData().reportHistory.map((entry) => (
                    <div key={entry.id} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
                      <small style={{ color: "#666" }}>تاريخ ووقت الحفظ: {entry.timestamp}</small>
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
