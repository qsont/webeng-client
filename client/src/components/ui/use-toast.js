import { toast as sonnerToast } from "sonner";

function useToast() {
  return { toast: sonnerToast };
}

export { useToast };
