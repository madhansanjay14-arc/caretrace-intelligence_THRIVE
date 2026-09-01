import React, { useState } from 'react';
import { Patient, RiskFilter } from '../types';
import { LineChart, Info } from 'lucide-react';

interface SimulatedRiskTrendProps {
  patient: Patient;
  projectedRisk: number;
  isSimulated: boolean;
}

export const SimulatedRiskTrend: React.FC<SimulatedRiskTrendProps> = ({
  patient,
  projectedRisk,
  isSimulated,
}) => {
  const [filter, setFilter] = useState<RiskFilter>('ALL');

  // SVG Chart Geometry
  const width = 640;
  const height = 170;
  const padding = { top: 25, right: 35, bottom: 35, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Trend points: 5 historical + 3 projected
  const basePoints = patient.trendHistory;

  // Recalculate projected points based on current What-If projectedRisk
  const points = basePoints.map((pt, i) => {
    if (pt.period.includes('(Proj)')) {
      if (i === 5) {
        return { ...pt, projectedRisk };
      } else if (i === 6) {
        return { ...pt, projectedRisk: Math.max(10, Math.round(projectedRisk * 0.82)) };
      } else if (i === 7) {
        return { ...pt, projectedRisk: Math.max(8, Math.round(projectedRisk * 0.7)) };
      }
    }
    return pt;
  });

  const getX = (index: number) => {
    return padding.left + (index / (points.length - 1)) * graphWidth;
  };

  const getY = (riskVal: number) => {
    return padding.top + graphHeight - (riskVal / 100) * graphHeight;
  };

  // Historical path (indices 0 to 4)
  const historicalPath = points
    .slice(0, 5)
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.actualRisk)}`)
    .join(' ');

  // Projected path (from index 4 to 7)
  const projectedPath = points
    .slice(4)
    .map((p, i) => {
      const idx = 4 + i;
      const val = p.projectedRisk !== undefined ? p.projectedRisk : p.actualRisk;
      return `${i === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(val)}`;
    })
    .join(' ');

  return (
    <div className="bg-[#162238] border border-[#2B3A55] rounded-lg p-4 shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-[#2B3A55] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#22D3EE] rounded-sm" />
              Simulated Risk Trajectory & Intervention Horizon
            </h4>
            <span className="bg-[#22D3EE]/15 text-[#22D3EE] text-[10px] font-mono px-2 py-0.5 rounded border border-[#22D3EE]/30 uppercase font-bold">
              Deterministic Projection
            </span>
          </div>
          <p className="text-[11px] text-[#94A3B8] font-mono mt-0.5 uppercase tracking-wide">
            Fictional trend line tracking simulated baseline vs post-intervention care trajectory.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-[#101B2E] p-1 rounded border border-[#2B3A55] self-start sm:self-auto">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as RiskFilter[]).map((rf) => (
            <button
              key={rf}
              onClick={() => setFilter(rf)}
              className={`font-mono text-[10px] px-2 py-0.5 rounded transition-all uppercase cursor-pointer ${
                filter === rf
                  ? 'bg-[#22D3EE] text-[#0B132B] font-bold'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#24344D]'
              }`}
            >
              {rf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Interactive Line Chart */}
      <div className="w-full overflow-x-auto relative bg-[#101B2E] rounded border border-[#2B3A55] p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-40 select-none"
          style={{ minWidth: '450px' }}
        >
          {/* Background Grid Lines & Y-Axis Labels */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#2B3A55"
                  strokeDasharray="2 2"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  fill="#94A3B8"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Intervention Milestone Highlight Band */}
          <line
            x1={getX(4)}
            y1={padding.top}
            x2={getX(4)}
            y2={height - padding.bottom}
            stroke="#22D3EE"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />

          <rect
            x={getX(4) - 40}
            y={padding.top - 16}
            width="80"
            height="14"
            rx="2"
            fill="#162238"
            stroke="#22D3EE"
            strokeWidth="1"
          />
          <text
            x={getX(4)}
            y={padding.top - 6}
            fill="#22D3EE"
            fontSize="7"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            INTERVENTION (DAY 0)
          </text>

          {/* Historical Actual Line */}
          <path
            d={historicalPath}
            fill="none"
            stroke="#FF5C5C"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Projected Future Line */}
          <path
            d={projectedPath}
            fill="none"
            stroke={isSimulated ? '#34D399' : '#22D3EE'}
            strokeWidth="2.5"
            strokeDasharray="4 2"
            strokeLinecap="round"
          />

          {/* Historical Data Points */}
          {points.slice(0, 5).map((pt, i) => {
            const cx = getX(i);
            const cy = getY(pt.actualRisk);
            const isToday = i === 4;

            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isToday ? 5 : 3.5}
                  fill={isToday ? '#FF5C5C' : '#101B2E'}
                  stroke="#FF5C5C"
                  strokeWidth={isToday ? 2.5 : 1.5}
                />
                <text
                  x={cx}
                  y={cy - 8}
                  fill="#FFFFFF"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {pt.actualRisk}
                </text>
                <text
                  x={cx}
                  y={height - padding.bottom + 14}
                  fill="#CBD5E1"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                >
                  {pt.period}
                </text>
              </g>
            );
          })}

          {/* Projected Data Points */}
          {points.slice(5).map((pt, i) => {
            const idx = 5 + i;
            const val = pt.projectedRisk || 50;
            const cx = getX(idx);
            const cy = getY(val);
            const ptColor = isSimulated ? '#34D399' : '#22D3EE';

            return (
              <g key={idx}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={4.5}
                  fill="#162238"
                  stroke={ptColor}
                  strokeWidth="2"
                />
                <text
                  x={cx}
                  y={cy - 8}
                  fill={ptColor}
                  fontSize="8.5"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {val}
                </text>
                <text
                  x={cx}
                  y={height - padding.bottom + 14}
                  fill={ptColor}
                  fontSize="7.5"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                >
                  {pt.period}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-2 pt-2 border-t border-[#2B3A55] font-mono text-[10px] text-[#94A3B8] uppercase">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 bg-[#FF5C5C] rounded-sm inline-block" />
            <span className="text-white font-medium">Simulated Historical Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 border-b-2 border-dashed border-[#22D3EE] inline-block" />
            <span className="text-[#22D3EE] font-medium">Projected Scenario Horizon</span>
          </div>
        </div>

        <div className="text-[9px] text-[#94A3B8] flex items-center gap-1">
          <Info className="w-3 h-3 text-[#22D3EE]" />
          <span>Calculated with deterministic sensitivity factors</span>
        </div>
      </div>
    </div>
  );
};

