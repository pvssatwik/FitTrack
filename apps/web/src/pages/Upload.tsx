import { useState } from 'react';
import { uploadFile } from '../api/client';

export function Upload() {
  const [status, setStatus] = useState('');
  return (
    <>
      <h1>Upload weekly export</h1>
      <input
        type="file"
        accept=".csv,.zip,.tgz"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setStatus('Uploading...');
          try {
            const id = await uploadFile(file);
            setStatus(`Queued (${id}). TODO: poll /uploads/:id and show the preview before awarding points.`);
          } catch (err) {
            setStatus(String(err));
          }
        }}
      />
      <p>{status}</p>
    </>
  );
}
