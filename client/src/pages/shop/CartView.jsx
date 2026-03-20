import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/cartStore";
import { useToast } from "@/components/ui/use-toast";

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
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-brand-violet-700">Your Cart</h1>
          <p className="text-sm text-muted-foreground">Review your selected items before checkout.</p>
        </div>
        <Button type="button" variant="outline" onClick={onClear} disabled={!cartItems.length || isLoading}>
          Clear cart
        </Button>
      </header>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="space-y-3">
        {cartItems?.map((item) => (
          <article key={item?.product?._id ?? item?._id} className="rounded-lg border bg-card p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[88px_1fr_auto] sm:items-center">
              <img
                src={item?.product?.image}
                alt={item?.product?.title}
                className="h-20 w-20 rounded-md object-cover"
              />

              <div>
                <p className="font-medium">{item?.product?.title}</p>
                <p className="text-xs text-muted-foreground">${Number(item?.product?.price ?? 0).toFixed(2)} each</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item?.quantity}
                  onChange={(event) =>
                    onQuantityChange(item?.product?._id, Number(event.target.value || 1))
                  }
                  className="h-9 w-16 rounded-md border border-input px-2 text-sm"
                />
                <Button type="button" variant="destructive" size="sm" onClick={() => onRemove(item?.product?._id)}>
                  Remove
                </Button>
              </div>
            </div>
          </article>
        ))}

        {!isLoading && !cartItems?.length ? (
          <p className="rounded-md border p-5 text-sm text-muted-foreground">Your cart is empty.</p>
        ) : null}
      </div>

      <footer className="rounded-lg border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">Estimated total</p>
        <p className="text-xl font-semibold">${cartTotal.toFixed(2)}</p>
      </footer>
    </section>
  );
}

export default CartView;