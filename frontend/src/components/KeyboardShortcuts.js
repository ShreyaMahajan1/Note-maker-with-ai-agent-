import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardIcon from '@mui/icons-material/Keyboard';

const ShortcutRow = ({ keys, description }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      py: 1.5,
      px: 2,
      '&:hover': {
        backgroundColor: 'rgba(45, 212, 191, 0.05)',
        borderRadius: 2,
      },
    }}
  >
    <Typography sx={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
      {description}
    </Typography>
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          <Chip
            label={key}
            size="small"
            sx={{
              backgroundColor: 'rgba(45, 212, 191, 0.15)',
              color: '#2dd4bf',
              fontWeight: 600,
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              border: '1px solid rgba(45, 212, 191, 0.3)',
            }}
          />
          {index < keys.length - 1 && (
            <Typography sx={{ color: '#64748b', mx: 0.5 }}>+</Typography>
          )}
        </React.Fragment>
      ))}
    </Box>
  </Box>
);

export const KeyboardShortcutsDialog = ({ open, onClose }) => {
  const shortcuts = [
    { keys: ['Ctrl', 'N'], description: 'Create new note' },
    { keys: ['Ctrl', 'K'], description: 'Search notes' },
    { keys: ['Ctrl', 'S'], description: 'Save current note' },
    { keys: ['Esc'], description: 'Close dialog' },
    { keys: ['?'], description: 'Show keyboard shortcuts' },
    { keys: ['Ctrl', 'E'], description: 'Export notes' },
    { keys: ['1'], description: 'Switch to Notes view' },
    { keys: ['2'], description: 'Switch to Calendar view' },
    { keys: ['3'], description: 'Switch to Analytics view' },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'rgba(21, 27, 46, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(45, 212, 191, 0.2)',
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <KeyboardIcon sx={{ color: '#2dd4bf' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#e2e8f0' }}>
            Keyboard Shortcuts
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: '#94a3b8',
            '&:hover': {
              backgroundColor: 'rgba(45, 212, 191, 0.1)',
              color: '#2dd4bf',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 3 }}>
        {shortcuts.map((shortcut, index) => (
          <React.Fragment key={index}>
            <ShortcutRow keys={shortcut.keys} description={shortcut.description} />
            {index < shortcuts.length - 1 && (
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
            )}
          </React.Fragment>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export const useKeyboardShortcuts = (handlers) => {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Create new note
  useHotkeys('ctrl+n', (e) => {
    e.preventDefault();
    handlers.onNewNote?.();
  });

  // Search
  useHotkeys('ctrl+k', (e) => {
    e.preventDefault();
    handlers.onSearch?.();
  });

  // Save
  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    handlers.onSave?.();
  });

  // Show shortcuts
  useHotkeys('shift+/', () => {
    setShortcutsOpen(true);
  });

  // View switching
  useHotkeys('1', () => handlers.onViewChange?.('notes'));
  useHotkeys('2', () => handlers.onViewChange?.('calendar'));
  useHotkeys('3', () => handlers.onViewChange?.('analytics'));

  // Export
  useHotkeys('ctrl+e', (e) => {
    e.preventDefault();
    handlers.onExport?.();
  });

  return { shortcutsOpen, setShortcutsOpen };
};

export default KeyboardShortcutsDialog;
