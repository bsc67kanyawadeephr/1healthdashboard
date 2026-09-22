import React from 'react';
import { HealthRecord } from '../types';
import { getHealthRiskAnalytics, getHealthTrendAnalytics } from '../utils/analytics';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { ShieldAlert, TrendingUp, Heart, Activity } from 'lucide-react';

interface VisualizationsRiskTrendProps {
  records: HealthRecord[];
}

export const VisualizationsRiskTrend: React.FC<VisualizationsRiskTrendProps> = ({ records }) => {
  const { riskPieData, dmData, htData, bmiData } = getHealthRiskAnalytics(records);
  const { trendData, monthlyData } = getHealthTrendAnalytics(records);

  // Group screening for DM & HT combined chart
  const diseaseComparison = [
    {
      name: 'โรคเบาหวาน (DM)',
      'ไม่มีความเสี่ยง': dmData.find((d) => d.name === 'ไม่มีความเสี่ยง')?.value || 0,
      'มีแนวโน้ม/เสี่ยง': dmData.find((d) => d.name === 'มีแนวโน้ม/เสี่ยง')?.value || 0,
    },
    {
      name: 'โรคความดันโลหิตสูง (HT)',
      'ไม่มีความเสี่ยง': htData.find((d) => d.name === 'ไม่มีความเสี่ยง')?.value || 0,
      'มีแนวโน้ม/เสี่ยง': htData.find((d) => d.name === 'มีแนวโน้ม/เสี่ยง')?.value || 0,
    },
  ];

  return (
    <div className="space-y-8 mb-8">
      {/* 3.1 Health Risk Section */}
      <section aria-labelledby="health-risk-heading" className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex items-start sm:items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                3.1
              </span>
              <h3 id="health-risk-heading" className="text-base sm:text-lg font-bold text-slate-800">
                Health Risk: การวิเคราะห์ความเสี่ยงด้านสุขภาพ
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              วิเคราะห์ 4 ฟิลด์หลัก: <strong>ระดับความเสี่ยง, เบาหวาน_คัดกรอง, ความดันโลหิตสูง_คัดกรอง, และ BMI</strong>
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
            4 Fields Visualized
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: ระดับความเสี่ยง (Pie / Donut) */}
          <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
            <div className="mb-2">
              <h4 className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                <span>1. สัดส่วนระดับความเสี่ยง</span>
                <span className="text-xs text-slate-400 font-normal">ต่ำ / กลาง / สูง</span>
              </h4>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any, item: any) => [
                      `${value} ราย (${item.payload.percentage}%)`,
                      name,
                    ]}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-200/60 text-center text-xs">
              {riskPieData.map((item) => (
                <div key={item.name} className="p-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-full mr-1" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 block text-[11px] truncate">{item.name.replace('ความเสี่ยง', '')}</span>
                  <strong className="text-slate-800">{item.count}</strong> <span className="text-slate-400 text-[10px]">({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: เบาหวาน & ความดันโลหิตสูง คัดกรอง */}
          <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
            <div className="mb-2">
              <h4 className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                <span>2 & 3. ผลคัดกรองเบาหวาน & ความดัน</span>
                <span className="text-xs text-slate-400 font-normal">DM & HT Risk</span>
              </h4>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diseaseComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="ไม่มีความเสี่ยง" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="มีแนวโน้ม/เสี่ยง" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-500 text-center">
              กลุ่มที่มีแนวโน้ม/เสี่ยง มีความดันโลหิตสูงพบมากกว่าเบาหวานอย่างมีนัยสำคัญ
            </div>
          </div>

          {/* Chart 3: การกระจายตัวตามเกณฑ์ BMI */}
          <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
            <div className="mb-2">
              <h4 className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                <span>4. การกระจายตัวดัชนีมวลกาย (BMI)</span>
                <span className="text-xs text-slate-400 font-normal">เกณฑ์เอเชีย</span>
              </h4>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bmiData}
                  layout="vertical"
                  margin={{ top: 5, right: 15, left: 35, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} />
                  <Tooltip
                    formatter={(val: any, name: any, item: any) => [
                      `${val} ราย (${item.payload.percentage}%)`,
                      'จำนวนผู้รับการคัดกรอง',
                    ]}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#818cf8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-500 text-center">
              ส่วนใหญ่จัดอยู่ในกลุ่มอ้วนระดับ 1 และน้ำหนักเกิน
            </div>
          </div>
        </div>
      </section>

      {/* 3.2 Health Trend Section */}
      <section aria-labelledby="health-trend-heading" className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex items-start sm:items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                3.2
              </span>
              <h3 id="health-trend-heading" className="text-base sm:text-lg font-bold text-slate-800">
                Health Trend: การวิเคราะห์แนวโน้มสุขภาพตามช่วงเวลา
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              วิเคราะห์ 2 ฟิลด์หลัก: <strong>วันที่คัดกรอง และ คะแนนความเสี่ยง</strong> (เปรียบเทียบแนวโน้มคะแนนเฉลี่ยและสัดส่วนผู้เสี่ยงสูง)
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
            2 Fields Visualized (Time & Score)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline Trend Line / Area Chart */}
          <div className="lg:col-span-2 bg-slate-50/60 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-700">
                แนวโน้มคะแนนความเสี่ยงตามวันที่คัดกรอง (Daily / Periodic Risk Trend)
              </h4>
              <span className="text-xs text-slate-400">แกน Y: คะแนนความเสี่ยง (0-7)</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} interval="preserveStartEnd" />
                  <YAxis domain={[0, 7]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) return `วันที่: ${payload[0].payload.dateRaw}`;
                      return label;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Area
                    type="monotone"
                    dataKey="avgScore"
                    name="คะแนนความเสี่ยงเฉลี่ย"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#scoreColor)"
                  />
                  <Line
                    type="monotone"
                    dataKey="maxScore"
                    name="คะแนนสูงสุดในวันนั้น"
                    stroke="#f43f5e"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Trend Summary Cards */}
          <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">
              เปรียบเทียบแนวโน้มรายเดือน (Monthly Trend)
            </h4>
            <div className="space-y-3">
              {monthlyData.map((m) => (
                <div key={m.month} className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800">{m.name}</span>
                    <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                      เสี่ยงสูง {m.highRiskPercent}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>
                      ตรวจคัดกรอง: <strong className="text-slate-700">{m.count}</strong> ราย
                    </div>
                    <div>
                      คะแนนเฉลี่ย: <strong className="text-slate-700">{m.avgScore}</strong> / 7
                    </div>
                  </div>
                  {/* Mini progress bar for risk */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-rose-400 h-full rounded-full"
                      style={{ width: `${Math.min(m.highRiskPercent, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-200 text-center">
              แนวโน้มพบผู้มีความเสี่ยงสูงเฉลี่ยใกล้เคียงกันตลอดช่วงไตรมาสแรก
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
