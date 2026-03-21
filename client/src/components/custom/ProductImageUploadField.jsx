import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, Upload } from "lucide-react";

function ProductImageUploadField({ value, onChange, disabled = false }) {
  const inputRef = useRef(null);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const onFileSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">Product Image</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelected}
        className="hidden"
        disabled={disabled}
      />

      {value ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <img src={value} alt="Selected product" className="h-52 w-full object-cover" />
          <div className="flex flex-wrap gap-2 border-t border-border p-3">
            <Button type="button" variant="outline" size="sm" onClick={openPicker} disabled={disabled}>
              <Upload className="size-4" />
              Change image
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={clearImage} disabled={disabled}>
              <Trash2 className="size-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-muted-foreground transition-colors hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ImagePlus className="size-5" />
          <span className="text-sm font-medium">Upload product image</span>
        </button>
      )}
    </div>
  );
}

export default ProductImageUploadField;
