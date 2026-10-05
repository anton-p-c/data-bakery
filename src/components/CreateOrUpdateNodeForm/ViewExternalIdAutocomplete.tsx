import type { ViewDefinition } from "@cognite/sdk"
import Autocomplete, { type AutocompleteProps } from "@mui/material/Autocomplete"
import CircularProgress from "@mui/material/CircularProgress"
import TextField from "@mui/material/TextField"
import { useRef, useState, type SyntheticEvent } from "react"
import { cogniteSDK } from "../../CogniteSDK"

type ViewExternalIdAutocompleteProps = Omit<
  AutocompleteProps<ViewDefinition, false, boolean, true>,
  "freeSolo" | "loading" | "noOptionsText" | "options" | "renderInput"
> & {
  space?: string
  renderInput?: AutocompleteProps<ViewDefinition, false, false, true>["renderInput"]
  noOptionsText?: AutocompleteProps<ViewDefinition, false, false, true>["noOptionsText"]
}

const viewExternalId = (option: ViewDefinition | string) =>
  typeof option === "string" ? option : option.externalId

const getViewOptionLabel = (option: ViewDefinition | string) =>
  typeof option === "string" ? option : option.name ?? option.externalId

const isViewOptionEqualToValue = (
  option: ViewDefinition | string,
  value: ViewDefinition | string,
) => viewExternalId(option) === viewExternalId(value)

const viewOptionKey = (option: ViewDefinition | string) =>
  typeof option === "string" ? option : `${option.externalId}@${option.version}`

export const ViewExternalIdAutocomplete = ({
  space,
  onOpen,
  renderInput,
  noOptionsText,
  getOptionLabel = getViewOptionLabel,
  isOptionEqualToValue = isViewOptionEqualToValue,
  getOptionKey = viewOptionKey,
  ...props
}: ViewExternalIdAutocompleteProps) => {
  const [result, setResult] = useState<{ space: string, views: ViewDefinition[] }>()
  const [loadingSpace, setLoadingSpace] = useState<string>()
  const requestId = useRef(0)

  const options = result && result.space === space ? result.views : []
  const loading = Boolean(space) && loadingSpace === space

  const handleOpen = (event: SyntheticEvent) => {
    onOpen?.(event)

    if (!space || result?.space === space || loadingSpace === space) return

    const requested = space
    const id = ++requestId.current
    setLoadingSpace(requested)

    try {
      cogniteSDK.api.views
        .list({ space: requested, includeGlobal: true })
        .autoPagingToArray({ limit: Infinity })
        .then((views) => {
          if (requestId.current !== id) return
          setResult({ space: requested, views })
        })
        .catch((error) => {
          console.error('error fetching views', error)
        })
        .finally(() => {
          if (requestId.current === id) setLoadingSpace(undefined)
        })
    } catch (error) {
      console.error('error fetching views', error)
      setLoadingSpace(undefined)
    }
  }

  return (
    <Autocomplete<ViewDefinition, false, boolean, true>
      forcePopupIcon
      disableClearable
      getOptionKey={getOptionKey}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      renderInput={
        renderInput ??
        ((params) => (
          <TextField
            {...params}
            label="External ID"
            slotProps={{
              input: {
                ...params.slotProps.input,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.slotProps.input.endAdornment}
                  </>
                ),
              },
            }}
          />
        ))
      }
      {...props}
      freeSolo
      loading={loading}
      noOptionsText={space ? noOptionsText : "Select a space first"}
      onOpen={handleOpen}
      options={options}
    />
  )
}
