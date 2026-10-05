import type { ViewDefinition } from "@cognite/sdk"
import Autocomplete, { type AutocompleteProps } from "@mui/material/Autocomplete"
import CircularProgress from "@mui/material/CircularProgress"
import TextField from "@mui/material/TextField"
import { useRef, useState, type SyntheticEvent } from "react"
import { cogniteSDK } from "../../CogniteSDK"

type ViewVersionAutocompleteProps = Omit<
  AutocompleteProps<ViewDefinition, false, boolean, true>,
  "freeSolo" | "loading" | "noOptionsText" | "options" | "renderInput"
> & {
  space?: string
  viewExternalId?: string
  renderInput?: AutocompleteProps<ViewDefinition, false, boolean, true>["renderInput"]
  noOptionsText?: AutocompleteProps<ViewDefinition, false, boolean, true>["noOptionsText"]
}

const viewVersion = (option: ViewDefinition | string) =>
  typeof option === "string" ? option : option.version

const getViewVersionLabel = (option: ViewDefinition | string) => viewVersion(option)

const isViewVersionEqualToValue = (
  option: ViewDefinition | string,
  value: ViewDefinition | string,
) => viewVersion(option) === viewVersion(value)

export const ViewVersionAutocomplete = ({
  space,
  viewExternalId,
  onOpen,
  renderInput,
  noOptionsText,
  getOptionLabel = getViewVersionLabel,
  isOptionEqualToValue = isViewVersionEqualToValue,
  getOptionKey = viewVersion,
  ...props
}: ViewVersionAutocompleteProps) => {
  const [result, setResult] = useState<{ space: string, views: ViewDefinition[] }>()
  const [loadingSpace, setLoadingSpace] = useState<string>()
  const requestId = useRef(0)

  const options = result && result.space === space
    ? result.views.filter((view) => view.externalId === viewExternalId)
    : []
  const loading = Boolean(space && viewExternalId) && loadingSpace === space

  const handleOpen = (event: SyntheticEvent) => {
    onOpen?.(event)

    if (!space || !viewExternalId || result?.space === space || loadingSpace === space) return

    const requested = space
    const id = ++requestId.current
    setLoadingSpace(requested)

    try {
      cogniteSDK.api.views
        .list({ space: requested, includeGlobal: true, allVersions: true })
        .autoPagingToArray({ limit: Infinity })
        .then((views) => {
          if (requestId.current !== id) return
          setResult({ space: requested, views })
        })
        .catch((error) => {
          console.error('error fetching view versions', error)
        })
        .finally(() => {
          if (requestId.current === id) setLoadingSpace(undefined)
        })
    } catch (error) {
      console.error('error fetching view versions', error)
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
            label="Version"
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
      noOptionsText={
        space
          ? viewExternalId
            ? noOptionsText
            : "Select an external ID first"
          : "Select a space first"
      }
      onOpen={handleOpen}
      options={options}
    />
  )
}
