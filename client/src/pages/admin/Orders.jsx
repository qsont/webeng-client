import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useAdminStore from "@/store/adminStore";
import AdminOrderDetailsModal from "@/components/custom/AdminOrderDetailsModal";
import { useSearchParams } from "react-router-dom";

const STATUS_OPTIONS = ["Pending", "Confirmed", "Out for Delivery", "Delivered", "Cancelled"];
const PAYMENT_OPTIONS = ["Unpaid", "Partially Paid", "Paid", "Refunded"];

function Orders() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders, isLoading, error, fetchOrders, updateOrder, completeOrderDelivery, deleteOrder } = useAdminStore();
  const [viewMode, setViewMode] = useState(searchParams.get("view") === "card" ? "card" : "row");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState("Pending");
  const [paymentStatusDraft, setPaymentStatusDraft] = useState("Unpaid");
  const initialQuery = searchParams.get("q") ?? "";
  const [searchText, setSearchText] = useState(initialQuery);
  const [queryText, setQueryText] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "all");
  const [paymentFilter, setPaymentFilter] = useState(searchParams.get("payment") ?? "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") ?? "createdAt_desc");

  useEffect(() => {
    const [field, order] = sortBy.split("_");
    fetchOrders({
      search: queryText,
      status: statusFilter !== "all" ? statusFilter : undefined,
      paymentStatus: paymentFilter !== "all" ? paymentFilter : undefined,
      sortBy: field,
      sortOrder: order,
    });
  }, [fetchOrders, queryText, statusFilter, paymentFilter, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (queryText) params.set("q", queryText);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (paymentFilter !== "all") params.set("payment", paymentFilter);
    if (sortBy !== "createdAt_desc") params.set("sort", sortBy);
    if (viewMode !== "row") params.set("view", viewMode);
    setSearchParams(params, { replace: true });
  }, [queryText, statusFilter, paymentFilter, sortBy, viewMode, setSearchParams]);

  const onSearch = (event) => {
    event.preventDefault();
    setQueryText(searchText.trim());
  };

  const onCheck = (order) => {
    setSelectedOrder(order);
    setStatusDraft(order?.status ?? "Pending");
    setPaymentStatusDraft(order?.paymentStatus ?? "Unpaid");
    setIsModalOpen(true);
  };

  const onSaveOrderUpdates = async () => {
    if (!selectedOrder?._id) {
      return;
    }

    const payload = {
      status: statusDraft,
      paymentStatus: paymentStatusDraft,
    };

    const result = await updateOrder(selectedOrder._id, payload);
    toast({ title: result?.message ?? "Order updated." });

    if (result?.success) {
      const nextSelectedOrder = {
        ...selectedOrder,
        ...payload,
      };
      setSelectedOrder(nextSelectedOrder);
      setIsModalOpen(false);
    }
  };

  const onCompleteCOD = async () => {
    if (!selectedOrder?._id) {
      return;
    }

    const result = await completeOrderDelivery(selectedOrder._id);
    toast({ title: result?.message ?? "Delivery/payment completion processed." });

    if (result?.success) {
      setSelectedOrder((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          status: "Delivered",
          paymentStatus: "Paid",
        };
      });
      setStatusDraft("Delivered");
      setPaymentStatusDraft("Paid");
      setIsModalOpen(false);
    }
  };

  const onDelete = async (id) => {
    const result = await deleteOrder(id);
    toast({ title: result?.message ?? "Order deleted." });
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-brand-violet-700">Order Management</h1>
        <p className="text-sm text-muted-foreground">Check details, update enum fields, and delete orders.</p>
      </header>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">View:</span>
        <Button
          type="button"
          variant={viewMode === "row" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("row")}
          className="text-xs"
        >
          Row
        </Button>
        <Button
          type="button"
          variant={viewMode === "card" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("card")}
          className="text-xs"
        >
          Card
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 shadow-soft lg:grid-cols-4">
        <form onSubmit={onSearch} className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by order ID, user name, or email"
            className="pl-8"
          />
        </form>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-400"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <select
          value={paymentFilter}
          onChange={(event) => setPaymentFilter(event.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-400"
        >
          <option value="all">All payment statuses</option>
          {PAYMENT_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-400 lg:col-span-2"
        >
          <option value="createdAt_desc">Newest</option>
          <option value="createdAt_asc">Oldest</option>
          <option value="totalAmount_desc">Amount: High to Low</option>
          <option value="totalAmount_asc">Amount: Low to High</option>
        </select>

        <Button type="button" variant="outline" onClick={() => { setSearchText(""); setQueryText(""); setStatusFilter("all"); setPaymentFilter("all"); setSortBy("createdAt_desc"); }}>
          Reset filters
        </Button>
      </div>

      {viewMode === "row" ? (
      <div className="ui-scrollbar overflow-x-auto rounded-xl border -mx-3 sm:mx-0">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-brand-violet-100/60 text-left text-brand-violet-800">
            <tr>
              <th className="p-2 sm:p-3 whitespace-nowrap text-xs">Order ID</th>
              <th className="p-2 sm:p-3 whitespace-nowrap text-xs">User</th>
              <th className="p-2 sm:p-3 whitespace-nowrap text-xs">Items</th>
              <th className="p-2 sm:p-3 whitespace-nowrap text-xs">Total</th>
              <th className="p-2 sm:p-3 whitespace-nowrap text-xs">Status</th>
              <th className="p-2 sm:p-3 whitespace-nowrap text-xs">Payment</th>
              <th className="p-2 sm:p-3 whitespace-nowrap text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order?._id} className="border-t">
                <td className="p-2 sm:p-3 text-xs sm:text-sm truncate">{order?._id}</td>
                <td className="p-2 sm:p-3 text-xs sm:text-sm truncate">{order?.user?.email ?? order?.user}</td>
                <td className="p-2 sm:p-3 text-xs sm:text-sm">{order?.items?.length ?? 0}</td>
                <td className="p-2 sm:p-3 text-xs sm:text-sm">{Number(order?.totalAmount).toFixed(2)}</td>
                <td className="p-2 sm:p-3 text-xs sm:text-sm">{order?.status}</td>
                <td className="p-2 sm:p-3 text-xs sm:text-sm">{order?.paymentStatus}</td>
                <td className="p-2 sm:p-3">
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => onCheck(order)}
                      disabled={isLoading}
                    >
                      Check
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="text-xs"
                      onClick={() => onDelete(order?._id)}
                      disabled={isLoading}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!orders?.length ? (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={7}>
                  No orders found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders?.map((order) => (
          <div key={order?._id} className="border rounded-lg p-4 bg-card space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-xs text-muted-foreground">Order ID</span>
                  <p className="text-xs truncate font-mono">{order?._id}</p>
                </div>
                <span className="text-xs font-semibold bg-brand-violet-100 text-brand-violet-700 px-2 py-1 rounded-md">{order?.status}</span>
              </div>
              <div>
                <span className="font-medium text-xs text-muted-foreground">User</span>
                <p className="text-sm">{order?.user?.email ?? order?.user}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium text-xs text-muted-foreground">Items</span>
                  <p className="text-sm">{order?.items?.length ?? 0}</p>
                </div>
                <div>
                  <span className="font-medium text-xs text-muted-foreground">Amount</span>
                  <p className="text-sm">₱{Number(order?.totalAmount).toFixed(2)}</p>
                </div>
              </div>
              <div>
                <span className="font-medium text-xs text-muted-foreground">Payment</span>
                <p className="text-xs font-semibold text-blue-700">{order?.paymentStatus}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs flex-1"
                onClick={() => onCheck(order)}
                disabled={isLoading}
              >
                Check
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="text-xs flex-1"
                onClick={() => onDelete(order?._id)}
                disabled={isLoading}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      )}

      {!orders?.length ? (
        <p className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No orders found.
        </p>
      ) : null}

      <AdminOrderDetailsModal
        isOpen={isModalOpen}
        order={selectedOrder}
        status={statusDraft}
        paymentStatus={paymentStatusDraft}
        onStatusChange={setStatusDraft}
        onPaymentStatusChange={setPaymentStatusDraft}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveOrderUpdates}
        onCompleteCOD={onCompleteCOD}
        isSaving={isLoading}
        statusOptions={STATUS_OPTIONS}
        paymentOptions={PAYMENT_OPTIONS}
      />
    </section>
  );
}

export default Orders;
