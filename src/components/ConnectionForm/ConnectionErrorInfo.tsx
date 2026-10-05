import { CogniteError, HttpError } from "@cognite/sdk"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Alert, { type AlertProps } from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import Link from "@mui/material/Link"
import Typography from "@mui/material/Typography"
import React from "react"
import type { CogniteSDKError } from "../../CogniteSDK"
import { PreBox, serializeError } from "../PreBox"

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
