import React from 'react';
import { ActiveNavTab } from '../types';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Activity, 
  Users, 
  ShieldAlert,
  Layers,
  AlertTriangle, 
  Settings, 
  HelpCircle, 
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  onEmergencyAlert: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
  alertsCount?: number;
  highRiskCount?: number;
  patientCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onEmergencyAlert,
  onOpenSettings,
  onOpenSupport,
  alertsCount = 4,
  highRiskCount = 3,
  patientCount = 8,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveNavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'queue' as ActiveNavTab, label: 'Queue', icon: ClipboardList, badge: `${highRiskCount} High` },
    { id: 'analytics' as ActiveNavTab, label: 'Analytics', icon: Activity },
    { id: 'patients' as ActiveNavTab, label: 'Patients', icon: Users, count: `${patientCount} Cohort` },
    { id: 'alerts' as ActiveNavTab, label: 'Risk Alerts', icon: ShieldAlert, badge: `${alertsCount} Alert${alertsCount === 1 ? '' : 's'}` },
    { id: 'staffing' as ActiveNavTab, label: 'Staffing', icon: Layers },
  ];

  return (
    <aside
      id="sidebar-nav"
      aria-label="Sidebar Navigation"
      className="h-screen w-20 lg:w-64 fixed left-0 top-0 flex flex-col bg-[#162238] border-r border-[#2B3A55] z-50 transition-all duration-300 shadow-sm"
    >
      <div className="flex flex-col h-full py-4 px-2.5 lg:px-3 justify-between">
        {/* Top Branding */}
        <div>
          <div className="mb-5 flex items-center justify-center lg:justify-start gap-2.5 px-2 mt-1">
            <div className="w-8 h-8 bg-[#22D3EE] rounded-sm flex items-center justify-center shadow-sm shrink-0">
              <div className="w-3.5 h-3.5 border-2 border-[#0B132B] rotate-45" />
            </div>
            <div className="hidden lg:block">
              <div className="font-bold text-[#22D3EE] tracking-tight text-base flex items-center gap-1.5 leading-none">
                CARETRACE
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40 font-bold">
                  v4.2
                </span>
              </div>
              <div className="text-[9px] text-[#94A3B8] font-mono tracking-wider uppercase mt-1">
                Clinical Intelligence
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="flex flex-col gap-1 mt-3" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-center lg:justify-between p-2.5 rounded text-xs font-mono font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'text-[#22D3EE] bg-[#22D3EE]/15 border-l-3 border-[#22D3EE] font-bold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#24344D]/60 border-l-3 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-transform ${
                        isActive ? 'text-[#22D3EE]' : 'text-[#94A3B8] group-hover:text-white'
                      }`}
                    />
                    <span className="hidden lg:block font-mono text-[11px] uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>

                  {item.badge && (
                    <span className="hidden lg:inline-block text-[9px] font-mono font-bold bg-[#FF5C5C]/20 text-[#FF5C5C] px-1.5 py-0.5 rounded border border-[#FF5C5C]/30">
                      {item.badge}
                    </span>
                  )}
                  {item.count && !item.badge && (
                    <span className="hidden lg:inline-block text-[9px] font-mono text-[#CBD5E1] bg-[#101B2E] px-1.5 py-0.5 rounded border border-[#2B3A55]">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="flex flex-col gap-2">
          {/* Emergency Alert Action - Compact and refined */}
          <button
            id="emergency-alert-btn"
            onClick={onEmergencyAlert}
            className="bg-[#101B2E] border border-[#FF5C5C]/50 hover:bg-[#FF5C5C]/15 hover:border-[#FF5C5C] text-[#FF5C5C] p-2 rounded flex items-center justify-center gap-2 transition-all w-full group cursor-pointer font-mono font-bold text-xs"
            title="Dispatch Emergency Clinical Alert"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#FF5C5C] shrink-0 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block uppercase tracking-wider text-[10px]">
              Emergency Alert
            </span>
          </button>

          {/* Secondary Actions */}
          <div className="border-t border-[#2B3A55] pt-2 flex flex-col gap-0.5">
            <button
              id="sidebar-settings-btn"
              onClick={onOpenSettings}
              className="text-[#94A3B8] hover:text-[#22D3EE] hover:bg-[#24344D]/50 transition-colors flex items-center justify-center lg:justify-start gap-2.5 p-2 rounded text-xs font-mono group cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#22D3EE] transition-colors" />
              <span className="hidden lg:block tracking-wide uppercase text-[10px]">Settings</span>
            </button>

            <button
              id="sidebar-support-btn"
              onClick={onOpenSupport}
              className="text-[#94A3B8] hover:text-[#22D3EE] hover:bg-[#24344D]/50 transition-colors flex items-center justify-center lg:justify-start gap-2.5 p-2 rounded text-xs font-mono group cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#22D3EE] transition-colors" />
              <span className="hidden lg:block tracking-wide uppercase text-[10px]">Protocol Guide</span>
            </button>

            {/* User Profile */}
            <div className="mt-1.5 pt-2 border-t border-[#2B3A55] flex items-center justify-center lg:justify-start gap-2.5 px-1 py-1">
              <div className="relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFo8tN6PIUwXCR4qwuntqUz0tuF9kfgLHxEsf6Ugh7abiWXBnhPqqwn6Ba1jltYFtOv8TjisYDefCvTNPa8bM_SBiluYMTb153KD60H51Vw2matO8EYHIvXfrOeJhE8H7D7dxVYGrgFZEQgd5VP5ZGjO4qkZPwX4O6jL_TaGZjPjDsVv5GZFpSkoMsw2OWhZGWe4Sj4d6bUUbcKSK6zDviDmKQvKFUywxod61LOYm1ZD3exDAjZx9B9Q"
                  alt="Dr. S. Chen Medical Director Profile"
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded object-cover border border-[#22D3EE]/40"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#34D399] border-2 border-[#162238] rounded-full"></span>
              </div>
              <div className="hidden lg:block overflow-hidden">
                <div className="font-mono text-xs text-white font-semibold truncate flex items-center gap-1">
                  Dr. S. Chen
                  <Sparkles className="w-2.5 h-2.5 text-[#22D3EE]" />
                </div>
                <div className="text-[9px] text-[#94A3B8] font-mono tracking-tight truncate uppercase">
                  Medical Director
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

