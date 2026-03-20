import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useAdminStore from "@/store/adminStore";

const initialForm = {
  orderId: "",
  amountReceived: "",
  isCompleted: false,
};

function Transactions() {
  const { toast } = useToast();
  const {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useAdminStore();

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState("row");

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      orderId: formData.orderId,
      amountReceived: Number(formData.amountReceived),
      isCompleted: formData.isCompleted,
    };

    const result = editingId
      ? await updateTransaction(editingId, payload)
      : await createTransaction(payload);

    if (result?.success) {
      toast({
        title: result?.message ?? "Transaction action completed.",
      });
      resetForm();
      return;
    }

    toast({
      title: result?.message ?? "Transaction action failed.",
    });
  };

  const onEdit = (transaction) => {
    setEditingId(transaction?._id);
    setFormData({
      orderId: transaction?.orderId?._id ?? transaction?.orderId ?? "",
      amountReceived: String(transaction?.amountReceived ?? ""),
      isCompleted: Boolean(transaction?.isCompleted),
    });
  };

  const onDelete = async (id) => {
    const result = await deleteTransaction(id);
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
        <h1 className="text-2xl font-semibold text-brand-violet-700">Transaction Management</h1>
        <p className="text-sm text-muted-foreground">Create, update, and remove transactions.</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border p-3 sm:p-4">
        <Input
          name="orderId"
          placeholder="Order ObjectId"
          value={formData.orderId}
          onChange={onChange}
          required
          className="text-sm"
        />

        <Input
          name="amountReceived"
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount received"
          value={formData.amountReceived}
          onChange={onChange}
          required
          className="text-sm"
        />

        <label className="inline-flex items-center gap-2 text-xs sm:text-sm">
          <input
            name="isCompleted"
            type="checkbox"
            checked={formData.isCompleted}
            onChange={onChange}
          />
          Transaction completed
        </label>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading} className="bg-brand-violet-600 text-white hover:bg-brand-violet-700">
            {editingId ? "Update Transaction" : "Create Transaction"}
          </Button>
          {editingId ? (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel Edit
            </Button>
          ) : null}
        </div>
      </form>

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
      <div className="overflow-x-auto rounded-lg border -mx-3 sm:mx-0">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-brand-violet-100/60 text-left text-brand-violet-800">
            <tr>
              <th className="p-2 sm:p-3 whitespace-nowrap text-xs">Transaction ID</th>
              <th className="p-2 sm:p-3 whitespace-nowrap text-xs">Order ID</th>
              <th className="p-2 sm:p-3 whitespace-nowrap text-xs">Amount</th>
              <th className="p-2 sm:p-3 whitespace-nowrap text-xs">Completed</th>
              <th className="p-2 sm:p-3 whitespace-nowrap text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.map((transaction) => (
              <tr key={transaction?._id} className="border-t">
                <td className="p-2 sm:p-3 text-xs sm:text-sm truncate">{transaction?._id}</td>
                <td className="p-2 sm:p-3 text-xs sm:text-sm truncate">{transaction?.orderId?._id ?? transaction?.orderId}</td>
                <td className="p-2 sm:p-3 text-xs sm:text-sm">{Number(transaction?.amountReceived).toFixed(2)}</td>
                <td className="p-2 sm:p-3 text-xs sm:text-sm">{transaction?.isCompleted ? "Yes" : "No"}</td>
                <td className="p-2 sm:p-3">
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => onEdit(transaction)}>
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="text-xs"
                      onClick={() => onDelete(transaction?._id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!transactions?.length ? (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={5}>
                  No transactions found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {transactions?.map((transaction) => (
          <div key={transaction?._id} className="border rounded-lg p-4 bg-card space-y-3">
            <div className="space-y-2">
              <div>
                <span className="font-medium text-xs text-muted-foreground">Transaction ID</span>
                <p className="text-xs truncate font-mono">{transaction?._id}</p>
              </div>
              <div>
                <span className="font-medium text-xs text-muted-foreground">Order ID</span>
                <p className="text-xs truncate font-mono">{transaction?.orderId?._id ?? transaction?.orderId}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium text-xs text-muted-foreground">Amount</span>
                  <p className="text-sm">${Number(transaction?.amountReceived).toFixed(2)}</p>
                </div>
                <div>
                  <span className="font-medium text-xs text-muted-foreground">Completed</span>
                  <p className={`text-sm font-semibold ${transaction?.isCompleted ? "text-green-700" : "text-orange-700"}`}>
                    {transaction?.isCompleted ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" className="text-xs flex-1" onClick={() => onEdit(transaction)}>
                Edit
              </Button>
              <Button type="button" variant="destructive" size="sm" className="text-xs flex-1" onClick={() => onDelete(transaction?._id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
        {!transactions?.length && (
          <p className="col-span-full text-center text-muted-foreground text-sm">No transactions found.</p>
        )}
      </div>
      )}
    </section>
  );
}

export default Transactions;
