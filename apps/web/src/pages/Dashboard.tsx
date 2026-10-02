import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

export function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Overview of your weekly metrics across sleep, steps, and activity.
      </Typography>

      <Grid container spacing={3}>
        {['Sleep', 'Steps', 'Active Minutes', 'Resting Heart Rate'].map((category) => (
          <Grid key={category} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {category}
                </Typography>
                <Typography variant="h5" sx={{ mt: 1, fontWeight: 600 }}>
                  --
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
