import PowerIcon from "@mui/icons-material/Power"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import { useAtom } from "jotai"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { cogniteSDK } from "../../CogniteSDK"
import { useExternalStateDefaults, useUpdateExternalState } from "./externalState"
import { ClusterURLFieldHelpModal, TokenFieldHelpModal, URLFieldHelpModal } from "./fieldHelpModals"
import { ClusterURLField, DEFAULT_CLUSTER_URL, TokenField, URLField } from "./fields"
import type { ConnectionFormState } from "./types"

export const ConnectionForm: React.FC = () => {
  const [connectionState] = useAtom(cogniteSDK.state.connectionState)
  const [connectionError] = useAtom(cogniteSDK.state.connectionError)

  const externalStateDefaults = useExternalStateDefaults()

  const methods = useForm<ConnectionFormState>({
    defaultValues: {
      clusterUrl: DEFAULT_CLUSTER_URL,
      url: "",
      token: "",
      ...externalStateDefaults,
    },
  })

  const formState = methods.watch()
  useUpdateExternalState(formState)

  const onSubmit = ({ clusterUrl, url, token }: ConnectionFormState) => {
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
          color={connectionState === "connected" ? "success" : "default"}
        >
          <PowerIcon />
        </IconButton>


        {isError && <Alert severity="error">{connectionError.message}</Alert>}
      </Box>
    </FormProvider >
  )
}
