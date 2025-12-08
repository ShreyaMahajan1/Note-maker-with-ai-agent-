import React from 'react';
import { Box, Card, CardContent, Skeleton, Grid } from '@mui/material';

export const NotesGridSkeleton = () => {
  return (
    <Grid container spacing={2.5}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={item}>
          <Card
            sx={{
              backgroundColor: "rgba(21, 27, 46, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              height: 220,
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Skeleton variant="rounded" width={80} height={20} />
                <Skeleton variant="rounded" width={60} height={20} />
              </Box>
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="70%" height={20} />
              <Box sx={{ mt: 'auto', pt: 2 }}>
                <Skeleton variant="text" width={100} height={16} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export const CalendarSkeleton = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rounded" width={80} height={32} />
          <Skeleton variant="rounded" width={80} height={32} />
          <Skeleton variant="rounded" width={80} height={32} />
        </Box>
      </Box>
      <Grid container spacing={1}>
        {[...Array(35)].map((_, i) => (
          <Grid item xs={12/7} key={i}>
            <Skeleton variant="rounded" height={100} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export const AnalyticsSkeleton = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card sx={{ p: 2, backgroundColor: "rgba(21, 27, 46, 0.7)" }}>
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={80} height={60} />
              <Skeleton variant="text" width={120} height={16} />
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="rounded" height={300} />
      </Box>
    </Box>
  );
};

export default NotesGridSkeleton;
