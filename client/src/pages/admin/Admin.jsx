import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Boxes, ClipboardList, CreditCard, PackageSearch, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAdminStore from "@/store/adminStore";

function Dashboard() {
  const [range, setRange] = useState("30d");

  const {
    products,
    orders,
    transactions,
    completedTransactions,
    isLoading,
    error,
    fetchProducts,
    fetchOrders,
    fetchTransactions,
    fetchCompletedTransactions,
  } = useAdminStore();

  useEffect(() => {
    const loadDashboard = async () => {
      await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchTransactions(),
        fetchCompletedTransactions(),
      ]);
    };

    loadDashboard();
  }, [fetchProducts, fetchOrders, fetchTransactions, fetchCompletedTransactions]);

  const isInRange = (value) => {
    if (range === "all") {
      return true;
    }

    const dateValue = value ? new Date(value) : null;
    if (!dateValue || Number.isNaN(dateValue.getTime())) {
      return false;
    }

    const now = new Date();
    if (range === "today") {
      return (
        dateValue.getFullYear() === now.getFullYear() &&
        dateValue.getMonth() === now.getMonth() &&
        dateValue.getDate() === now.getDate()
      );
    }

    const days = range === "7d" ? 7 : 30;
    const from = new Date(now);
    from.setDate(now.getDate() - days);
    return dateValue >= from;
  };

  const filteredOrders = useMemo(
    () => orders.filter((order) => isInRange(order?.createdAt)),
    [orders, range]
  );

  const filteredTransactions = useMemo(
    () => transactions.filter((transaction) => isInRange(transaction?.createdAt)),
    [transactions, range]
  );

  const filteredCompletedTransactions = useMemo(
    () => completedTransactions.filter((transaction) => isInRange(transaction?.createdAt)),
    [completedTransactions, range]
  );

  const metrics = useMemo(() => {
    const pendingOrders = filteredOrders.filter((order) => order?.status === "Pending").length;
    const outForDelivery = filteredOrders.filter((order) => order?.status === "Out for Delivery").length;
    const lowStockProducts = products.filter((product) => Number(product?.stock ?? 0) > 0 && Number(product?.stock ?? 0) <= 10);
    const outOfStockProducts = products.filter((product) => Number(product?.stock ?? 0) <= 0).length;

    const grossOrderValue = filteredOrders.reduce((sum, order) => sum + Number(order?.totalAmount ?? 0), 0);
    const remittedValue = filteredCompletedTransactions.reduce((sum, transaction) => sum + Number(transaction?.amountReceived ?? 0), 0);
    const unremittedValue = Math.max(grossOrderValue - remittedValue, 0);

    return {
      totalProducts: products.length,
      totalOrders: filteredOrders.length,
      totalTransactions: filteredTransactions.length,
      completedTransactions: filteredCompletedTransactions.length,
      pendingOrders,
      outForDelivery,
      lowStockProducts,
      outOfStockProducts,
      grossOrderValue,
      remittedValue,
      unremittedValue,
    };
  }, [products, filteredOrders, filteredTransactions, filteredCompletedTransactions]);

  const recentOrders = useMemo(() => filteredOrders.slice(0, 5), [filteredOrders]);
  const recentTransactions = useMemo(() => filteredTransactions.slice(0, 5), [filteredTransactions]);

  return (
    <main className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-brand-violet-700">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of products, orders, delivery operations, and COD remittance health.
        </p>
      </header>

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
        <p className="text-sm text-muted-foreground">Dashboard range</p>
        <select
          value={range}
          onChange={(event) => setRange(event.target.value)}
          className="h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-400"
        >
          <option value="today">Today</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-xs text-muted-foreground">Products</p>
          <p className="mt-1 text-2xl font-black text-brand-violet-700">{metrics.totalProducts}</p>
          <p className="mt-2 text-xs text-muted-foreground">{metrics.outOfStockProducts} out of stock</p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-xs text-muted-foreground">Orders</p>
          <p className="mt-1 text-2xl font-black text-brand-violet-700">{metrics.totalOrders}</p>
          <p className="mt-2 text-xs text-muted-foreground">{metrics.pendingOrders} pending • {metrics.outForDelivery} in transit</p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-xs text-muted-foreground">Transactions</p>
          <p className="mt-1 text-2xl font-black text-brand-violet-700">{metrics.totalTransactions}</p>
          <p className="mt-2 text-xs text-muted-foreground">{metrics.completedTransactions} remitted</p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <p className="text-xs text-muted-foreground">Unremitted COD</p>
          <p className="mt-1 text-2xl font-black text-brand-violet-700">₱{metrics.unremittedValue.toFixed(2)}</p>
          <p className="mt-2 text-xs text-muted-foreground">Gross ₱{metrics.grossOrderValue.toFixed(2)} • Remitted ₱{metrics.remittedValue.toFixed(2)}</p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-border bg-card p-4 shadow-soft xl:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <TriangleAlert className="size-4 text-orange-600" />
            <h2 className="text-sm font-semibold text-foreground">Operational Alerts</h2>
          </div>

          <div className="space-y-2 text-sm">
            <p className="rounded-xl border border-border bg-background/60 px-3 py-2">
              Low-stock products: <span className="font-semibold">{metrics.lowStockProducts.length}</span>
            </p>
            <p className="rounded-xl border border-border bg-background/60 px-3 py-2">
              Out-of-stock products: <span className="font-semibold">{metrics.outOfStockProducts}</span>
            </p>
            <p className="rounded-xl border border-border bg-background/60 px-3 py-2">
              Pending orders: <span className="font-semibold">{metrics.pendingOrders}</span>
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/products">
                <PackageSearch className="size-4" />
                Review stock
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/orders">
                <ClipboardList className="size-4" />
                Review orders
              </Link>
            </Button>
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-card p-4 shadow-soft xl:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <Boxes className="size-4 text-brand-violet-700" />
            <h2 className="text-sm font-semibold text-foreground">Recent Orders</h2>
          </div>

          <div className="space-y-2">
            {recentOrders.length ? recentOrders.map((order) => (
              <div key={order?._id} className="rounded-xl border border-border bg-background/60 px-3 py-2">
                <p className="text-xs text-muted-foreground">{order?._id}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{order?.user?.email ?? "Unknown user"}</span>
                  <span className="text-sm font-semibold">₱{Number(order?.totalAmount ?? 0).toFixed(2)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{order?.status} • {order?.paymentStatus}</p>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No recent orders.</p>
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-border bg-card p-4 shadow-soft xl:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <CreditCard className="size-4 text-brand-violet-700" />
            <h2 className="text-sm font-semibold text-foreground">Recent Transactions</h2>
          </div>

          <div className="space-y-2">
            {recentTransactions.length ? recentTransactions.map((transaction) => (
              <div key={transaction?._id} className="rounded-xl border border-border bg-background/60 px-3 py-2">
                <p className="text-xs text-muted-foreground">{transaction?._id}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Order {transaction?.orderId?._id ?? "N/A"}</span>
                  <span className="text-sm font-semibold">₱{Number(transaction?.amountReceived ?? 0).toFixed(2)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{transaction?.paymentStatus ?? (transaction?.isCompleted ? "Completed" : "Pending")}</p>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No recent transactions.</p>
            )}
          </div>
        </article>
      </section>

      {isLoading ? <p className="text-sm text-muted-foreground">Refreshing dashboard data...</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/orders">
            <BadgeCheck className="size-4" />
            Manage Orders
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/transactions">
            <CreditCard className="size-4" />
            Manage Transactions
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/products">
            <Boxes className="size-4" />
            Manage Products
          </Link>
        </Button>
      </div>
    </main>
  );
}

export default Dashboard;