import React from 'react';
import { RefreshCw, Activity, User, Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';
import { formatThaiDateTime } from '../services/sheetService';

interface HeaderProps {
  lastUpdated: Date;
  isRefreshing: boolean;
  onRefresh: () => void;
  totalRecords: number;
  filteredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isRefreshing,
  onRefresh,
  totalRecords,
  filteredCount,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Title and Author */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-400 to-teal-300 flex items-center justify-center text-white shadow-sm shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                  รายงานข้อมูลผลคัดกรองสุขภาพเบื้องต้น
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                  ระบบเชื่อมต่อข้อมูลอัตโนมัติ
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  ชื่อผู้จัดทำ : <span className="text-slate-800 font-semibold">นางสาวกัญญาวดี พรมอิน นักศึกษาเวชระเบียน</span>
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  วันที่/เวลาที่อัปเดตข้อมูล : <span className="text-slate-700 font-medium">{formatThaiDateTime(lastUpdated)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons & dataset status */}
          <div className="flex items-center gap-2.5 self-end md:self-center">
            <div className="text-right hidden lg:block">
              <p className="text-xs text-slate-400 font-normal">สถานะฐานข้อมูล</p>
              <p className="text-xs font-semibold text-slate-700 flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                พบข้อมูล {totalRecords} รายการ {filteredCount !== totalRecords && `(กรองแล้ว ${filteredCount})`}
              </p>
            </div>

            <button
              id="refresh-data-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-xs ${
                isRefreshing
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white active:scale-95 hover:shadow-md'
              }`}
              title="ดึงข้อมูลล่าสุดจาก Google Sheets"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-slate-400' : 'text-white'}`} />
              <span>{isRefreshing ? 'กำลังอัปเดตข้อมูล...' : 'Refresh / Update Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
