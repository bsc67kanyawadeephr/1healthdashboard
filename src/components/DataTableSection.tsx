import React, { useState } from 'react';
import { HealthRecord } from '../types';
import { getAreaDemographicSummary, AreaDemographicSummaryRow } from '../utils/analytics';
import { TableProperties, FileSpreadsheet, Eye, ChevronLeft, ChevronRight, ArrowUpDown, Filter } from 'lucide-react';
import { RecordDetailModal } from './RecordDetailModal';

interface DataTableSectionProps {
  records: HealthRecord[];
}

export const DataTableSection: React.FC<DataTableSectionProps> = ({ records }) => {
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Sorting for individual records
  const [sortField, setSortField] = useState<keyof HealthRecord>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Summary by Area and Demographic
  const summaryRows = getAreaDemographicSummary(records);

  const handleSort = (field: keyof HealthRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedRecords = [...records].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') {
      return sortOrder === 'asc'
        ? (aVal as string).localeCompare(bVal as string, 'th')
        : (bVal as string).localeCompare(aVal as string, 'th');
    }
    return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = sortedRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-8 mb-8">
      {/* 1. สรุปผลการคัดกรองจำแนกตามพื้นที่และกลุ่มประชากร */}
      <section aria-labelledby="area-demographic-heading" className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex items-start sm:items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                5.1
              </span>
              <h3 id="area-demographic-heading" className="text-base sm:text-lg font-bold text-slate-800">
                สรุปผลการคัดกรองจำแนกตามพื้นที่และกลุ่มประชากร
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              แสดงการสรุปเชิงลึกแยกตามพื้นที่ x เพศ พร้อม Conditional Formatting ไฮไลต์กลุ่มเสี่ยงสำคัญ
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
            Pivot Summary Matrix
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-3">พื้นที่</th>
                <th className="py-3 px-3">เพศ</th>
                <th className="py-3 px-3 text-center">จำนวนตรวจ (ราย)</th>
                <th className="py-3 px-3 text-center">อายุเฉลี่ย (ปี)</th>
                <th className="py-3 px-3 text-center">BMI เฉลี่ย</th>
                <th className="py-3 px-3 text-center">ความดันเฉลี่ย (mmHg)</th>
                <th className="py-3 px-3 text-center">น้ำตาลเฉลี่ย (mg/dL)</th>
                <th className="py-3 px-3 text-center">ผู้เสี่ยงสูง (ราย / %)</th>
                <th className="py-3 px-3 text-center">% เสี่ยงเบาหวาน</th>
                <th className="py-3 px-3 text-center">% เสี่ยงความดัน</th>
                <th className="py-3 px-3 text-center">คะแนนเฉลี่ย</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summaryRows.map((row, idx) => {
                // Conditional Formatting checks
                const isHighRiskHeavy = row.highRiskPercent >= 40;
                const isBmiHigh = row.avgBmi >= 25.0;
                const isSbpHigh = row.avgSbp >= 135;
                const isGlucoseHigh = row.avgGlucose >= 120;

                return (
                  <tr key={`${row.area}-${row.gender}`} className={`hover:bg-slate-50/70 transition-colors ${
                    isHighRiskHeavy ? 'bg-rose-50/20' : ''
                  }`}>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{row.area}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        row.gender === 'ชาย' ? 'bg-sky-50 text-sky-700' : 'bg-pink-50 text-pink-700'
                      }`}>
                        {row.gender}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">{row.count}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{row.avgAge}</td>
                    {/* BMI with pastel yellow/red formatting */}
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-1.5 py-0.5 rounded font-medium ${
                        isBmiHigh ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'text-slate-700'
                      }`}>
                        {row.avgBmi}
                      </span>
                    </td>
                    {/* BP with pastel red formatting */}
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-1.5 py-0.5 rounded font-medium ${
                        isSbpHigh ? 'bg-rose-100/70 text-rose-900 border border-rose-200' : 'text-slate-700'
                      }`}>
                        {row.avgSbp} / {row.avgDbp}
                      </span>
                    </td>
                    {/* Glucose formatting */}
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-1.5 py-0.5 rounded font-medium ${
                        isGlucoseHigh ? 'bg-rose-100/70 text-rose-900 border border-rose-200' : 'text-slate-700'
                      }`}>
                        {row.avgGlucose}
                      </span>
                    </td>
                    {/* % High Risk formatting (Red / Yellow) */}
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                        row.highRiskPercent >= 50
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : row.highRiskPercent > 0
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {row.highRiskCount} ({row.highRiskPercent}%)
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={row.diabetesRiskPercent > 30 ? 'font-bold text-rose-700' : 'text-slate-600'}>
                        {row.diabetesRiskPercent}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={row.hypertensionRiskPercent > 40 ? 'font-bold text-rose-700' : 'text-slate-600'}>
                        {row.hypertensionRiskPercent}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">{row.avgRiskScore}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. ตารางข้อมูลผลคัดกรองรายบุคคล */}
      <section aria-labelledby="individual-records-heading" className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex items-start sm:items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
                5.2
              </span>
              <h3 id="individual-records-heading" className="text-base sm:text-lg font-bold text-slate-800">
                ตารางข้อมูลผลคัดกรองสุขภาพรายบุคคล (Detail View)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ใช้ <strong>Conditional Formatting โทนสีแดงพาสเทล / สีเหลืองพาสเทล</strong> เน้นข้อมูลผู้ที่มีความเสี่ยงสูง • คลิกแถวเพื่อดูรายละเอียด
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-rose-200 border border-rose-300 inline-block"></span> เสี่ยงสูง (แดงพาสเทล)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-200 border border-amber-300 inline-block"></span> เสี่ยงปานกลาง (เหลืองพาสเทล)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-200 border border-emerald-300 inline-block"></span> เสี่ยงต่ำ (เขียวพาสเทล)
            </span>
          </div>
        </div>

        {/* Individual Records Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-semibold select-none">
              <tr>
                <th onClick={() => handleSort('id')} className="py-3 px-3 cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center gap-1">รหัส <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th onClick={() => handleSort('screeningDate')} className="py-3 px-3 cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center gap-1">วันที่คัดกรอง <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th onClick={() => handleSort('area')} className="py-3 px-3 cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center gap-1">พื้นที่ <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th onClick={() => handleSort('gender')} className="py-3 px-3 cursor-pointer hover:bg-slate-100">
                  <div className="flex items-center gap-1">เพศ <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th onClick={() => handleSort('age')} className="py-3 px-3 cursor-pointer hover:bg-slate-100 text-center">
                  <div className="flex items-center justify-center gap-1">อายุ <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th onClick={() => handleSort('bmi')} className="py-3 px-3 cursor-pointer hover:bg-slate-100 text-center">
                  <div className="flex items-center justify-center gap-1">BMI <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th onClick={() => handleSort('sbp')} className="py-3 px-3 cursor-pointer hover:bg-slate-100 text-center">
                  <div className="flex items-center justify-center gap-1">ความดัน SBP/DBP <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th onClick={() => handleSort('bloodGlucose')} className="py-3 px-3 cursor-pointer hover:bg-slate-100 text-center">
                  <div className="flex items-center justify-center gap-1">น้ำตาล <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3">พฤติกรรม (สูบ/ดื่ม/ออกกำลัง)</th>
                <th className="py-3 px-3 text-center">ผลคัดกรอง DM</th>
                <th className="py-3 px-3 text-center">ผลคัดกรอง HT</th>
                <th onClick={() => handleSort('riskScore')} className="py-3 px-3 cursor-pointer hover:bg-slate-100 text-center">
                  <div className="flex items-center justify-center gap-1">คะแนนเสี่ยง <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th onClick={() => handleSort('riskLevel')} className="py-3 px-3 cursor-pointer hover:bg-slate-100 text-center">
                  <div className="flex items-center justify-center gap-1">ระดับความเสี่ยง <ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                </th>
                <th className="py-3 px-3 text-center">ตรวจดู</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-8 text-center text-slate-400">
                    ไม่พบข้อมูลที่ตรงกับตัวกรองที่เลือก
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r) => {
                  const isHigh = r.riskLevel === 'สูง';
                  const isMid = r.riskLevel === 'ปานกลาง';
                  const isLow = r.riskLevel === 'ต่ำ';

                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedRecord(r)}
                      className={`cursor-pointer transition-colors ${
                        isHigh
                          ? 'bg-rose-50/40 hover:bg-rose-100/40'
                          : isMid
                          ? 'bg-amber-50/30 hover:bg-amber-100/40'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-900">{r.id}</td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{r.screeningDate}</td>
                      <td className="py-2.5 px-3 text-slate-800 font-medium">{r.area}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                          r.gender === 'ชาย' ? 'bg-sky-50 text-sky-700' : 'bg-pink-50 text-pink-700'
                        }`}>
                          {r.gender}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-700">{r.age}</td>

                      {/* BMI with Conditional Colors */}
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                          r.bmi >= 30
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : r.bmi >= 25
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'text-slate-700'
                        }`}>
                          {r.bmi}
                        </span>
                      </td>

                      {/* SBP/DBP with Conditional Colors */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                          r.sbp >= 140 || r.dbp >= 90
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : r.sbp >= 130
                            ? 'bg-amber-100 text-amber-800'
                            : 'text-slate-700'
                        }`}>
                          {r.sbp}/{r.dbp}
                        </span>
                      </td>

                      {/* Blood Glucose */}
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                          r.bloodGlucose >= 126
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : r.bloodGlucose >= 100
                            ? 'bg-amber-100 text-amber-800'
                            : 'text-slate-700'
                        }`}>
                          {r.bloodGlucose}
                        </span>
                      </td>

                      {/* Behaviors */}
                      <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                        <span className="text-slate-700 font-medium">
                          {r.smoking === 'สูบ' ? '🚬 สูบ' : 'ไม่สูบ'}, {r.alcohol === 'ดื่ม' ? '🍷 ดื่ม' : 'ไม่ดื่ม'}, {r.exercise}
                        </span>
                      </td>

                      {/* DM Screening */}
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] ${
                          r.diabetesScreening === 'มีแนวโน้ม/เสี่ยง'
                            ? 'bg-rose-100 text-rose-800 font-bold border border-rose-200'
                            : 'text-slate-400'
                        }`}>
                          {r.diabetesScreening === 'มีแนวโน้ม/เสี่ยง' ? 'มีแนวโน้ม' : 'ไม่มี'}
                        </span>
                      </td>

                      {/* HT Screening */}
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] ${
                          r.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง'
                            ? 'bg-rose-100 text-rose-800 font-bold border border-rose-200'
                            : 'text-slate-400'
                        }`}>
                          {r.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง' ? 'มีแนวโน้ม' : 'ไม่มี'}
                        </span>
                      </td>

                      {/* Risk Score */}
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800">{r.riskScore}</td>

                      {/* Risk Level Badge (Conditional Formatting: Red / Yellow / Green Pastel) */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold shadow-2xs ${
                          isHigh
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : isMid
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {r.riskLevel}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(r);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          title="ดูรายละเอียดเวชระเบียน"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {sortedRecords.length > pageSize && (
          <div className="flex items-center justify-between mt-4 text-xs text-slate-600">
            <div>
              แสดง {(currentPage - 1) * pageSize + 1} ถึง{' '}
              {Math.min(currentPage * pageSize, sortedRecords.length)} จาก {sortedRecords.length} รายการ
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 py-1 font-semibold text-slate-800">
                หน้า {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      <RecordDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  );
};
