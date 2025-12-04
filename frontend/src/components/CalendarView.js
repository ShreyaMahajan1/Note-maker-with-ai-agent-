// CalendarViewFull.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogContent,
  Link as MuiLink,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GroupsIcon from "@mui/icons-material/Groups";
import LinkIcon from "@mui/icons-material/Link";
import DescriptionIcon from "@mui/icons-material/Description";
import API_BASE_URL from "../config";

const defaultEventColor = "#e60023"; // fallback color

const CalendarView = ({ googleAuthorized }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]); // expects Google-style events
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState("month"); // 'month' | 'week' | 'day'
  const [dayForDayView, setDayForDayView] = useState(null);

  // --- Fetch events for the visible range ---
  const fetchCalendarEvents = async (fromIso, toIso) => {
    if (!googleAuthorized) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/google/calendar/events?timeMin=${encodeURIComponent(
          fromIso
        )}&timeMax=${encodeURIComponent(toIso)}`
      );
      if (response.ok) {
        const data = await response.json();
        // store as array
        setEvents(data.events || []);
      } else {
        console.error("Calendar fetch failed", response.status);
      }
    } catch (err) {
      console.error("Error fetching calendar events:", err);
    } finally {
      setLoading(false);
    }
  };

  // derive visible range to fetch depending on viewMode
  useEffect(() => {
    if (!googleAuthorized) return;

    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const weekStart = getWeekStart(currentDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59);

    let from = startOfMonth.toISOString();
    let to = endOfMonth.toISOString();
    if (viewMode === "week") {
      from = weekStart.toISOString();
      to = weekEnd.toISOString();
    } else if (viewMode === "day") {
      const d = dayForDayView || currentDate;
      const s = new Date(d);
      s.setHours(0, 0, 0, 0);
      const e = new Date(d);
      e.setHours(23, 59, 59, 999);
      from = s.toISOString();
      to = e.toISOString();
    }
    fetchCalendarEvents(from, to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, viewMode, googleAuthorized, dayForDayView]);

  // --- helpers ---
  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  function getDaysInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  }

  function isSameDate(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function formatTime(dateTime) {
    if (!dateTime) return "All day";
    const date = new Date(dateTime);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // get events for a particular date object
  function getEventsForDate(dateObj) {
    // Ensure events is an array
    if (!Array.isArray(events)) return [];
    
    return events.filter((ev) => {
      const evStart = ev.start?.dateTime || ev.start?.date;
      if (!evStart) return false;
      const d = new Date(evStart);
      return isSameDate(d, dateObj);
    });
  }

  // Month view helpers
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  // Week view helpers (horizontal week grid)
  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sun) - 6 (Sat)
    const start = new Date(d);
    start.setDate(d.getDate() - day);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  function getWeekDates(date) {
    const start = getWeekStart(date);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  // Clicking day opens Day View
  const openDayView = (dateObj) => {
    setSelectedEvent(null); // Close any open event popup
    setDayForDayView(dateObj);
    setViewMode("day");
  };

  // Enhanced link extraction - finds meeting links AND notes links
  function extractLinks(ev) {
    if (!ev) return { meetingLink: null, notesLink: null, allLinks: [] };
    
    const links = {
      meetingLink: null,
      notesLink: null,
      allLinks: []
    };

    // Check hangoutLink first
    if (ev.hangoutLink) {
      links.meetingLink = ev.hangoutLink;
      links.allLinks.push({ url: ev.hangoutLink, type: 'meeting' });
    }

    // Check conferenceData
    if (ev.conferenceData && ev.conferenceData.entryPoints) {
      const entry = ev.conferenceData.entryPoints.find((e) => e.uri);
      if (entry && !links.meetingLink) {
        links.meetingLink = entry.uri;
        links.allLinks.push({ url: entry.uri, type: 'meeting' });
      }
    }

    // Extract all URLs from description and location
    const text = `${ev.description || ""} ${ev.location || ""}`;
    const urlRegex = /(https?:\/\/[^\s)\]]+)/gi;
    const matches = text.match(urlRegex);

    if (matches) {
      matches.forEach(url => {
        // Check if it's a notes link (from our app)
        if (url.includes('📝 Notes:') || text.includes(`📝 Notes: ${url}`)) {
          links.notesLink = url;
          links.allLinks.push({ url, type: 'notes', label: 'Notes' });
        }
        // Check if it's a meeting link
        else if (url.match(/zoom|meet\.google|teams\.microsoft|webex|whereby/i)) {
          if (!links.meetingLink) {
            links.meetingLink = url;
          }
          links.allLinks.push({ url, type: 'meeting', label: 'Join Meeting' });
        }
        // Other links
        else if (!links.allLinks.some(l => l.url === url)) {
          links.allLinks.push({ url, type: 'other', label: 'Link' });
        }
      });
    }

    // Special check for notes link pattern: "📝 Notes: <url>"
    const notesMatch = text.match(/📝 Notes:\s*(https?:\/\/[^\s)\]]+)/i);
    if (notesMatch && notesMatch[1]) {
      links.notesLink = notesMatch[1];
      if (!links.allLinks.some(l => l.url === notesMatch[1])) {
        links.allLinks.push({ url: notesMatch[1], type: 'notes', label: 'View Notes' });
      }
    }

    return links;
  }

  // Render description with clickable links
  function renderDescriptionWithLinks(description) {
    if (!description) return null;

    const urlRegex = /(https?:\/\/[^\s)\]]+)/gi;
    const parts = description.split(urlRegex);

    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1, whiteSpace: "pre-wrap", fontSize: { xs: '0.8rem', md: '0.875rem' } }}
      >
        {parts.map((part, idx) => {
          if (part.match(urlRegex)) {
            return (
              <MuiLink
                key={idx}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#1a73e8",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                  wordBreak: "break-all",
                }}
              >
                {part}
              </MuiLink>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </Typography>
    );
  }

  // color resolution
  function eventColor(ev) {
    // Google event.colorId is an index to calendar colors; if your backend expands it to a direct color property use that.
    if (ev.color) return ev.color;
    if (ev.colorId) {
      // try to map a few common colorId -> hex (fallback)
      const mapping = {
        "1": "#a4b0be",
        "2": "#f6b93b",
        "3": "#f0932b",
        "4": "#e55039",
        "5": "#eb2f06",
        "6": "#c0392b",
        "7": "#6a89cc",
        "8": "#38ada9",
        "9": "#079992",
        "10": "#4a69bd",
        "11": "#60a3bc",
      };
      if (mapping[ev.colorId]) return mapping[ev.colorId];
    }
    return defaultEventColor;
  }

  // Navigation
  const handlePrev = () => {
    if (viewMode === "month") {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      );
    } else if (viewMode === "week") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
    } else {
      // day
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1));
      setDayForDayView((d) => {
        if (!d) return null;
        const nd = new Date(d);
        nd.setDate(nd.getDate() - 1);
        return nd;
      });
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      );
    } else if (viewMode === "week") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7));
    } else {
      // day
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1));
      setDayForDayView((d) => {
        if (!d) return null;
        const nd = new Date(d);
        nd.setDate(nd.getDate() + 1);
        return nd;
      });
    }
  };

  // --- Renderers ---
  const renderEventBadge = (ev, small = false) => {
    const color = eventColor(ev);
    const title = ev.summary || "(no title)";
    return (
      <Box
        onClick={(e) => {
          e.stopPropagation();
          setSelectedEvent(ev);
        }}
        sx={{
          backgroundColor: color,
          color: "white",
          px: small ? 0.5 : 0.75,
          py: small ? 0.2 : 0.4,
          borderRadius: 1,
          fontSize: small ? "0.65rem" : "0.75rem",
          fontWeight: 600,
          cursor: "pointer",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          "&:hover": {
            opacity: 0.9,
          },
        }}
        title={title}
      >
        {small ? title : title}
      </Box>
    );
  };

  // Month View grid
  const renderMonthView = () => {
    const emptyCells = Array.from({ length: startingDayOfWeek });
    return (
      <>
        {/* Week Days Header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: { xs: 0.3, md: 1 },
            mb: { xs: 0.5, md: 1 },
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <Box key={d} sx={{ textAlign: "center", py: { xs: 0.5, md: 1 } }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#94a3b8", fontSize: { xs: '0.6rem', md: '0.75rem' } }}>
                {isMobile ? d.substring(0, 1) : d}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: { xs: 0.3, md: 1 } }}>
          {/* Empty leading cells */}
          {emptyCells.map((_, i) => (
            <Box key={`e-${i}`} sx={{ minHeight: { xs: 50, md: 100 }, p: { xs: 0.3, md: 1 } }} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = getEventsForDate(dateObj);
            return (
              <Box
                key={`d-${day}`}
                sx={{
                  minHeight: { xs: 50, md: 100 },
                  p: { xs: 0.3, md: 1 },
                  background: isSameDate(dateObj, today) ? "rgba(139, 92, 246, 0.2)" : "rgba(15, 23, 42, 0.5)",
                  borderRadius: { xs: 0.5, md: 1.5 },
                  border: isSameDate(dateObj, today) ? "2px solid #8b5cf6" : "1px solid rgba(139, 92, 246, 0.2)",
                  position: "relative",
                  cursor: "pointer",
                  "&:hover": { background: "rgba(139, 92, 246, 0.15)" },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
                onClick={() => openDayView(dateObj)}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isSameDate(dateObj, today) ? 700 : 600,
                    color: isSameDate(dateObj, today) ? "#a78bfa" : "#f1f5f9",
                    mb: { xs: 0.2, md: 0.5 },
                    fontSize: { xs: '0.65rem', md: '0.875rem' },
                    textAlign: 'center',
                  }}
                >
                  {day}
                </Typography>

                {!isMobile && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, width: '100%' }}>
                    {dayEvents.slice(0, 2).map((ev, i) => (
                      <Box key={i}>{renderEventBadge(ev, true)}</Box>
                    ))}
                    {dayEvents.length > 2 && (
                      <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: '0.65rem' }}>
                        +{dayEvents.length - 2} more
                      </Typography>
                    )}
                  </Box>
                )}

                {isMobile && dayEvents.length > 0 && (
                  <Box sx={{ 
                    width: 4, 
                    height: 4, 
                    borderRadius: '50%', 
                    backgroundColor: eventColor(dayEvents[0]), 
                    mt: 0.3
                  }} />
                )}
              </Box>
            );
          })}
        </Box>
      </>
    );
  };

  // Week View grid - horizontal: 7 equal columns
  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate);
    return (
      <>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: { xs: 0.5, md: 1 }, mb: 1 }}>
          {weekDates.map((d) => (
            <Box key={d.toDateString()} sx={{ textAlign: "center", py: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#94a3b8", fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                {isMobile ? d.toLocaleDateString(undefined, { weekday: 'short' }).substring(0, 1) : d.toLocaleDateString(undefined, { weekday: "short" })}
              </Typography>
              <Typography variant="caption" sx={{ display: "block", fontWeight: 700, fontSize: { xs: '0.7rem', md: '0.75rem' }, color: "#f1f5f9" }}>
                {d.getDate()}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: { xs: 0.5, md: 1 } }}>
          {weekDates.map((d) => {
            const dayEvents = getEventsForDate(d);
            return (
              <Box
                key={d.toDateString()}
                sx={{
                  minHeight: { xs: 100, md: 160 },
                  p: { xs: 0.5, md: 1 },
                  background: isSameDate(d, today) ? "rgba(139, 92, 246, 0.2)" : "rgba(15, 23, 42, 0.5)",
                  borderRadius: 1.5,
                  border: isSameDate(d, today) ? "2px solid #8b5cf6" : "1px solid rgba(139, 92, 246, 0.2)",
                  cursor: "pointer",
                  "&:hover": { background: "rgba(139, 92, 246, 0.15)" },
                }}
                onClick={() => openDayView(d)}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {dayEvents.length === 0 && (
                    <Typography variant="caption" sx={{ color: "#64748b", fontSize: { xs: '0.6rem', md: '0.75rem' } }}>
                      {!isMobile && 'No events'}
                    </Typography>
                  )}
                  {dayEvents.map((ev, i) => (
                    <Box key={i} sx={{ display: "flex", flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, gap: { xs: 0.25, md: 1 } }}>
                      <Box sx={{ flex: 1 }}>{renderEventBadge(ev, true)}</Box>
                      {!isMobile && (
                        <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.65rem" }}>
                          {ev.start?.dateTime ? formatTime(ev.start.dateTime) : "All day"}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </>
    );
  };

  // Day View - simple list
  const renderDayView = () => {
    const d = dayForDayView || currentDate;
    const dateObj = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayEvents = getEventsForDate(dateObj).sort((a, b) => {
      const ta = a.start?.dateTime ? new Date(a.start.dateTime) : new Date(a.start?.date || 0);
      const tb = b.start?.dateTime ? new Date(b.start.dateTime) : new Date(b.start?.date || 0);
      return ta - tb;
    });

    return (
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '0.9rem', md: '1rem' }, color: "#f1f5f9" }}>
          {dateObj.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </Typography>

        {dayEvents.length === 0 && (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <EventIcon sx={{ fontSize: 36, color: "#64748b" }} />
            <Typography variant="body2" sx={{ color: "#94a3b8", mt: 1 }}>
              No events for this day
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {dayEvents.map((ev, i) => {
            const { meetingLink, notesLink } = extractLinks(ev);
            return (
              <Paper key={i} sx={{ 
                p: { xs: 1, md: 1.25 }, 
                display: "flex", 
                flexDirection: { xs: 'column', md: 'row' }, 
                alignItems: { xs: 'flex-start', md: 'center' }, 
                gap: 1,
                background: "rgba(15, 23, 42, 0.5)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
              }}>
                <Box sx={{ width: { xs: '100%', md: 86 }, textAlign: { xs: 'left', md: 'center' } }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, fontSize: { xs: '0.7rem', md: '0.75rem' }, color: "#a78bfa" }}>
                    {ev.start?.dateTime ? formatTime(ev.start.dateTime) : "All day"}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: { xs: '0.85rem', md: '0.875rem' }, color: "#f1f5f9" }}>
                    {ev.summary}
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", color: "#94a3b8", fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                    {ev.location || (ev.attendees ? `${ev.attendees.length} attendees` : "")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: { xs: 'row', md: 'column' }, gap: 1, alignItems: { xs: 'center', md: 'flex-end' }, width: { xs: '100%', md: 'auto' } }}>
                  {notesLink && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={!isMobile && <DescriptionIcon />}
                      onClick={() => window.open(notesLink, "_blank")}
                      fullWidth={isMobile}
                      sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}
                    >
                      Notes
                    </Button>
                  )}
                  
                  {meetingLink && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={!isMobile && <LinkIcon />}
                      onClick={() => window.open(meetingLink, "_blank")}
                      fullWidth={isMobile}
                      sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}
                    >
                      Join
                    </Button>
                  )}

                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={!isMobile && <OpenInNewIcon />}
                    onClick={() => {
                      setSelectedEvent(ev);
                      window.open(ev.htmlLink, "_blank");
                    }}
                    fullWidth={isMobile}
                    sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}
                  >
                    Open
                  </Button>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Box>
    );
  };

  // Event Details Component
  const EventDetailsContent = () => {
    const { meetingLink, notesLink, allLinks } = extractLinks(selectedEvent);
    
    return (
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
          <EventIcon sx={{ fontSize: 20, color: eventColor(selectedEvent) }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, flex: 1, fontSize: { xs: '0.95rem', md: '1rem' } }}>
            {selectedEvent.summary || "(no title)"}
          </Typography>
        </Box>

        {selectedEvent.start?.dateTime && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 16, color: "#5f6368" }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
              {formatTime(selectedEvent.start.dateTime)} — {formatTime(selectedEvent.end?.dateTime)}
            </Typography>
          </Box>
        )}

        {selectedEvent.location && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 16, color: "#5f6368" }} />
            <Typography variant="caption" color="text.secondary" sx={{ wordBreak: "break-word", fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
              {selectedEvent.location}
            </Typography>
          </Box>
        )}

        {selectedEvent.attendees && Array.isArray(selectedEvent.attendees) && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <GroupsIcon sx={{ fontSize: 16, color: "#5f6368" }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
              {selectedEvent.attendees.length} attendee{selectedEvent.attendees.length > 1 ? "s" : ""}
            </Typography>
          </Box>
        )}

        {selectedEvent.description && renderDescriptionWithLinks(selectedEvent.description)}

        <Divider sx={{ my: 2 }} />

        {/* All link buttons */}
        {notesLink && (
          <Button
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
            onClick={() => window.open(notesLink, "_blank")}
            startIcon={<DescriptionIcon />}
          >
            View Notes
          </Button>
        )}

        {meetingLink && (
          <Button
            variant="contained"
            fullWidth
            sx={{ mb: 1 }}
            onClick={() => window.open(meetingLink, "_blank")}
            startIcon={<LinkIcon />}
          >
            Join Meeting
          </Button>
        )}

        <Button
          variant="outlined"
          fullWidth
          startIcon={<OpenInNewIcon />}
          onClick={() => window.open(selectedEvent.htmlLink, "_blank")}
          sx={{ mb: 1 }}
        >
          Open in Google Calendar
        </Button>

        <Button variant="text" fullWidth onClick={() => setSelectedEvent(null)}>
          Close
        </Button>
      </CardContent>
    );
  };

  // main return
  return (
    <Paper sx={{ 
      p: { xs: 1.5, md: 3 }, 
      borderRadius: 4, 
      border: "1px solid rgba(139, 92, 246, 0.2)", 
      position: "relative", 
      overflow: 'hidden',
      background: "rgba(30, 41, 59, 0.8)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
    }}>
      {!googleAuthorized && (
        <Paper sx={{ 
          p: 4, 
          textAlign: "center", 
          borderRadius: 4,
          background: "rgba(15, 23, 42, 0.5)",
          border: "1px solid rgba(139, 92, 246, 0.2)",
        }}>
          <EventIcon sx={{ fontSize: 60, color: "#64748b", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#cbd5e1" }}>
            Connect your Google Calendar to view events
          </Typography>
        </Paper>
      )}

      {googleAuthorized && (
        <>
          {/* Header */}
          <Box sx={{ display: "flex", flexDirection: { xs: 'column', md: 'row' }, justifyContent: "space-between", alignItems: { xs: 'flex-start', md: 'center' }, mb: 3, gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#f1f5f9", display: "inline-block", mr: 2, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                📅 {monthName}
              </Typography>

              <Box component="span" sx={{ ml: { xs: 0, md: 1 }, display: 'block', mt: { xs: 1, md: 0 } }}>
                <Chip
                  label="Month"
                  variant={viewMode === "month" ? "filled" : "outlined"}
                  onClick={() => setViewMode("month")}
                  size="small"
                  sx={{ mr: 0.5, fontSize: { xs: '0.7rem', md: '0.8125rem' } }}
                />
                <Chip
                  label="Week"
                  variant={viewMode === "week" ? "filled" : "outlined"}
                  onClick={() => setViewMode("week")}
                  size="small"
                  sx={{ mr: 0.5, fontSize: { xs: '0.7rem', md: '0.8125rem' } }}
                />
                <Chip
                  label="Day"
                  variant={viewMode === "day" ? "filled" : "outlined"}
                  onClick={() => {
                    setDayForDayView(new Date());
                    setViewMode("day");
                  }}
                  size="small"
                  sx={{ fontSize: { xs: '0.7rem', md: '0.8125rem' } }}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton size="small" onClick={handlePrev}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton size="small" onClick={handleNext}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Loading */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Views */}
          {!loading && (
            <Box>
              {viewMode === "month" && renderMonthView()}
              {viewMode === "week" && renderWeekView()}
              {viewMode === "day" && renderDayView()}
            </Box>
          )}
        </>
      )}

      {/* Event Details Panel - Desktop: Fixed Card, Mobile: Dialog */}
      {selectedEvent && !isMobile && (
        <Card
          sx={{
            position: "fixed",
            right: 20,
            top: 90,
            zIndex: 9999,
            width: 360,
            maxHeight: "70vh",
            overflowY: "auto",
            boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
            pointerEvents: "auto",
          }}
        >
          <EventDetailsContent />
        </Card>
      )}

      {/* Mobile Dialog for Event Details */}
      {selectedEvent && isMobile && (
        <Dialog
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              margin: 2,
              maxHeight: 'calc(100vh - 64px)',
              position: 'fixed',
              bottom: 0,
              top: 'auto',
            }
          }}
          sx={{
            '& .MuiDialog-container': {
              alignItems: 'flex-end',
            }
          }}
        >
          <DialogContent sx={{ p: 0, pb: 2 }}>
            <EventDetailsContent />
          </DialogContent>
        </Dialog>
      )}
    </Paper>
  );
};

export default CalendarView;