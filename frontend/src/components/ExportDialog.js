import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import CodeIcon from '@mui/icons-material/Code';
import ArticleIcon from '@mui/icons-material/Article';

export const ExportDialog = ({ open, onClose, onExport }) => {
  const exportOptions = [
    {
      format: 'json',
      icon: <CodeIcon />,
      title: 'JSON',
      description: 'Machine-readable format',
      color: '#2dd4bf',
    },
    {
      format: 'csv',
      icon: <TableChartIcon />,
      title: 'CSV',
      description: 'Spreadsheet compatible',
      color: '#10b981',
    },
    {
      format: 'markdown',
      icon: <ArticleIcon />,
      title: 'Markdown',
      description: 'Formatted text',
      color: '#f59e0b',
    },
    {
      format: 'text',
      icon: <DescriptionIcon />,
      title: 'Plain Text',
      description: 'Simple text file',
      color: '#94a3b8',
    },
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
          <DownloadIcon sx={{ color: '#2dd4bf' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#e2e8f0' }}>
            Export Notes
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
      <DialogContent sx={{ pt: 3 }}>
        <Typography sx={{ mb: 3, color: '#94a3b8', fontSize: '0.9rem' }}>
          Choose a format to export your notes
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {exportOptions.map((option) => (
            <Button
              key={option.format}
              variant="outlined"
              onClick={() => {
                onExport(option.format);
                onClose();
              }}
              sx={{
                justifyContent: 'flex-start',
                p: 2,
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'left',
                '&:hover': {
                  borderColor: option.color,
                  backgroundColor: `${option.color}15`,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: `${option.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: option.color,
                  }}
                >
                  {option.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: '#e2e8f0',
                      fontSize: '1rem',
                      mb: 0.5,
                    }}
                  >
                    {option.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      color: '#94a3b8',
                    }}
                  >
                    {option.description}
                  </Typography>
                </Box>
                <DownloadIcon sx={{ color: '#64748b' }} />
              </Box>
            </Button>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
