import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Fade,
  Chip,
  CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import API_BASE_URL from "../config";

const InspirationCard = () => {
  const [currentContent, setCurrentContent] = useState(null);
  const [fadeIn, setFadeIn] = useState(true);
  const [selectedMood, setSelectedMood] = useState("motivational");
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(true);

  const contentData = {
    quotes: [
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
      { text: "Your limitation—it's only your imagination.", author: "Anonymous" },
      { text: "Great things never come from comfort zones.", author: "Anonymous" },
      { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
      { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
      { text: "Success doesn't just find you. You have to go out and get it.", author: "Anonymous" },
      { text: "Dream bigger. Do bigger.", author: "Anonymous" },
      { text: "Push yourself, because no one else is going to do it for you.", author: "Anonymous" },
      { text: "Sometimes later becomes never. Do it now.", author: "Anonymous" },
      { text: "The key to success is to focus on goals, not obstacles.", author: "Anonymous" },
    ],
  };

  const getDailyQuote = () => {
    const today = new Date().toDateString();
    const seed = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return contentData.quotes[seed % contentData.quotes.length];
  };

  const fetchAIQuote = async (mood = 'motivational') => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/ai/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood })
      });
      const data = await response.json();
      if (data.quote) {
        return { text: data.quote, author: 'AI Generated', isAI: true };
      }
    } catch (error) {
      console.error('Failed to fetch AI quote:', error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  useEffect(() => {
    const loadContent = async () => {
      if (useAI) {
        const aiQuote = await fetchAIQuote(selectedMood);
        setCurrentContent(aiQuote || getDailyQuote());
      } else {
        setCurrentContent(getDailyQuote());
      }
    };
    loadContent();
  }, [selectedMood, useAI]);

  const handleRefresh = async () => {
    setFadeIn(false);
    setTimeout(async () => {
      if (useAI) {
        const aiQuote = await fetchAIQuote(selectedMood);
        setCurrentContent(aiQuote || contentData.quotes[Math.floor(Math.random() * contentData.quotes.length)]);
      } else {
        const quotes = contentData.quotes;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setCurrentContent(randomQuote);
      }
      setFadeIn(true);
    }, 200);
  };

  const handleMoodChange = async (mood) => {
    setSelectedMood(mood);
    setFadeIn(false);
    setTimeout(async () => {
      const aiQuote = await fetchAIQuote(mood);
      setCurrentContent(aiQuote || getDailyQuote());
      setFadeIn(true);
    }, 200);
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: { xs: "240px", md: "320px" },
        background: "linear-gradient(135deg, rgba(45, 212, 191, 0.08) 0%, rgba(20, 184, 166, 0.05) 100%)",
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.2s ease",
        border: "1px solid rgba(45, 212, 191, 0.2)",
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
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#2dd4bf",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Daily Quote
            </Typography>
            {currentContent?.isAI && (
              <Chip
                icon={<AutoAwesomeIcon sx={{ fontSize: "12px !important" }} />}
                label="AI"
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)",
                  color: "#0a0e1a",
                  "& .MuiChip-icon": {
                    color: "#0a0e1a",
                  },
                }}
              />
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              onClick={() => setUseAI(!useAI)}
              size="small"
              sx={{
                color: useAI ? "#2dd4bf" : "#64748b",
                backgroundColor: useAI ? "rgba(45, 212, 191, 0.15)" : "rgba(100, 116, 139, 0.1)",
                "&:hover": {
                  backgroundColor: useAI ? "rgba(45, 212, 191, 0.25)" : "rgba(100, 116, 139, 0.2)",
                },
                transition: "all 0.2s ease",
              }}
              title={useAI ? "Using AI quotes" : "Using static quotes"}
            >
              <AutoAwesomeIcon sx={{ fontSize: "16px" }} />
            </IconButton>
            <IconButton
              onClick={handleRefresh}
              size="small"
              disabled={loading}
              sx={{
                color: "#2dd4bf",
                backgroundColor: "rgba(45, 212, 191, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(45, 212, 191, 0.2)",
                  transform: "rotate(180deg)",
                },
                transition: "all 0.3s ease",
                "&:disabled": {
                  color: "#64748b",
                  backgroundColor: "rgba(100, 116, 139, 0.1)",
                },
              }}
            >
              {loading ? <CircularProgress size={16} sx={{ color: "#2dd4bf" }} /> : <RefreshIcon fontSize="small" />}
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Fade in={fadeIn} timeout={400}>
          <Box sx={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center",
            overflow: "hidden",
          }}>
            {loading && !currentContent ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <CircularProgress sx={{ color: "#2dd4bf" }} size={40} />
                <Typography sx={{ fontSize: "0.9rem", color: "#94a3b8" }}>
                  Generating {selectedMood} quote...
                </Typography>
              </Box>
            ) : currentContent && (
              <>
                <Typography
                  sx={{
                    fontSize: { xs: "1rem", md: "1.15rem" },
                    fontWeight: 600,
                    color: "#e2e8f0",
                    lineHeight: 1.6,
                    mb: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: { xs: 5, md: 6 },
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  "{currentContent.text}"
                </Typography>

                {currentContent.author && (
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      fontStyle: "italic",
                      color: "#94a3b8",
                      mt: "auto",
                    }}
                  >
                    — {currentContent.author}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Fade>

        {/* Mood Selector (only when AI is enabled) */}
        {useAI && (
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              justifyContent: "center",
              flexWrap: "wrap",
              mt: 2,
            }}
          >
            {["motivational", "calm", "happy", "focused", "creative"].map((mood) => (
              <Chip
                key={mood}
                label={mood}
                size="small"
                onClick={() => handleMoodChange(mood)}
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  height: 22,
                  backgroundColor: selectedMood === mood 
                    ? "rgba(45, 212, 191, 0.2)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: selectedMood === mood ? "#2dd4bf" : "#94a3b8",
                  border: selectedMood === mood 
                    ? "1px solid rgba(45, 212, 191, 0.4)" 
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: selectedMood === mood 
                      ? "rgba(45, 212, 191, 0.3)" 
                      : "rgba(45, 212, 191, 0.1)",
                    borderColor: "rgba(45, 212, 191, 0.4)",
                  },
                  textTransform: "capitalize",
                }}
              />
            ))}
          </Box>
        )}

        {/* Decorative element */}
        <Box
          sx={{
            position: "absolute",
            bottom: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(45, 212, 191, 0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      </CardContent>
    </Card>
  );
};

export default InspirationCard;
