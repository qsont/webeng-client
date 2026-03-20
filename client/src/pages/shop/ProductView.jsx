import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useShopStore from "@/store/shopStore";
import useCartStore from "@/store/cartStore";
import { useToast } from "@/components/ui/use-toast";

function ProductView() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { selectedProduct, isLoading, error, fetchProductById } = useShopStore();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    }
  }, [fetchProductById, productId]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading product...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!selectedProduct) {
    return <p className="text-sm text-muted-foreground">Product not found.</p>;
  }

  const onAddToCart = async () => {
    const result = await addToCart({ productId: selectedProduct?._id, quantity });
    toast({ title: result?.message ?? "Cart updated." });
  };

  return (
    <section className="rounded-xl border bg-card p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg border">
          <img
            src={selectedProduct?.image}
            alt={selectedProduct?.title}
            className="h-full max-h-[440px] w-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-violet-700">{selectedProduct?.category}</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{selectedProduct?.title}</h1>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{selectedProduct?.description}</p>

          <div className="rounded-md border bg-muted/30 p-4">
            <p className="text-lg font-semibold">${Number(selectedProduct?.price).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Stock: {selectedProduct?.stock}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value || 1))}
              className="h-9 w-20 rounded-md border border-input px-2 text-sm"
            />
            <Button
              type="button"
              className="bg-brand-violet-600 text-white hover:bg-brand-violet-700"
              onClick={onAddToCart}>
              Add to cart
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/shop")}>
              Back to shop
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/cart")}>
              View cart
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductView;