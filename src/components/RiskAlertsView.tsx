import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { fetchAlertsFromBackend, ClinicalAlert } from '../services/api';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Bell, 
  CalendarCheck, 
  Send, 
  PhoneCall, 
  CheckCircle2, 
  Filter,
  ArrowRight,
  Sparkles,
  Clock
} from 'lucide-react';

interface RiskAlertsViewProps {
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  onScheduleFollowup: (patient: Patient) => void;
  onSendReminder: (patient: Patient) => void;
  onContactPatient: (patient: Patient) => void;
  onAlertResolved?: (alertId: string) => void;
}

export const RiskAlertsView: React.FC<RiskAlertsViewProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onScheduleFollowup,
  onSendReminder,
  onContactPatient,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'RESOLVED'>('ALL');
  const [alerts, setAlerts] = useState<ClinicalAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendAlerts, setIsBackendAlerts] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadAlerts() {
      setIsLoading(true);
      const res = await fetchAlertsFromBackend(patients);
      if (!isMounted) return;
      setAlerts(res.alerts);
      setIsBackendAlerts(res.isFromBackend);
      setIsLoading(false);
    }
    loadAlerts();
    return () => {
      isMounted = false;
    };
  }, [patients]);

  const toggleResolve = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: !a.resolved } : a))
    );
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'ALL') return !a.resolved;
    if (filter === 'RESOLVED') return a.resolved;
    return !a.resolved && a.severity === filter;
  });

  return (
    <div className="flex-1 flex flex-col gap-3.5 overflow-hidden h-full">
      {/* Top Banner */}
      <div className="bg-[#162238] border border-[#2B3A55] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-white flex items-center gap-2 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-[#FF5C5C]" />
              <span>Clinical Risk Alerts & Escalations</span>
            </h2>
            <span className="bg-[#FF5C5C]/15 text-[#FF5C5C] text-[10px] font-mono px-2 py-0.5 rounded border border-[#FF5C5C]/30 uppercase font-bold">
              {isBackendAlerts ? 'Google Sheets Live' : 'OFFLINE / DEMO'}
            </span>
          </div>
          <p className="text-[11px] font-mono text-[#94A3B8] mt-0.5 uppercase tracking-wide">
            Automated alerts triggered by deterministic risk thresholds and vital surveillance.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-[#101B2E] p-1 rounded border border-[#2B3A55] self-start md:self-auto">
          {(['ALL', 'HIGH', 'MEDIUM', 'RESOLVED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-mono text-[10px] px-2.5 py-1 rounded transition-all uppercase cursor-pointer ${
                filter === f
                  ? 'bg-[#22D3EE] text-[#0B132B] font-bold'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#24344D]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Alert List */}
      <div className="bg-[#162238] border border-[#2B3A55] rounded-lg flex-1 overflow-y-auto p-4 flex flex-col gap-3 shadow-sm">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-[#94A3B8] font-mono text-xs">
            <div className="animate-spin w-5 h-5 border-2 border-[#22D3EE] border-t-transparent rounded-full mr-2" />
            <span>SYNCING CLINICAL ALERTS FEED...</span>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#94A3B8] font-mono">
            <CheckCircle2 className="w-8 h-8 text-[#34D399] mb-2" />
            <div className="text-sm text-white font-bold uppercase">No active alerts in this category</div>
            <div className="text-xs text-[#94A3B8] mt-1">All prioritized triggers have been triaged.</div>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const patient = patients.find((p) => p.id === alert.patientId) || patients[0];
            const isHigh = alert.severity === 'HIGH';
            const isMedium = alert.severity === 'MEDIUM';

            const severityBorder = alert.resolved
              ? 'border-[#2B3A55] opacity-60'
              : isHigh
              ? 'border-l-4 border-l-[#FF5C5C] border-[#2B3A55]'
              : 'border-l-4 border-l-[#FBBF24] border-[#2B3A55]';

            return (
              <div
                key={alert.id}
                className={`bg-[#101B2E] rounded-lg p-4 transition-all border ${severityBorder} flex flex-col lg:flex-row lg:items-center justify-between gap-3`}
              >
                {/* Left Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        isHigh
                          ? 'bg-[#FF5C5C]/20 text-[#FF5C5C] border-[#FF5C5C]/40'
                          : 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]/40'
                      }`}
                    >
                      {alert.severity} SEVERITY
                    </span>
                    <span className="text-xs font-mono font-bold text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded border border-[#22D3EE]/30">
                      {alert.patientName} ({alert.patientId})
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-wide mb-1">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="mt-2 text-[11px] font-mono text-[#38BDF8] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
                    <span>Recommended Protocol: <strong>{alert.recommendedAction}</strong></span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 border-[#2B3A55] pt-2 lg:pt-0">
                  <button
                    onClick={() => {
                      if (patient) onSelectPatient(patient);
                    }}
                    className="px-3 py-2 bg-[#22D3EE] text-[#0B132B] rounded text-xs font-mono font-bold uppercase hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={() => patient && onScheduleFollowup(patient)}
                    className="px-2.5 py-2 bg-[#162238] border border-[#2B3A55] hover:border-[#22D3EE]/50 text-white rounded text-xs font-mono font-medium uppercase transition-all cursor-pointer"
                    title="Schedule Follow-up"
                  >
                    <CalendarCheck className="w-4 h-4 text-[#22D3EE]" />
                  </button>

                  <button
                    onClick={() => patient && onContactPatient(patient)}
                    className="px-2.5 py-2 bg-[#162238] border border-[#2B3A55] hover:border-[#22D3EE]/50 text-white rounded text-xs font-mono font-medium uppercase transition-all cursor-pointer"
                    title="Contact Patient"
                  >
                    <PhoneCall className="w-4 h-4 text-[#94A3B8]" />
                  </button>

                  <button
                    onClick={() => toggleResolve(alert.id)}
                    className={`px-2.5 py-2 rounded text-xs font-mono font-bold uppercase transition-all cursor-pointer border ${
                      alert.resolved
                        ? 'bg-[#34D399]/20 text-[#34D399] border-[#34D399]/40'
                        : 'bg-[#162238] text-[#94A3B8] hover:text-white border-[#2B3A55]'
                    }`}
                    title={alert.resolved ? 'Mark Unresolved' : 'Mark Triaged'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
