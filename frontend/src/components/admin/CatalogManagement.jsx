
import { useEffect, useState } from "react";

const CatalogManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "",
    inStock: true,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = getHeaders();

      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch("https://al-zahrawi-backend.onrender.com/api/products", { headers }),
        fetch("https://al-zahrawi-backend.onrender.com/api/categories", { headers }),
      ]);

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      if (!productsResponse.ok || !categoriesResponse.ok) {
        throw new Error(
          productsData.message ||
          categoriesData.message ||
          "Failed to load products or categories."
        );
      }

      setProducts(
        Array.isArray(productsData)
          ? productsData
          : productsData.products || []
      );

      setCategories(
        Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData.categories || []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "https://al-zahrawi-backend.onrender.com/api/categories",
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            name: categoryName,
            description: categoryDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add category.");
      }

      setCategoryName("");
      setCategoryDescription("");
      setMessage("Category added successfully.");

      await fetchCatalog();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProductData({
      ...productData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "https://al-zahrawi-backend.onrender.com/api/products",
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            ...productData,
            price: Number(productData.price),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product.");
      }

      setProductData({
        name: "",
        price: "",
        category: "",
        inStock: true,
      });

      setMessage("Product added successfully.");

      await fetchCatalog();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `https://al-zahrawi-backend.onrender.com/api/products/${productId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product.");
      }

      setMessage("Product deleted successfully.");

      await fetchCatalog();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="page-title">Products & Categories</h2>
        <p className="page-description">
          Manage dental products and organize them into categories.
        </p>
      </div>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="dashboard-card">
            <div className="stat-label">Total Products</div>
            <div className="stat-number">{products.length}</div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="dashboard-card">
            <div className="stat-label">Total Categories</div>
            <div className="stat-number">{categories.length}</div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-5">
          <div className="dashboard-card">
            <h5 className="fw-bold mb-3">Add New Category</h5>

            <form onSubmit={handleAddCategory}>
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter category description"
                  value={categoryDescription}
                  onChange={(e) =>
                    setCategoryDescription(e.target.value)
                  }
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Add Category
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="dashboard-card">
            <h5 className="fw-bold mb-3">Add New Product</h5>

            <form onSubmit={handleAddProduct}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter product name"
                    value={productData.name}
                    onChange={handleProductChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Price (JOD)</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    value={productData.price}
                    onChange={handleProductChange}
                    required
                  />
                </div>

                <div className="col-md-8">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    className="form-select"
                    value={productData.category}
                    onChange={handleProductChange}
                    required
                  >
                    <option value="">Select category</option>

                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4 d-flex align-items-end">
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      name="inStock"
                      className="form-check-input"
                      id="inStock"
                      checked={productData.inStock}
                      onChange={handleProductChange}
                    />
                    <label className="form-check-label" htmlFor="inStock">
                      In Stock
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={categories.length === 0}
              >
                Add Product
              </button>

              {categories.length === 0 && (
                <small className="text-muted d-block mt-2">
                  Add a category before adding a product.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="dashboard-card mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Products List</h5>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={fetchCatalog}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-center text-muted py-4">
            Loading catalog...
          </p>
        ) : products.length === 0 ? (
          <p className="text-center text-muted py-4">
            No products available.
          </p>
        ) : (
          <div className="table-container">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="fw-semibold">{product.name}</td>
                    <td>
                      {product.category?.name || "Uncategorized"}
                    </td>
                    <td>{product.price} JOD</td>
                    <td>
                      <span
                        className={`badge ${
                          product.inStock
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="dashboard-card">
        <h5 className="fw-bold mb-3">Categories List</h5>

        {categories.length === 0 ? (
          <p className="text-muted text-center py-3">
            No categories available.
          </p>
        ) : (
          <div className="table-container">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td className="fw-semibold">{category.name}</td>
                    <td>{category.description || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogManagement;
