# CareTrace Intelligence

> AI-powered care coordination command center for detecting patient risk, explaining contributing factors, simulating interventions, and enabling proactive follow-up.

## 🩺 Overview

CareTrace Intelligence is a decision-support prototype designed to help care teams identify patients who may need attention, understand the factors contributing to their simulated risk, explore possible interventions, and take proactive follow-up actions.

The platform follows a simple workflow:

**DETECT → EXPLAIN → SIMULATE → ACT**

## 🎯 Problem

Care teams may need to identify high-risk patients from multiple signals such as:

- Missed appointments
- Distance to care
- Emergency-room visit frequency
- Attendance patterns
- Care pathway information

When these signals are difficult to review together, patients who need timely follow-up may be overlooked.

## 💡 Solution

CareTrace brings these signals into one command center.

### 1. Detect

Prioritize patients using a simulated risk score and triage queue.

### 2. Explain

Show the factors contributing to a patient's risk and provide a clear patient journey view.

### 3. Simulate

Use the What-If Intervention Lab to explore hypothetical interventions such as:

- Reducing missed visits
- Transportation support
- Virtual/telehealth support

### 4. Act

Connect insights to simulated workflow actions:

- Schedule Follow-up
- Send Reminder
- Contact Case Lead
- Emergency Triage

## ✨ Key Features

- Patient risk command center
- Explainable risk factors
- Risk-prioritized triage queue
- Risk Alerts & Escalation Center
- What-If intervention simulation
- Patient follow-up journey
- Clinical workflow action tracking
- Google Sheets-backed fictional patient data
- Google Apps Script backend API
- Persistent intervention and action records
- Graceful offline/demo fallback
- Responsive command-center interface

## 🔬 Example Scenario

**Sarah Jenkins — P-1042**

Baseline:

**87 / 100 — HIGH RISK**

Key signals include:

- 4 missed visits
- 28 miles from clinic
- 3 ER visits in 6 months
- 48% attendance

The What-If simulator can test a hypothetical scenario:

**4 missed visits → 2 missed visits**

Simulated projection:

**87 HIGH → 68 MEDIUM**

**−19 simulated risk points**

This is a demonstration of intervention modeling and is **not a clinical prediction**.

## 🏗️ Architecture

```text
CareTrace Frontend
       │
       ▼
Vercel Application
       │
       ▼
Google Apps Script API
       │
       ▼
Google Sheets
       │
       ├── Patients
       ├── Risk Alerts
       ├── Interventions
       └── Actions
