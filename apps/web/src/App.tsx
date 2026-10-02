import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Leaderboards } from './pages/Leaderboards';
import { Login } from './pages/Login';
import { Upload } from './pages/Upload';

export function App() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              textDecoration: 'none',
              color: 'inherit',
              letterSpacing: 0.5,
            }}
          >
            FitTrack
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button component={RouterLink} to="/" color="inherit">
              Dashboard
            </Button>
            <Button component={RouterLink} to="/upload" color="inherit">
              Upload
            </Button>
            <Button component={RouterLink} to="/leaderboards" color="inherit">
              Leaderboards
            </Button>
            <Button component={RouterLink} to="/login" variant="outlined" color="primary">
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </Box>
  );
}
