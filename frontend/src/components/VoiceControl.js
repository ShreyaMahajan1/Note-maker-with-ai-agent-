import React, { useState, useEffect } from 'react';
import { 
    Fab, 
    Tooltip, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Box,
    Typography,
    IconButton,
    Chip,
    Paper,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CloseIcon from '@mui/icons-material/Close';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const VoiceControl = ({ onAddNote, onDeleteNote, notes }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);

    useEffect(() => {
        // Initialize speech recognition with proper fallback
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            setFeedback('Speech recognition not supported in this browser');
            return;
        }

        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onstart = () => {
            setFeedback('🎤 Listening...');
            setTranscript('');
        };

        rec.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            setTranscript(finalTranscript || interimTranscript);

            if (finalTranscript) {
                processVoiceCommand(finalTranscript.toLowerCase().trim());
            }
        };

        rec.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setFeedback(`❌ Error: ${event.error}`);
        };

        rec.onend = () => {
            setIsListening(false);
        };

        setRecognition(rec);

        return () => {
            if (rec) rec.stop();
        };
    }, [notes, onAddNote, onDeleteNote]);

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
        }
    };

    const clearFeedbackAfterDelay = (delay = 3000) => {
        setTimeout(() => {
            setFeedback('');
            setTranscript('');
            setCommandHistory([]);
        }, delay);
    };

    const processVoiceCommand = (command) => {
        // Add note commands
        if (command.includes('add note') || command.includes('create note') || command.includes('new note')) {
            const content = command
                .replace(/add note|create note|new note/gi, '')
                .trim();
            
            if (content && content.length > 2) {
                onAddNote(content);
                speak(`Note added: ${content}`);
                addToHistory(`ADD: ${content}`);
                clearFeedbackAfterDelay(2500);
            } else {
                setFeedback('❌ Please say more content for the note');
                speak('Please say more content for the note');
                clearFeedbackAfterDelay();
            }
        }
        // Delete note commands
        else if (command.includes('delete') || command.includes('remove')) {
            const content = command
                .replace(/delete|remove/gi, '')
                .replace(/note/gi, '')
                .trim();

            if (content) {
                const noteToDelete = notes.find(note =>
                    note.content.toLowerCase().includes(content.toLowerCase())
                );

                if (noteToDelete) {
                    onDeleteNote(noteToDelete.id);
                    speak(`Note deleted`);
                    addToHistory(`DELETE: ${noteToDelete.content.substring(0, 30)}...`);
                    clearFeedbackAfterDelay(2500);
                } else {
                    setFeedback(`❌ Could not find note matching: "${content}"`);
                    speak(`Could not find note matching ${content}`);
                    clearFeedbackAfterDelay();
                }
            } else {
                setFeedback('❌ Please specify which note to delete');
                speak('Please specify which note to delete');
                clearFeedbackAfterDelay();
            }
        }
        // Help command
        else if (command.includes('help') || command.includes('what can i say')) {
            setDialogOpen(true);
            speak('Showing help commands');
        }
        // List notes command
        else if (command.includes('list') || command.includes('show notes')) {
            if (notes.length === 0) {
                setFeedback('📝 You have no notes');
                speak('You have no notes');
            } else {
                const notesList = notes.slice(0, 3).map(n => n.content.substring(0, 20)).join(', ');
                setFeedback(`📝 Notes: ${notesList}...`);
                speak(`You have ${notes.length} notes`);
            }
            clearFeedbackAfterDelay();
        }
        else {
            setFeedback('❓ Command not recognized. Say "help" for options');
            clearFeedbackAfterDelay();
        }
    };

    const addToHistory = (command) => {
        setCommandHistory(prev => [command, ...prev.slice(0, 9)]);
    };

    const toggleListening = () => {
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    return (
        <>
            {/* Voice Control Microphone Button */}
            <Tooltip title={isListening ? 'Stop listening' : 'Start voice control'}>
                <Fab
                    color={isListening ? 'error' : 'primary'}
                    sx={{
                        position: 'fixed',
                        bottom: 100,
                        right: 24,
                        animation: isListening ? 'pulse 1s infinite' : 'none',
                        '@keyframes pulse': {
                            '0%': {
                                boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.7)',
                            },
                            '70%': {
                                boxShadow: '0 0 0 10px rgba(244, 67, 54, 0)',
                            },
                            '100%': {
                                boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)',
                            },
                        }
                    }}
                    onClick={toggleListening}
                >
                    {isListening ? <MicOffIcon /> : <MicIcon />}
                </Fab>
            </Tooltip>

            {/* Help Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }
                }}
            >
                <DialogTitle sx={{ color: 'white', fontWeight: 'bold' }}>
                    🎤 Voice Commands Help
                    <IconButton
                        aria-label="close"
                        onClick={() => setDialogOpen(false)}
                        sx={{ 
                            position: 'absolute', 
                            right: 8, 
                            top: 8,
                            color: 'white'
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ bgcolor: '#f5f5f5', pt: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {/* Add Note */}
                        <Paper sx={{ p: 2, bgcolor: '#e8f5e9', borderLeft: '4px solid #4caf50' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
                                ➕ Add a Note
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#388e3c' }}>
                                Say: <strong>"Add note [your content]"</strong>
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#388e3c', mt: 0.5 }}>
                                Examples: "Add note buy groceries", "Create note meeting at 3pm"
                            </Typography>
                        </Paper>

                        {/* Delete Note */}
                        <Paper sx={{ p: 2, bgcolor: '#ffebee', borderLeft: '4px solid #f44336' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#c62828', mb: 1 }}>
                                🗑️ Delete a Note
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#d32f2f' }}>
                                Say: <strong>"Delete [note content]"</strong> or <strong>"Remove [note content]"</strong>
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#d32f2f', mt: 0.5 }}>
                                Example: "Delete groceries"
                            </Typography>
                        </Paper>

                        {/* List Notes */}
                        <Paper sx={{ p: 2, bgcolor: '#e3f2fd', borderLeft: '4px solid #2196f3' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1565c0', mb: 1 }}>
                                📋 List Notes
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#1976d2' }}>
                                Say: <strong>"List notes"</strong> or <strong>"Show notes"</strong>
                            </Typography>
                        </Paper>

                        {/* Help */}
                        <Paper sx={{ p: 2, bgcolor: '#fff3e0', borderLeft: '4px solid #ff9800' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#e65100', mb: 1 }}>
                                ❓ Get Help
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#f57c00' }}>
                                Say: <strong>"Help"</strong> to see all commands
                            </Typography>
                        </Paper>

                        <Typography variant="caption" sx={{ mt: 2, color: '#666', textAlign: 'center' }}>
                            💡 Tip: Speak clearly and at a normal pace for best results
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Feedback Display */}
            {(isListening || feedback) && (
                <Paper
                    elevation={3}
                    sx={{
                        position: 'fixed',
                        bottom: 200,
                        right: 24,
                        p: 2.5,
                        maxWidth: 320,
                        maxHeight: 400,
                        overflowY: 'auto',
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(10px)',
                        borderLeft: '4px solid',
                        borderLeftColor: isListening ? 'primary.main' : 'success.main',
                        zIndex: 1000
                    }}
                >
                    {/* Feedback Message */}
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            fontWeight: 500,
                            mb: feedback ? 1 : 0,
                            color: 'text.primary'
                        }}
                    >
                        {feedback || '🎤 Ready to listen...'}
                    </Typography>

                    {/* Listening Indicator */}
                    {isListening && (
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VolumeUpIcon 
                                sx={{ 
                                    fontSize: 18, 
                                    color: 'primary.main',
                                    animation: 'bounce 1s infinite'
                                }} 
                            />
                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500 }}>
                                Listening...
                            </Typography>
                        </Box>
                    )}
                </Paper>
            )}
        </>
    );
};

export default VoiceControl;
