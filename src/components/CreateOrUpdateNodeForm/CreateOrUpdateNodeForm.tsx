import { CogniteError, HttpError, type PropertyValueGroupV3, type RawPropertyValueV3, type ViewReference } from "@cognite/sdk"
import { Box, Button, Divider, Paper, TextField, Typography } from "@mui/material"
import { useAtom } from "jotai"
import React, { useEffect, useState } from "react"
import { Controller, FormProvider, useFieldArray, useForm, useFormContext, useWatch, type UseFormReturn } from "react-hook-form"
import { cogniteSDK, type CogniteSDKError } from "../../CogniteSDK"
import { getFormIsNotAccessible } from "../formUtils"
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
    properties: {
      name: string,
      value: RawPropertyValueV3,
      nullable: boolean,
    }[],
  },
}

const NodeIdField: React.FC<{}> = ({ }) => {
  "use no memo";
  const formMethods = useFormContext<CreateOrUpdateNodeFormState>()
  const formIsNotAccessible = getFormIsNotAccessible(formMethods.formState)

  return <Box sx={{ display: "flex", gap: 1 }}>
    <TextField
      fullWidth
      label="space"
      size="small"
      autoComplete="off"
      disabled={formIsNotAccessible}
      error={!!formMethods.formState.errors.space}
      {...textFieldRegister(
        formMethods.register("space", {
          required: "Space is required",
        }),
      )}
    />
    <TextField
      fullWidth
      label="ExternalId"
      size="small"
      autoComplete="off"
      disabled={formIsNotAccessible}
      error={!!formMethods.formState.errors.externalId}
      {...textFieldRegister(
        formMethods.register("externalId", {
          required: "ExternalId is required",
        }),
      )}
    />
  </Box>
}

function useResetViewReferenceFields(formMethods: UseFormReturn<CreateOrUpdateNodeFormState, any, CreateOrUpdateNodeFormState>) {
  useEffect(() => {
    return formMethods.subscribe({
      name: [
        "source.reference.space",
        "source.reference.externalId",
      ],
      formState: { values: true },
      exact: true,
      callback: (changed) => {
        if (changed.name === "source.reference.space") {
          formMethods.resetField("source.reference.externalId")
        } else if (changed.name === "source.reference.externalId") {
          formMethods.resetField("source.reference.version")
        }
      },
    })
  }, [formMethods])
}

const ViewReferenceFields: React.FC<{}> = ({ }) => {
  "use no memo";
  const formMethods = useFormContext<CreateOrUpdateNodeFormState>()
  const sourceSpace = useWatch({ control: formMethods.control, name: "source.reference.space" })
  const sourceExternalId = useWatch({ control: formMethods.control, name: "source.reference.externalId" })

  const formIsNotAccessible = getFormIsNotAccessible(formMethods.formState)

  useResetViewReferenceFields(formMethods)

  return <Box sx={{ display: "flex", gap: 1 }}>
    <Controller
      name="source.reference.space"
      control={formMethods.control}
      rules={{ required: "Space is required" }}
      render={({ field, fieldState: { error } }) => (
        <SpaceAutocomplete
          fullWidth
          disabled={field.disabled || formMethods.formState.isSubmitting}
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
      control={formMethods.control}
      rules={{ required: "ExternalId is required" }}
      render={({ field, fieldState: { error } }) => (
        <ViewExternalIdAutocomplete
          fullWidth
          space={sourceSpace || undefined}
          disabled={field.disabled || formIsNotAccessible || !sourceSpace}
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
      control={formMethods.control}
      rules={{ required: "Version is required" }}
      render={({ field, fieldState: { error } }) => (
        <ViewVersionAutocomplete
          fullWidth
          space={sourceSpace || undefined}
          viewExternalId={sourceExternalId || undefined}
          disabled={field.disabled || formIsNotAccessible || !sourceSpace || !sourceExternalId}
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

const SourcePropertyFields: React.FC<{}> = ({ }) => {
  "use no memo";
  const formMethods = useFormContext<CreateOrUpdateNodeFormState>();
  const { fields } = useFieldArray<CreateOrUpdateNodeFormState, "source.properties">({
    control: formMethods.control,
    name: "source.properties",
  });

  const viewReference = useWatch({ control: formMethods.control, name: "source.reference" })

  const formIsNotAccessible = getFormIsNotAccessible(formMethods.formState)

  return <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
    {(
      viewReference === undefined ||
      viewReference.space === undefined ||
      viewReference.externalId === undefined ||
      viewReference.version === undefined
    ) && fields.length === 0 && <Typography sx={{ alignSelf: "center" }} variant="body2" color="textSecondary">Select a source to populate properties</Typography>}

    {fields.map((field, idx) => (
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          label="Name"
          size="small"
          autoComplete="off"
          disabled
          error={!!formMethods.formState.errors.source?.properties?.[idx]?.name}
          {...textFieldRegister(
            formMethods.register(`source.properties.${idx}.name`, {
              required: "Name is required",
              disabled: true
            }),
          )}
        />
        <TextField
          fullWidth
          label="Value"
          size="small"
          autoComplete="off"
          disabled={field.disabled || formIsNotAccessible}
          error={!!formMethods.formState.errors.source?.properties?.[idx]?.value}
          {...textFieldRegister(
            formMethods.register(`source.properties.${idx}.value`, {
              required: "Value is required",
            }),
          )}
        />
      </Box>
    ))}
  </Box>
}

const isNetworkError = (error: unknown): error is TypeError =>
  error instanceof TypeError

const isServerError = (error: unknown): error is CogniteError | HttpError =>
  error instanceof CogniteError || error instanceof HttpError

function usePopulateViewProperties(formMethods: UseFormReturn<CreateOrUpdateNodeFormState, any, CreateOrUpdateNodeFormState>) {
  "use no memo";

  React.useEffect(() => {
    return formMethods.subscribe({
      name: [
        "source.reference.version",
      ],
      formState: { values: true },
      exact: true,
      callback: (changed) => {
        const viewReference = changed.values.source.reference
        if (viewReference &&
          viewReference.space !== undefined &&
          viewReference.externalId !== undefined &&
          viewReference.version !== undefined &&
          formMethods.getValues("source.properties").length === 0
        ) {
          void cogniteSDK.api.views.retrieve([{
            space: viewReference.space,
            externalId: viewReference.externalId,
            version: viewReference.version,
          }]).then((views) => {
            const view = views.items[0]

            formMethods.setValue(
              "source.properties",
              Object.entries(view.properties).flatMap(([name, property]) => {
                if (!("containerPropertyIdentifier" in property)) {
                  return []
                }

                return [{
                  name,
                  value: property.defaultValue ?? "",
                  nullable: property.nullable ?? true,
                }]
              }),
            )
          }).catch((error) => {
            formMethods.setError("root", { message: error.message })
          })
        } else {
          formMethods.setValue(
            "source.properties",
            [],
          )
        }
      },
    })
  }, [formMethods])
}

export const CreateOrUpdateNodeForm: React.FC<{}> = ({ }) => {
  "use no memo";

  const [connectionState] = useAtom(cogniteSDK.state.connectionState)

  const formMethods = useForm<CreateOrUpdateNodeFormState>({
    disabled: connectionState !== "connected",
  })
  const [upsertError, setUpsertError] = useState<CogniteSDKError>()

  const formIsNotAccessible = getFormIsNotAccessible(formMethods.formState)

  usePopulateViewProperties(formMethods)

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
        <ViewReferenceFields />

        <FormDivider label="Source properties" />
        <SourcePropertyFields />

        {upsertError && <PreBox text={serializeError(upsertError)} />}

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            type="submit"
            loading={formMethods.formState.isSubmitting}
            disabled={formIsNotAccessible}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </FormProvider>
  )
}