import React, { useState, useEffect } from 'react';
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Card, 
  CardContent, 
  CardActions,
  Grid,
  Box,
  Button,
  Paper,
  TextField,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Fade,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Chip,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import PaletteIcon from '@mui/icons-material/Palette';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CategoryIcon from '@mui/icons-material/Category';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EventNoteIcon from '@mui/icons-material/EventNote';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { AiDialog } from './components/AiDialog';
import VoiceControl from './components/VoiceControl';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5',
      light: '#818cf8',
      dark: '#3730a3',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
  },
});

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [colorMenuAnchor, setColorMenuAnchor] = useState(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [googleAuthorized, setGoogleAuthorized] = useState(false);
  const [checkingGoogleAuth, setCheckingGoogleAuth] = useState(true);
  
  // AI-related state
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiDialogType, setAiDialogType] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const aiActions = [
    { icon: <SmartToyIcon />, name: 'Suggest', action: () => handleAiActionClick('suggest') },
    { icon: <AutoFixHighIcon />, name: 'Enhance', action: () => handleAiActionClick('enhance') },
    { icon: <CategoryIcon />, name: 'Categorize', action: () => handleAiActionClick('categorize') },
  ];

  const colors = ['#ffffff', '#f28b82', '#fbbc04', '#fff475', '#ccff90', '#a7ffeb', '#cbf0f8', '#aecbfa', '#d7aefb', '#fdcfe8'];

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      showSnackbar('Failed to reload notes', 'error');
    }
  };

  const checkGoogleAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/google/status');
      const data = await response.json();
      setGoogleAuthorized(data.authorized || false);
    } catch (error) {
      console.error('Error checking Google auth status:', error);
      setGoogleAuthorized(false);
    } finally {
      setCheckingGoogleAuth(false);
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/test'),
      fetch('http://localhost:5000/api/notes')
    ])
      .then(([resTest, resNotes]) => Promise.all([resTest.json(), resNotes.json()]))
      .then(([dataTest, dataNotes]) => {
        setMessage(dataTest.message);
        setNotes(dataNotes);
        setLoading(false);
        checkGoogleAuthStatus();
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
        showSnackbar('Failed to load data', 'error');
      });
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddNote = async () => {
    if (note.trim()) {
      setLoadingNotes(true);
      try {
        const response = await fetch('http://localhost:5000/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            content: note, 
            color: selectedColor,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone 
          }),
        });
        const data = await response.json();
        
        if (response.status === 409) {
          // Duplicate event
          showSnackbar('⚠️ This event already exists on your calendar!', 'warning');
        } else if (response.ok) {
          setNotes([data, ...notes]);
          setNote('');
          showSnackbar('Note added successfully');
          if (data.calendarEventUrl) {
            showSnackbar('✅ Calendar event created! Check your Google Calendar.');
          }
        } else {
          throw new Error(data.error || 'Failed to add note');
        }
      } catch (error) {
        showSnackbar(error.message, 'error');
      } finally {
        setLoadingNotes(false);
      }
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      // Remove from UI immediately for instant feedback
      setNotes(notes.filter(note => note.id !== id));
      
      // Then sync with backend
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        showSnackbar('Note deleted successfully');
      } else {
        throw new Error('Failed to delete note');
      }
    } catch (error) {
      showSnackbar(error.message, 'error');
      // If backend delete fails, reload notes
      fetchNotes();
    }
  };

    const handleAiActionClick = (type) => {
      setAiDialogType(type);
      setAiInput('');
      setAiResult('');
      setAiDialogOpen(true);
    };

    const getAiDialogProps = () => {
      switch (aiDialogType) {
        case 'suggest':
          return {
            title: 'Get AI Suggestion',
            inputLabel: 'What kind of note would you like?',
            submitLabel: 'Generate',
          };
        case 'enhance':
          return {
            title: 'Enhance Note',
            inputLabel: 'Enter note to enhance',
            submitLabel: 'Enhance',
          };
        case 'categorize':
          return {
            title: 'Categorize Note',
            inputLabel: 'Enter note to categorize',
            submitLabel: 'Categorize',
          };
        default:
          return {};
      }
    };

    const handleAiSubmit = async () => {
      setAiLoading(true);
      try {
          const response = await fetch(`http://localhost:5000/api/ai/${aiDialogType}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: aiInput,
              content: aiInput,
            }),
          });

          const data = await response.json().catch(() => ({}));

          if (response.status === 429) {
            // Quota / rate limit on backend/OpenAI
            const msg = data.error || 'OpenAI quota exceeded or rate limited. Check your API key and billing.';
            setAiResult(msg);
            showSnackbar(msg, 'error');
            return;
          }

          if (response.ok) {
            setAiResult(data.suggestion || data.enhanced || data.category);
            if (aiDialogType === 'suggest' || aiDialogType === 'enhance') {
              setNote(data.suggestion || data.enhanced);
            }
          } else {
            const msg = data.error || 'AI processing failed';
            showSnackbar(msg, 'error');
          }
      } catch (error) {
        showSnackbar(error.message, 'error');
      } finally {
        setAiLoading(false);
      }
    };

    // Function to categorize a note
    const getNoteCategory = (content) => {
      const text = (content || '').toLowerCase();
      const categories = {
        Work: ['meeting', 'project', 'deadline', 'client', 'deploy', 'release', 'task', 'work'],
        Personal: ['birthday', 'gym', 'dinner', 'family', 'home', 'personal', 'friend'],
        Todo: ['todo', 'task', 'do', 'finish', 'complete', 'reminder', 'check'],
        Idea: ['idea', 'brainstorm', 'prototype', 'concept', 'think'],
        Shopping: ['buy', 'purchase', 'order', 'shopping', 'store', 'shop'],
        Finance: ['invoice', 'budget', 'pay', 'expense', 'money', 'cost'],
      };

      for (const [cat, keys] of Object.entries(categories)) {
        for (const k of keys) {
          if (text.includes(k)) return cat;
        }
      }
      return 'General';
    };

    // Filter notes based on selected category
    const filteredNotes = selectedCategory === 'All' 
      ? notes 
      : notes.filter(note => getNoteCategory(note.content) === selectedCategory);

    // Get all unique categories from notes
    const allCategories = ['All', ...new Set(notes.map(note => getNoteCategory(note.content)))];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', background: 'linear-gradient(120deg, #f0f2f5 0%, #e8eaf6 100%)' }}>
        <AppBar position="static" elevation={0} sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ 
              flexGrow: 1, 
              color: 'primary.main', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <SmartToyIcon sx={{ fontSize: 32 }} /> AI-Powered Notes with Calendar
            </Typography>
            <Button
              onClick={() => {
                window.open('http://localhost:5000/auth/google', '_blank');
                // Check status every 2 seconds for 30 seconds after opening OAuth
                const statusCheckInterval = setInterval(() => {
                  checkGoogleAuthStatus();
                }, 2000);
                setTimeout(() => clearInterval(statusCheckInterval), 30000);
              }}
              variant={googleAuthorized ? 'outlined' : 'contained'}
              color={googleAuthorized ? 'success' : 'primary'}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                ml: 2
              }}
              disabled={checkingGoogleAuth}
            >
              {checkingGoogleAuth ? 'Checking...' : (googleAuthorized ? '✓ Google Calendar Connected' : 'Connect Calendar')}
            </Button>
          </Toolbar>
        </AppBar>
        <SpeedDial
          ariaLabel="AI Actions"
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24,
            '& .MuiSpeedDial-fab': {
              width: 64,
              height: 64,
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }
          }}
          icon={<SpeedDialIcon />}
        >
          {aiActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.action}
              sx={{
                '&:hover': {
                  backgroundColor: 'primary.light'
                }
              }}
            />
          ))}
        </SpeedDial>

        {/* AI Dialog */}
        <AiDialog
          open={aiDialogOpen}
          onClose={() => setAiDialogOpen(false)}
          {...getAiDialogProps()}
          content={aiInput}
          loading={aiLoading}
          result={aiResult}
          onSubmit={handleAiSubmit}
          inputValue={aiInput}
          onInputChange={setAiInput}
        />

        <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
          <Grid container spacing={4}>
            {/* Add Note Section */}
            <Grid item xs={12}>
              <Card 
                elevation={0} 
                sx={{ 
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Write your note here... (Ctrl + Enter to add)"
                      variant="outlined"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      onKeyPress={(e) => e.ctrlKey && e.key === 'Enter' && handleAddNote()}
                      sx={{ 
                        backgroundColor: selectedColor,
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.light',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.main',
                          }
                        }
                      }}
                    />
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'row', sm: 'column' }, 
                      gap: 1,
                      width: { xs: '100%', sm: 'auto' }
                    }}>
                      <IconButton 
                        onClick={(e) => setColorMenuAnchor(e.currentTarget)}
                        sx={{
                          border: '1px solid',
                          borderColor: 'grey.200',
                          borderRadius: 1,
                          p: 1,
                          '&:hover': {
                            backgroundColor: 'grey.50'
                          }
                        }}
                      >
                        <PaletteIcon />
                      </IconButton>
                      <Button
                        variant="contained"
                        onClick={handleAddNote}
                        disabled={loadingNotes}
                        sx={{ 
                          minWidth: '120px',
                          height: '100%',
                          flex: { xs: 1, sm: 'none' }
                        }}
                      >
                        {loadingNotes ? <CircularProgress size={24} /> : 'Add Note'}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Category Filter */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                flexWrap: 'wrap',
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
              }}>
                <Typography variant="subtitle2" sx={{ alignSelf: 'center', mr: 1, fontWeight: 600, color: 'text.secondary' }}>
                  Filter by Category:
                </Typography>
                {allCategories.map((category) => (
                  <Box
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 20,
                      backgroundColor: selectedCategory === category ? 'primary.main' : 'grey.100',
                      color: selectedCategory === category ? 'white' : 'text.primary',
                      cursor: 'pointer',
                      fontWeight: selectedCategory === category ? 600 : 500,
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: selectedCategory === category ? 'primary.dark' : 'grey.200',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    {category}
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Notes Grid */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {filteredNotes.length === 0 ? (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        📝 No notes found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedCategory === 'All' 
                          ? 'Create your first note to get started!' 
                          : `No notes in the "${selectedCategory}" category yet`}
                      </Typography>
                    </Box>
                  </Grid>
                ) : (
                  filteredNotes.map((note) => (
                  <Grid item xs={12} sm={6} md={4} key={note.id}>
                    <Card 
                      elevation={0}
                      sx={{
                        backgroundColor: note.color,
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        position: 'relative',
                        overflow: 'visible',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                          borderRadius: 'inherit',
                          zIndex: 0,
                        }
                      }}
                    >
                      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                          <Chip
                            label={getNoteCategory(note.content)}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(79, 70, 229, 0.15)',
                              color: 'rgba(79, 70, 229, 0.9)',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                          {note.calendarEventUrl && (
                            <Chip
                              icon={<EventNoteIcon sx={{ fontSize: '16px !important' }} />}
                              label="Scheduled"
                              size="small"
                              clickable
                              component="a"
                              href={note.calendarEventUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                                color: 'rgba(16, 185, 129, 0.95)',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                textDecoration: 'none',
                                cursor: 'pointer'
                              }}
                            />
                          )}
                        </Box>
                        <Typography 
                          sx={{ 
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            minHeight: '60px',
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            color: 'rgba(0, 0, 0, 0.87)',
                            mb: 2
                          }}
                        >
                          {note.content}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                          pt: 2
                        }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'rgba(0, 0, 0, 0.6)',
                              fontWeight: 500
                            }}
                          >
                            {new Date(note.createdAt).toLocaleString()}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setAiInput(note.content);
                                setAiDialogType('enhance');
                                setAiDialogOpen(true);
                              }}
                              sx={{ 
                                color: 'primary.main',
                                '&:hover': { backgroundColor: 'rgba(79, 70, 229, 0.1)' }
                              }}
                            >
                              <AutoFixHighIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setAiInput(note.content);
                                setAiDialogType('categorize');
                                setAiDialogOpen(true);
                              }}
                              sx={{ 
                                color: 'secondary.main',
                                '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)' }
                              }}
                            >
                              <CategoryIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteNote(note.id)}
                              sx={{ 
                                color: 'error.main',
                                '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  ))
                )}
              </Grid>
            </Grid>
          </Grid>
        </Container>

        {/* Color Picker Menu */}
        <Menu
          anchorEl={colorMenuAnchor}
          open={Boolean(colorMenuAnchor)}
          onClose={() => setColorMenuAnchor(null)}
          TransitionComponent={Fade}
        >
          <Box sx={{ p: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0.5 }}>
            {colors.map((color) => (
              <Box
                key={color}
                sx={{
                  width: 30,
                  height: 30,
                  backgroundColor: color,
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                }}
                onClick={() => {
                  setSelectedColor(color);
                  setColorMenuAnchor(null);
                }}
              />
            ))}
          </Box>
        </Menu>

        {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            severity={snackbar.severity} 
            variant="filled"
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Voice Control Component */}
        <VoiceControl
          onAddNote={async (content) => {
            setNote(content);
            setLoadingNotes(true);
            try {
              const response = await fetch('http://localhost:5000/api/notes', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content, color: selectedColor }),
              });
              const newNote = await response.json();
              if (response.ok) {
                setNotes([newNote, ...notes]);
                setNote('');
                showSnackbar('✅ Note added via voice!');
              } else {
                throw new Error(newNote.error || 'Failed to add note');
              }
            } catch (error) {
              showSnackbar(error.message, 'error');
            } finally {
              setLoadingNotes(false);
            }
          }}
          onDeleteNote={handleDeleteNote}
          notes={notes}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
