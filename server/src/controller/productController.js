import Product from "../model/Product.js";

export const getProducts = async (req, res) => {
  try {
    const {
      category,
      categories,
      search,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = {};

    const categoryList = categories
      ? categories
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
      : [];

    if (categoryList.length > 0) {
      filter.category = { $in: categoryList };
    } else if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const allowedSortFields = ["createdAt", "price", "title", "stock"];
    const selectedSortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const selectedSortOrder = sortOrder === "asc" ? 1 : -1;

    const products = await Product.find(filter).sort({ [selectedSortField]: selectedSortOrder });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductCategories = async (_req, res) => {
  try {
    const categories = await Product.distinct("category");
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, image, category, stock } = req.body;

    if (!title || !description || price === undefined || !image || !category || stock === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const product = await Product.create({ title, description, price, image, category, stock });
    return res.status(201).json({ success: true, message: "Product created successfully.", product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    return res.status(200).json({ success: true, message: "Product updated successfully.", product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    return res.status(200).json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
