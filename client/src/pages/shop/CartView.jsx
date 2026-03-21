import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/cartStore";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CartView() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { cartItems, isLoading, error, fetchCart, updateCartItem, removeCartItem, clearCart, checkoutCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = Number(item?.product?.price ?? 0);
    const quantity = Number(item?.quantity ?? 0);
    return sum + price * quantity;
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0);

  const onQuantityChange = async (productId, quantity) => {
    const result = await updateCartItem({ productId, quantity });
    toast({ title: result?.message ?? "Cart updated." });
  };

  const onRemove = async (productId) => {
    const result = await removeCartItem(productId);
    toast({ title: result?.message ?? "Item removed." });
  };

  const onDecrease = async (item) => {
    const productId = item?.product?._id;
    const nextQuantity = Number(item?.quantity ?? 1) - 1;

    if (nextQuantity <= 0) {
      await onRemove(productId);
      return;
    }

    await onQuantityChange(productId, nextQuantity);
  };

  const onIncrease = async (item) => {
    const productId = item?.product?._id;
    const nextQuantity = Number(item?.quantity ?? 0) + 1;
    await onQuantityChange(productId, nextQuantity);
  };

  const onClear = async () => {
    const result = await clearCart();
    toast({ title: result?.message ?? "Cart cleared." });
  };

  const onCheckout = async () => {
    const result = await checkoutCart();
    toast({
      title: result?.success ? "Checkout completed" : "Checkout failed",
      description: result?.message,
      variant: result?.success ? "default" : "destructive",
    });

    if (result?.success) {
      navigate("/orders");
    }
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

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        {cartItems?.map((item, index) => (
          <article
            key={item?.product?._id ?? item?._id}
            className={`grid grid-cols-[72px_1fr_auto] items-center gap-3 p-4 sm:grid-cols-[88px_1fr_auto] ${
              index !== cartItems.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <img
              src={item?.product?.image}
              alt={item?.product?.title}
              className="h-16 w-16 rounded-2xl object-cover sm:h-20 sm:w-20"
            />

            <div className="space-y-1">
              <p className="line-clamp-1 font-bold text-foreground">{item?.product?.title}</p>
              <p className="text-xs text-muted-foreground">₱{Number(item?.product?.price ?? 0).toFixed(2)} each</p>
              <p className="text-sm font-semibold text-brand-accent-700 dark:text-brand-accent-300">
                ₱{(Number(item?.product?.price ?? 0) * Number(item?.quantity ?? 0)).toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Button type="button" variant="outline" size="icon" onClick={() => onDecrease(item)} disabled={isLoading}>
                <Minus className="size-4" />
              </Button>
              <span className="min-w-8 text-center text-sm font-bold text-foreground">{item?.quantity}</span>
              <Button type="button" variant="outline" size="icon" onClick={() => onIncrease(item)} disabled={isLoading}>
                <Plus className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(item?.product?._id)} disabled={isLoading}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
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
        <p className="mb-1 flex items-center justify-between text-sm text-muted-foreground">
          <span>{totalItems} item(s)</span>
          <span>Ready to checkout</span>
        </p>
        <p className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
          <ShoppingBag className="size-4 text-brand-accent-600" />
          Estimated total
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xl font-black text-brand-accent-700 dark:text-brand-accent-300">₱{cartTotal.toFixed(2)}</p>
          <Button
            type="button"
            className="rounded-full"
            onClick={onCheckout}
            disabled={!cartItems.length || isLoading}
          >
            <CreditCard className="size-4" />
            Checkout now
          </Button>
        </div>
      </footer>
    </section>
  );
}

export default CartView;