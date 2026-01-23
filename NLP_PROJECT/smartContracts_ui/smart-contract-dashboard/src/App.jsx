import React, { useState } from "react";
import SmartContractDashboard from "./SmartContractDashboard";
import AnalyzerDashboard from "./AnalyzerDashboard";

export default function SidebarDashboard() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* SIDEBAR */}
      <div className="w-64 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 border-r border-slate-700/50 flex flex-col shadow-2xl">
        
        {/* HEADER */}
        <div className="px-6 py-8 border-b border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-xl">⚡</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Smart Panel</h1>
              <p className="text-xs text-slate-400">v2.0</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
            Menü
          </p>
          
          <button
            onClick={() => setTab("analyzer")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
              ${
                tab === "dashboard"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
          >
            <span className={`text-xl transition-transform duration-200 ${tab === "dashboard" ? "scale-110" : "group-hover:scale-110"}`}>
              🏠
            </span>
            <span className="text-sm font-semibold">Analyzer</span>
            {tab === "dashboard" && (
              <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
              ${
                tab === "analyzer"
                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
          >
            <span className={`text-xl transition-transform duration-200 ${tab === "analyzer" ? "scale-110" : "group-hover:scale-110"}`}>
              🧠
            </span>
            <span className="text-sm font-semibold">Dashboard</span>
            {tab === "dashboard" && (
              <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            )}
          </button>
        </nav>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/30 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-sm">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">User</p>
              <p className="text-xs text-slate-500">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {tab === "analyzer" && <AnalyzerDashboard />}
        {tab === "dashboard" && <SmartContractDashboard />}
      </div>
    </div>
  );
}