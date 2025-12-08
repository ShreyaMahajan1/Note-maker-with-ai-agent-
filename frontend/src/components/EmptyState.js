import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import BarChartIcon from '@mui/icons-material/BarChart';

export const EmptyNotes = ({ onCreateNote, category }) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 12,
        px: 3,
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          margin: '0 auto 24px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.1) 0%, rgba(20, 184, 166, 0.05) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid rgba(45, 212, 191, 0.2)',
        }}
      >
        <NoteAddIcon sx={{ fontSize: 60, color: '#2dd4bf' }} />
      </Box>
      
      <Typography
        variant="h5"
        sx={{
          mb: 1,
          fontWeight: 700,
          color: '#e2e8f0',
        }}
      >
        {category === 'All' ? 'No notes yet' : `No ${category} notes`}
      </Typography>
      
      <Typography
        variant="body1"
        sx={{
          mb: 4,
          color: '#94a3b8',
          maxWidth: 400,
          margin: '0 auto 32px',
        }}
      >
        {category === 'All' 
          ? 'Start capturing your thoughts, ideas, and tasks. Create your first note to get started!'
          : `You don't have any notes in the ${category} category yet. Create one now!`
        }
      </Typography>
      
      <Button
        variant="contained"
        size="large"
        startIcon={<NoteAddIcon />}
        onClick={onCreateNote}
        sx={{
          background: 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)',
          color: '#0a0e1a',
          fontWeight: 600,
          px: 4,
          py: 1.5,
          borderRadius: 2,
          boxShadow: '0 4px 16px rgba(45, 212, 191, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5eead4 0%, #2dd4bf 100%)',
            boxShadow: '0 6px 20px rgba(45, 212, 191, 0.4)',
          },
        }}
      >
        Create Your First Note
      </Button>
    </Box>
  );
};

export const EmptySearch = ({ searchTerm, onClearSearch }) => {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <SearchOffIcon sx={{ fontSize: 80, color: '#64748b', mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1, color: '#e2e8f0' }}>
        No results found
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
        No notes match "{searchTerm}"
      </Typography>
      <Button variant="outlined" onClick={onClearSearch}>
        Clear Search
      </Button>
    </Box>
  );
};

export const EmptyCalendar = () => {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <EventBusyIcon sx={{ fontSize: 80, color: '#64748b', mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1, color: '#e2e8f0' }}>
        No events scheduled
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
        Your calendar is empty for this period
      </Typography>
    </Box>
  );
};

export const EmptyAnalytics = () => {
  return (
    <Box sx={{ textAlign: 'center', py: 12 }}>
      <BarChartIcon sx={{ fontSize: 80, color: '#64748b', mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1, color: '#e2e8f0' }}>
        No data to display
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
        Create some notes to see your analytics
      </Typography>
    </Box>
  );
};

export default EmptyNotes;
