import { useEffect, useState } from "react";
import useOrderStore from "@/store/orderStore";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderDetailsModal from "@/components/custom/OrderDetailsModal";

function OrdersView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    orders,
    selectedOrder,
    isLoading,
    isDetailLoading,
    error,
    detailError,
    fetchMyOrders,
    fetchMyOrderById,
    clearSelectedOrder,
  } = useOrderStore();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const onOpenDetails = async (orderId) => {
    setIsModalOpen(true);
    await fetchMyOrderById(orderId);
  };

  const onCloseDetails = () => {
    setIsModalOpen(false);
    clearSelectedOrder();
  };

  return (
    <section className="space-y-4">
      <header className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-r from-brand-accent-200 to-brand-accent-100 p-5 shadow-float dark:from-brand-accent-900/55 dark:to-brand-accent-800/35 sm:p-6">
        <div className="relative flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-brand-accent-900 dark:text-brand-accent-100">My Orders</h1>
            <p className="text-sm text-brand-accent-800/80 dark:text-brand-accent-200/80">Track your checked-out items and order status.</p>
          </div>
          <ClipboardList className="size-6 text-brand-accent-700 dark:text-brand-accent-300" />
        </div>
      </header>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {!isLoading && !orders?.length ? (
        <p className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-soft">
          You have no orders yet.
        </p>
      ) : null}

      <div className="space-y-3">
        {orders?.map((order) => (
          <article key={order?._id} className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">Order ID: {order?._id}</p>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">{order?.status}</span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">{order?.paymentStatus}</span>
              </div>
            </div>

            <div className="space-y-2">
              {order?.items?.map((item) => (
                <div
                  key={`${order?._id}-${item?.productId?._id ?? item?.productId}`}
                  className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-2xl border border-border bg-background/60 p-2.5"
                >
                  <img
                    src={item?.productId?.image}
                    alt={item?.productId?.title}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div>
                    <p className="line-clamp-1 text-sm font-semibold text-foreground">{item?.productId?.title ?? "Product"}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item?.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-brand-accent-700 dark:text-brand-accent-300">
                    ₱{(Number(item?.priceAtPurchase ?? 0) * Number(item?.quantity ?? 0)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                Placed: {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-base font-black text-brand-accent-700 dark:text-brand-accent-300">
                  Total: ₱{Number(order?.totalAmount ?? 0).toFixed(2)}
                </p>
                <Button type="button" variant="outline" size="sm" onClick={() => onOpenDetails(order?._id)}>
                  View details
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={onCloseDetails}
        order={selectedOrder}
        isLoading={isDetailLoading}
        error={detailError}
      />
    </section>
  );
}

export default OrdersView;
