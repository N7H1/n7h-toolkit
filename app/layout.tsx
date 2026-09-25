import React from 'react';
import { 
  Home, Monitor, Gamepad2, Volume2, Globe, FileText, Code, Palette, 
  Bot, Wrench, Bookmark, Settings, Moon, Bell, Search, User, 
  ExternalLink, ChevronLeft, Cpu, HardDrive, Wifi, Zap, Lock
} from 'lucide-react';

export default function Dashboard() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#0b0f19] text-gray-200 font-sans flex flex-col">
      {/* Header / Top Navbar */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#111827] border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl tracking-wider">
            N7H
          </div>
          <span className="font-semibold text-lg text-white">PC TOOLKIT</span>
        </div>

        {/* Search Bar */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="ابحث عن أداة أو اسم..."
            className="w-full bg-[#1f293d] text-sm text-gray-200 pl-4 pr-10 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-white rounded-lg bg-[#1f293d]">
            <Moon className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white rounded-lg bg-[#1f293d]">
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 bg-[#1f293d] px-3 py-1.5 rounded-lg border border-gray-700">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white">
              N
            </div>
            <span className="text-sm font-medium">N7H</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar Left Navigation */}
        <aside className="w-64 bg-[#111827] border-l border-gray-800 p-4 flex flex-col justify-between">
          <nav className="space-y-1 text-sm">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-blue-600 text-white rounded-lg font-medium">
              <Home className="w-4 h-4" /> الرئيسية
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-[#1f293d] hover:text-white rounded-lg">
              <Monitor className="w-4 h-4" /> أدوات النظام
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-[#1f293d] hover:text-white rounded-lg">
              <Gamepad2 className="w-4 h-4" /> أدوات الألعاب
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-[#1f293d] hover:text-white rounded-lg">
              <Volume2 className="w-4 h-4" /> أدوات الصوت
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-[#1f293d] hover:text-white rounded-lg">
              <Globe className="w-4 h-4" /> أدوات الإنترنت
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-[#1f293d] hover:text-white rounded-lg">
              <FileText className="w-4 h-4" /> أدوات الملفات
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-[#1f293d] hover:text-white rounded-lg">
              <Code className="w-4 h-4" /> أدوات المبرمجين
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-[#1f293d] hover:text-white rounded-lg">
              <Palette className="w-4 h-4" /> أدوات التصميم
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-[#1f293d] hover:text-white rounded-lg">
              <Bot className="w-4 h-4" /> أدوات الذكاء الاصطناعي
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-[#1f293d] hover:text-white rounded-lg">
              <Wrench className="w-4 h-4" /> حل مشكلة الكمبيوتر
            </a>

            <div className="pt-4 border-t border-gray-800 space-y-1">
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white">
                <Bookmark className="w-4 h-4" /> المفضلة
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white">
                <Settings className="w-4 h-4" /> إعدادات الحساب
              </a>
            </div>
          </nav>

          {/* Bottom Sidebar Box */}
          <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 text-center space-y-3">
            <Zap className="w-6 h-6 text-blue-400 mx-auto" />
            <h4 className="text-sm font-semibold text-white">أهلاً بك في N7H</h4>
            <p className="text-xs text-gray-400">كل ما تحتاجه لجهازك في مكان واحد</p>
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium">
              ابدأ الآن
            </button>
          </div>
        </aside>

        {/* Middle Content Section */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Banner */}
          <div className="bg-gradient-to-r from-blue-900/60 via-[#111827] to-[#111827] p-8 rounded-2xl border border-blue-900/40 relative overflow-hidden flex justify-between items-center">
            <div className="space-y-4 max-w-lg z-10">
              <h1 className="text-3xl font-bold text-white">مرحباً بك في N7H PC Toolkit</h1>
              <p className="text-sm text-gray-300 leading-relaxed">
                مجموعة شاملة من الأدوات التي تساعدك على تحسين أداء جهازك، وحل المشكلات، وتسهيل حياتك الرقمية.
              </p>
              <div className="flex gap-3 pt-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2">
                  ابدأ الآن <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="bg-[#1f293d] hover:bg-gray-800 text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-700">
                  استكشف الأدوات
                </button>
              </div>
            </div>
            {/* Visual Deco */}
            <div className="hidden lg:block w-64 h-36 bg-blue-600/10 rounded-xl border border-blue-500/20 flex items-center justify-center">
              <Monitor className="w-20 h-20 text-blue-500/40" />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-[#111827] p-5 rounded-xl border border-red-900/30 hover:border-red-500/50 transition space-y-3">
              <div className="bg-red-500/10 p-2.5 w-fit rounded-lg text-red-500">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">أدوات الألعاب</h3>
              <p className="text-xs text-gray-400">تحسين الأداء، إعدادات، وحاسبات</p>
              <ul className="text-xs space-y-1.5 text-gray-300 pt-2 border-t border-gray-800">
                <li>• حاسبة الحساسية</li>
                <li>• اختبار FPS</li>
                <li>• إعدادات اللاعبين</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-[#111827] p-5 rounded-xl border border-blue-900/30 hover:border-blue-500/50 transition space-y-3">
              <div className="bg-blue-500/10 p-2.5 w-fit rounded-lg text-blue-500">
                <Monitor className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">أدوات النظام</h3>
              <p className="text-xs text-gray-400">معلومات، صيانة، وحلول</p>
              <ul className="text-xs space-y-1.5 text-gray-300 pt-2 border-t border-gray-800">
                <li>• معلومات الجهاز</li>
                <li>• حاسبة الطاقة (PSU)</li>
                <li>• إدارة التخزين</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-[#111827] p-5 rounded-xl border border-emerald-900/30 hover:border-emerald-500/50 transition space-y-3">
              <div className="bg-emerald-500/10 p-2.5 w-fit rounded-lg text-emerald-500">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">أدوات الإنترنت</h3>
              <p className="text-xs text-gray-400">اختبار السرعة، الشبكة، والأمان</p>
              <ul className="text-xs space-y-1.5 text-gray-300 pt-2 border-t border-gray-800">
                <li>• Speed Test</li>
                <li>• Ping Test</li>
                <li>• IP Lookup</li>
              </ul>
            </div>

            {/* Card 4 */}
            <div className="bg-[#111827] p-5 rounded-xl border border-purple-900/30 hover:border-purple-500/50 transition space-y-3">
              <div className="bg-purple-500/10 p-2.5 w-fit rounded-lg text-purple-500">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">أدوات الصوت</h3>
              <p className="text-xs text-gray-400">اختبار وتحسين الصوت</p>
              <ul className="text-xs space-y-1.5 text-gray-300 pt-2 border-t border-gray-800">
                <li>• اختبار المايك</li>
                <li>• اختبار السماعات</li>
                <li>• مستوى الصوت</li>
              </ul>
            </div>
          </div>

          {/* Troubleshoot Footer Bar */}
          <div className="bg-[#111827] p-4 rounded-xl border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5 text-blue-500" />
              <div>
                <h4 className="text-sm font-bold text-white">حل مشكلة الكمبيوتر</h4>
                <p className="text-xs text-gray-400">تشخيص ودخول للمشاكل الشائعة</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-xs bg-[#1f293d] px-3 py-1.5 rounded text-gray-300">النت بطيء</span>
              <span className="text-xs bg-[#1f293d] px-3 py-1.5 rounded text-gray-300">اللعبة تقفل</span>
              <span className="text-xs bg-[#1f293d] px-3 py-1.5 rounded text-gray-300">الشاشة سوداء</span>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-72 bg-[#111827] border-r border-gray-800 p-4 space-y-6">
          {/* User Specs */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400">مواصفات جهازك</h3>
            <div className="bg-[#1f293d] p-3 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <Monitor className="w-4 h-4 text-blue-400" /> Windows 11 Pro
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Cpu className="w-4 h-4 text-blue-400" /> Intel Core i7-14700K
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Zap className="w-4 h-4 text-blue-400" /> NVIDIA GeForce RTX 4070
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <HardDrive className="w-4 h-4 text-blue-400" /> 32 GB RAM
              </div>
            </div>
          </div>

          {/* Quick Tools */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400">أدوات سريعة</h3>
            <div className="space-y-2 text-xs">
              <button className="w-full bg-[#1f293d] hover:bg-gray-700 p-2.5 rounded-lg flex items-center justify-between text-gray-200">
                <span>معلومات الجهاز</span>
                <Monitor className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full bg-[#1f293d] hover:bg-gray-700 p-2.5 rounded-lg flex items-center justify-between text-gray-200">
                <span>اختبار سرعة الإنترنت</span>
                <Wifi className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full bg-[#1f293d] hover:bg-gray-700 p-2.5 rounded-lg flex items-center justify-between text-gray-200">
                <span>مولد كلمة مرور</span>
                <Lock className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
