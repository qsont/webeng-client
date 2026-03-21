import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useShopStore from "@/store/shopStore";
import useCartStore from "@/store/cartStore";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, CircleDollarSign, Package, ShoppingCart, Sparkles } from "lucide-react";

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

  const stockLimit = Math.max(0, Number(selectedProduct?.stock ?? 0));

  const clampQuantity = (value) => {
    const parsedValue = Number(value);
    const fallbackValue = stockLimit > 0 ? 1 : 0;

    if (!Number.isFinite(parsedValue)) {
      return fallbackValue;
    }

    if (stockLimit <= 0) {
      return 0;
    }

    return Math.min(Math.max(1, parsedValue), stockLimit);
  };

  const onAddToCart = async () => {
    if (stockLimit <= 0) {
      toast({ title: "This product is currently out of stock." });
      return;
    }

    const clampedQuantity = clampQuantity(quantity);
    setQuantity(clampedQuantity);

    const result = await addToCart({ productId: selectedProduct?._id, quantity: clampedQuantity });
    toast({ title: result?.message ?? "Cart updated." });
  };

  const flavorAccent = (() => {
    const category = String(selectedProduct?.category ?? "").toLowerCase();
    if (category.includes("mango")) {
      return {
        chip: "bg-flavor-mango text-flavor-mango-foreground",
        panel: "from-flavor-mango/40 to-brand-accent-100 dark:from-flavor-mango/30 dark:to-brand-violet-900/35",
      };
    }
    if (category.includes("milo")) {
      return {
        chip: "bg-flavor-milo text-flavor-milo-foreground",
        panel: "from-flavor-milo/40 to-brand-violet-200 dark:from-flavor-milo/35 dark:to-brand-violet-900/45",
      };
    }
    if (category.includes("cookies")) {
      return {
        chip: "bg-flavor-cookies text-flavor-cookies-foreground",
        panel: "from-flavor-cookies/45 to-brand-violet-100 dark:from-flavor-cookies/30 dark:to-brand-violet-900/35",
      };
    }
    return {
      chip: "bg-brand-violet-600 text-white",
      panel: "from-brand-violet-200 to-brand-accent-100 dark:from-brand-violet-700/35 dark:to-brand-violet-900/35",
    };
  })();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-4 shadow-float backdrop-blur-sm sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute -top-20 -right-20 size-48 rounded-full bg-brand-violet-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 size-56 rounded-full bg-flavor-mango/20 blur-3xl" />

      <div className="relative mb-5 flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" className="rounded-2xl" onClick={() => navigate("/shop")}>
          <ArrowLeft className="size-4" />
          Back to shop
        </Button>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-violet-100 px-3 py-1 text-xs font-semibold text-brand-violet-800 dark:bg-brand-violet-800/60 dark:text-brand-violet-100">
          <Sparkles className="size-3.5" />
          Fresh pick
        </span>
      </div>

      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className={`relative overflow-hidden rounded-3xl border border-border bg-linear-to-br p-3 shadow-soft ${flavorAccent.panel}`}>
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
            <img
              src={selectedProduct?.image}
              alt={selectedProduct?.title}
              className="h-full max-h-[460px] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        <div className="space-y-5 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
          <div className="space-y-3">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${flavorAccent.chip}`}>
              {selectedProduct?.category}
            </span>
            <h1 className="text-2xl font-black text-foreground sm:text-3xl lg:text-4xl">{selectedProduct?.title}</h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{selectedProduct?.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <CircleDollarSign className="size-4 text-brand-violet-600" />
                Price
              </p>
              <p className="text-2xl font-black text-brand-violet-700 dark:text-brand-violet-300">
                ₱{Number(selectedProduct?.price).toFixed(2)}
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Package className="size-4 text-brand-violet-600" />
                Stock
              </p>
              <p className="text-2xl font-black text-foreground">{selectedProduct?.stock}</p>
            </article>
          </div>

          <div className="rounded-2xl border border-border bg-muted/40 p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">Quantity</p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="number"
                min={stockLimit > 0 ? "1" : "0"}
                max={String(stockLimit)}
                value={quantity}
                onChange={(event) => setQuantity(clampQuantity(event.target.value || 1))}
                disabled={stockLimit <= 0}
                className="h-10 w-24 rounded-2xl border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand-violet-400"
              />
              <Button
                type="button"
                className="rounded-2xl bg-brand-violet-600 text-white shadow-soft hover:bg-brand-violet-700 dark:bg-brand-violet-500 dark:hover:bg-brand-violet-400"
                onClick={onAddToCart}
                disabled={stockLimit <= 0}
              >
                <ShoppingCart className="size-4" />
                {stockLimit <= 0 ? "Out of stock" : "Add to cart"}
              </Button>
              <Button type="button" variant="outline" className="rounded-2xl" onClick={() => navigate("/cart")}>
                View cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductView;