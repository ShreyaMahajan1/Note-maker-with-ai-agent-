import React, { useState, useEffect, useMemo } from "react";
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
import { AiDialog } from "./components/AiDialog";
import VoiceControl from "./components/VoiceControl";
import NotesGrid from "./components/NotesGrid";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import CalendarView from "./components/CalendarView";
import "./App.css";
import InspirationCard from "./components/inspirationCard";
import API_BASE_URL from "./config";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8b5cf6",
      light: "#a78bfa",
      dark: "#7c3aed",
    },
    secondary: {
      main: "#ec4899",
      light: "#f472b6",
      dark: "#db2777",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
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
      primary: "#f1f5f9",
      secondary: "#cbd5e1",
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    h4: {
      fontWeight: 800,
      letterSpacing: "-1px",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.3px",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      letterSpacing: "-0.2px",
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
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.95rem",
          boxShadow: "none",
          padding: "10px 24px",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(99, 102, 241, 0.25)",
            transform: "translateY(-2px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        contained: {
          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
            borderColor: "rgba(99, 102, 241, 0.2)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          fontSize: "0.85rem",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
        },
        elevation1: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        },
        elevation2: {
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
        },
        elevation3: {
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.1)",
            },
            "&.Mui-focused": {
              boxShadow: "0 4px 16px rgba(99, 102, 241, 0.2)",
            },
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
    }, 60000); // Check every minute

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

  const handleDeleteNote = async (id) => {
    try {
      setNotes(notes.filter((note) => note.id !== id));
      const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        showSnackbar("Note deleted successfully");
      } else {
        throw new Error("Failed to delete note");
      }
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

  const allCategories = [
    "All",
    ...new Set(notes.map((note) => getNoteCategory(note.content))),
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 10;
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, filteredNotes.length]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                    color: "#1a73e8",
                    textDecoration: "underline",
                    "&:hover": {
                      color: "#0d47a1",
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
                color: "#a78bfa",
                fontSize: "0.85rem",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                  color: "#8b5cf6",
                },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <LinkIcon sx={{ fontSize: "16px" }} />
              {link.length > 40 ? link.substring(0, 40) + "..." : link}
              <OpenInNewIcon sx={{ fontSize: "14px" }} />
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
        background: "rgba(30, 41, 59, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 4,
        border: "1px solid rgba(139, 92, 246, 0.2)",
        p: 2.5,
        height: "100%",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "rgba(15, 23, 42, 0.5)",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#615af1",
          borderRadius: "10px",
          "&:hover": {
            background: "#4a47d1",
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
                  ? "#615af1"
                  : "transparent",
              color: selectedCategory === category && currentView === "notes" ? "white" : "#cbd5e1",
              cursor: "pointer",
              fontWeight: selectedCategory === category && currentView === "notes" ? 700 : 600,
              fontSize: "0.9rem",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              border: "1px solid transparent",
              "&:hover": {
                background:
                  selectedCategory === category && currentView === "notes"
                    ? "#4a47d1"
                    : "rgba(97, 90, 241, 0.2)",
                transform: "translateX(4px)",
              },
            }}
          >
            {category}
          </Box>
        ))}
      </Box>

      <Box sx={{
        pt: 2,
        borderTop: "1px solid rgba(139, 92, 246, 0.2)",
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
            background: currentView === "analytics" ? "#615af1" : "transparent",
            color: currentView === "analytics" ? "white" : "#cbd5e1",
            cursor: "pointer",
            fontWeight: currentView === "analytics" ? 700 : 600,
            fontSize: "0.9rem",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            border: "1px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 1,
            "&:hover": {
              background: currentView === "analytics" ? "#4a47d1" : "rgba(97, 90, 241, 0.2)",
              transform: "translateX(4px)",
            },
          }}
        >
          📊 Analytics
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
          background: "#0f172a",
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "rgba(15, 23, 42, 0.7)",
            borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
            backdropFilter: "blur(30px) saturate(180%)",
            WebkitBackdropFilter: "blur(30px) saturate(180%)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
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
                flexShrink: 0, // Prevent logo from shrinking
                color: "white",
                fontWeight: 900,
                fontSize: { xs: "1.1rem", sm: "1.7rem", md: "2.2rem" },
                letterSpacing: "-1.5px",
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1 },
                textShadow: "0 2px 20px rgba(0, 0, 0, 0.2)",
                filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))",
                mr: { xs: 1, sm: 2 },
              }}
            >
              <Box
                sx={{
                  background: "#615af1",
                  borderRadius: { xs: "8px", sm: "12px" },
                  p: { xs: 0.5, sm: 0.8 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SmartToyIcon sx={{
                  fontSize: { xs: 18, sm: 26, md: 30 },
                  color: "white",
                }} />
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
                  color: "white",
                  fontWeight: 700,
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "white",
                  height: 3,
                  borderRadius: "3px 3px 0 0",
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
                    color: layoutMode === "single" ? "white" : "rgba(255, 255, 255, 0.7)",
                    background:
                      layoutMode === "single"
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
                flexShrink: 0, // Prevent button from shrinking
                textTransform: "none",
                fontWeight: 700,
                borderRadius: { xs: 1.5, sm: 3 },
                px: { xs: 1, sm: 2.5, md: 3.5 },
                py: { xs: 0.5, sm: 1, md: 1.2 },
                fontSize: { xs: "0.65rem", sm: "0.8rem", md: "0.9rem" },
                minWidth: { xs: "60px", sm: "120px", md: "150px" },
                background: "#615af1",
                color: "white",
                border: "none",
                "&:hover": {
                  background: "#4a47d1",
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
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#615af1" }}>
              Categories
            </Typography>
            <IconButton onClick={() => setSidebarOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <CategorySidebar />
        </Drawer>

        <SpeedDial
          ariaLabel="AI Actions"
          open={speedDialOpen}
          onClick={() => setSpeedDialOpen(!speedDialOpen)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            "& .MuiSpeedDial-fab": {
              width: 64,
              height: 64,
              background: "#615af1",
              "&:hover": {
                background: "#4a47d1",
              },
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
                "&:hover": {
                  backgroundColor: "primary.light",
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
                  <LinkIcon sx={{ mr: 1, color: "text.secondary" }} />
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
            <CalendarView googleAuthorized={googleAuthorized} />
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
                background: "#0f172a",
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
                <AnalyticsDashboard data={analyticsData} />
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
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 3,
                        background: "rgba(30, 41, 59, 0.8)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(139, 92, 246, 0.2)",
                        borderRadius: 4,
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
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
                                    sx={{ mr: 1, color: "#8b5cf6" }}
                                  />
                                ),
                              }}
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
                                border: "2px solid rgba(139, 92, 246, 0.3)",
                                borderRadius: 3,
                                p: 1.5,
                                background: "rgba(139, 92, 246, 0.1)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  backgroundColor: "rgba(139, 92, 246, 0.2)",
                                  borderColor: "#8b5cf6",
                                  transform: "scale(1.05)",
                                },
                              }}
                            >
                              <PaletteIcon sx={{ color: "#8b5cf6" }} />
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
                                backgroundColor: "#615af1",
                                "&:hover": {
                                  backgroundColor: "#4a47d1",
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
                    {filteredNotes.length === 0 ? (
                      <Box sx={{ textAlign: "center", py: 12 }}>
                        <Box sx={{ mb: 2, fontSize: "4rem" }}>📝</Box>
                        <Typography
                          variant="h6"
                          sx={{ mb: 1, fontWeight: 700, color: "#cbd5e1" }}
                        >
                          No notes found
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                          {selectedCategory === "All"
                            ? "Create your first note to get started!"
                            : `No notes in the "${selectedCategory}" category yet`}
                        </Typography>
                      </Box>
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
                            {currentNotes.map((note) => (
                              <Card
                                key={note.id}
                                sx={{
                                  backgroundColor: "rgba(30, 41, 59, 0.8)",
                                  backdropFilter: "blur(20px)",
                                  border: "1px solid rgba(139, 92, 246, 0.2)",
                                  height: { xs: 200, md: 220 },
                                  position: "relative",
                                  overflow: "hidden",
                                  cursor: "pointer",
                                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                  borderRadius: { xs: 3, md: 4 },
                                  display: "flex",
                                  flexDirection: "column",
                                  "&:hover": {
                                    transform: { xs: "none", md: "translateY(-4px)" },
                                    borderColor: "rgba(139, 92, 246, 0.5)",
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
                                        background: "#615af1",
                                        color: "white",
                                        fontWeight: 700,
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
                                          background: "#615af1",
                                          color: "white",
                                          fontWeight: 700,
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
                                      handleDeleteNote(note.id);
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
                            ))}
                          </Box>
                        )}

                        {layoutMode === "single" && (
                          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
                            {currentNotes.map((note) => (
                              <Card
                                key={note.id}
                                sx={{
                                  backgroundColor: "rgba(30, 41, 59, 0.8)",
                                  backdropFilter: "blur(20px)",
                                  border: "1px solid rgba(139, 92, 246, 0.2)",
                                  position: "relative",
                                  overflow: "hidden",
                                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                  borderRadius: 4,
                                  width: "100%",

                                  // ⭐ FIXED HEIGHT + layout
                                  height: 260,
                                  display: "flex",
                                  flexDirection: "column",

                                  "&:hover": {
                                    transform: "translateY(-4px)",
                                    borderColor: "rgba(139, 92, 246, 0.5)",
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
                                          background: "#615af1",
                                          color: "white",
                                          fontWeight: 700,
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
                                              "rgba(97, 90, 241, 0.15)",
                                            color: "#615af1",
                                            fontWeight: 700,
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
                                        "1px solid rgba(0, 0, 0, 0.08)",
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
                                        color: "#1a73e8",
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(26, 115, 232, 0.1)",
                                        },
                                      }}
                                    >
                                      <AutoFixHighIcon />
                                    </IconButton>

                                    <IconButton
                                      size="small"
                                      onClick={() => openEditDialog(note)}
                                      sx={{
                                        color: "#424242",
                                        "&:hover": {
                                          backgroundColor: "rgba(0,0,0,0.04)",
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
                                        color: "#615af1",
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(97, 90, 241, 0.1)",
                                        },
                                      }}
                                    >
                                      <CategoryIcon />
                                    </IconButton>

                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteNote(note.id)}
                                      sx={{
                                        color: "#d32f2f",
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(211, 47, 47, 0.1)",
                                        },
                                      }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Box>
                                </CardContent>
                              </Card>
                            ))}
                          </Box>
                        )}
                        {totalPages > 1 && (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 2,
                              mt: 6,
                              mb: 3,
                              p: 3,
                              background: "rgba(30, 41, 59, 0.8)",
                              backdropFilter: "blur(20px)",
                              borderRadius: 4,
                              border: "1px solid rgba(139, 92, 246, 0.2)",
                            }}
                          >
                            <Pagination
                              count={totalPages}
                              page={currentPage}
                              onChange={handlePageChange}
                              color="primary"
                              size="large"
                              siblingCount={1}
                              boundaryCount={1}
                              sx={{
                                "& .MuiPaginationItem-root": {
                                  fontWeight: 600,
                                  fontSize: "1rem",
                                  minWidth: "40px",
                                  height: "40px",
                                  borderRadius: 3,
                                  margin: "0 4px",
                                  border: "1px solid rgba(139, 92, 246, 0.3)",
                                  color: "#f1f5f9",
                                  background: "rgba(30, 41, 59, 0.8)",
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    background: "rgba(139, 92, 246, 0.2)",
                                    borderColor: "#8b5cf6",
                                    transform: "scale(1.05)",
                                  },
                                },
                                "& .Mui-selected": {
                                  background: "#615af1 !important",
                                  color: "white",
                                  border: "none",
                                  "&:hover": {
                                    background: "#4a47d1 !important",
                                    transform: "scale(1.05)",
                                  },
                                },
                                "& .MuiPaginationItem-ellipsis": {
                                  border: "none",
                                  color: "#94a3b8",
                                },
                              }}
                            />

                            <Typography
                              variant="body2"
                              sx={{
                                color: "#cbd5e1",
                                fontWeight: 500,
                                fontSize: "0.9rem",
                              }}
                            >
                              Showing{" "}
                              <strong>
                                {indexOfFirstNote + 1}-
                                {Math.min(
                                  indexOfLastNote,
                                  filteredNotes.length
                                )}
                              </strong>{" "}
                              of <strong>{filteredNotes.length}</strong> notes
                            </Typography>
                          </Box>
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>
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
          onDeleteNote={handleDeleteNote}
          onEditNote={handleUpdateNote}
          notes={notes}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
