import type { UseFormRegisterReturn } from "react-hook-form";

// TODO: move the file and all the forms into a "forms/" directory
export const textFieldRegister = ({ ref, ...rest }: UseFormRegisterReturn) => ({
  ...rest,
  inputRef: ref,
})