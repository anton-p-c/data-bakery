import PowerIcon from "@mui/icons-material/Power"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import { useAtom } from "jotai"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { cogniteSDK, type ConnectionState } from "../../CogniteSDK"
import { ClusterURLFieldHelpModal, TokenFieldHelpModal, URLFieldHelpModal } from "./fieldHelpModals"
import {
  ClusterURLField,
  DEFAULT_CLUSTER_URL,
  TokenField,
  URLField,
  type ConnectionFormValues,
} from "./fields"
import Alert from "@mui/material/Alert"

function getButtonColor(connectionState: ConnectionState, connectionError: Error | undefined) {
  if (connectionState === 'connected') {
    return 'success'
  }
  if (connectionState === 'disconnected' && connectionError !== undefined) {
    return 'error'
  }
  return 'default'
}

export const ConnectionForm: React.FC = () => {
  const [connectionState] = useAtom(cogniteSDK.state.connectionState)
  const [connectionError] = useAtom(cogniteSDK.state.connectionError)

  const methods = useForm<ConnectionFormValues>({
    defaultValues: {
      clusterUrl: DEFAULT_CLUSTER_URL,
      url: "",
      token: "",
    },
  })

  const onSubmit = ({ clusterUrl, url, token }: ConnectionFormValues) => {
    const urlObj = new URL(url)
    const appId = urlObj.hostname
    const project = urlObj.pathname.split('/')[1]
    void cogniteSDK.connect({ appId, project, oidcToken: token, baseUrl: clusterUrl })
  }

  const isError = connectionError !== undefined && connectionError.message !== undefined

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <URLField />
          <URLFieldHelpModal />
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TokenField />
          <TokenFieldHelpModal />
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <ClusterURLField />
          <ClusterURLFieldHelpModal />
        </Box>

        <IconButton
          type="submit"
          sx={{ alignSelf: "center" }}
          title={connectionState === "connected" ? "Disconnect" : "Connect"}
          color={getButtonColor(connectionState, connectionError)}
        >
          <PowerIcon />
        </IconButton>


        {isError && <Alert severity="error">{connectionError.message}</Alert>}
      </Box>
    </FormProvider >
  )
}
