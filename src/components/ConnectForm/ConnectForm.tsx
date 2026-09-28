import PowerIcon from "@mui/icons-material/Power"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import { useAtom } from "jotai"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { cogniteSDK } from "../../CogniteSDK"
import { ClusterURLFieldHelpModal, TokenFieldHelpModal, URLFieldHelpModal } from "./fieldHelpModals"
import {
  ClusterURLField,
  DEFAULT_CLUSTER_URL,
  TokenField,
  URLField,
  type ConnectFormValues,
} from "./fields"

export const ConnectForm: React.FC = () => {
  const [connectionState] = useAtom(cogniteSDK.state.connectionState)
  const methods = useForm<ConnectFormValues>({
    defaultValues: {
      clusterUrl: DEFAULT_CLUSTER_URL,
      url: "",
      token: "",
    },
  })

  const onSubmit = ({ clusterUrl, url, token }: ConnectFormValues) => {
    const urlObj = new URL(url)
    const appId = urlObj.hostname
    const project = urlObj.pathname.split('/')[1]
    void cogniteSDK.connect({ appId, project, oidcToken: token, baseUrl: clusterUrl })
  }

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <Box
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

        </Box>
      </Box>
    </FormProvider >
  )
}
