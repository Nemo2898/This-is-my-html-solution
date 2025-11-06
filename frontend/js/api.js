const API_BASE = 'http://localhost:8888';

async function apiGet(path) {
  const res = await fetch(API_BASE + path, { credentials: 'include' });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function apiPut(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

// Authentication APIs
export async function login(username, password) {
  const credentials = btoa(`${username}:${password}`);
  const res = await fetch(API_BASE + '/api/users/login', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Login failed' }));
    throw new Error(`Login failed: ${res.status} - ${error.error || 'Unknown error'}`);
  }
  return res.json();
}

export async function logout() {
  const res = await fetch(API_BASE + '/api/users/logout', {
    method: 'POST',
    credentials: 'include'
  });
  return res.ok;
}

export async function getCurrentUser() {
  const res = await fetch(API_BASE + '/api/users/current', {
    credentials: 'include'
  });
  if (!res.ok) return null;
  return res.json();
}

// Tender APIs
export async function listTenders() { return apiGet('/api/tenders'); }
export async function getTender(id) { return apiGet(`/api/tenders/${id}`); }
export async function updateTender(tender) { return apiPut(`/api/tenders/${tender.id}`, tender); }
export async function createTender(tender) { return apiPost('/api/tenders', tender); }
export async function deleteTender(id) {
  const res = await fetch(API_BASE + `/api/tenders/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  return res.ok;
}

// Bid APIs
export async function listBids(tenderId) {
  const url = tenderId ? `/api/bids?tenderId=${tenderId}` : '/api/bids';
  return apiGet(url);
}
export async function getBid(id) { return apiGet(`/api/bids/${id}`); }
export async function createBid(bid) { return apiPost('/api/bids', bid); }
export async function updateBid(bid) { return apiPut(`/api/bids/${bid.id}`, bid); }
export async function deleteBid(id) {
  const res = await fetch(API_BASE + `/api/bids/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  return res.ok;
}


