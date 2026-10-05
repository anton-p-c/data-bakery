import { type ContainerCreateDefinition, type DataModelCreate, type RawPropertyValueV3, type ViewCreateDefinition, type ViewReference } from "@cognite/sdk"
import DeleteIcon from "@mui/icons-material/Delete"
import { Box, Button, Divider, IconButton, Paper, TextField, Typography, } from "@mui/material"
import { FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form"
import { textFieldRegister } from "../utils"

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

const SourceIdField: React.FC<{}> = ({ }) => {
  "use no memo";
  const { register, formState } = useFormContext<CreateOrUpdateNodeFormState>()

  return <Box sx={{ display: "flex", gap: 1 }}>
    <TextField
      fullWidth
      label="space"
      size="small"
      autoComplete="off"
      disabled={formState.isSubmitting}
      error={!!formState.errors.source?.reference?.space}
      {...textFieldRegister(
        register("source.reference.space", {
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
      error={!!formState.errors.source?.reference?.externalId}
      {...textFieldRegister(
        register("source.reference.externalId", {
          required: "ExternalId is required",
        }),
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

export const CreateOrUpdateNodeForm: React.FC<{}> = ({ }) => {
  const methods = useForm<CreateOrUpdateNodeFormState>({ })

  const onSubmit = (data: CreateOrUpdateNodeFormState) => {
    // cogniteSDK.createOrUpdateNode(data)
    console.log('submitting', data)
  }

  return (
    <FormProvider {...methods}>
      <Paper
        component="form"
        variant="outlined"
        aria-labelledby="create-or-update-node-title"
        onSubmit={methods.handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          gap: 1,
          width: '400px',
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
        <SourceIdField />

        <FormDivider label="Source properties" />
        <SourceProperties />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Box>
      </Paper>
    </FormProvider>
  )
}