import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import useAdminStore from "@/store/adminStore";

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
  const {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useAdminStore();

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState("row");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

        <Input
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={onChange}
          required
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
