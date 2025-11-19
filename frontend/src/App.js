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
import { AiDialog } from "./components/AiDialog";
import VoiceControl from "./components/VoiceControl";
import NotesGrid from "./components/NotesGrid";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import CalendarView from "./components/CalendarView";
import "./App.css";
import InspirationCard from "./components/inspirationCard";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#e60023",
      light: "#ff4757",
      dark: "#ad081b",
    },
    secondary: {
      main: "#1a73e8",
      light: "#4a90e2",
      dark: "#0d47a1",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    grey: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    body2: {
      fontSize: "0.9rem",
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.95rem",
          boxShadow: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            transform: "scale(1.02)",
          },
        },
        contained: {
          boxShadow: "0 2px 8px rgba(230, 0, 35, 0.3)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          border: "none",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      const response = await fetch("http://localhost:5000/api/notes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      showSnackbar("Failed to reload notes", "error");
    }
  };

  const checkGoogleAuthStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/google/status");
      const data = await response.json();
      setGoogleAuthorized(data.authorized || false);

      // If not authorized, reset the state
      if (!data.authorized) {
        setGoogleAuthorized(false);
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
      fetch("http://localhost:5000/api/test"),
      fetch("http://localhost:5000/api/notes"),
    ])
      .then(([resTest, resNotes]) =>
        Promise.all([resTest.json(), resNotes.json()])
      )
      .then(([dataTest, dataNotes]) => {
        setMessage(dataTest.message);
        setNotes(dataNotes);
        setLoading(false);
        checkGoogleAuthStatus();
      })
      .catch((error) => {
        console.error("Error:", error);
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
        const response = await fetch("http://localhost:5000/api/notes", {
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
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
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
      default:
        return {};
    }
  };

  const handleAiSubmit = async () => {
    setAiLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/ai/${aiDialogType}`,
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
          "OpenAI quota exceeded or rate limited. Check your API key and billing.";
        setAiResult(msg);
        showSnackbar(msg, "error");
        return;
      }

      if (response.ok) {
        setAiResult(data.suggestion || data.enhanced || data.category);
        if (aiDialogType === "suggest" || aiDialogType === "enhance") {
          setNote(data.suggestion || data.enhanced);
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
        `http://localhost:5000/api/notes/${noteId}`,
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

  const [miniAnalyticsOpen, setMiniAnalyticsOpen] = useState(false);
  const [miniAnalyticsVisible, setMiniAnalyticsVisible] = useState(true);
  const totalNotes = useMemo(() => (notes ? notes.length : 0), [notes]);

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
            color: "#202124",
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
            sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid rgba(0,0,0,0.08)" }}
          >
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                color: "#1a73e8",
                fontSize: "0.85rem",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                  color: "#0d47a1",
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
        backgroundColor: "#ffffff",
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        p: 2.5,
        maxHeight: "calc(100vh - 120px)",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#e0e0e0",
          borderRadius: "10px",
          "&:hover": {
            background: "#d0d0d0",
          },
        },
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          mb: 2,
          fontWeight: 700,
          color: "#202124",
          fontSize: "0.95rem",
        }}
      >
        📂 Categories
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {allCategories.map((category) => (
          <Box
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setSidebarOpen(false);
            }}
            sx={{
              px: 2.5,
              py: 1.5,
              borderRadius: 2,
              backgroundColor:
                selectedCategory === category ? "#e60023" : "transparent",
              color: selectedCategory === category ? "white" : "#202124",
              cursor: "pointer",
              fontWeight: selectedCategory === category ? 700 : 600,
              fontSize: "0.9rem",
              transition: "all 0.2s ease",
              border:
                selectedCategory === category
                  ? "none"
                  : "1px solid transparent",
              "&:hover": {
                backgroundColor:
                  selectedCategory === category ? "#ad081b" : "#f5f5f5",
                borderColor:
                  selectedCategory === category ? "transparent" : "#e0e0e0",
              },
            }}
          >
            {category}
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          background: "linear-gradient(180deg, #fbfbfb 0%, #ffffff 100%)",
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e0e0e0",
            backdropFilter: "blur(10px)",
          }}
        >
          <Toolbar
            sx={{
              py: { xs: 1, sm: 1.5 },
              px: { xs: 1, sm: 2, md: 4 },
              minHeight: { xs: 56, sm: 64 },
            }}
          >
            {currentView === "notes" && (
              <IconButton
                onClick={() => setSidebarOpen(true)}
                sx={{
                  mr: { xs: 0.5, sm: 1 },
                  display: { xs: "flex", md: "none" },
                  color: "#e60023",
                  p: { xs: 0.5, sm: 1 },
                }}
                size="small"
              >
                <MenuIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </IconButton>
            )}

            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                color: "#e60023",
                fontWeight: 700,
                fontSize: { xs: "1.1rem", sm: "1.5rem", md: "1.8rem" },
                letterSpacing: "-0.5px",
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.5, sm: 1 },
              }}
            >
              <SmartToyIcon sx={{ fontSize: { xs: 20, sm: 28, md: 32 } }} />
              <span>NotePin</span>
            </Typography>

            <Tabs
              value={currentView}
              onChange={(e, newValue) => setCurrentView(newValue)}
              sx={{
                mr: { xs: 0.5, sm: 1, md: 2 },
                minHeight: { xs: 40, sm: 48 },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: { xs: 40, sm: 48 },
                  minWidth: { xs: 40, sm: 80, md: 100 },
                  px: { xs: 0.5, sm: 1.5, md: 2 },
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                },
                "& .Mui-selected": {
                  color: "#e60023",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#e60023",
                },
              }}
            >
              <Tab
                icon={
                  <NotesIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
                }
                iconPosition="start"
                value="notes"
                sx={{
                  "& .MuiTab-iconWrapper": {
                    mr: { xs: 0, sm: 0.5, md: 1 },
                  },
                }}
              />
              <Tab
                icon={
                  <CalendarMonthIcon
                    sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }}
                  />
                }
                iconPosition="start"
                value="calendar"
                sx={{
                  "& .MuiTab-iconWrapper": {
                    mr: { xs: 0, sm: 0.5, md: 1 },
                  },
                }}
              />
            </Tabs>

            {currentView === "notes" && (
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 0.25, sm: 0.5 },
                  mr: { xs: 0.5, sm: 1, md: 2 },
                }}
              >
                <IconButton
                  onClick={() => setLayoutMode("grid")}
                  size="small"
                  sx={{
                    color: layoutMode === "grid" ? "#e60023" : "#757575",
                    backgroundColor:
                      layoutMode === "grid"
                        ? "rgba(230, 0, 35, 0.1)"
                        : "transparent",
                    border:
                      layoutMode === "grid"
                        ? "2px solid #e60023"
                        : "2px solid transparent",
                    p: { xs: 0.5, sm: 0.75, md: 1 },
                    "&:hover": {
                      backgroundColor:
                        layoutMode === "grid"
                          ? "rgba(230, 0, 35, 0.15)"
                          : "rgba(0, 0, 0, 0.04)",
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
                    color: layoutMode === "single" ? "#e60023" : "#757575",
                    backgroundColor:
                      layoutMode === "single"
                        ? "rgba(230, 0, 35, 0.1)"
                        : "transparent",
                    border:
                      layoutMode === "single"
                        ? "2px solid #e60023"
                        : "2px solid transparent",
                    p: { xs: 0.5, sm: 0.75, md: 1 },
                    "&:hover": {
                      backgroundColor:
                        layoutMode === "single"
                          ? "rgba(230, 0, 35, 0.15)"
                          : "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                  title="Single Card View"
                >
                  <ViewAgendaIcon
                    sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }}
                  />
                </IconButton>
              </Box>
            )}

            <Button
              onClick={() => {
                window.open("http://localhost:5000/auth/google", "_blank");
                const statusCheckInterval = setInterval(() => {
                  checkGoogleAuthStatus();
                }, 2000);
                setTimeout(() => clearInterval(statusCheckInterval), 30000);
              }}
              variant={googleAuthorized ? "outlined" : "contained"}
              color={googleAuthorized ? "success" : "primary"}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: { xs: 2, sm: 20 },
                px: { xs: 1, sm: 2, md: 3 },
                py: { xs: 0.5, sm: 0.75, md: 1 },
                fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.85rem" },
                minWidth: { xs: "80px", sm: "110px", md: "140px" },
              }}
              disabled={checkingGoogleAuth}
            >
              {checkingGoogleAuth
                ? "..."
                : googleAuthorized
                ? "✓ Cal"
                : "Connect"}
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
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#e60023" }}>
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
          onOpen={() => setSpeedDialOpen(true)}
          onClose={() => setSpeedDialOpen(false)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            "& .MuiSpeedDial-fab": {
              width: 64,
              height: 64,
              "&:hover": {
                backgroundColor: "primary.dark",
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
              onClick={action.action}
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
        />

        {miniAnalyticsVisible && (
          <Paper
            onClick={() => setMiniAnalyticsOpen(true)}
            elevation={6}
            sx={{
              position: "fixed",
              bottom: speedDialOpen
                ? { xs: 200, sm: 220 }
                : { xs: 120, sm: 140 },
              right: { xs: 16, sm: 24 },
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              cursor: "pointer",
              zIndex: 1400,
              backgroundColor: "#ffffff",
              transition: "bottom 0.2s ease-in-out",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
              📊
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700 }}>
                All notes
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                {totalNotes} notes
              </Typography>
            </Box>
          </Paper>
        )}

        <IconButton
          aria-label="toggle-analytics-summary"
          onClick={() => setMiniAnalyticsVisible((v) => !v)}
          sx={{
            position: "fixed",
            bottom: speedDialOpen ? { xs: 280, sm: 300 } : { xs: 200, sm: 200 },
            right: { xs: 22, sm: 30 },
            display: "flex",
            zIndex: 1500,
            bgcolor: "background.paper",
            boxShadow: 3,
            width: 44,
            height: 44,
            borderRadius: "50%",
            transition: "bottom 0.2s ease-in-out",
          }}
          size="large"
          title={
            miniAnalyticsVisible
              ? "Hide analytics summary"
              : "Show analytics summary"
          }
        >
          <BarChartIcon color={miniAnalyticsVisible ? "primary" : "inherit"} />
        </IconButton>

        <Dialog
          open={miniAnalyticsOpen}
          onClose={() => setMiniAnalyticsOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Analytics</DialogTitle>
          <DialogContent>
            <AnalyticsDashboard data={analyticsData} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMiniAnalyticsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

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

        <Container maxWidth="xl" sx={{ mt: 4, mb: 6, px: { xs: 2, sm: 4 } }}>
          {currentView === "calendar" ? (
            <CalendarView googleAuthorized={googleAuthorized} />
          ) : (
            <Box
              sx={{
                display: "flex",
                minHeight: "calc(100vh - 200px)",
                gap: 3,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: { xs: "0", md: "240px" },
                  flexShrink: 0,
                  display: { xs: "none", md: "block" },
                }}
              />

              <Box
                sx={{
                  position: "fixed",
                  left: { xs: 0, sm: 16, md: 32 },
                  top: 100,
                  width: "240px",
                  display: { xs: "none", md: "block" },
                  zIndex: 100,
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
                        background: "#ffffff",
                        border: "1px solid #e0e0e0",
                        borderRadius: 3,
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, color: "#202124", fontWeight: 700 }}
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
                                backgroundColor: selectedColor,
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  border: "1px solid #e0e0e0",
                                  "&:hover fieldset": {
                                    borderColor: "#e60023",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#e60023",
                                    borderWidth: 2,
                                  },
                                },
                                "& .MuiOutlinedInput-input::placeholder": {
                                  opacity: 0.6,
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
                                    sx={{ mr: 1, color: "text.secondary" }}
                                  />
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  border: "1px solid #e0e0e0",
                                  "&:hover fieldset": {
                                    borderColor: "#e60023",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#e60023",
                                    borderWidth: 2,
                                  },
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
                                border: "2px solid #e0e0e0",
                                borderRadius: 2,
                                p: 1.5,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  backgroundColor: "#f0f0f0",
                                  borderColor: "#e60023",
                                  transform: "scale(1.05)",
                                },
                              }}
                            >
                              <PaletteIcon sx={{ color: "#e60023" }} />
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
                                backgroundColor: "#e60023",
                                "&:hover": {
                                  backgroundColor: "#ad081b",
                                  boxShadow: "0 4px 16px rgba(230, 0, 35, 0.3)",
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
                          color="text.secondary"
                          sx={{ mb: 1, fontWeight: 700 }}
                        >
                          No notes found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
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
                                  backgroundColor: note.color,
                                  border: "1px solid rgba(0, 0, 0, 0.08)",
                                  minHeight: 220,
                                  position: "relative",
                                  overflow: "hidden",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                                  display: "flex",
                                  flexDirection: "column",
                                  "&:hover": {
                                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                                    transform: "translateY(-2px)",
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
                                    p: "14px",
                                    gap: 1,
                                    overflow: "hidden",
                                    "&:last-child": {
                                      pb: "14px",
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
                                        backgroundColor:
                                          "rgba(230, 0, 35, 0.12)",
                                        color: "#c62828",
                                        fontWeight: 700,
                                        fontSize: "0.65rem",
                                        height: 20,
                                        "& .MuiChip-label": {
                                          px: "6px",
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
                                          backgroundColor:
                                            "rgba(26, 115, 232, 0.12)",
                                          color: "#0d47a1",
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
                                      color: "rgba(32, 33, 36, 0.5)",
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
                                    display: "flex",
                                    gap: 0.5,
                                    p: "10px",
                                    borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                                    opacity: 0,
                                    transition: "opacity 0.2s ease",
                                    justifyContent: "flex-end",
                                    zIndex: 5,
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
                                      color: "#1a73e8",
                                      width: 32,
                                      height: 32,
                                      "&:hover": {
                                        backgroundColor:
                                          "rgba(26, 115, 232, 0.1)",
                                      },
                                    }}
                                    title="Enhance"
                                  >
                                    <AutoFixHighIcon
                                      sx={{ fontSize: "16px" }}
                                    />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditDialog(note);
                                    }}
                                    sx={{
                                      color: "#424242",
                                      width: 32,
                                      height: 32,
                                      "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.04)",
                                      },
                                    }}
                                    title="Edit"
                                  >
                                    <EditIcon sx={{ fontSize: "16px" }} />
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
                                      color: "#e60023",
                                      width: 32,
                                      height: 32,
                                      "&:hover": {
                                        backgroundColor:
                                          "rgba(230, 0, 35, 0.1)",
                                      },
                                    }}
                                    title="Categorize"
                                  >
                                    <CategoryIcon sx={{ fontSize: "16px" }} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNote(note.id);
                                    }}
                                    sx={{
                                      color: "#d32f2f",
                                      width: 32,
                                      height: 32,
                                      "&:hover": {
                                        backgroundColor:
                                          "rgba(211, 47, 47, 0.1)",
                                      },
                                    }}
                                    title="Delete"
                                  >
                                    <DeleteIcon sx={{ fontSize: "16px" }} />
                                  </IconButton>
                                </Box>
                              </Card>
                            ))}
                          </Box>
                        )}

                        {layoutMode === "single" && (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                              mb: 10,
                              width: "100%",
                            }}
                          >
                            {currentNotes.map((note) => (
                              <Card
                                key={note.id}
                                sx={{
                                  backgroundColor: note.color,
                                  border: "1px solid rgba(0, 0, 0, 0.08)",
                                  position: "relative",
                                  overflow: "visible",
                                  transition: "all 0.2s ease",
                                  borderRadius: "12px",
                                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                                  width: "100%",
                                  "&:hover": {
                                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                                    transform: "translateY(-2px)",
                                  },
                                }}
                              >
                                <CardContent sx={{ p: 3 }}>
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
                                          backgroundColor:
                                            "rgba(230, 0, 35, 0.12)",
                                          color: "#c62828",
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
                                              "rgba(26, 115, 232, 0.12)",
                                            color: "#0d47a1",
                                            fontWeight: 700,
                                            fontSize: "0.7rem",
                                          }}
                                        />
                                      )}
                                    </Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "rgba(32, 33, 36, 0.5)",
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

                                  <Box sx={{ mb: 2 }}>
                                    {renderNoteContent(note.content, note.link)}
                                  </Box>

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
                                      title="Enhance"
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
                                      title="Edit"
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
                                        color: "#e60023",
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(230, 0, 35, 0.1)",
                                        },
                                      }}
                                      title="Categorize"
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
                                      title="Delete"
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
                              backgroundColor: "#ffffff",
                              borderRadius: 3,
                              border: "1px solid #e0e0e0",
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
                                  borderRadius: "10px",
                                  margin: "0 4px",
                                  border: "1px solid #e0e0e0",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    backgroundColor: "#f5f5f5",
                                    borderColor: "#e60023",
                                  },
                                },
                                "& .Mui-selected": {
                                  backgroundColor: "#e60023 !important",
                                  color: "white",
                                  border: "none",
                                  "&:hover": {
                                    backgroundColor: "#ad081b !important",
                                  },
                                },
                                "& .MuiPaginationItem-ellipsis": {
                                  border: "none",
                                },
                              }}
                            />

                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
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
        </Container>

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
              const response = await fetch("http://localhost:5000/api/notes", {
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
