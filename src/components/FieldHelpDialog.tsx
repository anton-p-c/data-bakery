import CloseIcon from "@mui/icons-material/Close"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import React, { type ReactNode } from "react"

type FieldHelpDialogProps = {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
}

export const FieldHelpDialog: React.FC<FieldHelpDialogProps> = ({
  title,
  open,
  onClose,
  children,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ m: 0, pr: 6 }}>{title}</DialogTitle>
      <IconButton
        aria-label="Close"
        onClick={onClose}
        sx={{ position: "absolute", right: 12, top: 12 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
