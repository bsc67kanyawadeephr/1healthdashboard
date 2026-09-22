import React from 'react';
import { ActiveNavTab } from '../types';
import { LayoutDashboard, TrendingUp, HeartPulse, TableProperties, Sparkles } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  viewAllMode: boolean;
  onToggleViewAll: () => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  viewAllMode,
  onToggleViewAll,
}) => {
  const tabs = [
    {
      id: 'overview' as ActiveNavTab,
      label: 'ภาพรวมสุขภาพ (KPIs)',
      icon: LayoutDashboard,
      badge: 'สรุป 4 ด้าน',
    },
    {
      id: 'risk_trend' as ActiveNavTab,
      label: 'วิเคราะห์ความเสี่ยงและแนวโน้ม',
      icon: TrendingUp,
      badge: 'Risk & Trends',
    },
    {
      id: 'behavior_corr' as ActiveNavTab,
      label: 'พฤติกรรมสุขภาพและความสัมพันธ์',
      icon: HeartPulse,
      badge: 'Behaviors',
    },
    {
      id: 'detail_table' as ActiveNavTab,
      label: 'สรุปรายพื้นที่และตารางข้อมูล',
      icon: TableProperties,
      badge: 'Data Table',
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 gap-2">
          {/* Nav Tabs */}
          <nav className="flex space-x-1.5 overflow-x-auto scrollbar-none py-1" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id && !viewAllMode;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => {
                    if (viewAllMode) onToggleViewAll();
                    onTabChange(tab.id);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-300' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              id="view-all-toggle-btn"
              onClick={onToggleViewAll}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                viewAllMode
                  ? 'bg-teal-50 border-teal-200 text-teal-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${viewAllMode ? 'text-teal-600' : 'text-slate-400'}`} />
              <span>{viewAllMode ? 'กำลังแสดงทุกหมวดหมู่ (Full View)' : 'แสดงทุกส่วนในหน้าเดียว'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
