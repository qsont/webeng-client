import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useShopStore from "@/store/shopStore";

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

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border">
        <img
          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80"
          alt="Shop banner"
          className="h-52 w-full object-cover sm:h-64"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/65 to-black/25" />
        <div className="absolute bottom-5 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl">
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">Discover products that match your style</h1>
          <p className="mt-1 text-sm text-white/85">Use filters and search to quickly find what you need.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit space-y-4 rounded-lg border bg-card p-4">
          <div>
            <h2 className="text-sm font-semibold text-brand-violet-700">Filter by category</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>

          <div className="space-y-2">
            {categories?.map((category) => (
              <label key={category} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 accent-brand-violet-600"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                <span>{category}</span>
              </label>
            ))}
            {!categories?.length && <p className="text-xs text-muted-foreground">No categories found.</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="sort-by" className="text-sm font-semibold text-brand-violet-700">
              Sort products
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-sm outline-none">
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
            <Button type="submit" className="bg-brand-violet-600 text-white hover:bg-brand-violet-700">
              Search
            </Button>
          </form>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products?.map((product) => (
              <article key={product?._id} className="overflow-hidden rounded-lg border bg-card">
                <img src={product?.image} alt={product?.title} className="h-44 w-full object-cover" />
                <div className="space-y-2 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-violet-700">{product?.category}</p>
                  <h3 className="line-clamp-1 text-base font-semibold">{product?.title}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{product?.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-sm font-semibold">${Number(product?.price).toFixed(2)}</p>
                    <Button asChild size="sm" className="bg-brand-violet-600 text-white hover:bg-brand-violet-700">
                      <Link to={`/product/${product?._id}`}>View product</Link>
                    </Button>
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