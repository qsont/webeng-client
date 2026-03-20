import { Toaster as Sonner } from "sonner";

function Toaster(props) {
  return <Sonner position="top-right" richColors closeButton {...props} />;
}

export { Toaster };
