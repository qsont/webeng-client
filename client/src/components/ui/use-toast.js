import { toast as sonnerToast } from "sonner";

function toSonnerPayload(input) {
  if (typeof input === "string") {
    return { message: input, options: {} };
  }

  if (input && typeof input === "object") {
    const { title, description, ...options } = input;
    return {
      message: title || "",
      options: {
        description,
        ...options,
      },
    };
  }

  return { message: "", options: {} };
}

function useToast() {
  return {
    toast: (input) => {
      const { message, options } = toSonnerPayload(input);
      return sonnerToast(message, options);
    },
  };
}

export { useToast };
