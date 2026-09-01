import React, { useState, useRef, useEffect } from 'react';
import { Patient, ActiveNavTab } from '../types';
import { 
  Search, 
  Bell, 
  User, 
  Radio, 
  ShieldAlert, 
  Layers, 
  ChevronRight,
  X,
  UserPlus
} from 'lucide-react';

interface HeaderProps {
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  onToggleNotificationDrawer: () => void;
  unreadCount?: number;
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  isBackendConnected?: boolean;
  isLoadingBackend?: boolean;
  onOpenAddPatient?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onToggleNotificationDrawer,
  unreadCount = 3,
  activeTab,
  onTabChange,
  isBackendConnected = true,
  isLoadingBackend = false,
  onOpenAddPatient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [timeString, setTimeString] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Live Technical Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setTimeString(`${year}.${month}.${day} // ${hours}:${mins}:${secs}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter patients based on query
  const filteredPatients = searchQuery.trim()
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.pathway.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="top-app-header"
      className="fixed top-0 right-0 w-[calc(100%-5rem)] lg:w-[calc(100%-16rem)] h-16 bg-[#162238] border-b border-[#2B3A55] z-40 flex justify-between items-center px-4 lg:px-6 transition-all duration-300 shadow-sm"
    >
      {/* Left: Diamond Logo, Title, Tagline & Sub-navigation */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-3">
          {/* Cyan Diamond Badge */}
          <div className="w-8 h-8 bg-[#22D3EE] rounded-sm flex items-center justify-center shadow-sm shrink-0">
            <div className="w-3.5 h-3.5 border-2 border-[#0B132B] rotate-45" />
          </div>

          <div>
            <h1 className="text-base lg:text-lg font-bold tracking-tight text-[#22D3EE] leading-none uppercase">
              CareTrace Intelligence
            </h1>
            <p className="text-[10px] text-[#94A3B8] font-mono mt-0.5 tracking-wider uppercase">
              Detect. Explain. Simulate. Act.
            </p>
          </div>
        </div>

        {/* Demo Mode Badge */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#FF5C5C]/15 border border-[#FF5C5C]/30 rounded">
          <div className="w-2 h-2 rounded-full bg-[#FF5C5C] animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-[#FF5C5C] uppercase tracking-wider">
            Demo Mode: Fictional Data
          </span>
        </div>

        {/* Data Source Indicator */}
        {isLoadingBackend ? (
          <div
            id="backend-sync-indicator"
            className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-[#22D3EE]/10 border border-[#22D3EE]/30 rounded"
          >
            <div className="w-2 h-2 rounded-full border-2 border-[#22D3EE] border-t-transparent animate-spin" />
            <span className="text-[9px] font-mono font-bold text-[#22D3EE] uppercase tracking-wider">
              Syncing Sheets...
            </span>
          </div>
        ) : isBackendConnected ? (
          <div
            id="backend-connected-indicator"
            className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-[#34D399]/15 border border-[#34D399]/30 rounded"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
            <span className="text-[9px] font-mono font-bold text-[#34D399] uppercase tracking-wider">
              DATA SOURCE: GOOGLE SHEETS
            </span>
          </div>
        ) : (
          <div
            id="backend-offline-indicator"
            className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-[#101B2E] border border-[#2B3A55] rounded"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
            <span className="text-[9px] font-mono font-bold text-[#94A3B8] uppercase tracking-wider">
              DATA SOURCE: OFFLINE / DEMO
            </span>
          </div>
        )}

        {/* Sub-nav */}
        <nav className="hidden xl:flex items-center gap-5 ml-2" aria-label="Secondary Navigation">
          <button
            id="header-nav-live"
            onClick={() => onTabChange('dashboard')}
            className={`text-xs font-mono tracking-wider uppercase pb-0.5 cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'text-[#22D3EE] border-b-2 border-[#22D3EE] font-bold'
                : 'text-[#94A3B8] hover:text-white border-b-2 border-transparent'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Live Feed
          </button>
          <button
            id="header-nav-alerts"
            onClick={() => onTabChange('alerts')}
            className={`text-xs font-mono tracking-wider uppercase pb-0.5 cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'text-[#22D3EE] border-b-2 border-[#22D3EE] font-bold'
                : 'text-[#94A3B8] hover:text-white border-b-2 border-transparent'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#FF5C5C]" />
            Risk Alerts
          </button>
          <button
            id="header-nav-staffing"
            onClick={() => onTabChange('staffing')}
            className={`text-xs font-mono tracking-wider uppercase pb-0.5 cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'staffing'
                ? 'text-[#22D3EE] border-b-2 border-[#22D3EE] font-bold'
                : 'text-[#94A3B8] hover:text-white border-b-2 border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Staffing
          </button>
        </nav>
      </div>

      {/* Right: Clock & Search & Notification Bell */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        {/* Add Patient Button */}
        {onOpenAddPatient && (
          <button
            id="header-add-patient-btn"
            onClick={onOpenAddPatient}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#22D3EE]/15 hover:bg-[#22D3EE]/25 border border-[#22D3EE]/40 text-[#22D3EE] hover:text-white rounded text-[11px] font-mono font-bold transition-all cursor-pointer uppercase tracking-wider shadow-sm shrink-0"
            title="Enroll New Cohort Patient to Google Sheets"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Add Patient</span>
            <span className="sm:hidden">+ Add</span>
          </button>
        )}

        {/* Live Clock */}
        <div className="hidden md:block text-right">
          <div className="text-[9px] text-[#94A3B8] font-mono uppercase tracking-wider">
            Command Center v4.2
          </div>
          <div className="text-[10px] font-mono text-[#22D3EE] font-medium">
            {timeString || '2024.10.27 // 14:42:01'}
          </div>
        </div>

        {/* Quick Search */}
        <div ref={searchRef} className="relative hidden sm:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            id="patient-quick-search-input"
            type="text"
            placeholder="SEARCH PATIENT..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="bg-[#101B2E] border border-[#2B3A55] rounded py-1.5 pl-8 pr-7 text-xs w-44 lg:w-56 text-white placeholder:text-[#94A3B8]/70 font-mono focus:border-[#22D3EE] focus:outline-none transition-all uppercase tracking-wider"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Autocomplete Dropdown */}
          {isSearchOpen && filteredPatients.length > 0 && (
            <div className="absolute right-0 top-full mt-1.5 w-72 bg-[#0D1B2A] border border-[#1E293B] rounded shadow-2xl overflow-hidden z-50 divide-y divide-[#1E293B]">
              <div className="px-3 py-1.5 text-[9px] font-mono text-[#94A3B8] uppercase bg-[#07111F] flex justify-between tracking-wider">
                <span>Matching Cohort Records</span>
                <span>{filteredPatients.length} Results</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredPatients.map((patient) => {
                  const isHigh = patient.riskLevel === 'HIGH';
                  const isMed = patient.riskLevel === 'MEDIUM';
                  return (
                    <button
                      key={patient.id}
                      onClick={() => {
                        onSelectPatient(patient);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-[#1E293B]/60 flex items-center justify-between transition-colors ${
                        patient.id === selectedPatient.id ? 'bg-[#22D3EE]/10' : ''
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-[#F8FAFC] flex items-center gap-1.5">
                          {patient.name}
                          <span className="text-[10px] font-mono text-[#94A3B8]">({patient.id})</span>
                        </div>
                        <div className="text-[10px] text-[#94A3B8] font-mono">{patient.pathway}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                            isHigh
                              ? 'bg-[#FF5C5C]/20 text-[#FF5C5C]'
                              : isMed
                              ? 'bg-[#FBBF24]/20 text-[#FBBF24]'
                              : 'bg-[#34D399]/20 text-[#34D399]'
                          }`}
                        >
                          {patient.simulatedRisk}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <button
          id="header-notification-btn"
          onClick={onToggleNotificationDrawer}
          className="text-[#94A3B8] hover:text-[#22D3EE] hover:bg-[#1E293B] p-2 rounded relative transition-all cursor-pointer border border-transparent hover:border-[#1E293B]"
          title="Clinical Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF5C5C] rounded-full pulse-red" />
          )}
        </button>

        {/* User Icon */}
        <div className="flex items-center pl-2 border-l border-[#1E293B]">
          <div className="w-7 h-7 rounded bg-[#07111F] border border-[#1E293B] flex items-center justify-center text-[#22D3EE]">
            <User className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </header>
  );
};

