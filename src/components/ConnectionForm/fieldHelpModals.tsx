import HelpIcon from '@mui/icons-material/Help'
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import React from "react"
import clusterUrlScreenshot from "../../assets/cluster-URL-screenshot.png"
import tokenScreenshot from "../../assets/token-screenshot.png"
import urlScreenshot from "../../assets/url-screenshot.png"
import { FieldHelpDialog } from "../FieldHelpDialog"

const ClusterURLFieldHelpSteps = [
  'Open Chrome developer tools',
  'Open the Network tab',
  'In the search bar, type "/inspect"',
  'look for the address of the request'
]
export const ClusterURLFieldHelpModal: React.FC<{}> = ({ }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <IconButton onClick={() => setOpen(true)} sx={{ alignSelf: "baseline" }}>
        <HelpIcon />
      </IconButton>

      <FieldHelpDialog
        title="How to get the Cluster URL?"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Typography component="ul" sx={{ pl: 4 }}>
          {ClusterURLFieldHelpSteps.map((step, index) => (
            <Typography key={index} component="li" variant="body1" sx={{ mb: 0.5 }}>
              {step}
            </Typography>
          ))}
        </Typography>
        <Box
          component="img"
          src={clusterUrlScreenshot}
          alt="Chrome DevTools Network tab with the inspect request URL circled"
          sx={{ display: "block", width: "100%", height: "auto", mt: 2 }}
        />
      </FieldHelpDialog>
    </>
  )
}

const URLFieldHelpSteps = [
  'Open the Network tab with opened fusion app',
  "Copy the full URL",
]
export const URLFieldHelpModal: React.FC<{}> = ({ }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <IconButton onClick={() => setOpen(true)} sx={{ alignSelf: "baseline" }}>
        <HelpIcon />
      </IconButton>

      <FieldHelpDialog
        title="How to get the URL?"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Typography component="ul" sx={{ pl: 4 }}>
          {URLFieldHelpSteps.map((step, index) => (
            <Typography key={index} component="li" variant="body1" sx={{ mb: 0.5 }}>
              {step}
            </Typography>
          ))}
        </Typography>
        <Box
          component="img"
          src={urlScreenshot}
          alt="Fusion app tab with the URL circled"
          sx={{ display: "block", width: "100%", height: "auto", mt: 2 }}
        />
      </FieldHelpDialog>
    </>
  )
}

const TokenFieldHelpSteps = [
  'Open Chrome developer tools',
  'Open the Network tab',
  'In the search bar, type "/inspect"',
  'Copy the Bearer token from the request headers (skip the "Barer" word)'
]
export const TokenFieldHelpModal: React.FC<{}> = ({ }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <IconButton onClick={() => setOpen(true)} sx={{ alignSelf: "baseline" }}>
        <HelpIcon />
      </IconButton>

      <FieldHelpDialog
        title="How to get the Token?"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Typography component="ul" sx={{ pl: 4 }}>
          {TokenFieldHelpSteps.map((step, index) => (
            <Typography key={index} component="li" variant="body1" sx={{ mb: 0.5 }}>
              {step}
            </Typography>
          ))}
        </Typography>
        <Box
          component="img"
          src={tokenScreenshot}
          alt="Chrome DevTools Network tab with the Bearer token circled"
          sx={{ display: "block", width: "100%", height: "auto", mt: 2 }}
        />
      </FieldHelpDialog>
    </>
  )
}
