import { Box, Card, CardContent, Typography } from '@mui/material';

export function Leaderboards() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Leaderboards
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Rankings and weekly competition with friends and groups.
      </Typography>

      <Card elevation={2}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Upload your weekly tracker export to see your placement on the leaderboard!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
