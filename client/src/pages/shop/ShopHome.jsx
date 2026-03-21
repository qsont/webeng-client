import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useShopStore from "@/store/shopStore";
import grahamBanner from "@/assets/graham-banner.jpg";

function ShopHome() {
  const { products, categories, isLoading, error, fetchProducts, fetchCategories } = useShopStore();
  const [searchText, setSearchText] = useState("");
  const [queryText, setQueryText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt_desc");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const [field, order] = sortBy.split("_");
    fetchProducts({
      search: queryText,
      categories: selectedCategories.join(","),
      sortBy: field,
      sortOrder: order,
    });
  }, [fetchProducts, queryText, selectedCategories, sortBy]);

  const onSearch = (event) => {
    event.preventDefault();
    setQueryText(searchText.trim());
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((value) => value !== category) : [...prev, category]
    );
  };

  const subtitle = useMemo(() => {
    if (selectedCategories.length === 0) return "Showing all products";
    return `Filtered by ${selectedCategories.length} categor${selectedCategories.length > 1 ? "ies" : "y"}`;
  }, [selectedCategories]);

  const getFlavorChipClass = (category) => {
    const value = String(category ?? "").toLowerCase();
    if (value.includes("mango")) return "bg-flavor-mango text-flavor-mango-foreground";
    if (value.includes("milo")) return "bg-flavor-milo text-flavor-milo-foreground";
    if (value.includes("cookies")) return "bg-flavor-cookies text-flavor-cookies-foreground";
    return "bg-brand-accent-600 text-white";
  };

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-float">
        <img
          src={grahamBanner}
          alt="Shop banner"
          className="h-52 w-full object-cover sm:h-64"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/35 to-black/10" />
        <div className="absolute bottom-5 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl">
          <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-accent-200/90 px-3 py-1 text-xs font-semibold text-brand-accent-900">
            <Sparkles className="size-3.5" />
            Graham & Cream Collection
          </span>
          <h1 className="text-2xl font-black text-white sm:text-3xl">Scoop your next favorite bar</h1>
          <p className="mt-1 text-sm text-white/90">Browse handcrafted local flavors with filters built for quick cravings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit space-y-4 rounded-3xl border border-border bg-card p-5 shadow-soft">
          <div>
            <h2 className="text-sm font-semibold text-brand-accent-700">Filter by category</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>

          <div className="space-y-2">
            {categories?.map((category) => (
              <label key={category} className="flex items-center gap-2 rounded-2xl px-2 py-1 text-sm transition-colors hover:bg-muted/60">
                <input
                  type="checkbox"
                  className="size-4 accent-brand-accent-600"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                <span>{category}</span>
              </label>
            ))}
            {!categories?.length && <p className="text-xs text-muted-foreground">No categories found.</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="sort-by" className="text-sm font-semibold text-brand-accent-700">
              Sort products
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-400">
              <option value="createdAt_desc">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="title_asc">Name: A-Z</option>
            </select>
          </div>
        </aside>

        <div className="space-y-4">
          <form onSubmit={onSearch} className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by name or description"
                className="pl-8"
              />
            </div>
            <Button type="submit" className="rounded-full bg-brand-accent-600 text-white hover:bg-brand-accent-700">
              Search
            </Button>
          </form>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products?.map((product) => (
              <article
                key={product?._id}
                className={`overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all ${
                  Number(product?.stock ?? 0) <= 0
                    ? "opacity-65 grayscale"
                    : "hover:-translate-y-0.5 hover:shadow-float"
                }`}
              >
                <div className="relative">
                  <img src={product?.image} alt={product?.title} className="h-56 w-full object-cover" />
                  <span className={`absolute left-3 top-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm ${getFlavorChipClass(product?.category)}`}>
                    {product?.category}
                  </span>
                  {Number(product?.stock ?? 0) <= 0 ? (
                    <span className="absolute right-3 top-3 inline-flex rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Out of stock
                    </span>
                  ) : null}
                </div>

                <div className="space-y-3 p-4">
                  <h3 className="line-clamp-1 text-base font-bold text-foreground">{product?.title}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-black text-brand-accent-700">₱{Number(product?.price).toFixed(2)}</p>
                    {Number(product?.stock ?? 0) <= 0 ? (
                      <Button size="sm" className="rounded-full" disabled>
                        Unavailable
                      </Button>
                    ) : (
                      <Button asChild size="sm" className="rounded-full bg-brand-accent-600 text-white hover:bg-brand-accent-700">
                        <Link to={`/product/${product?._id}`}>View product</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {!isLoading && !products?.length ? (
              <p className="col-span-full rounded-md border p-6 text-center text-sm text-muted-foreground">
                No products matched your current search or filters.
              </p>
            ) : null}
          </div>

          {isLoading ? <p className="text-sm text-muted-foreground">Loading products...</p> : null}
        </div>
      </div>
    </section>
  );
}

export default ShopHome;