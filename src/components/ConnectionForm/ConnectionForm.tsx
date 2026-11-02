import PowerIcon from "@mui/icons-material/Power"
import PowerOffIcon from "@mui/icons-material/PowerOff"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { useAtom } from "jotai"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { cogniteSDK } from "../../CogniteSDK"
import { ConnectionErrorInfo } from "./ConnectionErrorInfo"
import { useExternalStateDefaults, useUpdateExternalState } from "./externalState"
import { ClusterURLFieldHelpModal, TokenFieldHelpModal, URLFieldHelpModal } from "./fieldHelpModals"
import { ClusterURLField, DEFAULT_CLUSTER_URL, TokenField, URLField } from "./fields"
import type { ConnectionFormState } from "./types"

export const ConnectionForm: React.FC = () => {
  const [connectionState] = useAtom(cogniteSDK.state.connectionState)
  const [connectionError] = useAtom(cogniteSDK.state.connectionError)

  const isCogniteSDKBusy = connectionState === 'connected' || connectionState === 'connecting'

  const externalStateDefaults = useExternalStateDefaults()

  const formMethods = useForm<ConnectionFormState>({
    defaultValues: {
      clusterUrl: DEFAULT_CLUSTER_URL,
      url: "",
      token: "",
      ...externalStateDefaults,
    },
    disabled: isCogniteSDKBusy,
  })

  const formState = formMethods.watch()
  useUpdateExternalState(formState)

  const onSubmit = ({ clusterUrl, url, token }: ConnectionFormState) => {
    if (connectionState === 'disconnected') {
      const urlObj = new URL(url)
      const appId = urlObj.hostname
      const project = urlObj.pathname.split('/')[1]
      void cogniteSDK.connect({ appId, project, oidcToken: token, baseUrl: clusterUrl })
      return
    } else if (connectionState === 'connected') {
      cogniteSDK.disconnect()
      return
    }
  }

  return (
    <FormProvider {...formMethods}>
      <Box
        component="form"
        onSubmit={formMethods.handleSubmit(onSubmit)}
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

        <Button
          type="submit"
          variant={connectionState === "disconnected" ? "contained" : "outlined"}
          endIcon={connectionState === "connected" ? <PowerOffIcon /> : <PowerIcon />}
          title="Connect"
          loading={connectionState === "connecting"}
        >
          {connectionState === "connected" && "Disconnect"}
          {connectionState === "disconnected" && "Connect"}
        </Button>

        {connectionError && <ConnectionErrorInfo error={connectionError} />}
      </Box>
    </FormProvider >
  )
}
