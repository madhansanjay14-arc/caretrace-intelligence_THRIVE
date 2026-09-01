/**
 * CareTrace Intelligence - Types & Interfaces
 * Fictional Simulated Healthcare Decision Support System
 */

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface FactorContribution {
  id: string;
  name: string;
  percentage: number; // 0 - 100
  valueDisplay: string;
  color: string;
  description: string;
  category: 'attendance' | 'logistics' | 'clinical_history' | 'adherence';
}

export interface JourneyStep {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  status: 'completed' | 'missed' | 'active' | 'upcoming';
  detail: string;
}

export interface TrendPoint {
  period: string; // e.g. 'Wk -8', 'Wk -4', 'Today', 'Simulated +4'
  actualRisk: number;
  projectedRisk?: number;
  isInterventionPoint?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  pathway: string;
  simulatedRisk: number; // 0 - 100
  riskLevel: RiskLevel;
  primaryRiskReason: string;
  explanation: string;
  missedAppointments: number;
  distanceMiles: number;
  erVisitsLast6Mo: number;
  attendanceRate: number;
  treatmentDurationMonths: number;
  factors: FactorContribution[];
  journey: JourneyStep[];
  trendHistory: TrendPoint[];
  careCoordinator: string;
  contactNumber: string;
  lastContactDate: string;
  spatialPos: {
    x: number;
    z: number;
  };
}

export interface WhatIfState {
  patientId: string;
  simulatedMissedAppointments: number;
  transportAssistanceProvided: boolean;
  telehealthEnrollment: boolean;
  projectedRisk: number;
  riskDelta: number;
  isCustomized: boolean;
}

export type ActiveNavTab = 'dashboard' | 'queue' | 'analytics' | 'patients' | 'alerts' | 'staffing';
export type RiskFilter = 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW';
