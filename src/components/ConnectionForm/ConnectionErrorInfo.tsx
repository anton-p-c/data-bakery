import { CogniteError, HttpError } from "@cognite/sdk"
import CheckIcon from '@mui/icons-material/Check'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Alert, { type AlertProps } from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Box from "@mui/material/Box"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import React from "react"
import type { CogniteSDKError } from "../../CogniteSDK"

const AlertWithDetails: React.FC<AlertProps & { title: string, message: React.ReactNode, details?: React.JSX.Element }> = ({ title, message, details, ...props }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Alert
      severity="error"
      {...props}
      action={
        (details && <IconButton
          color="inherit"
          size="small"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>)
      }
      sx={{ width: '100%' }}
    >
      <AlertTitle>{title}</AlertTitle>
      {message}

      {details && <Collapse in={expanded} timeout="auto" unmountOnExit>
        {details}
      </Collapse>}
    </Alert>
  );
}

// Error's `message`/`stack` are non-enumerable and `name` lives on the prototype,
// so JSON.stringify(error) on its own yields "{}".
const serializeError = (error: unknown) =>
  error instanceof Error
    ? JSON.stringify(
      { ...error, name: error.name, message: error.message, stack: error.stack },
      null,
      2
    )
    : JSON.stringify(error, null, 2)

const PreBox: React.FC<{ text: string }> = ({ text }) => {
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

const HttpErrorInfo: React.FC<{ error: HttpError }> = ({ error }) => {
  const message = error.status === 401 ? 'Unauthorized. Check your Token or URL.' : error.message

  return <AlertWithDetails
    title="Connection error"
    severity="error"
    message={message}
    details={<PreBox text={serializeError(error)} />}
  />
}

const TypeErrorInfo: React.FC<{ error: TypeError }> = ({ error }) => {
  const message = error.message === 'Failed to fetch' ? <>
    <Typography>If you see CORS error in chrome dev tools, try to change the Cluster URL or add register the application in your cognite organization:</Typography>
    <Link href="https://docs.cognite.com/cdf/admin/manage_organization/register_apps#register-an-application" target="_blank">Documentation</Link>
  </> : error.message

  return <AlertWithDetails
    title="Connection error"
    severity="error"
    message={message}
    details={<PreBox text={serializeError(error)} />}
  />
}

const CongiteErrorInfo: React.FC<{ error: CogniteError }> = ({ error }) => {
  return <AlertWithDetails
    title="Connection error"
    severity="error"
    message={error.message}
    details={<PreBox text={serializeError(error)} />}
  />
}

export const ConnectionErrorInfo: React.FC<{ error: CogniteSDKError }> = ({ error }) => {
  if (error instanceof CogniteError) {
    return <CongiteErrorInfo error={error} />
  } else if (error instanceof HttpError) {
    return <HttpErrorInfo error={error} />
  } else if (error instanceof TypeError) {
    return <TypeErrorInfo error={error} />
  } else {
    const unexpectedError: never = error
    throw new Error('Unexpected Error type: ' + unexpectedError)
  }
}
