import { type FieldValues, type UseFormStateReturn } from "react-hook-form"

export function getFormIsNotAccessible(formState: UseFormStateReturn<FieldValues>) {
  return formState.isSubmitting || formState.disabled
}
