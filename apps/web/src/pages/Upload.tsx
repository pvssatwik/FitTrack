import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { uploadFile } from '../api/client';

export function Upload() {
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setStatus(`Uploading ${file.name}...`);

    try {
      const id = await uploadFile(file);
      setStatus(`Successfully queued upload (ID: ${id}). Processing in background...`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card elevation={2}>
        <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            Upload Weekly Export
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Upload your tracker export (.csv, .zip, or .tgz) from Ultrahuman or Fitbit.
          </Typography>

          <Button
            component="label"
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Uploading...' : 'Select File'}
            <input
              type="file"
              hidden
              accept=".csv,.zip,.tgz"
              onChange={handleFileChange}
            />
          </Button>

          {status && (
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
              {status}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
