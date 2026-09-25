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

export default function N7HPortal() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [showJobMenu, setShowJobMenu] = useState<boolean>(false);

  const [loginAccountId, setLoginAccountId] = useState<string>("n7h");
  const [loginPass, setLoginPass] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  const [activeTab, setActiveTab] = useState<string>("general");

  const [reportsMap, setReportsMap] = useState<Record<string, ReportItem[]>>({});
  const [notesMap, setNotesMap] = useState<Record<string, NoteItem[]>>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [inputReportNum, setInputReportNum] = useState<string>("");
  const [reportError, setReportError] = useState<string>("");
  const [noteText, setNoteText] = useState<string>("");
  const [noteFile, setNoteFile] = useState<File | null>(null);

  const [chatText, setChatText] = useState<string>("");
  const [chatFile, setChatFile] = useState<File | null>(null);

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
      setReportError("يرجى كتابة رقم من 0 إلى 100");
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
  };

  if (!currentUser) {
    return (
      <div dir="rtl" style={{
        minHeight: "100vh",
        backgroundColor: "#080c14",
        color: "#f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
        }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h1 style={{
              fontSize: "24px",
              fontWeight: "900",
              color: "#38bdf8",
              margin: "0 0 6px 0"
            }}>N7H PORTAL</h1>
            <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>منظومة إدارة التقارير والملاحظات</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px" }}>اختر الحساب:</label>
              <select
                value={loginAccountId}
                onChange={(e) => setLoginAccountId(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#080c14",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  padding: "12px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none"
                }}
              >
                {ACCOUNTS.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px" }}>كلمة المرور:</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="أدخل كلمة المرور..."
                style={{
                  width: "100%",
                  backgroundColor: "#080c14",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  padding: "12px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {loginError && <p style={{ color: "#ef4444", fontSize: "12px", margin: 0, textAlign: "center" }}>{loginError}</p>}

            <button
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#0284c7",
                color: "#fff",
                fontWeight: "bold",
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                marginTop: "10px"
              }}
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
    <div dir="rtl" style={{
      minHeight: "100vh",
      backgroundColor: "#080c14",
      color: "#f1f5f9",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header */}
      <header style={{
        height: "65px",
        backgroundColor: "#0f172a",
        borderBottom: "1px solid #1e293b",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", itemsCenter: "center", gap: "12px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            backgroundColor: "#0284c7",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "900",
            color: "#fff"
          }}>N</div>
          <span style={{ fontSize: "18px", fontWeight: "800", color: "#38bdf8", letterSpacing: "1px" }}>N7H PORTAL</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowJobMenu(!showJobMenu)}
              style={{
                backgroundColor: "rgba(2, 132, 199, 0.15)",
                border: "1px solid #0284c7",
                color: "#38bdf8",
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span>💼 {selectedJob ? selectedJob : "اختر الوظيفه"}</span>
              <span style={{ fontSize: "10px" }}>▼</span>
            </button>

            {showJobMenu && (
              <div style={{
                position: "absolute",
                top: "45px",
                right: 0,
                width: "180px",
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                padding: "6px",
                zIndex: 200
              }}>
                {JOBS.map((job) => (
                  <div
                    key={job}
                    onClick={() => handleSelectJob(job)}
                    style={{
                      padding: "10px 12px",
                      fontSize: "12px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      backgroundColor: selectedJob === job ? "#0284c7" : "transparent",
                      color: selectedJob === job ? "#fff" : "#cbd5e1",
                      fontWeight: selectedJob === job ? "bold" : "normal",
                      marginBottom: "2px"
                    }}
                  >
                    {job}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: "#1e293b",
            padding: "6px 14px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#e2e8f0"
          }}>
            {currentUser.name}
          </div>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#f87171",
              padding: "6px 14px",
              borderRadius: "10px",
              fontSize: "12px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            خروج
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <aside style={{
          width: "240px",
          backgroundColor: "#0f172a",
          borderLeft: "1px solid #1e293b",
          padding: "20px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          <div style={{ fontSize: "11px", fontWeight: "bold", color: "#64748b", padding: "0 10px", marginBottom: "4px" }}>
            الأقسام الرئيسية
          </div>

          <button
            onClick={() => setActiveTab("general")}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "bold",
              textAlign: "right",
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === "general" ? "#0284c7" : "transparent",
              color: activeTab === "general" ? "#fff" : "#94a3b8"
            }}
          >
            💬 شات
          </button>

          <div style={{ fontSize: "11px", fontWeight: "bold", color: "#64748b", padding: "0 10px", marginTop: "16px", marginBottom: "4px" }}>
            قائمة الأعضاء
          </div>

          {ACCOUNTS.map((acc) => {
            const isActive = activeTab === acc.id;
            return (
              <button
                key={acc.id}
                onClick={() => setActiveTab(acc.id)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  textAlign: "right",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: isActive ? "#0284c7" : "transparent",
                  color: isActive ? "#fff" : "#94a3b8"
                }}
              >
                <span>{acc.name}</span>
                {currentUser.id === acc.id && (
                  <span style={{
                    fontSize: "10px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "2px 6px",
                    borderRadius: "4px"
                  }}>حسابك</span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
          {activeTab === "general" && (
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <div style={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "16px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                height: "600px"
              }}>
                <div style={{
                  borderBottom: "1px solid #1e293b",
                  paddingBottom: "12px",
                  marginBottom: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>💬 الشات العام</h2>
                  {selectedJob && <span style={{ fontSize: "12px", color: "#38bdf8" }}>الوظيفة الحالية: {selectedJob}</span>}
                </div>

                <div style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "12px",
                  backgroundColor: "#080c14",
                  borderRadius: "12px",
                  border: "1px solid #1e293b",
                  marginBottom: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}>
                  {chatMessages.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#64748b", fontSize: "13px", marginTop: "auto", marginBottom: "auto" }}>
                      لا توجد رسائل في الشات العام.
                    </div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "12px",
                          maxWidth: "75%",
                          alignSelf: msg.senderId === currentUser.id ? "flex-start" : "flex-end",
                          backgroundColor: msg.senderId === currentUser.id ? "#0369a1" : "#1e293b",
                          color: "#fff"
                        }}
                      >
                        <div style={{ display: "flex", justifyBetween: "space-between", gap: "12px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "12px", fontWeight: "bold", color: "#7dd3fc" }}>
                            {msg.senderName} {msg.senderJob && `[${msg.senderJob}]`}
                          </span>
                          <span style={{ fontSize: "10px", color: "#94a3b8" }}>{msg.timestamp}</span>
                        </div>
                        {msg.text && <p style={{ fontSize: "13px", margin: 0, whiteSpace: "pre-wrap", lineHeight: "1.4" }}>{msg.text}</p>}

                        {msg.fileUrl && (
                          <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                            {msg.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                              <img src={msg.fileUrl} alt="uploaded" style={{ maxHeight: "180px", borderRadius: "8px" }} />
                            ) : (
                              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#38bdf8", fontSize: "12px" }}>
                                📎 {msg.fileName || "ملف مرفق"}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <label style={{
                    backgroundColor: "#1e293b",
                    color: "#cbd5e1",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "13px"
                  }}>
                    📎
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => e.target.files && setChatFile(e.target.files[0])}
                    />
                  </label>

                  <input
                    type="text"
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="اكتب رسالتك..."
                    style={{
                      flex: 1,
                      backgroundColor: "#080c14",
                      border: "1px solid #1e293b",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      color: "#fff",
                      fontSize: "13px",
                      outline: "none"
                    }}
                  />

                  <button
                    onClick={handleSendMessage}
                    style={{
                      backgroundColor: "#0284c7",
                      color: "#fff",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "10px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "13px"
                    }}
                  >
                    إرسال
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "general" && (
            <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "16px",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <h1 style={{ fontSize: "20px", fontWeight: "800", margin: 0 }}>
                    حساب: {ACCOUNTS.find((a) => a.id === activeTab)?.name}
                  </h1>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>
                    {currentUser.id === activeTab ? "إدارة التقرير الخاص بك والملاحظات السرية" : "استعراض تقرير هذا العضو (قراءة فقط)"}
                  </p>
                </div>

                <div style={{
                  backgroundColor: "#080c14",
                  border: "1px solid #0284c7",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "10px", color: "#94a3b8" }}>التقرير الحالي</div>
                  <div style={{ fontSize: "20px", fontWeight: "900", color: "#38bdf8" }}>
                    تقرير رقم [{latestReport ? latestReport.number : 0}]
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "16px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "bold", margin: 0, borderBottom: "1px solid #1e293b", paddingBottom: "10px" }}>
                    📊 تقريري
                  </h3>

                  {currentUser.id === activeTab ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={inputReportNum}
                        onChange={(e) => setInputReportNum(e.target.value)}
                        placeholder="أدخل رقم التقرير (0 - 100)..."
                        style={{
                          backgroundColor: "#080c14",
                          border: "1px solid #1e293b",
                          borderRadius: "10px",
                          padding: "10px",
                          color: "#fff",
                          fontSize: "13px",
                          outline: "none"
                        }}
                      />
                      {reportError && <span style={{ color: "#ef4444", fontSize: "11px" }}>{reportError}</span>}

                      <button
                        onClick={handleAddReport}
                        style={{
                          backgroundColor: "#0284c7",
                          color: "#fff",
                          border: "none",
                          padding: "10px",
                          borderRadius: "10px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          fontSize: "13px"
                        }}
                      >
                        تأكيد
                      </button>
                    </div>
                  ) : (
                    <div style={{ fontSize: "12px", color: "#64748b" }}>🔒 لا يمكنك تعديل تقارير هذا الحساب.</div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "#94a3b8" }}>السجلات:</div>
                    {activeAccountReports.length === 0 ? (
                      <div style={{ fontSize: "12px", color: "#475569", textAlign: "center", padding: "20px 0" }}>لا توجد تقارير.</div>
                    ) : (
                      activeAccountReports.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            backgroundColor: "#080c14",
                            border: "1px solid #1e293b",
                            padding: "12px",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "14px", fontWeight: "bold", color: "#38bdf8" }}>تقرير رقم [{item.number}]</span>
                            <button
                              onClick={() => shareReportToChat(item.number)}
                              style={{
                                backgroundColor: "rgba(2, 132, 199, 0.2)",
                                border: "1px solid #0284c7",
                                color: "#38bdf8",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "10px",
                                cursor: "pointer"
                              }}
                            >
                              مشاركة بالشات
                            </button>
                          </div>
                          <div style={{ fontSize: "10px", color: "#64748b", textAlign: "left", direction: "ltr" }}>
                            {item.timestamp}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div style={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "16px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "bold", margin: 0, borderBottom: "1px solid #1e293b", paddingBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                    <span>📝 الملاحظات</span>
                    {currentUser.id === activeTab && <span style={{ fontSize: "10px", color: "#10b981" }}>🔒 سرية وحصرية</span>}
                  </h3>

                  {currentUser.id === activeTab ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="اكتب ملاحظاتك السرية هنا..."
                        rows={3}
                        style={{
                          backgroundColor: "#080c14",
                          border: "1px solid #1e293b",
                          borderRadius: "10px",
                          padding: "10px",
                          color: "#fff",
                          fontSize: "12px",
                          outline: "none",
                          resize: "none"
                        }}
                      />

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <label style={{
                          backgroundColor: "#1e293b",
                          color: "#94a3b8",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          fontSize: "11px",
                          cursor: "pointer"
                        }}>
                          📎 إرفاق ملف
                          <input type="file" style={{ display: "none" }} onChange={(e) => e.target.files && setNoteFile(e.target.files[0])} />
                        </label>

                        <button
                          onClick={handleAddNote}
                          style={{
                            backgroundColor: "#0284c7",
                            color: "#fff",
                            border: "none",
                            padding: "6px 16px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "12px"
                          }}
                        >
                          حفظ
                        </button>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                        {activeAccountNotes.map((note) => (
                          <div key={note.id} style={{
                            backgroundColor: "#080c14",
                            border: "1px solid #1e293b",
                            padding: "10px",
                            borderRadius: "8px",
                            fontSize: "12px"
                          }}>
                            <p style={{ margin: 0, color: "#e2e8f0" }}>{note.text}</p>
                            {note.fileUrl && (
                              <div style={{ marginTop: "6px" }}>
                                {note.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                  <img src={note.fileUrl} alt="attached" style={{ maxHeight: "100px", borderRadius: "6px" }} />
                                ) : (
                                  <a href={note.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#38bdf8" }}>📎 {note.fileName}</a>
                                )}
                              </div>
                            )}
                            <div style={{ fontSize: "9px", color: "#64748b", textAlign: "left", marginTop: "4px" }}>{note.timestamp}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: "12px", color: "#64748b", textAlign: "center", padding: "40px 0" }}>
                      🔒 هذه الملاحظات سرية ولا يمكن لأحد الاطلاع عليها سواك.
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
