import React, { useState, useEffect, useMemo } from 'react';
import { HealthRecord, FilterState, ActiveNavTab } from './types';
import { rawInitialRecords } from './data/defaultData';
import { fetchHealthData } from './services/sheetService';
import { calculateKpis } from './utils/analytics';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { FiltersBar } from './components/FiltersBar';
import { KpiCards } from './components/KpiCards';
import { VisualizationsRiskTrend } from './components/VisualizationsRiskTrend';
import { VisualizationsBehaviorCorr } from './components/VisualizationsBehaviorCorr';
import { DataTableSection } from './components/DataTableSection';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<HealthRecord[]>(rawInitialRecords);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Navigation state
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('overview');
  const [viewAllMode, setViewAllMode] = useState<boolean>(true);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    area: 'all',
    gender: 'all',
    month: 'all',
    dateStart: '',
    dateEnd: '',
    riskLevel: 'all',
    search: '',
  });

  // Load live data from Google Sheet on mount
  useEffect(() => {
    let isMounted = true;
    async function loadInitialData() {
      setIsRefreshing(true);
      try {
        const result = await fetchHealthData();
        if (isMounted && result.records && result.records.length > 0) {
          setRecords(result.records);
          setLastUpdated(result.lastUpdated);
          setSyncNotice(`ซิงค์ข้อมูลสดสำเร็จ (${result.records.length} ระเบียน)`);
          setTimeout(() => setSyncNotice(null), 4000);
        }
      } catch (err) {
        console.warn('Initial live sync error, using cached snapshot:', err);
      } finally {
        if (isMounted) setIsRefreshing(false);
      }
    }
    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Manual Refresh Handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setSyncNotice('กำลังดึงข้อมูลล่าสุดจาก Google Sheets...');
    try {
      const result = await fetchHealthData();
      if (result.records && result.records.length > 0) {
        setRecords(result.records);
        setLastUpdated(result.lastUpdated);
        setSyncNotice(`อัปเดตข้อมูลสำเร็จ! พบทั้งหมด ${result.records.length} ระเบียน`);
      } else {
        setSyncNotice('ดึงข้อมูลสำเร็จ แต่ไม่พบระเบียนใหม่');
      }
    } catch (err: any) {
      setSyncNotice('เกิดข้อผิดพลาดในการเชื่อมต่อ Google Sheets กำลังใช้ข้อมูลล่าสุด');
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setSyncNotice(null), 4500);
    }
  };

  // Available unique filter values
  const availableAreas = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.area) set.add(r.area);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'th'));
  }, [records]);

  const availableMonths = useMemo(() => {
    const monthNamesTh: Record<string, string> = {
      '2026-01': 'มกราคม 2569',
      '2026-02': 'กุมภาพันธ์ 2569',
      '2026-03': 'มีนาคม 2569',
    };
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.month) set.add(r.month);
    });
    return Array.from(set)
      .sort()
      .map((m) => ({ value: m, label: monthNamesTh[m] || m }));
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // 1. Area filter
      if (filters.area !== 'all' && r.area !== filters.area) return false;

      // 2. Gender filter
      if (filters.gender !== 'all' && r.gender !== filters.gender) return false;

      // 3. Month / Date filter
      if (filters.month !== 'all' && r.month !== filters.month) return false;

      // 4. Risk level filter
      if (filters.riskLevel !== 'all' && r.riskLevel !== filters.riskLevel) return false;

      // 5. Search query
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchId = r.id.toLowerCase().includes(query);
        const matchArea = r.area.toLowerCase().includes(query);
        const matchGender = r.gender.toLowerCase().includes(query);
        const matchBmi = String(r.bmi).includes(query);
        const matchSbp = String(r.sbp).includes(query);
        const matchRisk = r.riskLevel.toLowerCase().includes(query);
        if (!matchId && !matchArea && !matchGender && !matchBmi && !matchSbp && !matchRisk) {
          return false;
        }
      }

      return true;
    });
  }, [records, filters]);

  // Dynamic KPI calculation
  const kpiSummary = useMemo(() => {
    return calculateKpis(filteredRecords);
  }, [filteredRecords]);

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      area: 'all',
      gender: 'all',
      month: 'all',
      dateStart: '',
      dateEnd: '',
      riskLevel: 'all',
      search: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col antialiased selection:bg-sky-200">
      {/* 1. Header with Title, Timestamp, Author, and Refresh Button */}
      <Header
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        totalRecords={records.length}
        filteredCount={filteredRecords.length}
      />

      {/* 2. Navigation Controls */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewAllMode={viewAllMode}
        onToggleViewAll={() => setViewAllMode((prev) => !prev)}
      />

      {/* Toast Notification */}
      {syncNotice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 w-full">
          <div className="bg-sky-50 border border-sky-200 text-sky-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between shadow-2xs animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              {syncNotice}
            </span>
            <button
              onClick={() => setSyncNotice(null)}
              className="text-xs text-sky-600 hover:text-sky-900 ml-4 underline"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters Bar */}
        <FiltersBar
          filters={filters}
          onFilterChange={setFilters}
          availableAreas={availableAreas}
          availableMonths={availableMonths}
          totalCount={records.length}
          filteredCount={filteredRecords.length}
          onReset={handleResetFilters}
        />

        {/* View Layouts */}
        {viewAllMode ? (
          /* Full Dashboard Mode: All sections in elegant flow */
          <div className="space-y-2">
            <KpiCards kpi={kpiSummary} />
            <VisualizationsRiskTrend records={filteredRecords} />
            <VisualizationsBehaviorCorr records={filteredRecords} />
            <DataTableSection records={filteredRecords} />
          </div>
        ) : (
          /* Focused Tab Mode */
          <div>
            {activeTab === 'overview' && (
              <div>
                <KpiCards kpi={kpiSummary} />
                <div className="mt-8">
                  <VisualizationsRiskTrend records={filteredRecords} />
                </div>
              </div>
            )}

            {activeTab === 'risk_trend' && (
              <VisualizationsRiskTrend records={filteredRecords} />
            )}

            {activeTab === 'behavior_corr' && (
              <VisualizationsBehaviorCorr records={filteredRecords} />
            )}

            {activeTab === 'detail_table' && (
              <DataTableSection records={filteredRecords} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 font-medium">
            รายงานข้อมูลผลคัดกรองสุขภาพเบื้องต้น • จัดทำโดย{' '}
            <span className="text-slate-800 font-bold">นางสาวกัญญาวดี พรมอิน นักศึกษาเวชระเบียน</span>
          </p>
          <p className="text-slate-400">
            ระบบรายงานเวชระเบียนและสารสนเทศสุขภาพ • อัปเดตข้อมูลอัตโนมัติ
          </p>
        </div>
      </footer>
    </div>
  );
}
