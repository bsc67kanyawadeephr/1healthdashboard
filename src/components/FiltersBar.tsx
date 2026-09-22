import React from 'react';
import { FilterState } from '../types';
import { Filter, MapPin, Users, Calendar, RotateCcw, Search, ShieldCheck } from 'lucide-react';

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableAreas: string[];
  availableMonths: { value: string; label: string }[];
  totalCount: number;
  filteredCount: number;
  onReset: () => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onFilterChange,
  availableAreas,
  availableMonths,
  totalCount,
  filteredCount,
  onReset,
}) => {
  const isFiltered =
    filters.area !== 'all' ||
    filters.gender !== 'all' ||
    filters.month !== 'all' ||
    filters.riskLevel !== 'all' ||
    filters.search !== '' ||
    filters.dateStart !== '' ||
    filters.dateEnd !== '';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              ระบบควบคุมและตัวกรองข้อมูล (Filters)
              {isFiltered && (
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  กำลังใช้งานตัวกรอง
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500">
              กรองผลคัดกรองตาม 1.พื้นที่ 2.เพศ 3.วันที่คัดกรอง หรือระดับความเสี่ยง
            </p>
          </div>
        </div>

        {/* Filter count & Reset */}
        <div className="flex items-center gap-2.5 self-start lg:self-center">
          <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
            แสดง <strong className="text-slate-900">{filteredCount}</strong> จากทั้งหมด {totalCount} รายการ
          </span>
          {isFiltered && (
            <button
              id="reset-filters-btn"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>ล้างตัวกรองทั้งหมด</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
        {/* 1. พื้นที่ */}
        <div>
          <label htmlFor="filter-area" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-sky-500" />
            1. พื้นที่ (Area)
          </label>
          <select
            id="filter-area"
            value={filters.area}
            onChange={(e) => onFilterChange({ ...filters, area: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-sky-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 transition-all outline-none"
          >
            <option value="all">ทุกพื้นที่ (ทั้งหมด)</option>
            {availableAreas.map((area) => (
              <option key={area} value={area}>
                พื้นที่: {area}
              </option>
            ))}
          </select>
        </div>

        {/* 2. เพศ */}
        <div>
          <label htmlFor="filter-gender" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-teal-500" />
            2. เพศ (Gender)
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            {['all', 'ชาย', 'หญิง'].map((g) => (
              <button
                key={g}
                type="button"
                id={`gender-pill-${g}`}
                onClick={() => onFilterChange({ ...filters, gender: g })}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all text-center ${
                  filters.gender === g
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {g === 'all' ? 'ทั้งหมด' : g}
              </button>
            ))}
          </div>
        </div>

        {/* 3. วันที่คัดกรอง / เดือน */}
        <div>
          <label htmlFor="filter-month" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            3. วันที่คัดกรอง / เดือน (Date)
          </label>
          <select
            id="filter-month"
            value={filters.month}
            onChange={(e) => onFilterChange({ ...filters, month: e.target.value, dateStart: '', dateEnd: '' })}
            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-sky-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 transition-all outline-none"
          >
            <option value="all">ทุกช่วงเวลา (ม.ค. - มี.ค. 2569)</option>
            {availableMonths.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* 4. ระดับความเสี่ยง & ค้นหา */}
        <div>
          <label htmlFor="filter-risk" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            ระดับความเสี่ยง (Risk Level)
          </label>
          <select
            id="filter-risk"
            value={filters.riskLevel}
            onChange={(e) => onFilterChange({ ...filters, riskLevel: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-sky-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 transition-all outline-none"
          >
            <option value="all">ทุกระดับความเสี่ยง</option>
            <option value="ต่ำ">ความเสี่ยงต่ำ (Low)</option>
            <option value="ปานกลาง">ความเสี่ยงปานกลาง (Medium)</option>
            <option value="สูง">ความเสี่ยงสูง (High)</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="filter-search-input"
            type="text"
            placeholder="ค้นหาด้วยรหัสบุคคล (เช่น H0001), ค่า BMI, ค่าความดัน หรือข้อมูลอื่น..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50/80 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-sky-500 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
          />
        </div>
        {filters.search && (
          <button
            onClick={() => onFilterChange({ ...filters, search: '' })}
            className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1"
          >
            ล้างคำค้น
          </button>
        )}
      </div>
    </div>
  );
};
