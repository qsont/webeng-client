import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import useAdminStore from "@/store/adminStore";
import ProductImageUploadField from "@/components/custom/ProductImageUploadField";
import { useSearchParams } from "react-router-dom";

const initialForm = {
  title: "",
  description: "",
  price: "",
  image: "",
  category: "",
  stock: "",
};

function Products() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    products,
    productCategories,
    isLoading,
    error,
    fetchProducts,
    fetchProductCategories,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useAdminStore();

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState(searchParams.get("view") === "card" ? "card" : "row");
  const initialQuery = searchParams.get("q") ?? "";
  const [searchText, setSearchText] = useState(initialQuery);
  const [queryText, setQueryText] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState(
    (searchParams.get("cats") ?? "").split(",").map((value) => value.trim()).filter(Boolean)
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") ?? "createdAt_desc");

  useEffect(() => {
    fetchProductCategories();
  }, [fetchProductCategories]);

  useEffect(() => {
    const [field, order] = sortBy.split("_");
    fetchProducts({
      search: queryText,
      categories: selectedCategories.join(","),
      sortBy: field,
      sortOrder: order,
    });
  }, [fetchProducts, queryText, selectedCategories, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (queryText) params.set("q", queryText);
    if (selectedCategories.length) params.set("cats", selectedCategories.join(","));
    if (sortBy !== "createdAt_desc") params.set("sort", sortBy);
    if (viewMode !== "row") params.set("view", viewMode);
    setSearchParams(params, { replace: true });
  }, [queryText, selectedCategories, sortBy, viewMode, setSearchParams]);

  const subtitle = useMemo(() => {
    if (selectedCategories.length === 0) return "Showing all products";
    return `Filtered by ${selectedCategories.length} categor${selectedCategories.length > 1 ? "ies" : "y"}`;
  }, [selectedCategories]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((value) => value !== category) : [...prev, category]
    );
  };

  const onSearch = (event) => {
    event.preventDefault();
    setQueryText(searchText.trim());
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!formData.image) {
      toast({ title: "Please upload a product image." });
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    const result = editingId
      ? await updateProduct(editingId, payload)
      : await createProduct(payload);

    if (result?.success) {
      toast({
        title: result?.message ?? "Product action completed.",
      });
      resetForm();
      return;
    }

    toast({
      title: result?.message ?? "Product action failed.",
    });
  };

  const onEdit = (product) => {
    setEditingId(product?._id);
    setFormData({
      title: product?.title ?? "",
      description: product?.description ?? "",
      price: String(product?.price ?? ""),
      image: product?.image ?? "",
      category: product?.category ?? "",
      stock: String(product?.stock ?? ""),
    });
  };

  const onDelete = async (id) => {
    const result = await deleteProduct(id);
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
        <h1 className="text-2xl font-semibold text-brand-violet-700">Product Management</h1>
        <p className="text-sm text-muted-foreground">Create, update, and remove products.</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border p-3 sm:p-4">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          <Input
            name="title"
            placeholder="Product title"
            value={formData.title}
            onChange={onChange}
            required
          />
          <Input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={onChange}
            required
          />
          <Input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={onChange}
            required
          />
          <Input
            name="stock"
            type="number"
            min="0"
            placeholder="Stock"
            value={formData.stock}
            onChange={onChange}
            required
          />
        </div>

        <ProductImageUploadField
          value={formData.image}
          onChange={(nextImage) =>
            setFormData((previous) => ({ ...previous, image: nextImage }))
          }
          disabled={isLoading}
        />

        <Textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={onChange}
          required
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading} className="bg-brand-violet-600 text-white hover:bg-brand-violet-700">
            {editingId ? "Update Product" : "Create Product"}
          </Button>
          {editingId ? (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel Edit
            </Button>
          ) : null}
        </div>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex items-center gap-2 mb-1">
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

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-card p-4 shadow-soft lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="space-y-3">
          <form onSubmit={onSearch} className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by product title or description"
                className="pl-8"
              />
            </div>
            <Button type="submit" className="rounded-md bg-brand-accent-600 text-white hover:bg-brand-accent-700">
              Search
            </Button>
          </form>

          <div>
            <p className="text-sm font-semibold text-brand-accent-700">Filter by category</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {productCategories?.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                    selectedCategories.includes(category)
                      ? "border-brand-accent-600 bg-brand-accent-600 text-white"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={() => {
                setSearchText("");
                setQueryText("");
                setSelectedCategories([]);
                setSortBy("createdAt_desc");
              }}
            >
              Reset filters
            </Button>
          </div>
        </div>

        <div className="space-y-1 min-w-56">
          <label htmlFor="admin-product-sort" className="text-sm font-semibold text-brand-accent-700">
            Sort products
          </label>
          <select
            id="admin-product-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-400"
          >
            <option value="createdAt_desc">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="title_asc">Name: A-Z</option>
            <option value="stock_desc">Stock: High to Low</option>
          </select>
        </div>
      </div>

      {viewMode === "row" ? (
      <div className="ui-scrollbar overflow-x-auto rounded-xl border -mx-3 sm:mx-0">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-brand-violet-100/60 text-left text-brand-violet-800">
            <tr>
              <th className="p-2 sm:p-3 whitespace-nowrap">Title</th>
              <th className="p-2 sm:p-3 whitespace-nowrap">Category</th>
              <th className="p-2 sm:p-3 whitespace-nowrap">Price</th>
              <th className="p-2 sm:p-3 whitespace-nowrap">Stock</th>
              <th className="p-2 sm:p-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product?._id} className="border-t">
                <td className="p-2 sm:p-3 text-xs sm:text-sm truncate">{product?.title}</td>
                <td className="p-2 sm:p-3 text-xs sm:text-sm truncate">{product?.category}</td>
                <td className="p-2 sm:p-3 text-xs sm:text-sm">{Number(product?.price).toFixed(2)}</td>
                <td className="p-2 sm:p-3 text-xs sm:text-sm">{product?.stock}</td>
                <td className="p-2 sm:p-3">
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => onEdit(product)}>
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="text-xs"
                      onClick={() => onDelete(product?._id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!products?.length ? (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={5}>
                  No products found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product) => (
          <div key={product?._id} className="border rounded-lg p-4 bg-card space-y-3">
            <img src={product?.image} alt={product?.title} className="w-full h-40 object-cover rounded-md" />
            <div className="space-y-2">
              <h3 className="font-semibold text-sm line-clamp-2">{product?.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{product?.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium">Price:</span>
                  <p>₱{Number(product?.price).toFixed(2)}</p>
                </div>
                <div>
                  <span className="font-medium">Stock:</span>
                  <p>{product?.stock}</p>
                </div>
                <div>
                  <span className="font-medium">Category:</span>
                  <p>{product?.category}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" className="text-xs flex-1" onClick={() => onEdit(product)}>
                Edit
              </Button>
              <Button type="button" variant="destructive" size="sm" className="text-xs flex-1" onClick={() => onDelete(product?._id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
        {!products?.length && (
          <p className="col-span-full text-center text-muted-foreground text-sm">No products found.</p>
        )}
      </div>
      )}
    </section>
  );
}

export default Products;
