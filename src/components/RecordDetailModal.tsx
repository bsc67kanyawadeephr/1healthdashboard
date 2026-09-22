import React from 'react';
import { HealthRecord } from '../types';
import { X, User, Activity, Heart, ShieldAlert, CheckCircle, Scale, Cigarette, Wine, Dumbbell } from 'lucide-react';

interface RecordDetailModalProps {
  record: HealthRecord | null;
  onClose: () => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center font-bold text-sm">
              {record.id}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                ข้อมูลผลคัดกรองเวชระเบียนรายบุคคล
              </h3>
              <p className="text-xs text-slate-500">
                วันที่คัดกรอง: {record.screeningDate} • พื้นที่: {record.area}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Risk Badge Banner */}
        <div className={`mt-4 p-3.5 rounded-xl border flex items-center justify-between ${
          record.riskLevel === 'สูง'
            ? 'bg-rose-50/80 border-rose-200 text-rose-900'
            : record.riskLevel === 'ปานกลาง'
            ? 'bg-amber-50/80 border-amber-200 text-amber-900'
            : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-slate-600">ระดับความเสี่ยงสุขภาพ</p>
              <p className="text-sm font-bold">
                ความเสี่ยง{record.riskLevel} (คะแนนรวม {record.riskScore}/7)
              </p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
            record.riskLevel === 'สูง'
              ? 'bg-rose-200 text-rose-800'
              : record.riskLevel === 'ปานกลาง'
              ? 'bg-amber-200 text-amber-800'
              : 'bg-emerald-200 text-emerald-800'
          }`}>
            {record.riskLevel}
          </span>
        </div>

        {/* Body Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 block mb-0.5">ข้อมูลทั่วไป</span>
            <p className="font-semibold text-slate-800 text-sm">
              เพศ{record.gender} • อายุ {record.age} ปี
            </p>
            <p className="text-slate-500 mt-1">
              ส่วนสูง {record.height} ซม. • น้ำหนัก {record.weight} กก.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 block mb-0.5">ดัชนีมวลกาย (BMI)</span>
            <p className="font-semibold text-slate-800 text-sm">
              {record.bmi} kg/m²
            </p>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-medium ${
              record.bmi >= 25 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {record.bmiCategory}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 block mb-0.5">ความดันโลหิต & ชีพจร</span>
            <p className="font-semibold text-slate-800 text-sm">
              {record.sbp} / {record.dbp} mmHg
            </p>
            <p className="text-slate-500 mt-1">
              ชีพจร {record.pulse} ครั้ง/นาที • {record.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง' ? '⚠️ มีภาวะเสี่ยงความดัน' : 'ปกติ'}
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 block mb-0.5">ระดับน้ำตาลในเลือด</span>
            <p className="font-semibold text-slate-800 text-sm">
              {record.bloodGlucose} mg/dL
            </p>
            <p className="text-slate-500 mt-1">
              {record.diabetesScreening === 'มีแนวโน้ม/เสี่ยง' ? '⚠️ มีแนวโน้มเบาหวาน' : 'ปกติ'}
            </p>
          </div>
        </div>

        {/* Behavior badges */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-700 mb-2">พฤติกรรมสุขภาพที่บันทึกไว้:</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
              record.smoking === 'สูบ'
                ? 'bg-rose-50 border-rose-200 text-rose-800 font-medium'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <Cigarette className="w-3.5 h-3.5" />
              สูบบุหรี่: {record.smoking}
            </span>
            <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
              record.alcohol === 'ดื่ม'
                ? 'bg-amber-50 border-amber-200 text-amber-800 font-medium'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <Wine className="w-3.5 h-3.5" />
              แอลกอฮอล์: {record.alcohol}
            </span>
            <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
              record.exercise === 'ไม่ออกกำลังกาย'
                ? 'bg-rose-50 border-rose-200 text-rose-800 font-medium'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
            }`}>
              <Dumbbell className="w-3.5 h-3.5" />
              การออกกำลังกาย: {record.exercise}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
