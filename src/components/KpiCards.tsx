import React from 'react';
import { KpiSummary } from '../types';
import { Users, Scale, PieChart, Percent, AlertTriangle, HeartPulse, Activity } from 'lucide-react';

interface KpiCardsProps {
  kpi: KpiSummary;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpi }) => {
  return (
    <section aria-labelledby="kpi-overview-heading" className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 id="kpi-overview-heading" className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-600" />
            Health Overview: การสรุปข้อมูลสำคัญ (KPI Cards)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            สรุปข้อมูลสุขภาพ 4 ด้านตามเกณฑ์มาตรฐาน: <strong>จำนวน, ค่าเฉลี่ย, สัดส่วน, และร้อยละ</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: จำนวน (Count) */}
        <div
          id="kpi-card-count"
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              จำนวน (Count)
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-100/70 text-sky-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">จำนวนผู้รับการคัดกรองทั้งหมด</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                {kpi.totalCount}
              </span>
              <span className="text-sm font-medium text-slate-500">ราย</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>เสี่ยงสูง: <strong className="text-rose-600">{kpi.highRiskCount}</strong> ราย</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>ปานกลาง: <strong className="text-amber-600">{kpi.mediumRiskCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>ต่ำ: <strong className="text-emerald-600">{kpi.lowRiskCount}</strong></span>
            </div>
          </div>
        </div>

        {/* KPI 2: ค่าเฉลี่ย (Average) */}
        <div
          id="kpi-card-average"
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              ค่าเฉลี่ย (Average)
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-100/70 text-teal-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">ค่าเฉลี่ยดัชนีมวลกาย (BMI เฉลี่ย)</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                {kpi.avgBmi}
              </span>
              <span className="text-sm font-medium text-slate-500">kg/m²</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                kpi.avgBmi >= 25 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {kpi.avgBmi >= 25 ? 'เกณฑ์น้ำหนักเกิน' : 'เกณฑ์สมส่วน'}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block text-[11px]">ความดันเฉลี่ย</span>
              <strong className="text-slate-800">{kpi.avgSbp}/{kpi.avgDbp}</strong> mmHg
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">คะแนนเสี่ยงเฉลี่ย</span>
              <strong className="text-slate-800">{kpi.avgRiskScore}</strong> / 7 คะแนน
            </div>
          </div>
        </div>

        {/* KPI 3: สัดส่วน (Ratio) */}
        <div
          id="kpi-card-ratio"
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              สัดส่วน (Ratio)
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-100/70 text-indigo-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">สัดส่วนผู้มีความเสี่ยงสูงต่อทั้งหมด</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                {kpi.highRiskRatioText}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">ในทุกประชากรที่ตรวจสุขภาพ</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block text-[11px]">สัดส่วนเพศ</span>
              <strong className="text-slate-800">{kpi.genderRatioText}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">อายุเฉลี่ย</span>
              <strong className="text-slate-800">{kpi.avgAge}</strong> ปี
            </div>
          </div>
        </div>

        {/* KPI 4: ร้อยละ (Percentage) */}
        <div
          id="kpi-card-percentage"
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              ร้อยละ (Percentage)
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-100/70 text-rose-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">ร้อยละของผู้ที่มีความเสี่ยงสูง</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-rose-600 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                {kpi.percentHighRisk}%
              </span>
              <span className="text-xs text-slate-400">({kpi.highRiskCount} จาก {kpi.totalCount} ราย)</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block text-[11px]">เสี่ยงเบาหวาน</span>
              <strong className="text-amber-700">{kpi.percentDiabetesRisk}%</strong> ({kpi.diabetesRiskCount} ราย)
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">เสี่ยงความดันสูง</span>
              <strong className="text-rose-700">{kpi.percentHypertensionRisk}%</strong> ({kpi.hypertensionRiskCount} ราย)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
