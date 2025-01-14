import { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";

const LowStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State to hold the selected image
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/products/products/low-stock"
        );
        if (!response.ok) {
          throw new Error("No Products On Low Stock.");
        }
        const data = await response.json();
        setProducts(data); // Assuming the response is an array of low-stock products
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, []);

  const openModal = (image) => {
    setSelectedImage(image); // Set the selected image URL
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedImage(null); // Reset the selected image
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">{` ${error}`}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 w-full">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Low Stock Products
        </h2>

        {products.length === 0 ? (
          <div className="flex flex-col items-center text-gray-600">
            <FaBoxOpen className="text-6xl text-gray-400 mb-4" />
            <p className="text-lg">No products are low on stock.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-4 text-left text-lg text-gray-700 font-semibold border border-gray-300">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-lg text-gray-700 font-semibold border border-gray-300">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-left text-lg text-gray-700 font-semibold border border-gray-300">
                    Category
                  </th>
                  <th className="px-6 py-4 text-right text-lg text-gray-700 font-semibold border border-gray-300">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product._id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 border border-gray-300">
                      <img
                        src={
                          product.images && product.images.length > 0
                            ? product.images[0]
                            : "https://via.placeholder.com/150" // Fallback image
                        }
                        alt={product.name || "Product"}
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                        onClick={() =>
                          openModal(
                            product.images && product.images.length > 0
                              ? product.images[0]
                              : "https://via.placeholder.com/150"
                          )
                        }
                      />
                    </td>
                    <td className="px-6 py-4 border border-gray-300">
                      <p className="text-lg font-medium text-gray-800">
                        {product.name}
                      </p>
                    </td>
                    <td className="px-6 py-4 border border-gray-300">
                      <p className="text-gray-600">
                        {product.category || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right border border-gray-300">
                      <p className="text-red-600 font-semibold text-lg">
                        {product.stock}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Image */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              ✖
            </button>
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LowStock;
