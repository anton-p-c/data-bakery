import ClearIcon from "@mui/icons-material/Clear"
import PowerIcon from "@mui/icons-material/Power"
import Autocomplete from "@mui/material/Autocomplete"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import { useAtom } from "jotai"
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
  useWatch,
  type UseFormRegisterReturn,
} from "react-hook-form"
import { cogniteSDK } from "../CogniteSDK"

const textFieldRegister = ({ ref, ...rest }: UseFormRegisterReturn) => ({
  ...rest,
  inputRef: ref,
})

const CLUSTER_URLS = [
  "https://api.cognitedata.com",
  "https://aws-dub-dev.cognitedata.com",
  "https://az-arn-dev-002.cognitedata.com",
  "https://gc-bru-dev-003.cognitedata.com",
]

const DEFAULT_CLUSTER_URL = CLUSTER_URLS[0]

type ConnectFormValues = {
  clusterUrl: string
  url: string
  token: string
}

const URLInput: React.FC = () => {
  const { register, setValue } = useFormContext<ConnectFormValues>()
  const { errors } = useFormState<ConnectFormValues>({ name: "url" })
  const url = useWatch<ConnectFormValues>({ name: "url" })

  return (
    <TextField
      label="URL"
      size="small"
      error={!!errors.url}
      helperText={errors.url?.message}
      {...textFieldRegister(
        register("url", {
          required: "URL is required",
          validate: (value) => {
            try {
              new URL(value)
              return true
            } catch {
              return "Enter a valid URL"
            }
          },
        }),
      )}
      slotProps={{
        input: {
          endAdornment: url ? (
            <InputAdornment position="end">
              <IconButton
                type="button"
                aria-label="Clear"
                edge="end"
                size="small"
                onClick={() =>
                  setValue("url", "", { shouldDirty: true, shouldValidate: true })
                }
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  )
}

const TokenInput: React.FC = () => {
  const { register, setValue } = useFormContext<ConnectFormValues>()
  const { errors } = useFormState<ConnectFormValues>({ name: "token" })
  const token = useWatch<ConnectFormValues>({ name: "token" })

  return (
    <TextField
      label="Token"
      size="small"
      error={!!errors.token}
      helperText={errors.token?.message}
      {...textFieldRegister(
        register("token", {
          required: "Token is required",
        }),
      )}
      slotProps={{
        input: {
          endAdornment: token ? (
            <InputAdornment position="end">
              <IconButton
                type="button"
                aria-label="Clear"
                edge="end"
                size="small"
                onClick={() =>
                  setValue("token", "", { shouldDirty: true, shouldValidate: true })
                }
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  )
}

const ClusterURLInput: React.FC = () => {
  const { control } = useFormContext<ConnectFormValues>()

  return (
    <Controller
      name="clusterUrl"
      control={control}
      rules={{
        required: "Cluster URL is required",
        validate: (value) => {
          try {
            new URL(value)
            return true
          } catch {
            return "Enter a valid URL"
          }
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          freeSolo
          forcePopupIcon
          options={CLUSTER_URLS}
          value={field.value}
          onChange={(_event, option) => {
            field.onChange(option ?? "")
          }}
          inputValue={field.value}
          onInputChange={(_event, inputValue) => {
            field.onChange(inputValue)
          }}
          getOptionLabel={(option) => option}
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cluster URL"
              size="small"
              error={!!error}
              helperText={error?.message}
              inputRef={field.ref}
            />
          )}
        />
      )}
    />
  )
}

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
          <ClusterURLInput />
          <URLInput />
          <TokenInput />
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
    </FormProvider>
  )
}
