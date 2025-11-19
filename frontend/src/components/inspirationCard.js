import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Fade,
  Chip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

// your subtle texture background (uploaded file)
const BACKGROUND_IMAGE = "/mnt/data/2fc43379-e6d5-4660-a04b-fd9e44429174.png";

const InspirationCard = () => {
  const [currentContent, setCurrentContent] = useState(null);
  const [fadeIn, setFadeIn] = useState(true);
  const [contentType, setContentType] = useState("quote");

  const contentData = {
    quotes: [
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain", icon: "💭" },
      { text: "Your limitation—it's only your imagination.", author: "Anonymous", icon: "🌟" },
      { text: "Great things never come from comfort zones.", author: "Anonymous", icon: "🚀" },
      { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", icon: "⏰" },
      { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous", icon: "💪" },
      { text: "Success doesn't just find you. You have to go out and get it.", author: "Anonymous", icon: "🎯" },
      { text: "Dream bigger. Do bigger.", author: "Anonymous", icon: "✨" },
      { text: "Push yourself, because no one else is going to do it for you.", author: "Anonymous", icon: "🔥" },
      { text: "Sometimes later becomes never. Do it now.", author: "Anonymous", icon: "⚡" },
      { text: "The key to success is to focus on goals, not obstacles.", author: "Anonymous", icon: "🗝️" },
    ],
    prompts: [
      { text: "Write about a moment that changed your perspective today.", icon: "📝" },
      { text: "What's one thing you're grateful for right now?", icon: "🙏" },
      { text: "Describe your ideal day from start to finish.", icon: "☀️" },
      { text: "What skill would you like to learn and why?", icon: "🎓" },
      { text: "Write a letter to your future self.", icon: "💌" },
      { text: "What problem in your life needs a creative solution?", icon: "🧩" },
      { text: "Document a small victory you had recently.", icon: "🏆" },
      { text: "What would you do if you knew you couldn't fail?", icon: "🌈" },
    ],
    facts: [
      { text: "The first computer bug was an actual bug - a moth found in a Harvard computer in 1947.", icon: "🐛" },
      { text: "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that's still edible.", icon: "🍯" },
      { text: "The shortest war in history lasted 38 minutes between Britain and Zanzibar in 1896.", icon: "⏱️" },
      { text: "Octopuses have three hearts and blue blood.", icon: "🐙" },
      { text: "A single strand of spaghetti is called a 'spaghetto'.", icon: "🍝" },
      { text: "The Hawaiian alphabet only has 12 letters.", icon: "🌺" },
      { text: "Bananas are berries, but strawberries aren't.", icon: "🍌" },
      { text: "A group of flamingos is called a 'flamboyance'.", icon: "🦩" },
    ],
    tips: [
      { text: "Use color coding to categorize your notes by priority or topic.", icon: "🎨" },
      { text: "Set aside 5 minutes each morning to review yesterday's notes.", icon: "☕" },
      { text: "Keep your notes concise - aim for clarity over length.", icon: "✂️" },
      { text: "Use the Pomodoro Technique: 25 minutes of focus, 5 minute break.", icon: "🍅" },
      { text: "Archive old notes monthly to keep your workspace clean.", icon: "📦" },
      { text: "Add links to your notes to create a personal knowledge base.", icon: "🔗" },
      { text: "Try voice input for faster note-taking on the go.", icon: "🎤" },
      { text: "Review and enhance your notes with AI for better clarity.", icon: "🤖" },
    ],
  };

  const getContentByType = (type) => {
    switch (type) {
      case "quote": return contentData.quotes;
      case "prompt": return contentData.prompts;
      case "fact": return contentData.facts;
      case "tip": return contentData.tips;
      default: return contentData.quotes;
    }
  };

  const getRandomContent = (type) => {
    const contents = getContentByType(type);
    return contents[Math.floor(Math.random() * contents.length)];
  };

  const getDailyContent = (type) => {
    const contents = getContentByType(type);
    const today = new Date().toDateString();
    const seed = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return contents[seed % contents.length];
  };

  useEffect(() => {
    setCurrentContent(getDailyContent(contentType));
  }, [contentType]);

  const handleRefresh = () => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentContent(getRandomContent(contentType));
      setFadeIn(true);
    }, 300);
  };

  const handleTypeChange = (type) => {
    setFadeIn(false);
    setTimeout(() => {
      setContentType(type);
      setCurrentContent(getDailyContent(type));
      setFadeIn(true);
    }, 300);
  };

  // Balanced gradients
 const getGradient = () => {
  switch (contentType) {
    case "quote":
      return "linear-gradient(135deg, #9B7EDE 0%, #CFA6FF 100%)"; 
    case "prompt":
      return "linear-gradient(135deg, #ec5381ff 0%, #FF7AA5 100%)"; 
    case "fact":
      return "linear-gradient(135deg, #1883c5ff 0%, #4BA8F0 100%)"; 
    case "tip":
      return "linear-gradient(135deg, #06462eff 0%, #1eb988ff 100%)"; 
    default:
      return "linear-gradient(135deg, #9B7EDE 0%, #CFA6FF 100%)";
  }
};


  // renamed label
  const getTypeLabel = () => {
    switch (contentType) {
      case "quote": return "Daily Quote";
      case "prompt": return "Journal Idea";
      case "fact": return "Fun Fact";
      case "tip": return "Productivity Tip";
      default: return "Daily Quote";
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        // responsive min-height so the card is taller on desktop and still okay on mobile
        minHeight: { xs: "260px", md: "380px" }, // <-- increased height
        height: "100%", // still fills parent if parent defines fixed height
        // gradient + texture
        backgroundImage: `${getGradient()}, url(${BACKGROUND_IMAGE})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.5s ease",
        /* GLASSMORPHISM */
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 8px 30px rgba(16, 24, 40, 0.06)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        // soft highlight
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015) 40%, transparent 80%)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: -20,
          left: -20,
          width: 180,
          height: 180,
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.03), transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <CardContent
        sx={{
          p: 3,
          height: "100%", // ensures internal content stretches
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Chip
            label={getTypeLabel()}
            size="small"
            sx={{
              backgroundColor: "rgba(255,255,255,0.16)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.75rem",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
          <IconButton
            onClick={handleRefresh}
            size="small"
            sx={{
              color: "white",
              backgroundColor: "rgba(255,255,255,0.12)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.22)",
                transform: "rotate(180deg)",
              },
              transition: "all 0.35s ease",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Fade in={fadeIn} timeout={500}>
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", py: 2 }}>
            {currentContent && (
              <>
                <Typography
                  sx={{
                    fontSize: "2.6rem",
                    mb: 2,
                    lineHeight: 1,
                    filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.15))",
                  }}
                >
                  {currentContent.icon}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1.08rem",
                    fontWeight: 800,
                    color: "rgba(255,255,255,0.97)",
                    lineHeight: 1.6,
                    mb: currentContent.author ? 2 : 0,
                    px: { xs: 1, sm: 3 },
                    maxWidth: "820px",
                    margin: "0 auto",
                    textShadow: "0 3px 8px rgba(0,0,0,0.22)",
                  }}
                >
                  {currentContent.text}
                </Typography>

                {currentContent.author && (
                  <Typography
                    sx={{
                      fontSize: "1.0rem",
                      fontWeight: 700,
                      fontStyle: "italic",
                      color: "rgba(255,255,255,0.9)",
                      textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      mt: 1,
                    }}
                  >
                    — {currentContent.author}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Fade>

        {/* Type Selector */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            flexWrap: "wrap",
            mt: 1,
          }}
        >
          <IconButton
            onClick={() => handleTypeChange("quote")}
            size="medium"
            sx={{
              color: "white",
              backgroundColor: contentType === "quote" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.32)" },
              border: "1px solid rgba(255,255,255,0.04)",
            }}
            title="Quotes"
          >
            <FormatQuoteIcon fontSize="small" />
          </IconButton>

          <IconButton
            onClick={() => handleTypeChange("prompt")}
            size="small"
            sx={{
              color: "white",
              backgroundColor: contentType === "prompt" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.32)" },
              border: "1px solid rgba(255,255,255,0.04)",
            }}
            title="Journal Idea"
          >
            <HistoryEduIcon fontSize="small" />
          </IconButton>

          <IconButton
            onClick={() => handleTypeChange("fact")}
            size="small"
            sx={{
              color: "white",
              backgroundColor: contentType === "fact" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.32)" },
              border: "1px solid rgba(255,255,255,0.04)",
            }}
            title="Fun Facts"
          >
            <LightbulbIcon fontSize="small" />
          </IconButton>

          <IconButton
            onClick={() => handleTypeChange("tip")}
            size="small"
            sx={{
              color: "white",
              backgroundColor: contentType === "tip" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.32)" },
              border: "1px solid rgba(255,255,255,0.04)",
            }}
            title="Tips"
          >
            <TipsAndUpdatesIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InspirationCard;
