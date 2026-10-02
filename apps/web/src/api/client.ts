const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const isFormData = init?.body instanceof FormData;
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...init?.headers,
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

//Direct upload to API: sends file directly via FormData in-memory
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const data = await api<{ uploadId: string; status: string }>('/uploads', {
    method: 'POST',
    body: formData,
  });
  return data.uploadId;
}
