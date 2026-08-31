// src/services/cloudSync.js

const API_BASE_URL = 'https://api.restful-api.dev/objects';

// Helper to convert user sync code to valid REST object ID
function getObjectId(syncCode) {
  const cleanCode = (syncCode || 'bharath-bulking-70kg').toLowerCase().replace(/[^a-z0-9]/g, '');
  // Deterministic 32-char hex string derived from code
  let hash = 0;
  for (let i = 0; i < cleanCode.length; i++) {
    hash = (hash << 5) - hash + cleanCode.charCodeAt(i);
    hash |= 0;
  }
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
  return `trackcal_${cleanCode}_${hexHash}`.slice(0, 32).padEnd(32, '0');
}

/**
 * Pushes local Trackcal data to the Cloud API
 */
export async function pushCloudData(syncCode, payload) {
  const id = getObjectId(syncCode);
  const url = `${API_BASE_URL}/${id}`;

  const bodyData = {
    name: `Trackcal - ${syncCode}`,
    data: {
      payload: JSON.stringify(payload),
      updatedAt: Date.now()
    }
  };

  try {
    // Try PUT first to update existing object
    let response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    // If object doesn't exist yet, create it with POST
    if (response.status === 404) {
      bodyData.id = id;
      response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
    }

    if (response.ok) {
      return true;
    }
  } catch (err) {
    console.warn('Cloud sync push error:', err);
  }
  return false;
}

/**
 * Fetches latest remote Trackcal data from Cloud API
 */
export async function fetchCloudData(syncCode) {
  const id = getObjectId(syncCode);
  const url = `${API_BASE_URL}/${id}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const result = await response.json();
      if (result && result.data && result.data.payload) {
        return {
          payload: JSON.parse(result.data.payload),
          updatedAt: result.data.updatedAt
        };
      }
    }
  } catch (err) {
    console.warn('Cloud sync fetch error:', err);
  }
  return null;
}
