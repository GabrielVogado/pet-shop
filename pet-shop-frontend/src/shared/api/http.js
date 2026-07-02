const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
const TOKEN_KEY = 'petcare.token';

export function getToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error('Nao foi possivel conectar ao servidor. Verifique se o backend esta ativo.');
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message ?? 'Ocorreu um erro inesperado.';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}
