import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

function OrderDetailsModal({ isOpen, onClose, order, isLoading, error }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <section
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border bg-card p-5 shadow-float sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-brand-accent-900 dark:text-brand-accent-100">Order details</h2>
            <p className="text-xs text-muted-foreground">Read-only order information</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </header>

        {isLoading ? <p className="text-sm text-muted-foreground">Loading order details...</p> : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {!isLoading && !error && order ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <p className="text-xs text-muted-foreground">Order ID</p>
                <p className="break-all text-sm font-semibold text-foreground">{order?._id}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <p className="text-xs text-muted-foreground">Placed</p>
                <p className="text-sm font-semibold text-foreground">
                  {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <p className="text-xs text-muted-foreground">Order status</p>
                <p className="text-sm font-semibold text-foreground">{order?.status ?? "N/A"}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <p className="text-xs text-muted-foreground">Payment status</p>
                <p className="text-sm font-semibold text-foreground">{order?.paymentStatus ?? "N/A"}</p>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-border bg-background/60 p-3">
              <p className="text-xs text-muted-foreground">Items</p>
              {order?.items?.map((item) => (
                <div
                  key={`${order?._id}-${item?.productId?._id ?? item?.productId}`}
                  className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-xl border border-border bg-card p-2.5"
                >
                  <img
                    src={item?.productId?.image}
                    alt={item?.productId?.title}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div>
                    <p className="line-clamp-1 text-sm font-semibold text-foreground">
                      {item?.productId?.title ?? "Product"}
                    </p>
                    <p className="text-xs text-muted-foreground">Qty: {item?.quantity}</p>
                    <p className="text-xs text-muted-foreground">₱{Number(item?.priceAtPurchase ?? 0).toFixed(2)} each</p>
                  </div>
                  <p className="text-sm font-black text-brand-accent-700 dark:text-brand-accent-300">
                    ₱{(Number(item?.priceAtPurchase ?? 0) * Number(item?.quantity ?? 0)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-background/60 p-3">
              <p className="text-xs text-muted-foreground">Total amount</p>
              <p className="text-lg font-black text-brand-accent-700 dark:text-brand-accent-300">
                ₱{Number(order?.totalAmount ?? 0).toFixed(2)}
              </p>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default OrderDetailsModal;
