'use client';

import React, { useState, useEffect } from 'react';
import {
  Users, UserCheck, Shield, FileText, CheckCircle,
  RotateCcw, Save, MessageSquare, AlertCircle, LogOut, Send, Key, User, Lock
} from 'lucide-react';

// قائمة الحسابات المتاحة وكلمات المرور المحدثة
const INITIAL_USERS = [
  { id: 'n7h', name: 'N7H', pass: 'N7H5002', isAdmin: true, enabled: true },
  { id: 'azzam', name: 'عزام', pass: 'AZM18', enabled: true },
  { id: 'rakan', name: 'راكان', pass: 'RKN20', enabled: true },
  { id: 'farraj', name: 'فراج', pass: 'FRG66', enabled: true },
  { id: 'mohammed', name: 'محمد', pass: 'M7D9', enabled: true },
  { id: 'raad', name: 'رعد', pass: 'R3D33', enabled: true },
];

interface ChatMessage {
  id: string;
  senderName: string;
  senderId: string;
  text: string;
  time: string;
}

export default function N7HToolkit() {
  // حالة تسجيل الدخول
  const [loggedInUser, setLoggedInUser] = useState<any | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // إدارة قائمة المستخدمين والحالة
  const [users, setUsers] = useState(INITIAL_USERS);
  const [activeTab, setActiveTab] = useState('public');

  // بيانات "تقاريري" و "مهم"
  const [reportsData, setReportsData] = useState<{ [key: string]: string }>({});
  const [importantData, setImportantData] = useState<{ [key: string]: string }>({});

  // الشات العام
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // المدخلات الحالية
  const [inputReportNum, setInputReportNum] = useState('');
  const [inputImportant, setInputImportant] = useState('');

  // تحميل واسترجاع البيانات المحفوظة
  useEffect(() => {
    const savedUser = localStorage.getItem('n7h_auth_user');
    const savedReports = localStorage.getItem('n7h_reports');
    const savedImportant = localStorage.getItem('n7h_important');
    const savedChat = localStorage.getItem('n7h_chat_messages');
    const savedUsersConfig = localStorage.getItem('n7h_users_config');

    if (savedUser) setLoggedInUser(JSON.parse(savedUser));
    if (savedReports) setReportsData(JSON.parse(savedReports));
    if (savedImportant) setImportantData(JSON.parse(savedImportant));
    if (savedUsersConfig) setUsers(JSON.parse(savedUsersConfig));
    if (savedChat) {
      setChatMessages(JSON.parse(savedChat));
    } else {
      setChatMessages([
        { id: '1', senderName: 'N7H', senderId: 'n7h', text: 'مرحباً بالجميع في الشات العام!', time: '12:00 م' }
      ]);
    }
  }, []);

  // تحديث القيم عند التبديل بين الحسابات والأقسام
  useEffect(() => {
    const currentViewId = activeTab === 'public' ? (loggedInUser?.id || '') : activeTab;
    setInputReportNum(reportsData[currentViewId] || '');
    setInputImportant(importantData[currentViewId] || '');
  }, [activeTab, reportsData, importantData, loggedInUser]);

  // تسجيل الدخول
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const found = users.find(
      (u) => u.name.trim().toLowerCase() === loginUsername.trim().toLowerCase() && u.pass === loginPassword
    );

    if (!found) {
      setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة');
      return;
    }

    if (!found.enabled) {
      setLoginError('هذا الحساب معطل حالياً من قبل المسؤول');
      return;
    }

    setLoggedInUser(found);
    localStorage.setItem('n7h_auth_user', JSON.stringify(found));
    setActiveTab('public');
  };

  // تسجيل الخروج
  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('n7h_auth_user');
  };

  // التحقق هل المستخدم الحالي يملك صلاحية التعديل على القسم المفتوح
  const canEditCurrentView = () => {
    if (!loggedInUser) return false;
    if (loggedInUser.isAdmin) return true; // N7H يمكنه التعديل على الجميع
    return activeTab === loggedInUser.id; // صاحب الحساب يملك التعديل
  };

  // حفظ التقرير
  const handleSaveReport = () => {
    if (!canEditCurrentView()) {
      alert('عذراً، لا يمكنك تعديل تقارير هذا الشخص!');
      return;
    }
    const targetId = activeTab === 'public' ? loggedInUser.id : activeTab;
    const num = parseInt(inputReportNum);
    if (isNaN(num) || num < 1 || num > 100) {
      alert('رجاءً أدخل رقماً صحيحاً بين 1 و 100');
      return;
    }
    const updated = { ...reportsData, [targetId]: num.toString() };
    setReportsData(updated);
    localStorage.setItem('n7h_reports', JSON.stringify(updated));
  };

  // إعادة تعيين التقرير
  const handleResetReport = () => {
    if (!canEditCurrentView()) {
      alert('عذراً، لا يمكنك تعديل تقارير هذا الشخص!');
      return;
    }
    const targetId = activeTab === 'public' ? loggedInUser.id : activeTab;
    const updated = { ...reportsData, [targetId]: '' };
    setReportsData(updated);
    setInputReportNum('');
    localStorage.setItem('n7h_reports', JSON.stringify(updated));
  };

  // حفظ قسم "مهم"
  const handleSaveImportant = () => {
    if (!canEditCurrentView()) {
      alert('عذراً، لا يمكنك تعديل ملاحظات هذا الشخص!');
      return;
    }
    const targetId = activeTab === 'public' ? loggedInUser.id : activeTab;
    const updated = { ...importantData, [targetId]: inputImportant };
    setImportantData(updated);
    localStorage.setItem('n7h_important', JSON.stringify(updated));
  };

  // إرسال رسالة في الشات العام
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !loggedInUser) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      senderName: loggedInUser.name,
      senderId: loggedInUser.id,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedChat = [...chatMessages, msg];
    setChatMessages(updatedChat);
    setNewMessage('');
    localStorage.setItem('n7h_chat_messages', JSON.stringify(updatedChat));
  };

  // تفعيل/تعطيل حساب مستخدم (خاص بـ N7H)
  const toggleUserAccess = (userId: string) => {
    const updated = users.map((u) => (u.id === userId ? { ...u, enabled: !u.enabled } : u));
    setUsers(updated);
    localStorage.setItem('n7h_users_config', JSON.stringify(updated));
  };

  // ----------------------------------------------------
  // شاشة تسجيل الدخول للزوار
  // ----------------------------------------------------
  if (!loggedInUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#070b14] text-slate-200 font-sans p-4" dir="rtl">
        <div className="w-full max-w-md bg-[#0a101f] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-3xl text-white mx-auto shadow-xl shadow-blue-600/30">
              N7H
            </div>
            <h1 className="text-xl font-bold text-white pt-2">تسجيل الدخول إلى N7H Toolkit</h1>
            <p className="text-xs text-slate-400">أدخل اسم الحساب وكلمة المرور للوصول</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1.5">اسم المستخدم (الاسم):</label>
              <div className="relative">
                <User size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="مثال: N7H، عزام، راكان..."
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pr-11 pl-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1.5">كلمة المرور:</label>
              <div className="relative">
                <Key size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pr-11 pl-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // الواجهة الرئيسية بعد تسجيل الدخول
  // ----------------------------------------------------
  const currentViewId = activeTab === 'public' ? loggedInUser.id : activeTab;
  const currentViewObj = users.find((u) => u.id === currentViewId);
  const isEditable = canEditCurrentView();

  return (
    <div className="flex h-screen bg-[#070b14] text-slate-200 font-sans overflow-hidden" dir="rtl">
      
      {/* Sidebar القائمة الجانبية (الأدوات والأسماء ظاهرة للجميع) */}
      <aside className="w-64 bg-[#0a101f] border-l border-slate-800/60 flex flex-col justify-between p-4 flex-shrink-0">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/30">
              N7H
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-wide text-white">N7H</h1>
              <span className="text-[10px] text-blue-400 font-medium tracking-widest">الملاحظات والشات</span>
            </div>
          </div>

          {/* قائمة الأسماء الشاملة المتاحة للجميع */}
          <nav className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 px-3 uppercase tracking-wider block mb-2">الأقسام والأسماء</span>
            
            {/* الشات العام */}
            <button
              onClick={() => setActiveTab('public')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'public'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Users size={18} className={activeTab === 'public' ? 'text-white' : 'text-emerald-400'} />
              <span>عام (الشات)</span>
            </button>

            {/* عرض كل الأسماء للجميع */}
            {users.map((item) => {
              const isActive = activeTab === item.id;
              const isSelf = item.id === loggedInUser.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck size={18} className={isActive ? 'text-white' : 'text-blue-400'} />
                    <span>{item.name} {isSelf && '(أنت)'}</span>
                  </div>
                  {!item.enabled && <span className="text-[10px] text-red-400 bg-red-950/80 px-1.5 py-0.5 rounded">معطل</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* تسجيل الخروج */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">الحساب الحالي:</span>
            <span className="font-bold text-blue-400">{loggedInUser.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-slate-800 hover:bg-red-600/20 text-slate-300 hover:text-red-400 border border-slate-700/60 hover:border-red-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <LogOut size={14} /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-16 border-b border-slate-800/60 px-6 flex items-center justify-between bg-[#070b14]/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>عرض قسم:</span>
              <span className="text-blue-400">{activeTab === 'public' ? 'الشات العام' : currentViewObj?.name}</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
              <Shield size={16} className="text-blue-400" />
              <span className="text-xs text-slate-300">
                الرتبة: {loggedInUser.isAdmin ? 'مدير النظام (N7H)' : 'عضو'}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Body */}
        <div className="p-6 flex gap-6">
          <div className="flex-1 space-y-6">

            {/* 1. قسم الشات العام */}
            {activeTab === 'public' && (
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col h-[75vh]">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3 flex-shrink-0">
                  <MessageSquare className="text-emerald-400" size={26} />
                  <div>
                    <h3 className="text-base font-bold text-white">الشات العام المشترك</h3>
                    <p className="text-xs text-slate-400">تواصل مباشر باسمك مع جميع الأعضاء.</p>
                  </div>
                </div>

                {/* صندوق الرسائل */}
                <div className="flex-1 overflow-y-auto space-y-3 p-2 border border-slate-800/60 rounded-xl bg-slate-950/60">
                  {chatMessages.length === 0 ? (
                    <p className="text-center text-xs text-slate-600 py-10">لا توجد رسائل حالياً.</p>
                  ) : (
                    chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-xl max-w-lg ${
                          msg.senderId === loggedInUser.id
                            ? 'bg-blue-600/20 border border-blue-500/30 mr-auto'
                            : 'bg-slate-800/60 border border-slate-700/50 ml-auto'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <span className="font-bold text-xs text-blue-400">{msg.senderName}</span>
                          <span className="text-[10px] text-slate-500">{msg.time}</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* مدخل الإرسال */}
                <form onSubmit={handleSendMessage} className="flex gap-2 flex-shrink-0">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`اكتب رسالة بصفتك (${loggedInUser.name})...`}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                  >
                    <Send size={16} /> إرسال
                  </button>
                </form>
              </div>
            )}

            {/* 2. الأقسام الشخصية (عرض وحفظ التقرير و الملاحظات) */}
            {activeTab !== 'public' && (
              <div className="space-y-6">
                
                {/* تنبيه إذا لم يكن يملك صلاحية التعديل */}
                {!isEditable && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-400 flex items-center gap-2">
                    <Lock size={16} />
                    <span>أنت الآن في وضع "العرض فقط". يمكنك رؤية بيانات {currentViewObj?.name} ولكن لا يمكنك التعديل عليها.</span>
                  </div>
                )}

                {/* أداة تقاريري */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                    <FileText className="text-blue-400" size={24} />
                    <h3 className="text-base font-bold text-white">أداة تقاريري ({currentViewObj?.name})</h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-slate-400 block mb-1.5">رقم التقرير (من 1 إلى 100):</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        disabled={!isEditable}
                        value={inputReportNum}
                        onChange={(e) => setInputReportNum(e.target.value)}
                        placeholder="مثال: 50"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                      />
                    </div>
                    {isEditable && (
                      <div className="flex items-end gap-2 pt-6">
                        <button
                          onClick={handleSaveReport}
                          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                        >
                          <CheckCircle size={16} /> تأكيد
                        </button>
                        <button
                          onClick={handleResetReport}
                          className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5"
                        >
                          <RotateCcw size={16} /> إعادة تعيين
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* أداة مهم */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                    <AlertCircle className="text-amber-400" size={24} />
                    <h3 className="text-base font-bold text-white">أداة مهم ({currentViewObj?.name})</h3>
                  </div>

                  <div className="space-y-3">
                    <textarea
                      rows={5}
                      disabled={!isEditable}
                      value={inputImportant}
                      onChange={(e) => setInputImportant(e.target.value)}
                      placeholder={isEditable ? "اكتب الملاحظات والمهام الهامة..." : "لا توجد صلاحية لكتابة ملاحظات لهذا الحساب."}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-all resize-none disabled:opacity-50"
                    ></textarea>
                    
                    {isEditable && (
                      <button
                        onClick={handleSaveImportant}
                        className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-600/20"
                      >
                        <Save size={16} /> حفظ الملاحظة
                      </button>
                    )}
                  </div>
                </div>

                {/* لوحة التحكم بالإتاحة للمسؤول N7H */}
                {loggedInUser.isAdmin && (
                  <div className="p-6 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-4">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                      <Key size={18} />
                      <span>إدارة تفعيل/تعطيل الحسابات (خاص بالمدير N7H)</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {users.filter((u) => !u.isAdmin).map((u) => (
                        <button
                          key={u.id}
                          onClick={() => toggleUserAccess(u.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                            u.enabled
                              ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-red-600/20 text-red-400 border-red-500/40'
                          }`}
                        >
                          <span>{u.name}</span>
                          <span>{u.enabled ? '(مُفعل)' : '(معطل)'}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* القائمة اليسرى (عرض التقرير بشكل بارز) */}
          <div className="w-80 space-y-5 flex-shrink-0">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-900 border border-blue-500/30 text-center space-y-3 shadow-xl">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                تقرير ({activeTab === 'public' ? loggedInUser.name : currentViewObj?.name})
              </span>
              
              {reportsData[currentViewId] ? (
                <div className="p-4 bg-blue-600/20 border border-blue-500/40 rounded-2xl space-y-1">
                  <span className="text-xs text-blue-300 font-medium block">التقرير المحفوظ</span>
                  <div className="text-2xl font-black text-white tracking-wide">
                    تقرير رقم <span className="text-blue-400">{reportsData[currentViewId]}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-2xl text-xs text-slate-500">
                  لا يوجد رقم تقرير محفوظ حالياً.
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h4 className="font-bold text-xs text-amber-400 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                <AlertCircle size={14} /> ملاحظات "مهم" الحالية:
              </h4>
              <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[60px]">
                {importantData[currentViewId] || 'لا توجد ملاحظات محفوظة.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
