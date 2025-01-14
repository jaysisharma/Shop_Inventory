import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [modalProduct, setModalProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [salePrice, setSalePrice] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [saleSuccess, setSaleSuccess] = useState(false);  // Added state for success message
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://shop-inventory-rorw.onrender.com/api/products");
        setProducts(response.data);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (modalProduct) {
      setSalePrice(modalProduct.price);
      setTotalAmount(modalProduct.price * quantity);
    }
  }, [quantity, modalProduct]);

  // Reset page to 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter products based on the search query
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Calculate the products to display based on currentPage and productsPerPage
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = useMemo(() => {
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, indexOfFirstProduct, indexOfLastProduct]);

  // Handle page changes
  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const openModal = useCallback((product, index) => {
    setModalProduct(product);
    setCurrentImageIndex(index);
    setModalImage(product.images[index]);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalImage(null);
    setModalProduct(null);
  }, []);

  const openSellModal = useCallback((product) => {
    setModalProduct(product);
    setQuantity(1);
    setSalePrice(product.price);
    setSellModalOpen(true);
  }, []);

  const closeSellModal = useCallback(() => {
    setSellModalOpen(false);
    setQuantity(1);
  }, []);

  const handleQuantityChange = useCallback((e) => {
    const value = e.target.value;
    if (value === "" || /^[1-9]\d*$/.test(value)) {
      setQuantity(Math.max(1, parseInt(value) || 1));
    }
  }, []);

  const handleSalePriceChange = useCallback((e) => {
    const value = parseFloat(e.target.value) || 0;
    setSalePrice(value);
  }, []);

  useEffect(() => {
    if (salePrice > 0 && quantity > 0) {
      setTotalAmount(salePrice * quantity);
    }
  }, [salePrice, quantity]);

  const handleConfirmPurchase = useCallback(async () => {
    try {
        const saleData = {
            products: [{
                productId: modalProduct._id,
                quantity,
                salePrice
            }],
            totalAmount
        };

        const response = await axios.post("https://shop-inventory-rorw.onrender.com/api/products/sell", saleData);
        console.log("Sale successful:", response.data);

        // Update product stock locally after successful sale
        const updatedProducts = products.map((product) =>
            product._id === modalProduct._id
                ? { ...product, stock: product.stock - quantity }
                : product
        );
        setProducts(updatedProducts);  // Update the products state

        // Close the sell modal and set success message
        setSellModalOpen(false);
        setSaleSuccess(true);  // Set success message

        // Optionally reset success message after a few seconds
        setTimeout(() => {
            setSaleSuccess(false);
        }, 3000);  // Clear the success message after 3 seconds

    } catch (error) {
        console.error("Error during purchase:", error.response ? error.response.data : error.message);
    }
}, [modalProduct, quantity, salePrice, totalAmount, products]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Product Catalog</h1>

        {/* Search Input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/3 mx-auto p-2 rounded-lg border border-gray-300"
          />
        </div>

        {loading && (
          <p className="text-center text-gray-600 text-lg">Loading...</p>
        )}
        {error && (
          <p className="text-center text-red-500 text-lg">{error}</p>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 text-lg">No products found matching your search.</p>
        )}

        {!loading && !error && currentProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                {/* Main Product Image */}
                {product.images?.length > 0 && (
                  <div className="mb-4">
                    <img
                      src={product.images[0]} 
                      alt={product.name}
                      className="h-72 w-full object-cover rounded-t-lg mb-4 cursor-pointer"
                      onClick={() => openModal(product, 0)} 
                    />
                  </div>
                )}

                <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-2"><strong>Category:</strong> {product.category}</p>
                <p className="text-gray-600 mb-2"><strong>Brand:</strong> {product.brand}</p>
                <p className="text-gray-800 font-medium mb-2">${product.price.toFixed(2)}</p>
                <p className="text-gray-500 text-sm mb-4">{product.description}</p>
                <p className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
                </p>

                <button
                  onClick={() => openSellModal(product)}
                  className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  Sell
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => paginate(currentPage - 1)}
              className="px-4 py-2 bg-gray-600 text-white rounded-l-lg disabled:bg-gray-400"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              className="px-4 py-2 bg-gray-600 text-white rounded-r-lg disabled:bg-gray-400"
              disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal for Image */}
      {isModalOpen && modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full relative">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Product Image</h2>
              <button className="text-red-600" onClick={closeModal}>Close</button>
            </div>
            <div className="flex justify-center mt-4">
              <img src={modalImage} alt="Product" className="w-full h-[80vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Modal for Sell */}
      {sellModalOpen && modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-xl w-full relative">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Sell {modalProduct.name}</h2>
              <button className="text-red-600" onClick={closeSellModal}>Close</button>
            </div>

            {modalProduct.images?.length > 0 && (
              <div className="flex justify-center mt-4 mb-6">
                <img
                  src={modalProduct.images[0]}
                  alt={modalProduct.name}
                  className="w-1/2 h-auto object-contain rounded-lg"
                />
              </div>
            )}

            <div className="mt-4">
              <div className="mb-4">
                <label className="block text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Sale Price</label>
                <input
                  type="number"
                  value={salePrice}
                  onChange={handleSalePriceChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="mb-4">
                <p className="text-lg font-medium">Total Price: ${totalAmount.toFixed(2)}</p>
              </div>

              <button
                onClick={handleConfirmPurchase}
                className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {saleSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg">
          Product sold successfully!
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
