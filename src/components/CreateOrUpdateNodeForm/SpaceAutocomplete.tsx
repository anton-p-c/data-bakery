import type { SpaceDefinition } from "@cognite/sdk"
import Autocomplete, { type AutocompleteProps } from "@mui/material/Autocomplete"
import CircularProgress from "@mui/material/CircularProgress"
import TextField from "@mui/material/TextField"
import { useRef, useState, type SyntheticEvent } from "react"
import { cogniteSDK } from "../../CogniteSDK"

type SpaceAutocompleteProps = Omit<
  AutocompleteProps<SpaceDefinition, false, boolean, true>,
  "freeSolo" | "loading" | "options" | "renderInput"
> & {
  renderInput?: AutocompleteProps<SpaceDefinition, false, boolean, true>["renderInput"]
}

const spaceId = (option: SpaceDefinition | string) =>
  typeof option === "string" ? option : option.space

const getSpaceOptionLabel = (option: SpaceDefinition | string) =>
  typeof option === "string" ? option : option.name ?? option.space

const isSpaceOptionEqualToValue = (
  option: SpaceDefinition | string,
  value: SpaceDefinition | string,
) => spaceId(option) === spaceId(value)

export const SpaceAutocomplete = ({
  onOpen,
  renderInput,
  getOptionLabel = getSpaceOptionLabel,
  isOptionEqualToValue = isSpaceOptionEqualToValue,
  getOptionKey = spaceId,
  ...props
}: SpaceAutocompleteProps) => {
  const [options, setOptions] = useState<SpaceDefinition[]>([])
  const [loading, setLoading] = useState(false)
  const hasRequested = useRef(false)

  const handleOpen = (event: SyntheticEvent) => {
    onOpen?.(event)

    if (hasRequested.current) return

    hasRequested.current = true
    setLoading(true)

    try {
      cogniteSDK.api.spaces
        .list({ includeGlobal: true })
        .autoPagingToArray({ limit: Infinity })
        .then((spaces) => {
          setOptions(spaces)
        })
        .catch(() => {
          hasRequested.current = false
        })
        .finally(() => {
          setLoading(false)
        })
    } catch (error) {
      console.error('error fetching spaces', error)
      hasRequested.current = false
      setLoading(false)
    }
  }

  return (
    <Autocomplete<SpaceDefinition, false, boolean, true>
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
            label="Space"
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
      onOpen={handleOpen}
      options={options}
    />
  )
}
