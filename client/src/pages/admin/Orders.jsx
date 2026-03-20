import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import useAdminStore from "@/store/adminStore";

const STATUS_OPTIONS = ["Pending", "Confirmed", "Out for Delivery", "Delivered", "Cancelled"];
const PAYMENT_OPTIONS = ["Unpaid", "Partially Paid", "Paid", "Refunded"];

const initialForm = {
  user: "",
  items: "",
  totalAmount: "",
  status: "Pending",
  paymentStatus: "Unpaid",
};

function Orders() {
  const { toast } = useToast();
  const {
    orders,
    isLoading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
  } = useAdminStore();

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [viewMode, setViewMode] = useState("row");

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setFormError("");
    setEditingId(null);
  };

  const parseItems = () => {
    try {
      const items = JSON.parse(formData.items);
      if (!Array.isArray(items) || !items.length) {
        throw new Error("Items must be a non-empty JSON array.");
      }
      return items;
    } catch {
      throw new Error("Invalid items JSON. Use array of { productId, quantity, priceAtPurchase }.");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    try {
      const payload = {
        user: formData.user,
        items: parseItems(),
        totalAmount: Number(formData.totalAmount),
        status: formData.status,
        paymentStatus: formData.paymentStatus,
      };

      const result = editingId
        ? await updateOrder(editingId, payload)
        : await createOrder(payload);

      if (result?.success) {
        toast({
          title: result?.message ?? "Order action completed.",
        });
        resetForm();
        return;
      }

      toast({
        title: result?.message ?? "Order action failed.",
      });
    } catch (errorMessage) {
      setFormError(errorMessage.message);
      toast({ title: errorMessage.message });
    }
  };

  const onEdit = (order) => {
    setEditingId(order?._id);
    setFormError("");
    setFormData({
      user: order?.user?._id ?? order?.user ?? "",
      items: JSON.stringify(order?.items ?? [], null, 2),
      totalAmount: String(order?.totalAmount ?? ""),
      status: order?.status ?? "Pending",
      paymentStatus: order?.paymentStatus ?? "Unpaid",
    });
  };

  const onDelete = async (id) => {
    const result = await deleteOrder(id);
    toast({
      title: result?.message ?? "Delete action completed.",
    });
    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-brand-violet-700">Order Management</h1>
        <p className="text-sm text-muted-foreground">Create, update, and remove orders.</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border p-3 sm:p-4">
        <Input
          name="user"
          placeholder="User ObjectId"
          value={formData.user}
          onChange={onChange}
          required
          className="text-sm"
        />

        <Textarea
          name="items"
          placeholder='Items JSON: [{"productId":"...","quantity":1,"priceAtPurchase":999}]'
          value={formData.items}
          onChange={onChange}
          className="min-h-32 sm:min-h-40 text-sm"
          required
        />

        <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
          <Input
            name="totalAmount"
            type="number"
            min="0"
            step="0.01"
            placeholder="Total amount"
            value={formData.totalAmount}
            onChange={onChange}
            required
          />

          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className="h-9 rounded-md border border-input bg-transparent px-2.5 py-2 text-sm outline-none"
            required>
            {STATUS_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>

          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={onChange}
            className="h-9 rounded-md border border-input bg-transparent px-2.5 py-2 text-sm outline-none"
            required>
            {PAYMENT_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading} className="bg-brand-violet-600 text-white hover:bg-brand-violet-700">
            {editingId ? "Update Order" : "Create Order"}
          </Button>
          {editingId ? (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel Edit
            </Button>
          ) : null}
        </div>
      </form>

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">View:</span>
        <Button
          type="button"
          variant={viewMode === "row" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("row")}
          className="text-xs">
          Row
        </Button>
        <Button
          type="button"
          variant={viewMode === "card" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("card")}
          className="text-xs">
          Card
        </Button>
      </div>

      {viewMode === "row" ? (
      <div className="ui-scrollbar overflow-x-auto rounded-3xl border -mx-3 sm:mx-0">
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
                    <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => onEdit(order)}>
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="text-xs"
                      onClick={() => onDelete(order?._id)}>
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
                <span className="text-xs font-semibold bg-brand-violet-100 text-brand-violet-700 px-2 py-1 rounded">{order?.status}</span>
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
                <span className="font-medium text-xs text-muted-foreground">Payment Status</span>
                <p className="text-xs font-semibold text-blue-700">{order?.paymentStatus}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" className="text-xs flex-1" onClick={() => onEdit(order)}>
                Edit
              </Button>
              <Button type="button" variant="destructive" size="sm" className="text-xs flex-1" onClick={() => onDelete(order?._id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
        {!orders?.length && (
          <p className="col-span-full text-center text-muted-foreground text-sm">No orders found.</p>
        )}
      </div>
      )}
    </section>
  );
}

export default Orders;
