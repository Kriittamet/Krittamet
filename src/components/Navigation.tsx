import React from 'react';
import { ClipboardCheck, Calendar, BarChart3, MapPin } from 'lucide-react';

export type ActiveTab = 'record' | 'daily' | 'monthly' | 'zones';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  todayCount: number;
  todayFailCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  todayCount,
  todayFailCount,
}) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-[69px] z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex space-x-2 sm:space-x-4 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => onTabChange('record')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition shrink-0 ${
              activeTab === 'record'
                ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-xs'
                : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
            }`}
          >
            <ClipboardCheck className={`w-4 h-4 ${activeTab === 'record' ? 'text-blue-700' : 'text-slate-500'}`} />
            <span>บันทึกผลการตรวจ</span>
          </button>

          <button
            onClick={() => onTabChange('daily')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition shrink-0 ${
              activeTab === 'daily'
                ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-xs'
                : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
            }`}
          >
            <Calendar className={`w-4 h-4 ${activeTab === 'daily' ? 'text-blue-700' : 'text-slate-500'}`} />
            <span>สรุปรายวัน</span>
            {todayCount > 0 && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                todayFailCount > 0 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {todayCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('monthly')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition shrink-0 ${
              activeTab === 'monthly'
                ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-xs'
                : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className={`w-4 h-4 ${activeTab === 'monthly' ? 'text-blue-700' : 'text-slate-500'}`} />
            <span>สรุปรายเดือนและสถิติ</span>
          </button>

          <button
            onClick={() => onTabChange('zones')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition shrink-0 ${
              activeTab === 'zones'
                ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-xs'
                : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
            }`}
          >
            <MapPin className={`w-4 h-4 ${activeTab === 'zones' ? 'text-blue-700' : 'text-slate-500'}`} />
            <span>ผังเขตพื้นที่ & ห้องเรียน</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
