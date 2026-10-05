import { CogniteError, HttpError, type PropertyValueGroupV3, type RawPropertyValueV3, type ViewReference } from "@cognite/sdk"
import DeleteIcon from "@mui/icons-material/Delete"
import { Box, Button, Divider, IconButton, Paper, TextField, Typography, } from "@mui/material"
import { useState } from "react"
import { Controller, FormProvider, useFieldArray, useForm, useFormContext, useWatch } from "react-hook-form"
import { cogniteSDK, type CogniteSDKError } from "../../CogniteSDK"
import { PreBox, serializeError } from "../PreBox"
import { textFieldRegister } from "../utils"
import { SpaceAutocomplete } from "./SpaceAutocomplete"
import { ViewExternalIdAutocomplete } from "./ViewExternalIdAutocomplete"
import { ViewVersionAutocomplete } from "./ViewVersionAutocomplete"

const FormDivider: React.FC<{ label: string }> = ({ label }) => {
  return <Divider><Typography variant="subtitle1">{label}</Typography></Divider>
}

type CreateOrUpdateNodeFormState = {
  space: string,
  externalId: string,
  source: {
    reference: ViewReference,
    properties: { name: string, value: RawPropertyValueV3 }[],
  },
}

const NodeIdField: React.FC<{}> = ({ }) => {
  "use no memo";
  const { register, formState } = useFormContext<CreateOrUpdateNodeFormState>()

  return <Box sx={{ display: "flex", gap: 1 }}>
    <TextField
      fullWidth
      label="space"
      size="small"
      autoComplete="off"
      disabled={formState.isSubmitting}
      error={!!formState.errors.space}
      {...textFieldRegister(
        register("space", {
          required: "Space is required",
        }),
      )}
    />
    <TextField
      fullWidth
      label="ExternalId"
      size="small"
      autoComplete="off"
      disabled={formState.isSubmitting}
      error={!!formState.errors.externalId}
      {...textFieldRegister(
        register("externalId", {
          required: "ExternalId is required",
        }),
      )}
    />
  </Box>
}

const ViewIdField: React.FC<{}> = ({ }) => {
  "use no memo";
  const { control, formState } = useFormContext<CreateOrUpdateNodeFormState>()
  const sourceSpace = useWatch({ control, name: "source.reference.space" })
  const sourceExternalId = useWatch({ control, name: "source.reference.externalId" })

  return <Box sx={{ display: "flex", gap: 1 }}>
    <Controller
      name="source.reference.space"
      control={control}
      rules={{ required: "Space is required" }}
      render={({ field, fieldState: { error } }) => (
        <SpaceAutocomplete
          fullWidth
          disabled={formState.isSubmitting}
          value={field.value ?? ""}
          inputValue={field.value ?? ""}
          onChange={(_event, option) => {
            field.onChange(option == null ? "" : typeof option === "string" ? option : option.space)
          }}
          onInputChange={(_event, inputValue, reason) => {
            if (reason === "input" || reason === "clear") {
              field.onChange(inputValue)
            }
          }}
          getOptionLabel={(option) => (typeof option === "string" ? option : option.space)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="space"
              size="small"
              autoComplete="off"
              error={!!error}
              inputRef={field.ref}
            />
          )}
        />
      )}
    />
    <Controller
      name="source.reference.externalId"
      control={control}
      rules={{ required: "ExternalId is required" }}
      render={({ field, fieldState: { error } }) => (
        <ViewExternalIdAutocomplete
          fullWidth
          space={sourceSpace || undefined}
          disabled={formState.isSubmitting || !sourceSpace}
          value={field.value ?? ""}
          inputValue={field.value ?? ""}
          onChange={(_event, option) => {
            field.onChange(option == null ? "" : typeof option === "string" ? option : option.externalId)
          }}
          onInputChange={(_event, inputValue, reason) => {
            if (reason === "input" || reason === "clear") {
              field.onChange(inputValue)
            }
          }}
          getOptionLabel={(option) => (typeof option === "string" ? option : option.externalId)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="ExternalId"
              size="small"
              autoComplete="off"
              error={!!error}
              inputRef={field.ref}
            />
          )}
        />
      )}
    />
    <Controller
      name="source.reference.version"
      control={control}
      rules={{ required: "Version is required" }}
      render={({ field, fieldState: { error } }) => (
        <ViewVersionAutocomplete
          fullWidth
          space={sourceSpace || undefined}
          viewExternalId={sourceExternalId || undefined}
          disabled={formState.isSubmitting || !sourceSpace || !sourceExternalId}
          value={field.value ?? ""}
          inputValue={field.value ?? ""}
          onChange={(_event, option) => {
            field.onChange(option == null ? "" : typeof option === "string" ? option : option.version)
          }}
          onInputChange={(_event, inputValue, reason) => {
            if (reason === "input" || reason === "clear") {
              field.onChange(inputValue)
            }
          }}
          getOptionLabel={(option) => (typeof option === "string" ? option : option.version)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Version"
              size="small"
              autoComplete="off"
              error={!!error}
              inputRef={field.ref}
            />
          )}
        />
      )}
    />
  </Box>
}

const SourceProperties: React.FC<{}> = ({ }) => {
  "use no memo";
  const formMethods = useFormContext<CreateOrUpdateNodeFormState>();
  const { fields, append, remove } = useFieldArray<CreateOrUpdateNodeFormState, "source.properties">({
    control: formMethods.control,
    name: "source.properties",
  });

  return <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
    {fields.map((fields, idx) => (
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          label="Name"
          size="small"
          autoComplete="off"
          disabled={formMethods.formState.isSubmitting}
          error={!!formMethods.formState.errors.source?.properties?.[idx]?.name}
          {...textFieldRegister(
            formMethods.register(`source.properties.${idx}.name`, {
              required: "Name is required",
            }),
          )}
        />
        <TextField
          fullWidth
          label="Value"
          size="small"
          autoComplete="off"
          disabled={formMethods.formState.isSubmitting}
          error={!!formMethods.formState.errors.source?.properties?.[idx]?.value}
          {...textFieldRegister(
            formMethods.register(`source.properties.${idx}.value`, {
              required: "Value is required",
            }),
          )}
        />
        <IconButton
          type="button"
          aria-label="Remove property"
          onClick={() => remove(idx)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    ))}
    <Button
      variant="outlined"
      type="button"
      aria-label="Add property"
      onClick={() => append({ name: '', value: '' })}
      sx={{ alignSelf: "stretch" }}
    >
      Add property
    </Button>
  </Box>
}

const isNetworkError = (error: unknown): error is TypeError =>
  error instanceof TypeError

const isServerError = (error: unknown): error is CogniteError | HttpError =>
  error instanceof CogniteError || error instanceof HttpError

export const CreateOrUpdateNodeForm: React.FC<{}> = ({ }) => {
  const formMethods = useForm<CreateOrUpdateNodeFormState>({})
  const [upsertError, setUpsertError] = useState<CogniteSDKError>()

  const onSubmit = async (data: CreateOrUpdateNodeFormState) => {
    const propertiesMap: PropertyValueGroupV3 = {}

    data.source.properties.forEach((property) => {
      propertiesMap[property.name] = property.value
    })

    setUpsertError(undefined)

    try {
      await cogniteSDK.api.instances.upsert({
        items: [{
          instanceType: "node",
          space: data.space,
          externalId: data.externalId,
          sources: [{
            source: {
              type: "view",
              space: data.source.reference.space,
              externalId: data.source.reference.externalId,
              version: data.source.reference.version,
            },
            properties: propertiesMap,
          }],
        }]
      })
    } catch (error) {
      console.error('error upserting node', error)

      if (isNetworkError(error) || isServerError(error)) {
        setUpsertError(error)
        return
      }

      throw error
    }
  }

  return (
    <FormProvider {...formMethods}>
      <Paper
        component="form"
        variant="outlined"
        aria-labelledby="create-or-update-node-title"
        onSubmit={formMethods.handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          gap: 1,
          width: '500px',
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography id="create-or-update-node-title" variant="h6" component="h2">
          Create or updated Node
        </Typography>
        <FormDivider label="Node ID" />
        <NodeIdField />

        <FormDivider label="Source" />
        <ViewIdField />

        <FormDivider label="Source properties" />
        <SourceProperties />

        {upsertError && <PreBox text={serializeError(upsertError)} />}

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" type="submit"
            loading={formMethods.formState.isSubmitting}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </FormProvider>
  )
}