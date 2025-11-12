import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';

export function AiDialog({ 
  open, 
  onClose, 
  title, 
  content, 
  loading, 
  result, 
  onSubmit, 
  inputLabel, 
  inputValue, 
  onInputChange,
  submitLabel 
}) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid',
        borderColor: 'grey.200',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        '& .MuiTypography-root': {
          fontWeight: 600,
          color: 'primary.main'
        }
      }}>
        <Typography variant="h6">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label={inputLabel}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            multiline
            rows={3}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'grey.50',
                '&:hover fieldset': {
                  borderColor: 'primary.light',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                }
              }
            }}
          />
          
          {loading && (
            <Box 
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 1,
                backgroundColor: 'primary.50',
                color: 'primary.main'
              }}
            >
              <CircularProgress size={24} color="primary" />
              <Typography sx={{ fontWeight: 500 }}>
                Processing with AI...
              </Typography>
            </Box>
          )}
          
          {result && (
            <Box 
              sx={{ 
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'grey.50',
                border: '1px solid',
                borderColor: 'primary.light',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, primary.main, primary.light)',
                  borderTopLeftRadius: 'inherit',
                  borderTopRightRadius: 'inherit',
                }
              }}
            >
              <Typography sx={{ 
                whiteSpace: 'pre-wrap',
                color: 'text.primary',
                lineHeight: 1.6
              }}>
                {result}
              </Typography>
                        </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: 2.5,
        borderTop: '1px solid',
        borderColor: 'grey.200'
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            minWidth: '100px',
            borderColor: 'grey.300',
            color: 'text.secondary',
            '&:hover': {
              borderColor: 'grey.400',
              backgroundColor: 'grey.50'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSubmit} 
          variant="contained" 
          disabled={loading}
          sx={{
            borderRadius: 2,
            minWidth: '100px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} color="inherit" />
              {submitLabel}
            </Box>
          ) : (
            submitLabel
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}