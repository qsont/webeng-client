import { FormProvider } from "react-hook-form";

function Form({ children, ...props }) {
  return <FormProvider {...props}>{children}</FormProvider>;
}

export { Form };
