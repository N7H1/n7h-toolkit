"use client";

import React, { useState, useEffect } from "react";

interface UserProfile {
  id: string;
  name: string;
  role: string;
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
  { id: "n7h", name: "N7H", role: "الأدمن" },
  { id: "azzam", name: "عزام", role: "عضو" },
  { id: "rakan", name: "راكان", role: "عضو" },
  { id: "farraj", name: "فراج", role: "عضو" },
  { id: "mohammed", name: "محمد", role: "عضو" },
  { id: "raad", name: "رعد", role: "عضو" },
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

  // ترتيب الحساب الحالي ليظهر بالأعلى دائماً
  const sortedUsers = [currentUser, ...USERS.filter((u) => u.id !== currentUser.id)];
  const unknownTabs = Array.from({ length: 9 }, (_, i) => `unknown_${i + 1}`);

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: "#060913", color: "#e2e8f0", fontFamily: "sans-serif", padding: "30px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <div style={{ backgroundColor: "#0c1322", padding: "12px 20px", borderRadius: "10px", border: "1px solid #1e293b", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "bold", color: "#f8fafc", fontSize: "16px" }}>{currentUser.name}</div>
              <div style={{ fontSize: "12px", color: "#38bdf8" }}>{currentUser.role}</div>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "bold", color: "#38bdf8" }}>
              N7H Toolkit
            </h1>
            <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "13px" }}>منصة الأدوات والتواصل المشتركة</p>
          </div>
        </header>

        {/* Layout */}
        <div style={{ display: "flex", gap: "20px" }}>
          
          {/* Main Workspace (اليسار) */}
          <main style={{ flex: 1, backgroundColor: "#0c1322", padding: "20px", borderRadius: "12px", border: "1px solid #1e293b" }}>
            
            {/* General Section */}
            {selectedTab === "general" && (
              <div>
                {/* Tabs Bar */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "15px", borderBottom: "1px solid #1e293b", pb: "15px" }}>
                  <button
                    onClick={() => setGeneralSubTab("chat")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      backgroundColor: generalSubTab === "chat" ? "#1e293b" : "#060913",
                      color: generalSubTab === "chat" ? "#38bdf8" : "#94a3b8",
                      fontWeight: generalSubTab === "chat" ? "bold" : "normal"
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
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: generalSubTab === tabKey ? "#1e293b" : "#060913",
                        color: generalSubTab === tabKey ? "#38bdf8" : "#94a3b8",
                        fontWeight: generalSubTab === tabKey ? "bold" : "normal"
                      }}
                    >
                      مجهول {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Chat Display */}
                {generalSubTab === "chat" && (
                  <div>
                    <div style={{ height: "420px", overflowY: "auto", backgroundColor: "#060913", border: "1px solid #1e293b", borderRadius: "8px", padding: "15px", marginBottom: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {chatMessages.length === 0 ? (
                        <div style={{ color: "#475569", textAlign: "center", marginTop: "180px" }}>لا توجد رسائل في الشات العام.</div>
                      ) : (
                        chatMessages.map((msg) => (
                          <div key={msg.id} style={{ backgroundColor: "#0c1322", padding: "10px 14px", borderRadius: "6px", borderRight: "3px solid #38bdf8" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                              <span style={{ fontWeight: "bold", color: "#38bdf8", fontSize: "14px" }}>{msg.senderName}</span>
                              <span style={{ fontSize: "11px", color: "#64748b" }}>{msg.timestamp}</span>
                            </div>
                            <div style={{ color: "#e2e8f0", fontSize: "14px" }}>{msg.text}</div>
                            {msg.fileUrl && (
                              <div style={{ marginTop: "6px" }}>
                                {msg.fileType === "image" ? (
                                  <img src={msg.fileUrl} alt="مرفق" style={{ maxWidth: "200px", borderRadius: "6px" }} />
                                ) : (
                                  <a href={msg.fileUrl} download={msg.fileName} style={{ color: "#38bdf8", fontSize: "12px" }}>📎 {msg.fileName}</a>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Chat Input */}
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input type="file" onChange={handleChatFileUpload} style={{ color: "#64748b", fontSize: "12px", width: "180px" }} />
                      <input
                        type="text"
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        style={{ flex: 1, backgroundColor: "#060913", border: "1px solid #1e293b", borderRadius: "6px", padding: "10px", color: "#fff" }}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <button onClick={handleSendMessage} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", backgroundColor: "#0284c7", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
                        إرسال
                      </button>
                    </div>
                  </div>
                )}

                {/* Unknown Tabs Screen */}
                {generalSubTab !== "chat" && (
                  <div style={{ padding: "100px 20px", textAlign: "center", backgroundColor: "#060913", borderRadius: "8px", border: "1px dashed #1e293b" }}>
                    <h3 style={{ color: "#38bdf8", margin: "0 0 8px 0" }}>⚙️ جاري البرمجة على السكربت...</h3>
                    <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>هذا القسم قيد التطوير والتجهيز حالياً.</p>
                  </div>
                )}
              </div>
            )}

            {/* Member Section */}
            {selectedTab !== "general" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "18px" }}>قسم العضو: {currentUser.name}</h2>
                
                {/* 1. Private Notes */}
                <div style={{ backgroundColor: "#060913", padding: "15px", borderRadius: "8px", border: "1px solid #1e293b" }}>
                  <h3 style={{ margin: "0 0 6px 0", color: "#38bdf8", fontSize: "15px" }}>📌 [الملاحظات]</h3>
                  <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>خاص بك فقط، ولا يمكن لأي عضو آخر الاطلاع عليه.</p>
                  <textarea
                    value={getCurrentPrivateData().note}
                    onChange={(e) => updateCurrentPrivateData({ note: e.target.value })}
                    placeholder="اكتب ملاحظاتك الشخصية السرية هنا..."
                    rows={3}
                    style={{ width: "100%", backgroundColor: "#0c1322", border: "1px solid #1e293b", borderRadius: "6px", padding: "10px", color: "#fff", marginBottom: "10px" }}
                  />
                  <div>
                    <label style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "5px" }}>إرفاق صورة أو ملف مع الملاحظة:</label>
                    <input type="file" onChange={handleNoteFileUpload} style={{ color: "#64748b", fontSize: "12px" }} />
                    {getCurrentPrivateData().noteFileUrl && (
                      <div style={{ marginTop: "10px" }}>
                        {getCurrentPrivateData().noteFileType === "image" ? (
                          <img src={getCurrentPrivateData().noteFileUrl} alt="ملاحظة مصورة" style={{ maxWidth: "200px", borderRadius: "6px" }} />
                        ) : (
                          <a href={getCurrentPrivateData().noteFileUrl} download={getCurrentPrivateData().noteFileName} style={{ color: "#38bdf8" }}>📎 {getCurrentPrivateData().noteFileName}</a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Current Report */}
                <div style={{ backgroundColor: "#060913", padding: "15px", borderRadius: "8px", border: "1px solid #1e293b" }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#f8fafc", fontSize: "15px" }}>كتابة تقرير</h3>
                  <textarea
                    value={getCurrentPrivateData().currentReport}
                    onChange={(e) => updateCurrentPrivateData({ currentReport: e.target.value })}
                    placeholder="اكتب تفاصيل التقرير..."
                    rows={3}
                    style={{ width: "100%", backgroundColor: "#0c1322", border: "1px solid #1e293b", borderRadius: "6px", padding: "10px", color: "#fff", marginBottom: "10px" }}
                  />
                  <button onClick={handleSaveReportToHistory} style={{ padding: "8px 16px", borderRadius: "6px", border: "none", backgroundColor: "#10b981", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
                    حفظ التقرير في الأرشيف
                  </button>
                </div>

                {/* 3. Reports History */}
                <div style={{ backgroundColor: "#060913", padding: "15px", borderRadius: "8px", border: "1px solid #1e293b" }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#f8fafc", fontSize: "15px" }}>سجل التقارير والأرشيف</h3>
                  {getCurrentPrivateData().reportHistory.length === 0 ? (
                    <p style={{ color: "#64748b", margin: 0, fontSize: "13px" }}>لا يوجد أرشيف تقارير سابقة.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {getCurrentPrivateData().reportHistory.map((entry) => (
                        <div key={entry.id} style={{ backgroundColor: "#0c1322", padding: "10px", borderRadius: "6px", borderRight: "3px solid #10b981" }}>
                          <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>تاريخ ووقت الحفظ: {entry.timestamp}</div>
                          <div style={{ color: "#e2e8f0", fontSize: "13px" }}>{entry.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </main>

          {/* Sidebar (اليمين) */}
          <aside style={{ width: "260px", backgroundColor: "#0c1322", padding: "15px", borderRadius: "12px", border: "1px solid #1e293b", height: "fit-content" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#64748b" }}>الأقسام والأعضاء</h3>
            
            <button
              onClick={() => setSelectedTab("general")}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                textAlign: "center",
                backgroundColor: selectedTab === "general" ? "#0284c7" : "#060913",
                color: "#fff",
              }}
            >
              عام
            </button>

            <h4 style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>الأعضاء (حسابك بالأعلى):</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid",
                      borderColor: currentUser.id === user.id ? "#38bdf8" : "#1e293b",
                      backgroundColor: isSelected ? "#1e293b" : "#060913",
                      color: "#e2e8f0",
                      cursor: "pointer",
                      textAlign: "right",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span>{user.name}</span>
                    {currentUser.id === user.id && (
                      <span style={{ fontSize: "10px", backgroundColor: "#0284c7", padding: "2px 6px", borderRadius: "4px" }}>
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
