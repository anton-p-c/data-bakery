import React from "react";
import { type ConnectionFormState } from "./types";

export const LOCAL_STORAGE_KEY = "connectionFormState"

export function getExternalState(): ConnectionFormState | undefined {
  const rawString = localStorage.getItem(LOCAL_STORAGE_KEY)

  if (rawString === null) {
    return undefined
  }

  try {
    return JSON.parse(rawString)
  } catch {
    return undefined
  }
}

export function useExternalStateDefaults(): ConnectionFormState | undefined {
  return React.useMemo(() => getExternalState(), [])
}

export function useUpdateExternalState(formState: ConnectionFormState) {
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formState));
    }, 400); 

    return () => clearTimeout(delayDebounceFn)
  }, [formState])
}