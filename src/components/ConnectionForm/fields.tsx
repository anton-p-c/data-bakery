import ClearIcon from "@mui/icons-material/Clear"
import Autocomplete from "@mui/material/Autocomplete"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import React from "react"
import {
  Controller,
  useFormContext,
  useFormState,
  useWatch,
  type UseFormRegisterReturn,
} from "react-hook-form"
import type { ConnectionFormState } from "./types"

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

export const DEFAULT_CLUSTER_URL = CLUSTER_URLS[0]

export const URLField: React.FC = () => {
  const { register, setValue } = useFormContext<ConnectionFormState>()
  const { errors } = useFormState<ConnectionFormState>({ name: "url" })
  const url = useWatch<ConnectionFormState>({ name: "url" })

  return (
    <TextField
      fullWidth
      label="URL"
      size="small"
      error={!!errors.url}
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

export const TokenField: React.FC = () => {
  const { register, setValue } = useFormContext<ConnectionFormState>()
  const { errors } = useFormState<ConnectionFormState>({ name: "token" })
  const token = useWatch<ConnectionFormState>({ name: "token" })

  return (
    <TextField
      fullWidth
      label="Token"
      size="small"
      error={!!errors.token}
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

export const ClusterURLField: React.FC = () => {
  const { control } = useFormContext<ConnectionFormState>()

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
              inputRef={field.ref}
            />
          )}
          fullWidth
        />
      )}
    />
  )
}
