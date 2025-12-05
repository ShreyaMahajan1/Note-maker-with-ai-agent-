import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VideoFileIcon from "@mui/icons-material/VideoFile";

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
  submitLabel,
  showFileUpload = false,
  onFileUpload,
}) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUploadClick = () => {
    if (selectedFile && onFileUpload) {
      onFileUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "rgba(21, 27, 46, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(45, 212, 191, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#f1f5f9" }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ 
        py: 3,
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={inputLabel}
              placeholder={inputLabel}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              multiline
              rows={3}
              variant="outlined"
              InputLabelProps={{
                shrink: Boolean(inputValue),
                sx: {
                  color: "#94a3b8",
                  fontWeight: 600,
                  "&.Mui-focused": { color: "#2dd4bf" },
                  transformOrigin: "left top",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(15, 23, 42, 0.5)",
                  color: "#f1f5f9",
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(45, 212, 191, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2dd4bf",
                    borderWidth: 1,
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
              }}
            />
          </Box>

          {showFileUpload && (
            <>
              <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
                <Typography sx={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600 }}>
                  OR
                </Typography>
              </Divider>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  p: 2.5,
                  borderRadius: 2,
                  background: "rgba(10, 14, 26, 0.5)",
                  border: "2px dashed rgba(45, 212, 191, 0.3)",
                }}
              >
                <Typography sx={{ color: "#cbd5e1", fontWeight: 600, fontSize: "0.9rem" }}>
                  📹 Upload Video/Audio Recording
                </Typography>
                <Typography sx={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                  Supported: MP4, WebM, MOV, MP3, WAV, M4A (Max 100MB)
                </Typography>

                <input
                  accept="video/*,audio/*"
                  style={{ display: "none" }}
                  id="video-upload-input"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="video-upload-input">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      borderColor: "rgba(45, 212, 191, 0.3)",
                      color: "#cbd5e1",
                      py: 1.5,
                      "&:hover": {
                        borderColor: "#2dd4bf",
                        backgroundColor: "rgba(45, 212, 191, 0.1)",
                      },
                    }}
                  >
                    Choose File
                  </Button>
                </label>

                {selectedFile && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 2,
                      borderRadius: 2,
                      background: "rgba(45, 212, 191, 0.1)",
                      border: "1px solid rgba(45, 212, 191, 0.3)",
                    }}
                  >
                    <VideoFileIcon sx={{ color: "#2dd4bf", fontSize: 28 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: "#f1f5f9", fontWeight: 600, fontSize: "0.9rem" }}>
                        {selectedFile.name}
                      </Typography>
                      <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleFileUploadClick}
                      disabled={loading}
                      sx={{
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)",
                        color: "#0a0e1a",
                        fontWeight: 600,
                        "&:hover": {
                          background: "linear-gradient(135deg, #5eead4 0%, #2dd4bf 100%)",
                        },
                      }}
                    >
                      Process
                    </Button>
                  </Box>
                )}
              </Box>
            </>
          )}

          {loading && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 3,
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
              }}
            >
              <CircularProgress size={24} sx={{ color: "#2dd4bf" }} />
              <Typography sx={{ fontWeight: 500, color: "#f1f5f9" }}>
                Processing with AI...
              </Typography>
            </Box>
          )}

          {result && (
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                background: "rgba(10, 14, 26, 0.5)",
                border: "1px solid rgba(45, 212, 191, 0.3)",
                position: "relative",
                maxHeight: "400px",
                overflowY: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: "linear-gradient(90deg, #2dd4bf, #14b8a6)",
                  borderTopLeftRadius: "inherit",
                  borderTopRightRadius: "inherit",
                },
              }}
            >
              <Typography
                sx={{
                  whiteSpace: "pre-wrap",
                  color: "#f1f5f9",
                  lineHeight: 1.6,
                }}
              >
                {result}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          p: 2.5,
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            minWidth: "100px",
            borderColor: "rgba(255, 255, 255, 0.1)",
            color: "#cbd5e1",
            "&:hover": {
              borderColor: "rgba(45, 212, 191, 0.5)",
              backgroundColor: "rgba(45, 212, 191, 0.1)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={loading || !inputValue}
          sx={{
            borderRadius: 2,
            minWidth: "100px",
            background: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)",
            color: "#0a0e1a",
            fontWeight: 600,
            boxShadow: "0 4px 16px rgba(45, 212, 191, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #5eead4 0%, #2dd4bf 100%)",
              boxShadow: "0 6px 20px rgba(45, 212, 191, 0.4)",
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
