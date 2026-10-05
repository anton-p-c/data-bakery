import CheckIcon from '@mui/icons-material/Check'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import React from "react"

// Error's `message`/`stack` are non-enumerable and `name` lives on the prototype,
// so JSON.stringify(error) on its own yields "{}".
export const serializeError = (error: unknown) =>
  error instanceof Error
    ? JSON.stringify(
      { ...error, name: error.name, message: error.message, stack: error.stack },
      null,
      2
    )
    : JSON.stringify(error, null, 2)

export const PreBox: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  const onCopy = () => {
    void navigator.clipboard.writeText(text).then(() => setCopied(true))
  }

  return <Box sx={{ position: 'relative' }}>
    <Box
      component="pre"
      sx={{
        mt: 2,
        p: 1.5,
        pr: 5, // keep text clear of the copy button
        bgcolor: 'rgba(0, 0, 0, 0.04)', // subtle background tint
        borderRadius: 1,
        fontSize: '0.8rem',
        overflowX: 'auto', // horizontal scrollbar for long lines
        fontFamily: 'monospace'
      }}
    >
      {text}
    </Box>

    <IconButton
      color="inherit"
      size="small"
      onClick={onCopy}
      title={copied ? "Copied" : "Copy"}
      sx={{ position: 'absolute', top: 4, right: 4 }}
    >
      {copied ? <CheckIcon fontSize="inherit" /> : <ContentCopyIcon fontSize="inherit" />}
    </IconButton>
  </Box>
}
