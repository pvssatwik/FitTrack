export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

/** Direct-to-storage upload flow: get URL -> PUT file -> mark complete -> poll for preview. */
export async function uploadFile(file: File): Promise<string> {
  const { uploadId, url } = await api<{ uploadId: string; url: string }>('/uploads', {
    method: 'POST',
    body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/octet-stream', size: file.size }),
  });
  await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type || 'application/octet-stream' } });
  await api(`/uploads/${uploadId}/complete`, { method: 'POST' });
  return uploadId;
}
