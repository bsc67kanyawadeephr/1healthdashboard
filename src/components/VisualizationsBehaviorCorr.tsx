import React from 'react';
import { HealthRecord } from '../types';
import { getHealthBehaviorAnalytics, getAdvancedCrossAnalytics } from '../utils/analytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from 'recharts';
import { HeartPulse, Compass, AlertCircle, Sparkles, Scale, Cigarette, Wine, Dumbbell } from 'lucide-react';

interface VisualizationsBehaviorCorrProps {
  records: HealthRecord[];
}

export const VisualizationsBehaviorCorr: React.FC<VisualizationsBehaviorCorrProps> = ({ records }) => {
  const { exerciseData, smokingMap, alcoholMap, genderComparisonData } = getHealthBehaviorAnalytics(records);
  const { ageRiskData, areaRiskData, bmiBpScatter, behaviorVsRisk } = getAdvancedCrossAnalytics(records);

  const total = records.length || 1;
  const smokerPercent = +((smokingMap['สูบ'] / total) * 100).toFixed(1);
  const alcoholPercent = +((alcoholMap['ดื่ม'] / total) * 100).toFixed(1);

  return (
    <div className="space-y-8 mb-8">
      {/* 3.3 Health Behavior Section */}
      <section aria-labelledby="behavior-heading" className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex items-start sm:items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                3.3
              </span>
              <h3 id="behavior-heading" className="text-base sm:text-lg font-bold text-slate-800">
                Health Behavior: การวิเคราะห์พฤติกรรมสุขภาพ
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              วิเคราะห์ 4 ฟิลด์พฤติกรรมหลัก: <strong>การออกกำลังกาย, สูบบุหรี่, ดื่มแอลกอฮอล์, และเพศ</strong>
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
            4 Fields Visualized (Behavior & Gender)
          </span>
        </div>

        {/* 3 Behavior Metric Mini Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">การออกกำลังกายสม่ำเสมอ</p>
              <p className="text-base font-bold text-slate-800">
                {exerciseData.find((e) => e.name === 'สม่ำเสมอ')?.count || 0} ราย{' '}
                <span className="text-xs text-teal-600 font-normal">
                  ({exerciseData.find((e) => e.name === 'สม่ำเสมอ')?.percentage}%)
                </span>
              </p>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-100/70 text-rose-700 flex items-center justify-center shrink-0">
              <Cigarette className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">การสูบบุหรี่</p>
              <p className="text-base font-bold text-slate-800">
                {smokingMap['สูบ']} ราย{' '}
                <span className="text-xs text-rose-600 font-normal">({smokerPercent}%)</span>
              </p>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
              <Wine className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">การดื่มแอลกอฮอล์</p>
              <p className="text-base font-bold text-slate-800">
                {alcoholMap['ดื่ม']} ราย{' '}
                <span className="text-xs text-amber-600 font-normal">({alcoholPercent}%)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Charts: Exercise distribution & Gender behavior comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">
              ระดับการออกกำลังกายของผู้รับการคัดกรอง (Exercise Frequency)
            </h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exerciseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    formatter={(val: any, name: any, item: any) => [
                      `${val} ราย (${item.payload.percentage}%)`,
                      'จำนวนผู้ตรวจ',
                    ]}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">
              เปรียบเทียบพฤติกรรมเสี่ยงจำแนกตามเพศ (ชาย vs หญิง %)
            </h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genderComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="behavior" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis unit="%" tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, '']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="ชาย" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="หญิง" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: 4 Core Advanced Analytics Views */}
      <section aria-labelledby="deep-analytics-heading" className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex items-start sm:items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
                4.0
              </span>
              <h3 id="deep-analytics-heading" className="text-base sm:text-lg font-bold text-slate-800">
                การวิเคราะห์เชิงลึก 4 ด้านสำคัญ (Key Health Analytics)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              1. กลุ่มอายุเสี่ยงสูง • 2. พื้นที่เสี่ยงสูง • 3. ความสัมพันธ์ BMI กับความดัน • 4. พฤติกรรมกับระดับความเสี่ยง
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
            Comprehensive Insights
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 4.1 กลุ่มอายุที่มีความเสี่ยงสูง */}
          <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  4.1 กลุ่มอายุที่มีความเสี่ยงสูง (Risk by Age Groups)
                </h4>
                <span className="text-[11px] text-slate-400">จำแนกระดับเสี่ยง</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                กลุ่มอายุ 60 ปีขึ้นไปมีความชุกของระดับความเสี่ยงสูงมากที่สุดถึง 100%
              </p>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="ageGroup" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="ความเสี่ยงต่ำ" stackId="a" fill="#10b981" />
                  <Bar dataKey="ความเสี่ยงปานกลาง" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="ความเสี่ยงสูง" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4.2 พื้นที่ที่มีผู้เสี่ยงสูง */}
          <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  4.2 พื้นที่ที่มีผู้เสี่ยงสูง (High Risk by Areas)
                </h4>
                <span className="text-[11px] text-slate-400">เรียงตาม % เสี่ยงสูง</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                พื้นที่ที่มีสัดส่วนผู้มีความเสี่ยงสูงมากที่สุด ได้แก่ <strong>ใต้</strong> และ <strong>ตะวันออก</strong>
              </p>
            </div>

            <div className="space-y-2.5">
              {areaRiskData.map((a) => (
                <div key={a.area} className="bg-white p-3 rounded-xl border border-slate-200/70">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800">
                      พื้นที่: {a.area} <span className="font-normal text-slate-400">({a.total} ราย)</span>
                    </span>
                    <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                      เสี่ยงสูง {a.highRiskPercent}% ({a.high} ราย)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-400 h-full" style={{ width: `${(a.low / a.total) * 100}%` }} title={`ต่ำ: ${a.low}`} />
                    <div className="bg-amber-400 h-full" style={{ width: `${(a.mid / a.total) * 100}%` }} title={`ปานกลาง: ${a.mid}`} />
                    <div className="bg-rose-500 h-full" style={{ width: `${(a.high / a.total) * 100}%` }} title={`สูง: ${a.high}`} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>BMI เฉลี่ย: {a.avgBmi}</span>
                    <span>ความดันเฉลี่ย: {a.avgSbp} mmHg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4.3 ความสัมพันธ์ระหว่าง BMI กับความดัน (Scatter / Quadrant) */}
          <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  4.3 ความสัมพันธ์ระหว่าง BMI กับความดัน (BMI vs SBP)
                </h4>
                <span className="text-[11px] text-slate-400">Scatter Plot</span>
              </div>
              <p className="text-xs text-slate-500 mb-2">
                ผู้รับการคัดกรองที่มีค่า BMI สูง (≥25) มีแนวโน้มค่าความดันโลหิตตัวบน SBP สูงขึ้นอย่างชัดเจน
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="bmi"
                    name="BMI"
                    unit=" kg/m²"
                    domain={[18, 35]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="sbp"
                    name="SBP"
                    unit=" mmHg"
                    domain={[100, 170]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <ZAxis type="number" dataKey="riskScore" range={[40, 140]} />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(value: any, name: any, item: any) => {
                      if (name === 'BMI') return [`${value} kg/m²`, 'ค่าดัชนีมวลกาย'];
                      if (name === 'SBP') return [`${value} mmHg`, 'ความดันโลหิตตัวบน'];
                      return [value, name];
                    }}
                  />
                  <Scatter name="ผู้รับการคัดกรอง" data={bmiBpScatter}>
                    {bmiBpScatter.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.riskLevel === 'สูง' ? '#f43f5e' : entry.riskLevel === 'ปานกลาง' ? '#f59e0b' : '#10b981'}
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> เสี่ยงต่ำ
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> เสี่ยงปานกลาง
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> เสี่ยงสูง
              </span>
            </div>
          </div>

          {/* 4.4 พฤติกรรมกับระดับความเสี่ยง */}
          <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  4.4 พฤติกรรมกับระดับความเสี่ยง (Behavior vs High Risk %)
                </h4>
                <span className="text-[11px] text-slate-400">% เสี่ยงสูงตามกลุ่ม</span>
              </div>
              <p className="text-xs text-slate-500 mb-2">
                ผู้ที่ <strong>ไม่ออกกำลังกาย</strong> และ <strong>สูบบุหรี่</strong> มีสัดส่วนการตกอยู่ในกลุ่มเสี่ยงสูงมากกว่าปกติ
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={behaviorVsRisk}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" unit="%" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="behavior" tick={{ fontSize: 10, fill: '#475569' }} />
                  <Tooltip
                    formatter={(val: any, name: any, item: any) => [
                      `${val}% (เสี่ยงสูง ${item.payload.highRisk} จาก ${item.payload.total} ราย)`,
                      'ร้อยละความเสี่ยงสูง',
                    ]}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="percent" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-200">
              กลุ่มที่ออกกำลังกายสม่ำเสมอพบผู้มีความเสี่ยงสูง 0%
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
