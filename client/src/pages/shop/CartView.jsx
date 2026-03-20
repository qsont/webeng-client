import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/cartStore";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingBag, Trash2 } from "lucide-react";

function CartView() {
  const { toast } = useToast();
  const { cartItems, isLoading, error, fetchCart, updateCartItem, removeCartItem, clearCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = Number(item?.product?.price ?? 0);
    const quantity = Number(item?.quantity ?? 0);
    return sum + price * quantity;
  }, 0);

  const onQuantityChange = async (productId, quantity) => {
    const result = await updateCartItem({ productId, quantity });
    toast({ title: result?.message ?? "Cart updated." });
  };

  const onRemove = async (productId) => {
    const result = await removeCartItem(productId);
    toast({ title: result?.message ?? "Item removed." });
  };

  const onClear = async () => {
    const result = await clearCart();
    toast({ title: result?.message ?? "Cart cleared." });
  };

  return (
    <section className="space-y-4">
      <header className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-r from-brand-accent-200 to-brand-accent-100 p-5 shadow-float dark:from-brand-accent-900/55 dark:to-brand-accent-800/35 sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-flavor-mango/30 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-brand-accent-900 dark:text-brand-accent-100">Your Cart</h1>
            <p className="text-sm text-brand-accent-800/80 dark:text-brand-accent-200/80">Review your selected items before checkout.</p>
          </div>
          <Button type="button" variant="outline" className="rounded-full bg-background/75" onClick={onClear} disabled={!cartItems.length || isLoading}>
            <Trash2 className="size-4" />
            Clear cart
          </Button>
        </div>
      </header>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="space-y-3">
        {cartItems?.map((item) => (
          <article key={item?.product?._id ?? item?._id} className="rounded-3xl border border-border bg-card p-4 shadow-soft">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[88px_1fr_auto] sm:items-center">
              <img
                src={item?.product?.image}
                alt={item?.product?.title}
                className="h-20 w-20 rounded-2xl object-cover"
              />

              <div>
                <p className="font-bold text-foreground">{item?.product?.title}</p>
                <p className="text-xs text-muted-foreground">₱{Number(item?.product?.price ?? 0).toFixed(2)} each</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item?.quantity}
                  onChange={(event) =>
                    onQuantityChange(item?.product?._id, Number(event.target.value || 1))
                  }
                  className="h-9 w-16 rounded-2xl border border-input bg-background px-2 text-sm"
                />
                <Button type="button" variant="destructive" size="sm" onClick={() => onRemove(item?.product?._id)}>
                  Remove
                </Button>
              </div>
            </div>
          </article>
        ))}

        {!isLoading && !cartItems?.length ? (
          <p className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-soft">
            <span className="mb-2 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-semibold">No items yet</span>
            <br />
            Your cart is empty.
          </p>
        ) : null}
      </div>

      <footer className="rounded-3xl border border-border bg-card p-5 shadow-float">
        <p className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
          <ShoppingBag className="size-4 text-brand-accent-600" />
          Estimated total
        </p>
        <p className="text-2xl font-black text-brand-accent-700 dark:text-brand-accent-300">₱{cartTotal.toFixed(2)}</p>
      </footer>
    </section>
  );
}

export default CartView;