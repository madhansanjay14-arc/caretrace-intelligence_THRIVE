import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GAS_BASE_URL =
  'https://script.google.com/macros/s/AKfycbyZcUAMhR0dSpdObymomjvMLXs1wJmVLKVnPw-udJEAdT5DAPJvda_u24n9-ejTygsgrA/exec';

const PERSISTED_PATIENTS_FILE = path.join(__dirname, 'src', 'data', 'persisted_patients.json');

// Helper to load persisted patients from disk
function loadPersistedPatients(): any[] {
  try {
    if (fs.existsSync(PERSISTED_PATIENTS_FILE)) {
      const raw = fs.readFileSync(PERSISTED_PATIENTS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[Server API] Could not load persisted patients file:', err);
  }
  return [];
}

// Helper to save persisted patients to disk
function savePersistedPatients(patients: any[]): void {
  try {
    const dir = path.dirname(PERSISTED_PATIENTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PERSISTED_PATIENTS_FILE, JSON.stringify(patients, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Server API] Could not save persisted patients file:', err);
  }
}

// In-memory action & intervention store
let localActionsLog: any[] = [];
let localInterventionsLog: any[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'CareTrace Backend Proxy' });
  });

  /**
   * POST /api/caretrace
   * Unified endpoint for adding patients, saving interventions, and logging actions
   */
  app.post('/api/caretrace', async (req, res) => {
    try {
      const data = req.body;
      const type = data.type || (data.action_type ? 'action' : 'unknown');
      console.log(`[Server API] Received /api/caretrace POST for type [${type}]:`, data);

      if (type === 'patient') {
        const patientId = String(data.patient_id || data.id || `P-${Date.now().toString().slice(-4)}`);
        const newRecord = {
          patient_id: patientId,
          id: patientId,
          name: String(data.name || 'Unnamed Patient'),
          age: Number(data.age) || 50,
          gender: String(data.gender || 'Unspecified'),
          pathway: String(data.pathway || 'General Care Management'),
          risk_score: Number(data.risk_score ?? data.simulatedRisk ?? 50),
          risk_level: String(data.risk_level || (Number(data.risk_score) >= 70 ? 'HIGH' : 'MEDIUM')),
          missed_visits: Number(data.missed_visits ?? data.missedAppointments ?? 0),
          distance_miles: Number(data.distance_miles ?? data.distanceMiles ?? 10),
          er_visits: Number(data.er_visits ?? data.erVisitsLast6Mo ?? 0),
          attendance_rate: Number(data.attendance_rate ?? data.attendanceRate ?? 75),
          created_at: new Date().toISOString(),
        };

        // Forward to Google Apps Script
        try {
          fetch(GAS_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'patient',
              ...newRecord,
            }),
            redirect: 'follow',
          }).catch((e) => console.warn('[Server API] GAS forward error (patient):', e.message));
        } catch (e) {
          console.warn('[Server API] GAS forward sync non-blocking warning:', e);
        }

        // Persist to local JSON file
        const persisted = loadPersistedPatients();
        const existingIdx = persisted.findIndex((p: any) => p.patient_id === patientId || p.id === patientId);
        if (existingIdx >= 0) {
          persisted[existingIdx] = newRecord;
        } else {
          persisted.push(newRecord);
        }
        savePersistedPatients(persisted);

        return res.json({
          success: true,
          message: 'Patient saved',
          patient: newRecord,
        });
      }

      if (type === 'intervention') {
        const interventionRecord = {
          intervention_id: `INT-${Date.now().toString().slice(-5)}`,
          patient_id: String(data.patient_id || 'P-1042'),
          missed_visits: Number(data.missed_visits ?? 2),
          ride_voucher: Boolean(data.ride_voucher),
          virtual_sync: Boolean(data.virtual_sync),
          projected_risk: Number(data.projected_risk ?? 68),
          delta: Number(data.delta ?? -19),
          created_at: new Date().toISOString(),
        };

        // Forward to Google Apps Script
        try {
          const gasRes = await fetch(GAS_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'intervention',
              ...interventionRecord,
            }),
            redirect: 'follow',
          });
          const gasData = await gasRes.json().catch(() => ({ success: true }));
          console.log('[Server API] GAS intervention response:', gasData);
        } catch (e: any) {
          console.warn('[Server API] GAS forward warning (intervention):', e.message);
        }

        localInterventionsLog.unshift(interventionRecord);

        return res.json({
          success: true,
          message: 'Intervention saved',
          intervention: interventionRecord,
        });
      }

      if (type === 'action') {
        const actionRecord = {
          action_id: `ACT-${Date.now().toString().slice(-5)}`,
          patient_id: String(data.patient_id || 'P-1042'),
          patient_name: data.patient_name || data.patientName || 'Patient',
          action: String(data.action || data.action_type || 'Schedule Follow-up'),
          status: String(data.status || data.action_status || 'TRIGGERED'),
          scheduled_date: data.scheduled_date || data.date || '',
          scheduled_time: data.scheduled_time || data.time || '',
          notes: data.notes || '',
          created_at: new Date().toISOString(),
          timestamp: new Date().toISOString(),
        };

        // Forward to Google Apps Script
        try {
          const gasRes = await fetch(GAS_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'action',
              ...actionRecord,
            }),
            redirect: 'follow',
          });
          const gasData = await gasRes.json().catch(() => ({ success: true }));
          console.log('[Server API] GAS action response:', gasData);
        } catch (e: any) {
          console.warn('[Server API] GAS forward warning (action):', e.message);
        }

        localActionsLog.unshift(actionRecord);

        return res.json({
          success: true,
          message: 'Action saved',
          action: actionRecord,
        });
      }

      return res.status(400).json({ success: false, error: 'Unknown request type' });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('[Server API] Error processing /api/caretrace:', errMsg);
      return res.status(500).json({ success: false, error: errMsg });
    }
  });

  // Proxy /api/patients -> Google Apps Script + Merge Persisted Custom Patients
  app.get('/api/patients', async (_req, res) => {
    try {
      console.log('[Server API] Fetching patients from Google Apps Script...');
      let gasPatients: any[] = [];
      let gasSuccess = false;

      try {
        const response = await fetch(`${GAS_BASE_URL}?action=patients`, {
          method: 'GET',
          redirect: 'follow',
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.success && Array.isArray(data.patients)) {
            gasPatients = data.patients;
            gasSuccess = true;
          }
        }
      } catch (gasErr: any) {
        console.warn('[Server API] GAS fetch warning:', gasErr.message);
      }

      // Merge persisted patients from local store
      const persisted = loadPersistedPatients();
      const combinedMap = new Map<string, any>();

      // Put GAS patients first
      for (const p of gasPatients) {
        const id = String(p.patient_id || p.id);
        combinedMap.set(id, p);
      }

      // Merge persisted patients (overriding or adding)
      for (const p of persisted) {
        const id = String(p.patient_id || p.id);
        if (!combinedMap.has(id)) {
          combinedMap.set(id, p);
        }
      }

      const mergedPatients = Array.from(combinedMap.values());
      console.log(`[Server API] Returning ${mergedPatients.length} total patients (GAS: ${gasPatients.length}, Persisted: ${persisted.length})`);

      return res.json({
        success: gasSuccess || mergedPatients.length > 0,
        patients: mergedPatients,
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('[Server API] Error fetching patients:', errMsg);
      // Even on error, return persisted patients if any
      const persisted = loadPersistedPatients();
      return res.json({ success: persisted.length > 0, patients: persisted });
    }
  });

  // Proxy /api/alerts -> Google Apps Script
  app.get('/api/alerts', async (_req, res) => {
    try {
      console.log('[Server API] Fetching alerts from Google Apps Script...');
      const response = await fetch(`${GAS_BASE_URL}?action=alerts`, {
        method: 'GET',
        redirect: 'follow',
      });

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: `GAS status ${response.status}`,
        });
      }

      const data = await response.json();
      return res.json(data);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      return res.status(502).json({ success: false, error: errMsg });
    }
  });

  // Proxy /api/actions -> Google Apps Script + Local Log
  app.all('/api/actions', async (req, res) => {
    try {
      if (req.method === 'POST') {
        const data = req.body;
        const actionRecord = {
          action_id: `ACT-${Date.now().toString().slice(-5)}`,
          patient_id: String(data.patient_id || 'P-1042'),
          action: String(data.action || data.action_type || 'Schedule Follow-up'),
          status: String(data.status || 'TRIGGERED'),
          created_at: new Date().toISOString(),
          timestamp: new Date().toISOString(),
        };

        try {
          fetch(GAS_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'action', ...actionRecord }),
            redirect: 'follow',
          }).catch(() => {});
        } catch {}

        localActionsLog.unshift(actionRecord);
        return res.json({ success: true, message: 'Action saved', action: actionRecord });
      }

      // GET Actions
      let sheetActions: any[] = [];
      try {
        const response = await fetch(`${GAS_BASE_URL}?action=actions`, {
          method: 'GET',
          redirect: 'follow',
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.success && Array.isArray(data.actions)) {
            sheetActions = data.actions;
          }
        }
      } catch {}

      // Combine Sheet actions + Local actions (deduped by timestamp/patient_id)
      const combined = [...localActionsLog, ...sheetActions];
      return res.json({ success: true, actions: combined });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn('[Server API] Action proxy warning:', errMsg);
      return res.json({ success: true, actions: localActionsLog });
    }
  });

  // Proxy /api/interventions
  app.get('/api/interventions', async (_req, res) => {
    try {
      let sheetInterventions: any[] = [];
      try {
        const response = await fetch(`${GAS_BASE_URL}?action=interventions`, {
          method: 'GET',
          redirect: 'follow',
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.success && Array.isArray(data.interventions)) {
            sheetInterventions = data.interventions;
          }
        }
      } catch {}

      const combined = [...localInterventionsLog, ...sheetInterventions];
      return res.json({ success: true, interventions: combined });
    } catch (err: unknown) {
      return res.json({ success: true, interventions: localInterventionsLog });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareTrace server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start CareTrace server:', err);
});

