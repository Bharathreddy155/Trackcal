// bot/services/firebaseService.js
import dotenv from 'dotenv';
dotenv.config();

const PROJECT_ID = 'bulktrack976';
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

/**
 * Converts Firestore Document format to standard JSON object
 */
function fromFirestore(fields) {
  if (!fields) return {};
  const result = {};
  for (const [key, val] of Object.entries(fields)) {
    if ('stringValue' in val) result[key] = val.stringValue;
    else if ('integerValue' in val) result[key] = parseInt(val.integerValue, 10);
    else if ('doubleValue' in val) result[key] = parseFloat(val.doubleValue);
    else if ('booleanValue' in val) result[key] = val.booleanValue;
    else if ('mapValue' in val) result[key] = fromFirestore(val.mapValue.fields);
    else if ('arrayValue' in val) {
      result[key] = (val.arrayValue.values || []).map(v => {
        if ('mapValue' in v) return fromFirestore(v.mapValue.fields);
        if ('stringValue' in v) return v.stringValue;
        if ('integerValue' in v) return parseInt(v.integerValue, 10);
        if ('doubleValue' in v) return parseFloat(v.doubleValue);
        if ('booleanValue' in v) return v.booleanValue;
        return v;
      });
    }
  }
  return result;
}

/**
 * Converts standard JSON object to Firestore Document format
 */
function toFirestore(obj) {
  const fields = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined) continue;
    if (typeof val === 'string') fields[key] = { stringValue: val };
    else if (typeof val === 'number') {
      if (Number.isInteger(val)) fields[key] = { integerValue: val.toString() };
      else fields[key] = { doubleValue: val };
    }
    else if (typeof val === 'boolean') fields[key] = { booleanValue: val };
    else if (Array.isArray(val)) {
      fields[key] = {
        arrayValue: {
          values: val.map(v => {
            if (typeof v === 'object') return { mapValue: { fields: toFirestore(v) } };
            if (typeof v === 'string') return { stringValue: v };
            if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: v.toString() } : { doubleValue: v };
            if (typeof v === 'boolean') return { booleanValue: v };
            return { stringValue: String(v) };
          })
        }
      };
    }
    else if (typeof val === 'object') {
      fields[key] = { mapValue: { fields: toFirestore(val) } };
    }
  }
  return fields;
}

/**
 * Gets formatted date string YYYY-MM-DD
 */
export function getTodayDateStr() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Fetches all Trackcal data for a given sync code from Firestore
 */
export async function getTrackcalData(syncCode) {
  const code = (syncCode || process.env.TRACKCAL_SYNC_CODE || 'bharath-bulking-70kg').toLowerCase().trim();
  const url = `${FIRESTORE_BASE_URL}/trackcal_data/${code}`;

  try {
    const res = await fetch(url);
    if (res.ok) {
      const doc = await res.json();
      return fromFirestore(doc.fields);
    }
  } catch (err) {
    console.error('Error fetching Trackcal data:', err.message);
  }
  return null;
}

/**
 * Saves/Updates Trackcal data in Firestore
 */
export async function saveTrackcalData(syncCode, data) {
  const code = (syncCode || process.env.TRACKCAL_SYNC_CODE || 'bharath-bulking-70kg').toLowerCase().trim();
  const url = `${FIRESTORE_BASE_URL}/trackcal_data/${code}`;

  try {
    const payload = {
      fields: toFirestore({
        ...data,
        updatedAt: new Date().toISOString()
      })
    };

    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (err) {
    console.error('Error saving Trackcal data:', err.message);
    return false;
  }
}

/**
 * Helper to update today's log entry
 */
export async function updateTodayLog(syncCode, updaterFn) {
  const data = (await getTrackcalData(syncCode)) || { dailyLogs: {} };
  const todayStr = getTodayDateStr();

  const currentLogs = data.dailyLogs || {};
  const todayLog = currentLogs[todayStr] || {
    date: todayStr,
    dayType: 'non-chicken',
    chickenQuantity: 175,
    curryQuantityLunch: 60,
    curryQuantityDinner: 60,
    weight: null,
    waterIntakeLiters: 0,
    supplements: {
      whey: { taken: false, scoops: 1, loggedAt: null },
      creatine: { taken: false, grams: 3, loggedAt: null }
    },
    meals: {
      breakfast: { isLogged: false, loggedAt: null, items: [] },
      lunch: { isLogged: false, loggedAt: null, items: [] },
      snack: { isLogged: false, loggedAt: null, items: [] },
      dinner: { isLogged: false, loggedAt: null, items: [] }
    },
    workout: {
      completed: false,
      name: '',
      durationMinutes: 0,
      notes: '',
      exercises: []
    }
  };

  const updatedTodayLog = updaterFn(todayLog, data);
  data.dailyLogs = {
    ...currentLogs,
    [todayStr]: updatedTodayLog
  };

  const success = await saveTrackcalData(syncCode, data);
  return { success, todayLog: updatedTodayLog, allData: data };
}
