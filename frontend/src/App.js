import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Tabs,
  Tab,
  Link,
  Drawer,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PaletteIcon from "@mui/icons-material/Palette";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CategoryIcon from "@mui/icons-material/Category";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import EventNoteIcon from "@mui/icons-material/EventNote";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NotesIcon from "@mui/icons-material/Notes";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import LinkIcon from "@mui/icons-material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SummarizeIcon from "@mui/icons-material/Summarize";
import DownloadIcon from "@mui/icons-material/Download";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import { AiDialog } from "./components/AiDialog";
import VoiceControl from "./components/VoiceControl";
import NotesGrid from "./components/NotesGrid";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import CalendarView from "./components/CalendarView";
import { NotesGridSkeleton, CalendarSkeleton, AnalyticsSkeleton } from "./components/LoadingSkeleton";
import { EmptyNotes, EmptySearch, EmptyCalendar, EmptyAnalytics } from "./components/EmptyState";
import { useKeyboardShortcuts, KeyboardShortcutsDialog } from "./components/KeyboardShortcuts";
import ExportDialog from "./components/ExportDialog";
import { exportToJSON, exportToCSV, exportToMarkdown, exportToText } from "./utils/exportUtils";
import "./App.css";
import InspirationCard from "./components/inspirationCard";
import API_BASE_URL from "./config";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2dd4bf", // teal accent
      light: "#5eead4",
      dark: "#14b8a6",
    },
    secondary: {
      main: "#f59e0b", // amber
      light: "#fbbf24",
      dark: "#d97706",
    },
    background: {
      default: "#0a0e1a",
      paper: "#151b2e",
    },
    grey: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
    },
    text: {
      primary: "#e2e8f0",
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.3px",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "0px",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "0.95rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.9rem",
          boxShadow: "none",
          padding: "10px 20px",
          transition: "all 0.15s ease",
          "&:hover": {
            boxShadow: "none",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "all 0.2s ease",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "none",
          "&:hover": {
            transform: "translateY(-2px)",
            borderColor: "rgba(45, 212, 191, 0.3)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: "0.75rem",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [noteLink, setNoteLink] = useState("");
  const [notes, setNotes] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedColor, setSelectedColor] = useState(() => {
    return localStorage.getItem("notepin-color") || "#ffffff";
  });
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem("notepin-view") || "notes";
  });
  const [layoutMode, setLayoutMode] = useState(() => {
    return localStorage.getItem("notepin-layout") || "grid";
  });
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem("notepin-category") || "All";
  });
  const [colorMenuAnchor, setColorMenuAnchor] = useState(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [googleAuthorized, setGoogleAuthorized] = useState(false);
  const [checkingGoogleAuth, setCheckingGoogleAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer

  // AI-related state
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiDialogType, setAiDialogType] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  // Edit note state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteContent, setEditNoteContent] = useState("");
  const [editNoteLink, setEditNoteLink] = useState("");

  // Export and search state
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Delete confirmation and undo state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deletedNote, setDeletedNote] = useState(null);
  const [showUndoSnackbar, setShowUndoSnackbar] = useState(false);

  // Bulk selection state
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  // Keyboard shortcuts
  const { shortcutsOpen, setShortcutsOpen } = useKeyboardShortcuts({
    onNewNote: () => {
      const textarea = document.querySelector('textarea[placeholder*="What\'s on your mind"]');
      if (textarea) {
        textarea.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    onSearch: () => {
      const searchInput = document.querySelector('input[placeholder*="Search"]');
      if (searchInput) searchInput.focus();
    },
    onSave: () => handleAddNote(),
    onExport: () => setExportDialogOpen(true),
    onViewChange: (view) => setCurrentView(view),
  });

  const aiActions = [
    {
      icon: <SmartToyIcon />,
      name: "Suggest",
      action: () => handleAiActionClick("suggest"),
    },
    {
      icon: <AutoFixHighIcon />,
      name: "Enhance",
      action: () => handleAiActionClick("enhance"),
    },
    {
      icon: <CategoryIcon />,
      name: "Categorize",
      action: () => handleAiActionClick("categorize"),
    },
    {
      icon: <SummarizeIcon />,
      name: "Meeting Summary",
      action: () => handleAiActionClick("meeting-summary"),
    },
  ];

  const colors = [
    "#ffffff",
    "#f28b82",
    "#fbbc04",
    "#fff475",
    "#ccff90",
    "#a7ffeb",
    "#cbf0f8",
    "#aecbfa",
    "#d7aefb",
    "#fdcfe8",
  ];

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem("notepin-view", currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem("notepin-layout", layoutMode);
  }, [layoutMode]);

  useEffect(() => {
    localStorage.setItem("notepin-category", selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem("notepin-color", selectedColor);
  }, [selectedColor]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      showSnackbar("Failed to reload notes", "error");
    }
  };

  const checkGoogleAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/google/status`);
      const data = await response.json();

      const isAuthorized = data.authorized || false;
      const wasAuthorized = googleAuthorized;
      setGoogleAuthorized(isAuthorized);

      // If just became authorized, reload notes to show calendar events
      if (isAuthorized && !wasAuthorized) {
        fetchNotes();
      }

      // If token expired, show notification
      if (!isAuthorized && data.reason === 'token_expired') {
        showSnackbar("⚠️ Calendar session expired. Please reconnect.", "warning");
      }
    } catch (error) {
      console.error("Error checking Google auth status:", error);
      setGoogleAuthorized(false);
    } finally {
      setCheckingGoogleAuth(false);
    }
  };

  // Check auth status periodically
  useEffect(() => {
    const authCheckInterval = setInterval(() => {
      checkGoogleAuthStatus();
    }, 5 * 60000); // Check every 5 minutes (reduced from 1 minute to avoid rate limiting)

    return () => clearInterval(authCheckInterval);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/test`),
      fetch(`${API_BASE_URL}/api/notes`),
    ])
      .then(([resTest, resNotes]) =>
        Promise.all([resTest.json(), resNotes.json()])
      )
      .then(([dataTest, dataNotes]) => {
        console.log('API Response:', dataNotes, 'isArray:', Array.isArray(dataNotes));
        setMessage(dataTest.message);
        setNotes(Array.isArray(dataNotes) ? dataNotes : []);
        setLoading(false);
        checkGoogleAuthStatus();
      })
      .catch((error) => {
        console.error("Error:", error);
        setNotes([]);
        setLoading(false);
        showSnackbar("Failed to load data", "error");
      });
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddNote = async () => {
    if (note.trim()) {
      setLoadingNotes(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/notes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: note,
            color: selectedColor,
            link: noteLink.trim() || null,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }),
        });
        const data = await response.json();

        // Handle token expiration
        if (
          response.status === 401 ||
          (data.error && data.error.includes("token"))
        ) {
          setGoogleAuthorized(false);
          showSnackbar(
            "⚠️ Calendar session expired. Please reconnect.",
            "warning"
          );
        } else if (response.status === 409) {
          showSnackbar(
            "⚠️ This event already exists on your calendar!",
            "warning"
          );
        } else if (response.ok) {
          setNotes([data, ...notes]);
          setNote("");
          setNoteLink("");
          showSnackbar("Note added successfully");
          if (data.calendarEventUrl) {
            showSnackbar(
              "✅ Calendar event created! Check your Google Calendar."
            );
          }
        } else {
          throw new Error(data.error || "Failed to add note");
        }
      } catch (error) {
        showSnackbar(error.message, "error");
      } finally {
        setLoadingNotes(false);
      }
    }
  };

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;
    
    const noteToRemove = noteToDelete;
    setDeleteConfirmOpen(false);
    
    try {
      // Store the deleted note for undo
      setDeletedNote(noteToRemove);
      
      // Remove from UI immediately
      setNotes(notes.filter((note) => note.id !== noteToRemove.id));
      
      // Show undo snackbar
      setShowUndoSnackbar(true);
      
      // Set timeout to actually delete from backend
      const deleteTimeout = setTimeout(async () => {
        const response = await fetch(`${API_BASE_URL}/api/notes/${noteToRemove.id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete note");
        }
        setDeletedNote(null);
      }, 5000); // 5 seconds to undo
      
      // Store timeout ID for potential cancellation
      noteToRemove.deleteTimeout = deleteTimeout;
      
    } catch (error) {
      showSnackbar(error.message, "error");
      fetchNotes();
    } finally {
      setNoteToDelete(null);
    }
  };

  const handleUndoDelete = () => {
    if (deletedNote) {
      // Cancel the delete timeout
      if (deletedNote.deleteTimeout) {
        clearTimeout(deletedNote.deleteTimeout);
      }
      
      // Restore the note
      setNotes([deletedNote, ...notes]);
      setDeletedNote(null);
      setShowUndoSnackbar(false);
      showSnackbar("Note restored", "success");
    }
  };

  const handlePinNote = async (noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    const newPinnedState = !note.pinned;
    
    // Optimistic update
    setNotes(notes.map(n => 
      n.id === noteId ? { ...n, pinned: newPinnedState } : n
    ));

    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}/pin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: newPinnedState }),
      });

      if (!response.ok) {
        throw new Error('Failed to pin/unpin note');
      }

      showSnackbar(newPinnedState ? "Note pinned" : "Note unpinned", "success");
    } catch (error) {
      // Revert on error
      setNotes(notes.map(n => 
        n.id === noteId ? { ...n, pinned: !newPinnedState } : n
      ));
      showSnackbar(error.message, "error");
    }
  };

  const toggleNoteSelection = (noteId) => {
    setSelectedNotes(prev =>
      prev.includes(noteId)
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotes.length === searchedNotes.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(searchedNotes.map(note => note.id));
    }
  };

  const handleBulkDelete = async () => {
    setBulkDeleteConfirmOpen(false);
    
    if (selectedNotes.length === 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/bulk`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteIds: selectedNotes }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete notes');
      }

      // Remove deleted notes from UI
      setNotes(notes.filter(note => !selectedNotes.includes(note.id)));
      showSnackbar(`Deleted ${selectedNotes.length} notes`, "success");
      setSelectedNotes([]);
      setBulkSelectMode(false);
    } catch (error) {
      showSnackbar(error.message, "error");
      fetchNotes();
    }
  };

  const handleAiActionClick = (type) => {
    setAiDialogType(type);
    setAiInput("");
    setAiResult("");
    setAiDialogOpen(true);
  };

  const getAiDialogProps = () => {
    switch (aiDialogType) {
      case "suggest":
        return {
          title: "Get AI Suggestion",
          inputLabel: "What kind of note would you like?",
          submitLabel: "Generate",
        };
      case "enhance":
        return {
          title: "Enhance Note",
          inputLabel: "Enter note to enhance",
          submitLabel: "Enhance",
        };
      case "categorize":
        return {
          title: "Categorize Note",
          inputLabel: "Enter note to categorize",
          submitLabel: "Categorize",
        };
      case "meeting-summary":
        return {
          title: "Meeting Summary",
          inputLabel: "Paste your meeting notes or transcript here",
          submitLabel: "Generate Summary",
          showFileUpload: true,
        };
      default:
        return {};
    }
  };

  const handleFileUpload = async (file) => {
    setAiLoading(true);
    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await fetch(`${API_BASE_URL}/api/ai/transcribe-video`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setAiResult(data.summary);
        setNote(data.summary);
        showSnackbar('✅ Video transcribed and summarized successfully!');
      } else {
        const msg = data.error || 'Failed to process video';
        showSnackbar(msg, 'error');
      }
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiSubmit = async () => {
    setAiLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ai/${aiDialogType}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: aiInput,
            content: aiInput,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 429) {
        const msg =
          data.error ||
          "API quota exceeded or rate limited. Check your API key and billing.";
        setAiResult(msg);
        showSnackbar(msg, "error");
        return;
      }

      if (response.ok) {
        const result = data.suggestion || data.enhanced || data.category || data.summary;
        setAiResult(result);
        if (aiDialogType === "suggest" || aiDialogType === "enhance" || aiDialogType === "meeting-summary") {
          setNote(result);
        }
      } else {
        const msg = data.error || "AI processing failed";
        showSnackbar(msg, "error");
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setAiLoading(false);
    }
  };

  const openEditDialog = (note) => {
    setEditNoteId(note.id);
    setEditNoteContent(note.content || "");
    setEditNoteLink(note.link || "");
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    await handleUpdateNote(editNoteId, editNoteContent, editNoteLink);
  };

  const handleUpdateNote = async (noteId, newContent, newLink = null) => {
    if (!noteId) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notes/${noteId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: newContent,
            link: newLink?.trim() || null,
          }),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === noteId
              ? {
                ...n,
                content: data.content || newContent,
                link: data.link || newLink,
              }
              : n
          )
        );
        setEditDialogOpen(false);
        setEditNoteId(null);
        setEditNoteContent("");
        setEditNoteLink("");
        showSnackbar("Note updated successfully");
      } else {
        throw new Error(data.error || "Failed to update note");
      }
    } catch (err) {
      showSnackbar(err.message || "Failed to update note", "error");
      fetchNotes();
    }
  };

  const getNoteCategory = (content) => {
    const text = (content || "").toLowerCase();
    const categories = {
      Work: [
        "meeting",
        "project",
        "deadline",
        "client",
        "deploy",
        "release",
        "task",
        "work",
      ],
      Personal: [
        "birthday",
        "gym",
        "dinner",
        "family",
        "home",
        "personal",
        "friend",
      ],
      Todo: ["todo", "task", "do", "finish", "complete", "reminder", "check"],
      Idea: ["idea", "brainstorm", "prototype", "concept", "think"],
      Shopping: ["buy", "purchase", "order", "shopping", "store", "shop"],
      Finance: ["invoice", "budget", "pay", "expense", "money", "cost"],
    };

    for (const [cat, keys] of Object.entries(categories)) {
      for (const k of keys) {
        if (text.includes(k)) return cat;
      }
    }
    return "General";
  };

  const filteredNotes =
    selectedCategory === "All"
      ? notes
      : notes.filter(
        (note) => getNoteCategory(note.content) === selectedCategory
      );

  // Apply search filter and sort (pinned first)
  const searchedNotes = (searchTerm
    ? filteredNotes.filter((note) =>
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredNotes
  ).sort((a, b) => {
    // Pinned notes first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    // Then by creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const allCategories = [
    "All",
    ...new Set(notes.map((note) => getNoteCategory(note.content))),
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 10;
  const totalPages = Math.ceil(searchedNotes.length / notesPerPage);
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = searchedNotes.slice(indexOfFirstNote, indexOfLastNote);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchedNotes.length]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExport = (format) => {
    const notesWithCategory = notes.map((note) => ({
      ...note,
      category: getNoteCategory(note.content),
    }));

    switch (format) {
      case "json":
        exportToJSON(notesWithCategory);
        break;
      case "csv":
        exportToCSV(notesWithCategory);
        break;
      case "markdown":
        exportToMarkdown(notesWithCategory);
        break;
      case "text":
        exportToText(notesWithCategory);
        break;
      default:
        break;
    }
    showSnackbar(`Notes exported as ${format.toUpperCase()}!`);
    setExportDialogOpen(false);
  };

  const analyticsData = useMemo(() => {
    const counts = {};
    for (const n of notes) {
      const cat = getNoteCategory(n.content);
      counts[cat] = (counts[cat] || 0) + 1;
    }
    const labels = Object.keys(counts);
    const values = labels.map((l) => counts[l]);
    if (labels.length === 0) {
      return { labels: ["No data"], values: [0] };
    }
    return { labels, values };
  }, [notes]);



  const renderNoteContent = (content, link) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return (
      <Box>
        <Typography
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: { xs: "0.9rem", sm: "0.9rem" },
            lineHeight: 1.5,
            color: "#f1f5f9",
            fontWeight: 500,
          }}
        >
          {parts.map((part, index) => {
            if (part.match(urlRegex)) {
              return (
                <Link
                  key={index}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#2dd4bf",
                    textDecoration: "underline",
                    "&:hover": {
                      color: "#5eead4",
                    },
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {part}
                </Link>
              );
            }
            return part;
          })}
        </Typography>
        {link && (
          <Box
            sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid rgba(139, 92, 246, 0.2)" }}
          >
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                color: "#2dd4bf",
                fontSize: "0.85rem",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                  color: "#5eead4",
                },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <LinkIcon sx={{ fontSize: "16px", color: "#2dd4bf" }} />
              {link.length > 40 ? link.substring(0, 40) + "..." : link}
              <OpenInNewIcon sx={{ fontSize: "14px", color: "#2dd4bf" }} />
            </Link>
          </Box>
        )}
      </Box>
    );
  };

  // Sidebar Component
  const CategorySidebar = () => (
    <Box
      sx={{
        background: "rgba(21, 27, 46, 0.7)",
        borderRadius: 3,
        border: "1px solid rgba(255, 255, 255, 0.08)",
        p: 2.5,
        height: "100%",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(45, 212, 191, 0.3)",
          borderRadius: "10px",
          "&:hover": {
            background: "rgba(45, 212, 191, 0.5)",
          },
        },
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          mb: 2,
          fontWeight: 700,
          color: "#f1f5f9",
          fontSize: "0.95rem",
        }}
      >
        📂 Categories
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
        {allCategories.map((category) => (
          <Box
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setSidebarOpen(false);
              if (currentView === "analytics") setCurrentView("notes");
            }}
            sx={{
              px: 2.5,
              py: 1.5,
              borderRadius: 3,
              background:
                selectedCategory === category && currentView === "notes"
                  ? "rgba(45, 212, 191, 0.15)"
                  : "transparent",
              color: selectedCategory === category && currentView === "notes" ? "#2dd4bf" : "#94a3b8",
              cursor: "pointer",
              fontWeight: selectedCategory === category && currentView === "notes" ? 600 : 500,
              fontSize: "0.9rem",
              transition: "all 0.15s ease",
              border: selectedCategory === category && currentView === "notes" ? "1px solid rgba(45, 212, 191, 0.3)" : "1px solid transparent",
              "&:hover": {
                background:
                  selectedCategory === category && currentView === "notes"
                    ? "rgba(45, 212, 191, 0.2)"
                    : "rgba(45, 212, 191, 0.08)",
                transform: "translateX(2px)",
              },
            }}
          >
            {category}
          </Box>
        ))}
      </Box>

      <Box sx={{
        pt: 2,
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}>
        <Box
          onClick={() => {
            setCurrentView("analytics");
            setSidebarOpen(false);
          }}
          sx={{
            px: 2.5,
            py: 1.5,
            borderRadius: 3,
            background: currentView === "analytics" ? "rgba(45, 212, 191, 0.15)" : "transparent",
            color: currentView === "analytics" ? "#2dd4bf" : "#94a3b8",
            cursor: "pointer",
            fontWeight: currentView === "analytics" ? 600 : 500,
            fontSize: "0.9rem",
            transition: "all 0.15s ease",
            border: currentView === "analytics" ? "1px solid rgba(45, 212, 191, 0.3)" : "1px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&:hover": {
              background: currentView === "analytics" ? "rgba(45, 212, 191, 0.2)" : "rgba(45, 212, 191, 0.08)",
              transform: "translateX(2px)",
            },
          }}
        >
          📊 Analytics
        </Box>
      </Box>

      {/* Mobile-only Quick Actions */}
      <Box sx={{
        pt: 2,
        mt: 2,
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        display: { xs: "block", md: "none" },
      }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1.5,
            fontWeight: 700,
            color: "#f1f5f9",
            fontSize: "0.85rem",
          }}
        >
          ⚡ Quick Actions
        </Typography>
        
        <Box
          onClick={() => {
            setExportDialogOpen(true);
            setSidebarOpen(false);
          }}
          sx={{
            px: 2.5,
            py: 1.5,
            mb: 1,
            borderRadius: 3,
            background: "transparent",
            color: "#2dd4bf",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.9rem",
            transition: "all 0.15s ease",
            border: "1px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            "&:hover": {
              background: "rgba(45, 212, 191, 0.08)",
              transform: "translateX(2px)",
            },
          }}
        >
          <DownloadIcon sx={{ fontSize: 20 }} />
          Export Notes
        </Box>

        <Box
          onClick={() => {
            setShortcutsOpen(true);
            setSidebarOpen(false);
          }}
          sx={{
            px: 2.5,
            py: 1.5,
            borderRadius: 3,
            background: "transparent",
            color: "#94a3b8",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.9rem",
            transition: "all 0.15s ease",
            border: "1px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            "&:hover": {
              background: "rgba(148, 163, 184, 0.08)",
              transform: "translateX(2px)",
            },
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: 20 }} />
          Keyboard Shortcuts
        </Box>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          position: "relative",
          background: "linear-gradient(135deg, #0a0e1a 0%, #151b2e 100%)",
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "rgba(10, 14, 26, 0.85)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
            zIndex: 1100,
          }}
        >
          <Toolbar
            sx={{
              py: { xs: 1, sm: 1.5 },
              px: { xs: 0.5, sm: 2, md: 4 },
              minHeight: { xs: 56, sm: 64 },
              gap: { xs: 0.5, sm: 1 },
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconButton
              onClick={() => setSidebarOpen(true)}
              sx={{
                mr: { xs: 0, sm: 1 },
                display: { xs: "flex", md: "none" },
                color: "white",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                p: { xs: 0.4, sm: 1 },
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.25)",
                },
              }}
              size="small"
            >
              <MenuIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
            </IconButton>

            <Typography
              variant="h5"
              component="div"
              sx={{
                flexShrink: 0,
                color: "#2dd4bf",
                fontWeight: 700,
                fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" },
                letterSpacing: "-0.5px",
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1 },
                mr: { xs: 1, sm: 2 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 28, sm: 36 },
                  height: { xs: 28, sm: 36 },
                  background: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(45, 212, 191, 0.3)",
                }}
              >
                <Box component="span" sx={{ fontSize: { xs: "1rem", sm: "1.3rem" } }}>
                  📝
                </Box>
              </Box>
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                MindSync
              </Box>
            </Typography>

            <Tabs
              value={currentView}
              onChange={(e, newValue) => setCurrentView(newValue)}
              sx={{
                flexGrow: 1, // Allow tabs to take available space
                minHeight: { xs: 40, sm: 48 },
                "& .MuiTabs-flexContainer": {
                  gap: { xs: 0.5, sm: 1 },
                  height: '100%',
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: { xs: 40, sm: 48 },
                  minWidth: { xs: 50, sm: 70, md: 80 },
                  px: { xs: 1, sm: 1.5 },
                  color: "rgba(255, 255, 255, 0.7)",
                },
                "& .Mui-selected": {
                  color: "#2dd4bf",
                  fontWeight: 700,
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#2dd4bf",
                  height: 2,
                },
              }}
            >
              <Tab
                icon={<NotesIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />}
                value="notes"
                title="Notes"
              />
              <Tab
                icon={<CalendarMonthIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />}
                value="calendar"
                title="Calendar"
              />
              <Tab
                icon={<BarChartIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />}
                value="analytics"
                title="Analytics"
              />
            </Tabs>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                flexShrink: 0,
              }}
            >
              <IconButton
                onClick={() => setExportDialogOpen(true)}
                size="small"
                sx={{
                  color: "#2dd4bf",
                  background: "rgba(45, 212, 191, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(45, 212, 191, 0.3)",
                  p: 1,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(45, 212, 191, 0.2)",
                    transform: "scale(1.05)",
                  },
                }}
                title="Export Notes (Ctrl+E)"
              >
                <DownloadIcon sx={{ fontSize: 24 }} />
              </IconButton>

              <IconButton
                onClick={() => setShortcutsOpen(true)}
                size="small"
                sx={{
                  color: "#94a3b8",
                  background: "rgba(148, 163, 184, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  p: 1,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(148, 163, 184, 0.2)",
                    color: "#cbd5e1",
                    transform: "scale(1.05)",
                  },
                }}
                title="Keyboard Shortcuts (?)"
              >
                <HelpOutlineIcon sx={{ fontSize: 24 }} />
              </IconButton>
            </Box>

            {currentView === "notes" && (
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 0.25, sm: 0.5 },
                  flexShrink: 0,
                }}
              >
                <IconButton
                  onClick={() => setLayoutMode("grid")}
                  size="small"
                  sx={{
                    color: layoutMode === "grid" ? "white" : "rgba(255, 255, 255, 0.7)",
                    background:
                      layoutMode === "grid"
                        ? "rgba(255, 255, 255, 0.25)"
                        : "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    p: { xs: 0.5, sm: 0.75, md: 1 },
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.3)",
                      transform: "scale(1.05)",
                    },
                  }}
                  title="Grid View"
                >
                  <GridViewIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
                </IconButton>
                <IconButton
                  onClick={() => setLayoutMode("single")}
                  size="small"
                  sx={{
                    color: layoutMode === "single" ? "#2dd4bf" : "rgba(255, 255, 255, 0.5)",
                    background:
                      layoutMode === "single"
                        ? "rgba(45, 212, 191, 0.15)"
                        : "transparent",
                    border: layoutMode === "single" ? "1px solid rgba(45, 212, 191, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)",
                    p: { xs: 0.5, sm: 0.75, md: 1 },
                    borderRadius: 1.5,
                    transition: "all 0.15s ease",
                    "&:hover": {
                      background: "rgba(45, 212, 191, 0.1)",
                    },
                  }}
                  title="Single Card View"
                >
                  <ViewAgendaIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
                </IconButton>
              </Box>
            )}

            <Button
              onClick={() => {
                window.open(`${API_BASE_URL}/auth/google`, "_blank");

                const statusCheckInterval = setInterval(async () => {
                  await checkGoogleAuthStatus();
                }, 1000);

                const handleFocus = async () => {
                  await checkGoogleAuthStatus();
                };
                window.addEventListener('focus', handleFocus);

                setTimeout(() => {
                  clearInterval(statusCheckInterval);
                  window.removeEventListener('focus', handleFocus);
                }, 30000);
              }}
              variant="contained"
              sx={{
                flexShrink: 0,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: { xs: 1.5, sm: 2 },
                px: { xs: 1, sm: 2, md: 2.5 },
                py: { xs: 0.5, sm: 0.8, md: 1 },
                fontSize: { xs: "0.7rem", sm: "0.85rem", md: "0.9rem" },
                minWidth: { xs: "60px", sm: "100px", md: "120px" },
                background: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)",
                color: "#0a0e1a",
                border: "none",
                boxShadow: "0 2px 8px rgba(45, 212, 191, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5eead4 0%, #2dd4bf 100%)",
                  boxShadow: "0 4px 12px rgba(45, 212, 191, 0.4)",
                },
              }}
              disabled={checkingGoogleAuth}
            >
              <Box component="span" sx={{ display: { xs: "inline", lg: "none" } }}>
                {checkingGoogleAuth ? "..." : googleAuthorized ? "✓" : "Cal"}
              </Box>
              <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
                {checkingGoogleAuth ? "..." : googleAuthorized ? "✓ Calendar" : "Connect"}
              </Box>
            </Button>
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer for Categories */}
        <Drawer
          anchor="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: 280,
              boxSizing: "border-box",
              p: 2,
              pt: 3,
              pb: 3,
              background: "linear-gradient(135deg, #0a0e1a 0%, #151b2e 100%)",
              borderRight: "1px solid rgba(45, 212, 191, 0.2)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              pb: 2,
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#2dd4bf" }}>
              Categories
            </Typography>
            <IconButton 
              onClick={() => setSidebarOpen(false)}
              sx={{
                color: "#94a3b8",
                "&:hover": {
                  backgroundColor: "rgba(45, 212, 191, 0.1)",
                  color: "#2dd4bf",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <CategorySidebar />
        </Drawer>

        <SpeedDial
          ariaLabel="AI Actions"
          open={speedDialOpen}
          onClick={() => setSpeedDialOpen(!speedDialOpen)}
          direction="up"
          sx={{
            position: "fixed",
            bottom: { xs: 140, sm: 100 },
            right: { xs: 16, sm: 24 },
            "& .MuiSpeedDial-fab": {
              width: 56,
              height: 56,
              background: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)",
              color: "#0a0e1a",
              boxShadow: "0 4px 16px rgba(45, 212, 191, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #5eead4 0%, #2dd4bf 100%)",
                boxShadow: "0 6px 20px rgba(45, 212, 191, 0.5)",
              },
            },
            "& .MuiSpeedDial-actions": {
              paddingTop: { xs: "8px", sm: "8px" },
            },
          }}
          icon={<SpeedDialIcon />}
        >
          {aiActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={(e) => {
                action.action();
                setSpeedDialOpen(false);
              }}
              sx={{
                marginTop: { xs: "12px", sm: "10px" },
                "&:hover": {
                  backgroundColor: "rgba(45, 212, 191, 0.15)",
                },
                "& .MuiSpeedDialAction-fab": {
                  backgroundColor: "rgba(21, 27, 46, 0.9)",
                  color: "#2dd4bf",
                  border: "1px solid rgba(45, 212, 191, 0.3)",
                  "&:hover": {
                    backgroundColor: "rgba(45, 212, 191, 0.2)",
                    borderColor: "#2dd4bf",
                  },
                },
              }}
            />
          ))}
        </SpeedDial>

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
          onFileUpload={handleFileUpload}
        />

        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit Note</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={editNoteContent}
              onChange={(e) => setEditNoteContent(e.target.value)}
              placeholder="Edit your note"
              variant="outlined"
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              fullWidth
              value={editNoteLink}
              onChange={(e) => setEditNoteLink(e.target.value)}
              placeholder="Add a link (optional)"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <LinkIcon sx={{ mr: 1, color: "#2dd4bf" }} />
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveEdit}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Box
          sx={{
            mt: currentView === "analytics" ? 0 : 4,
            mb: currentView === "analytics" ? 0 : 6,
            px: currentView === "analytics" ? 0 : { xs: 2, sm: 4 },
            position: "relative",
            zIndex: 1,
            width: "100%",
          }}
        >
          {currentView === "calendar" ? (
            loading ? (
              <CalendarSkeleton />
            ) : (
              <CalendarView googleAuthorized={googleAuthorized} />
            )
          ) : currentView === "analytics" ? (
            <Box
              sx={{
                display: "flex",
                minHeight: "100vh",
                width: { xs: "100%", md: "100vw" },
                position: "relative",
                left: { xs: 0, md: "50%" },
                right: { xs: 0, md: "50%" },
                marginLeft: { xs: 0, md: "-50vw" },
                marginRight: { xs: 0, md: "-50vw" },
                background: "linear-gradient(135deg, #0a0e1a 0%, #151b2e 100%)",
                pt: { xs: 2, md: 3 },
                px: { xs: 2, md: 3 },
              }}
            >
              {/* Spacer for sidebar */}
              <Box
                sx={{
                  width: { xs: "0", md: "240px" },
                  flexShrink: 0,
                  display: { xs: "none", md: "block" },
                }}
              />

              {/* Fixed sidebar */}
              <Box
                sx={{
                  position: "fixed",
                  left: { md: 24 },
                  top: 100,
                  bottom: 24,
                  width: "240px",
                  display: { xs: "none", md: "block" },
                  zIndex: 100,
                  overflowY: "auto",
                }}
              >
                <CategorySidebar />
              </Box>

              {/* Analytics Content */}
              <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
                {loading ? (
                  <AnalyticsSkeleton />
                ) : notes.length === 0 ? (
                  <EmptyAnalytics />
                ) : (
                  <AnalyticsDashboard data={analyticsData} />
                )}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                minHeight: "calc(100vh - 200px)",
                gap: 3,
                width: "100%",
              }}
            >
              {/* Spacer for sidebar */}
              <Box
                sx={{
                  width: { xs: "0", md: "240px" },
                  flexShrink: 0,
                  display: { xs: "none", md: "block" },
                }}
              />

              {/* Fixed sidebar */}
              <Box
                sx={{
                  position: "fixed",
                  left: { xs: 0, sm: 16, md: 32 },
                  top: 105,
                  bottom: 24,
                  width: "240px",
                  display: { xs: "none", md: "block" },
                  zIndex: 100,
                  overflowY: "auto",
                }}
              >
                <CategorySidebar />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
                {loading ? (
                  <NotesGridSkeleton />
                ) : (
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Card
                        elevation={0}
                        sx={{
                          p: 3,
                          background: "rgba(21, 27, 46, 0.7)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          borderRadius: 3,
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="h6"
                            sx={{ mb: 2, color: "#f1f5f9", fontWeight: 700 }}
                          >
                            ✨ Create a New Note
                          </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "flex-start",
                            flexDirection: { xs: "column", sm: "column" },
                          }}
                        >
                          <Box
                            sx={{
                              width: "100%",
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                            }}
                          >
                            <TextField
                              fullWidth
                              multiline
                              rows={3}
                              placeholder="What's on your mind? 💭"
                              variant="outlined"
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              onKeyPress={(e) =>
                                e.ctrlKey &&
                                e.key === "Enter" &&
                                handleAddNote()
                              }
                              sx={{
                                backgroundColor: "rgba(30, 41, 59, 0.8)",
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 3,
                                  border: "1px solid rgba(139, 92, 246, 0.3)",
                                  color: "#f1f5f9",
                                  "&:hover fieldset": {
                                    borderColor: "#8b5cf6",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#8b5cf6",
                                    borderWidth: 2,
                                    boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                                  },
                                  "& textarea": {
                                    scrollbarWidth: "none",
                                    "&::-webkit-scrollbar": {
                                      display: "none",
                                    },
                                  },
                                },
                                "& .MuiOutlinedInput-input": {
                                  color: "#f1f5f9",
                                },
                                "& .MuiOutlinedInput-input::placeholder": {
                                  color: "#94a3b8",
                                  opacity: 1,
                                },
                              }}
                            />
                            <TextField
                              fullWidth
                              placeholder="Add a link (optional) 🔗"
                              variant="outlined"
                              value={noteLink}
                              onChange={(e) => setNoteLink(e.target.value)}
                              InputProps={{
                                startAdornment: (
                                  <LinkIcon
                                    sx={{ mr: 1, color: "#2dd4bf" }}
                                  />
                                ),
                              }}
                              sx={{
                                backgroundColor: "rgba(21, 27, 46, 0.6)",
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  border: "1px solid rgba(255, 255, 255, 0.1)",
                                  color: "#e2e8f0",
                                  "&:hover fieldset": {
                                    borderColor: "rgba(45, 212, 191, 0.5)",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#2dd4bf",
                                    borderWidth: 1,
                                    boxShadow: "0 0 0 3px rgba(45, 212, 191, 0.1)",
                                  },
                                },
                                "& .MuiOutlinedInput-input": {
                                  color: "#f1f5f9",
                                },
                                "& .MuiOutlinedInput-input::placeholder": {
                                  color: "#94a3b8",
                                  opacity: 1,
                                },
                              }}
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: { xs: "row", sm: "row" },
                              gap: 1.5,
                              width: { xs: "100%", sm: "100%" },
                              justifyContent: "flex-end",
                            }}
                          >
                            <IconButton
                              onClick={(e) =>
                                setColorMenuAnchor(e.currentTarget)
                              }
                              sx={{
                                border: "1px solid rgba(45, 212, 191, 0.3)",
                                borderRadius: 2,
                                p: 1.5,
                                background: "rgba(45, 212, 191, 0.1)",
                                transition: "all 0.15s ease",
                                "&:hover": {
                                  backgroundColor: "rgba(45, 212, 191, 0.2)",
                                  borderColor: "#2dd4bf",
                                },
                              }}
                            >
                              <PaletteIcon sx={{ color: "#2dd4bf" }} />
                            </IconButton>
                            <Button
                              variant="contained"
                              onClick={handleAddNote}
                              disabled={loadingNotes}
                              sx={{
                                minWidth: "120px",
                                height: "100%",
                                flex: { xs: 1, sm: "none" },
                                borderRadius: 2,
                                background: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)",
                                color: "#0a0e1a",
                                fontWeight: 600,
                                boxShadow: "0 2px 8px rgba(45, 212, 191, 0.3)",
                                "&:hover": {
                                  background: "linear-gradient(135deg, #5eead4 0%, #2dd4bf 100%)",
                                  boxShadow: "0 4px 12px rgba(45, 212, 191, 0.4)",
                                },
                              }}
                            >
                              {loadingNotes ? (
                                <CircularProgress size={24} color="inherit" />
                              ) : (
                                "+ Save"
                              )}
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Box
                    sx={{
                      display: { xs: "none", xl: "block" },
                      flexShrink: 0,
                      width: { md: "min(40vw, 600px)" },
                      maxWidth: { md: "600px" },
                      minWidth: { md: "320px" },
                      position: "relative",
                      alignSelf: "flex-start",
                      mt: { md: 0 },
                      zIndex: 10,
                      px: { md: 0 },
                    }}
                  >
                    <InspirationCard />
                  </Box>

                  <Grid item xs={12}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 3,
                        background: "rgba(21, 27, 46, 0.7)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: 3,
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <TextField
                          fullWidth
                          placeholder="🔍 Search notes... (Ctrl+K)"
                          variant="outlined"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              border: "1px solid rgba(45, 212, 191, 0.2)",
                              color: "#f1f5f9",
                              "&:hover fieldset": {
                                borderColor: "rgba(45, 212, 191, 0.4)",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#2dd4bf",
                                borderWidth: 2,
                              },
                            },
                            "& .MuiOutlinedInput-input": {
                              color: "#f1f5f9",
                            },
                            "& .MuiOutlinedInput-input::placeholder": {
                              color: "#94a3b8",
                              opacity: 1,
                            },
                          }}
                        />
                        <Button
                          variant={bulkSelectMode ? "contained" : "outlined"}
                          onClick={() => {
                            setBulkSelectMode(!bulkSelectMode);
                            setSelectedNotes([]);
                          }}
                          startIcon={<SelectAllIcon />}
                          sx={{
                            whiteSpace: "nowrap",
                            borderColor: bulkSelectMode ? "transparent" : "rgba(45, 212, 191, 0.3)",
                            color: bulkSelectMode ? "#0a0e1a" : "#2dd4bf",
                            background: bulkSelectMode ? "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)" : "transparent",
                            "&:hover": {
                              borderColor: "rgba(45, 212, 191, 0.5)",
                              background: bulkSelectMode ? "linear-gradient(135deg, #5eead4 0%, #2dd4bf 100%)" : "rgba(45, 212, 191, 0.1)",
                            },
                          }}
                        >
                          Select
                        </Button>
                      </Box>
                    </Card>
                  </Grid>

                  {/* Bulk Actions Toolbar */}
                  {bulkSelectMode && (
                    <Grid item xs={12}>
                      <Card
                        elevation={0}
                        sx={{
                          p: 2,
                          mb: 2,
                          background: "linear-gradient(135deg, rgba(45, 212, 191, 0.15) 0%, rgba(20, 184, 166, 0.1) 100%)",
                          border: "1px solid rgba(45, 212, 191, 0.3)",
                          borderRadius: 3,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Typography sx={{ color: "#2dd4bf", fontWeight: 600 }}>
                              {selectedNotes.length} selected
                            </Typography>
                            <Button
                              size="small"
                              onClick={handleSelectAll}
                              sx={{ color: "#2dd4bf", textTransform: "none" }}
                            >
                              {selectedNotes.length === searchedNotes.length ? "Deselect All" : "Select All"}
                            </Button>
                          </Box>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              disabled={selectedNotes.length === 0}
                              onClick={() => setBulkDeleteConfirmOpen(true)}
                              sx={{
                                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                color: "white",
                                "&:hover": {
                                  background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                                },
                                "&:disabled": {
                                  background: "rgba(100, 116, 139, 0.3)",
                                  color: "rgba(255, 255, 255, 0.3)",
                                },
                              }}
                            >
                              Delete ({selectedNotes.length})
                            </Button>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    {searchedNotes.length === 0 ? (
                      searchTerm ? (
                        <EmptySearch searchTerm={searchTerm} onClearSearch={() => setSearchTerm("")} />
                      ) : filteredNotes.length === 0 ? (
                        <EmptyNotes
                          onCreateNote={() => {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            const textarea = document.querySelector('textarea[placeholder*="What\'s on your mind"]');
                            if (textarea) textarea.focus();
                          }}
                          category={selectedCategory}
                        />
                      ) : null
                    ) : (
                      <>
                        {layoutMode === "grid" && (
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)",
                                lg: "repeat(4, 1fr)",
                                xl: "repeat(5, 1fr)",
                              },
                              gap: 2.5,
                              mb: 4,
                            }}
                          >
                            <AnimatePresence mode="popLayout">
                              {currentNotes.map((note, index) => (
                                <motion.div
                                  key={note.id}
                                  layout
                                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                  <Card
                                sx={{
                                  backgroundColor: "rgba(21, 27, 46, 0.7)",
                                  border: "1px solid rgba(255, 255, 255, 0.08)",
                                  height: { xs: 200, md: 220 },
                                  position: "relative",
                                  overflow: "hidden",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  borderRadius: { xs: 2.5, md: 3 },
                                  display: "flex",
                                  flexDirection: "column",
                                  "&:hover": {
                                    transform: { xs: "none", md: "translateY(-2px)" },
                                    borderColor: "rgba(45, 212, 191, 0.4)",
                                    boxShadow: "0 4px 12px rgba(45, 212, 191, 0.15)",
                                    "& .action-buttons": {
                                      opacity: 1,
                                    },
                                  },
                                }}
                              >
                                <CardContent
                                  sx={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                    p: { xs: "10px", md: "14px" },
                                    gap: { xs: 0.75, md: 1 },
                                    overflow: "hidden",
                                    "&:last-child": {
                                      pb: { xs: "10px", md: "14px" },
                                    },
                                  }}
                                >
                                  {/* Pin and Checkbox Row */}
                                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePinNote(note.id);
                                      }}
                                      sx={{
                                        p: 0.5,
                                        color: note.pinned ? "#f59e0b" : "#64748b",
                                        "&:hover": {
                                          color: note.pinned ? "#d97706" : "#94a3b8",
                                        },
                                      }}
                                      title={note.pinned ? "Unpin" : "Pin"}
                                    >
                                      {note.pinned ? (
                                        <PushPinIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
                                      ) : (
                                        <PushPinOutlinedIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
                                      )}
                                    </IconButton>
                                    
                                    {bulkSelectMode && (
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleNoteSelection(note.id);
                                        }}
                                        sx={{ p: 0.5 }}
                                      >
                                        {selectedNotes.includes(note.id) ? (
                                          <CheckBoxIcon sx={{ fontSize: { xs: 20, md: 22 }, color: "#2dd4bf" }} />
                                        ) : (
                                          <CheckBoxOutlineBlankIcon sx={{ fontSize: { xs: 20, md: 22 }, color: "#64748b" }} />
                                        )}
                                      </IconButton>
                                    )}
                                  </Box>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 0.6,
                                      flexWrap: "wrap",
                                      minHeight: "fit-content",
                                    }}
                                  >
                                    <Chip
                                      label={getNoteCategory(note.content)}
                                      size="small"
                                      sx={{
                                        background: "rgba(45, 212, 191, 0.15)",
                                        color: "#2dd4bf",
                                        border: "1px solid rgba(45, 212, 191, 0.3)",
                                        fontWeight: 600,
                                        fontSize: { xs: "0.6rem", md: "0.65rem" },
                                        height: { xs: 18, md: 20 },
                                        "& .MuiChip-label": {
                                          px: { xs: "4px", md: "6px" },
                                        },
                                      }}
                                    />
                                    {note.calendarEventUrl && (
                                      <Chip
                                        icon={
                                          <EventNoteIcon
                                            sx={{
                                              fontSize: "12px !important",
                                              ml: "3px !important",
                                            }}
                                          />
                                        }
                                        label="Scheduled"
                                        size="small"
                                        clickable
                                        component="a"
                                        href={note.calendarEventUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                          background: "rgba(245, 158, 11, 0.15)",
                                          color: "#f59e0b",
                                          border: "1px solid rgba(245, 158, 11, 0.3)",
                                          fontWeight: 600,
                                          fontSize: "0.65rem",
                                          height: 20,
                                          "& .MuiChip-label": {
                                            px: "5px",
                                          },
                                        }}
                                      />
                                    )}
                                  </Box>

                                  <Box
                                    sx={{
                                      flex: 1,
                                      overflowY: "auto",
                                      overflowX: "hidden",
                                      pr: 0.8,
                                      scrollbarWidth: "none",
                                      "-ms-overflow-style": "none",
                                      "&::-webkit-scrollbar": {
                                        display: "none",
                                      },
                                    }}
                                  >
                                    {renderNoteContent(note.content, note.link)}
                                  </Box>

                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "#94a3b8",
                                      fontWeight: 600,
                                      fontSize: "0.7rem",
                                      marginTop: "auto",
                                    }}
                                  >
                                    {new Date(
                                      note.createdAt
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </Typography>
                                </CardContent>

                                <Box
                                  className="action-buttons"
                                  sx={{
                                    display: { xs: "flex", md: "flex" },
                                    gap: { xs: 0.3, md: 0.5 },
                                    p: { xs: "6px", md: "10px" },
                                    borderTop: "1px solid rgba(139, 92, 246, 0.2)",
                                    backgroundColor: "rgba(15, 23, 42, 0.5)",
                                    opacity: { xs: 1, md: 0 },
                                    transition: "opacity 0.2s ease",
                                    justifyContent: "flex-end",
                                    zIndex: 5,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAiInput(note.content);
                                      setAiDialogType("enhance");
                                      setAiDialogOpen(true);
                                    }}
                                    sx={{
                                      color: "#a78bfa",
                                      width: { xs: 28, md: 32 },
                                      height: { xs: 28, md: 32 },
                                      "&:hover": {
                                        backgroundColor: "rgba(139, 92, 246, 0.2)",
                                      },
                                    }}
                                    title="Enhance"
                                  >
                                    <AutoFixHighIcon
                                      sx={{ fontSize: { xs: "14px", md: "16px" } }}
                                    />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditDialog(note);
                                    }}
                                    sx={{
                                      color: "#cbd5e1",
                                      width: { xs: 28, md: 32 },
                                      height: { xs: 28, md: 32 },
                                      "&:hover": {
                                        backgroundColor: "rgba(203, 213, 225, 0.1)",
                                      },
                                    }}
                                    title="Edit"
                                  >
                                    <EditIcon sx={{ fontSize: { xs: "14px", md: "16px" } }} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAiInput(note.content);
                                      setAiDialogType("categorize");
                                      setAiDialogOpen(true);
                                    }}
                                    sx={{
                                      color: "#ec4899",
                                      width: { xs: 28, md: 32 },
                                      height: { xs: 28, md: 32 },
                                      "&:hover": {
                                        backgroundColor: "rgba(236, 72, 153, 0.2)",
                                      },
                                    }}
                                    title="Categorize"
                                  >
                                    <CategoryIcon sx={{ fontSize: { xs: "14px", md: "16px" } }} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteClick(note);
                                    }}
                                    sx={{
                                      color: "#ef4444",
                                      width: { xs: 28, md: 32 },
                                      height: { xs: 28, md: 32 },
                                      "&:hover": {
                                        backgroundColor: "rgba(239, 68, 68, 0.2)",
                                      },
                                    }}
                                    title="Delete"
                                  >
                                    <DeleteIcon sx={{ fontSize: { xs: "14px", md: "16px" } }} />
                                  </IconButton>
                                </Box>
                              </Card>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </Box>
                        )}

                        {layoutMode === "single" && (
                          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
                            <AnimatePresence mode="popLayout">
                              {currentNotes.map((note, index) => (
                                <motion.div
                                  key={note.id}
                                  layout
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                  <Card
                                sx={{
                                  backgroundColor: "rgba(21, 27, 46, 0.7)",
                                  border: "1px solid rgba(255, 255, 255, 0.08)",
                                  position: "relative",
                                  overflow: "hidden",
                                  transition: "all 0.2s ease",
                                  borderRadius: 3,
                                  width: "100%",
                                  height: 260,
                                  display: "flex",
                                  flexDirection: "column",
                                  "&:hover": {
                                    transform: "translateY(-2px)",
                                    borderColor: "rgba(45, 212, 191, 0.4)",
                                    boxShadow: "0 4px 12px rgba(45, 212, 191, 0.15)",
                                  },
                                }}
                              >
                                <CardContent
                                  sx={{
                                    p: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    flex: 1,
                                    overflow: "hidden",
                                  }}
                                >
                                  {/* Header (chips + date) */}
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "flex-start",
                                      mb: 2,
                                      flexWrap: "wrap",
                                      gap: 1,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 1,
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <Chip
                                        label={getNoteCategory(note.content)}
                                        size="small"
                                        sx={{
                                          background: "rgba(45, 212, 191, 0.15)",
                                          color: "#2dd4bf",
                                          border: "1px solid rgba(45, 212, 191, 0.3)",
                                          fontWeight: 600,
                                          fontSize: "0.7rem",
                                        }}
                                      />
                                      {note.calendarEventUrl && (
                                        <Chip
                                          icon={
                                            <EventNoteIcon
                                              sx={{
                                                fontSize: "14px !important",
                                              }}
                                            />
                                          }
                                          label="Scheduled"
                                          size="small"
                                          clickable
                                          component="a"
                                          href={note.calendarEventUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          sx={{
                                            backgroundColor:
                                              "rgba(245, 158, 11, 0.15)",
                                            color: "#f59e0b",
                                            border: "1px solid rgba(245, 158, 11, 0.3)",
                                            fontWeight: 600,
                                            fontSize: "0.7rem",
                                          }}
                                        />
                                      )}
                                    </Box>

                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "#94a3b8",
                                        fontWeight: 600,
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      {new Date(
                                        note.createdAt
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </Typography>
                                  </Box>

                                  {/* ⭐ Scrollable content */}
                                  <Box
                                    sx={{
                                      flex: 1,
                                      overflowY: "auto",
                                      pr: 1,
                                      mb: 2,
                                      scrollbarWidth: "none",
                                      "&::-webkit-scrollbar": {
                                        display: "none",
                                      },
                                    }}
                                  >
                                    {renderNoteContent(note.content, note.link)}
                                  </Box>

                                  {/* Footer (buttons) */}
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 1,
                                      justifyContent: "flex-end",
                                      pt: 2,
                                      borderTop:
                                        "1px solid rgba(255, 255, 255, 0.08)",
                                    }}
                                  >
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setAiInput(note.content);
                                        setAiDialogType("enhance");
                                        setAiDialogOpen(true);
                                      }}
                                      sx={{
                                        color: "#2dd4bf",
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(45, 212, 191, 0.15)",
                                        },
                                      }}
                                    >
                                      <AutoFixHighIcon />
                                    </IconButton>

                                    <IconButton
                                      size="small"
                                      onClick={() => openEditDialog(note)}
                                      sx={{
                                        color: "#94a3b8",
                                        "&:hover": {
                                          backgroundColor: "rgba(148, 163, 184, 0.15)",
                                        },
                                      }}
                                    >
                                      <EditIcon />
                                    </IconButton>

                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setAiInput(note.content);
                                        setAiDialogType("categorize");
                                        setAiDialogOpen(true);
                                      }}
                                      sx={{
                                        color: "#f59e0b",
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(245, 158, 11, 0.15)",
                                        },
                                      }}
                                    >
                                      <CategoryIcon />
                                    </IconButton>

                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteClick(note)}
                                      sx={{
                                        color: "#ef4444",
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(239, 68, 68, 0.15)",
                                        },
                                      }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Box>
                                </CardContent>
                              </Card>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </Box>
                        )}
                        {totalPages > 1 && (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: { xs: 1.5, sm: 2 },
                              mt: { xs: 4, sm: 6 },
                              mb: 3,
                              p: { xs: 2, sm: 3 },
                              background: "rgba(21, 27, 46, 0.7)",
                              borderRadius: 3,
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                            }}
                          >
                            <Pagination
                              count={totalPages}
                              page={currentPage}
                              onChange={handlePageChange}
                              color="primary"
                              size="medium"
                              siblingCount={0}
                              boundaryCount={1}
                              sx={{
                                "& .MuiPaginationItem-root": {
                                  fontWeight: 600,
                                  fontSize: { xs: "0.7rem", sm: "0.875rem", md: "1rem" },
                                  minWidth: { xs: "26px", sm: "32px", md: "40px" },
                                  height: { xs: "26px", sm: "32px", md: "40px" },
                                  borderRadius: 2,
                                  margin: { xs: "0 1px", sm: "0 2px", md: "0 4px" },
                                  padding: { xs: "0 4px", sm: "0 6px" },
                                  border: "1px solid rgba(255, 255, 255, 0.1)",
                                  color: "#e2e8f0",
                                  background: "rgba(21, 27, 46, 0.7)",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    background: "rgba(45, 212, 191, 0.15)",
                                    borderColor: "rgba(45, 212, 191, 0.4)",
                                  },
                                },
                                "& .Mui-selected": {
                                  background: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%) !important",
                                  color: "#0a0e1a",
                                  border: "none",
                                  fontWeight: 700,
                                  "&:hover": {
                                    background: "linear-gradient(135deg, #5eead4 0%, #2dd4bf 100%) !important",
                                  },
                                },
                                "& .MuiPaginationItem-ellipsis": {
                                  border: "none",
                                  color: "#94a3b8",
                                  minWidth: { xs: "20px", sm: "24px" },
                                },
                                "& .MuiPaginationItem-icon": {
                                  fontSize: { xs: "1rem", sm: "1.25rem" },
                                },
                              }}
                            />

                            <Typography
                              variant="body2"
                              sx={{
                                color: "#94a3b8",
                                fontWeight: 500,
                                fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" },
                                textAlign: "center",
                              }}
                            >
                              Showing{" "}
                              <strong>
                                {indexOfFirstNote + 1}-
                                {Math.min(
                                  indexOfLastNote,
                                  searchedNotes.length
                                )}
                              </strong>{" "}
                              of <strong>{searchedNotes.length}</strong> notes
                            </Typography>
                          </Box>
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>
                )}
              </Box>
            </Box>
          )}
        </Box>

        <Menu
          anchorEl={colorMenuAnchor}
          open={Boolean(colorMenuAnchor)}
          onClose={() => setColorMenuAnchor(null)}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 1,
            }}
          >
            {colors.map((color) => (
              <Box
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  setColorMenuAnchor(null);
                }}
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: color,
                  border: "2px solid #e0e0e0",
                  borderRadius: "50%",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.15)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  },
                }}
              />
            ))}
          </Box>
        </Menu>

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

        <ExportDialog
          open={exportDialogOpen}
          onClose={() => setExportDialogOpen(false)}
          onExport={handleExport}
        />

        <KeyboardShortcutsDialog
          open={shortcutsOpen}
          onClose={() => setShortcutsOpen(false)}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: "rgba(21, 27, 46, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            },
          }}
        >
          <DialogTitle sx={{ color: "#f1f5f9", fontWeight: 700 }}>
            Delete Note?
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: "#94a3b8" }}>
              Are you sure you want to delete this note? You'll have 5 seconds to undo.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={() => setDeleteConfirmOpen(false)}
              sx={{
                color: "#94a3b8",
                "&:hover": {
                  backgroundColor: "rgba(148, 163, 184, 0.1)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteNote}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "white",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bulk Delete Confirmation Dialog */}
        <Dialog
          open={bulkDeleteConfirmOpen}
          onClose={() => setBulkDeleteConfirmOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: "rgba(21, 27, 46, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            },
          }}
        >
          <DialogTitle sx={{ color: "#f1f5f9", fontWeight: 700 }}>
            {`Delete ${selectedNotes.length} Notes?`}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: "#94a3b8" }}>
              {`Are you sure you want to delete ${selectedNotes.length} selected notes? This action cannot be undone.`}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={() => setBulkDeleteConfirmOpen(false)}
              sx={{
                color: "#94a3b8",
                "&:hover": {
                  backgroundColor: "rgba(148, 163, 184, 0.1)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkDelete}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "white",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                },
              }}
            >
              Delete All
            </Button>
          </DialogActions>
        </Dialog>

        {/* Undo Delete Snackbar */}
        <Snackbar
          open={showUndoSnackbar}
          autoHideDuration={5000}
          onClose={() => setShowUndoSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity="info"
            variant="filled"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={handleUndoDelete}
                sx={{ fontWeight: 700 }}
              >
                UNDO
              </Button>
            }
            onClose={() => setShowUndoSnackbar(false)}
            sx={{
              background: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)",
              color: "#0a0e1a",
              fontWeight: 600,
            }}
          >
            Note deleted
          </Alert>
        </Snackbar>

        <VoiceControl
          onAddNote={async (content) => {
            setNote(content);
            setLoadingNotes(true);
            try {
              const response = await fetch(`${API_BASE_URL}/api/notes`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ content, color: selectedColor }),
              });
              const newNote = await response.json();
              if (response.ok) {
                setNotes([newNote, ...notes]);
                setNote("");
                showSnackbar("✅ Note added via voice!");
              } else {
                throw new Error(newNote.error || "Failed to add note");
              }
            } catch (error) {
              showSnackbar(error.message, "error");
            } finally {
              setLoadingNotes(false);
            }
          }}
          onDeleteNote={(noteId) => {
            const note = notes.find(n => n.id === noteId);
            if (note) handleDeleteClick(note);
          }}
          onEditNote={handleUpdateNote}
          notes={notes}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
