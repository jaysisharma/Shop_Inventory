import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import TechnicianNameModal from "../../components/TechnicianNameModal"; // Import the modal component

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemServiced, setItemServiced] = useState(0); // Use state for itemServiced
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [productIndexToComplete, setProductIndexToComplete] = useState(null); // Index of the product to mark as done
  const [technicianName, setTechnicianName] = useState("Saroj Sharma"); // Default technician name

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `https://shop-inventory-rorw.onrender.com/api/repair-services/${id}`
        );
        setOrder(response.data.data);
        // Recalculate itemServiced after fetching the order
        calculateItemServiced(response.data.data);
      } catch (error) {
        setError("Error fetching order details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const calculateItemServiced = (orderData) => {
    const servicedItems = orderData.products.filter(
      (product) => product.servicingCompleted
    ).length;
    setItemServiced(servicedItems); // Update the state for serviced items
  };

  const markAsCompleted = (productIndex) => {
    setProductIndexToComplete(productIndex);
    setIsModalOpen(true); // Open the modal to ask for the technician's name
  };

  const handleConfirmTechnician = async (technicianName) => {
    try {
      const product = order.products[productIndexToComplete];

      // Make the PATCH request to update servicingCompleted and technicianName
      const response = await axios.patch(
        `https://shop-inventory-rorw.onrender.com/api/repair-services/${id}/products/${productIndexToComplete}`,
        { servicingCompleted: true, technicianName }
      );

      // Update the state with the new order data
      const updatedOrder = { ...order };
      updatedOrder.products[productIndexToComplete].servicingCompleted = true;

      // Recalculate totalItems (excluding completed ones)
      updatedOrder.totalItems = updatedOrder.products.filter(
        (product) => !product.servicingCompleted
      ).length;

      // Recalculate itemServiced (count of serviced items)
      calculateItemServiced(updatedOrder);

      // Update the technician name globally
      updatedOrder.technicianName = technicianName;

      setOrder(updatedOrder);

      alert("Product marked as completed!");
    } catch (error) {
      console.error("Error marking product as completed", error);
      alert("Error marking product as completed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg font-semibold animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-600">
        Order Details
      </h1>

      {order ? (
        <div className="space-y-8">
          {/* Customer Information */}
          <section className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <strong>Name:</strong> {order.customerName}
              </p>
              <p>
                <strong>Contact:</strong> {order.contactNumber}
              </p>
              <p>
                <strong>Email:</strong> {order.customerEmail}
              </p>
            </div>
          </section>

          {/* Repair Details */}
          <section className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Repair Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded ${getStatusColor(
                    order.repairStatus
                  )}`}
                >
                  {order.repairStatus}
                </span>
              </p>
              <p>
                <strong>Total Items:</strong> {order.totalItems}
              </p>
              <p>
                <strong>Items Serviced:</strong> {itemServiced || "0"}
              </p>
              <p>
                <strong>Cost:</strong> Rs {order.repairCost}
              </p>
              <p>
                <strong>Expected Amount:</strong> Rs {order.expectationAmount}
              </p>
              <p>
                <strong>Delivery Date:</strong>{" "}
                {formatDate(order.expectedDeliveryDate)}
              </p>
              <p>
                <strong>Technician:</strong>{" "}
                {order.technicianName || "Not Assigned"}
              </p>
            </div>
          </section>

          {/* Product Details */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Products
            </h2>
            {order.products?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {order.products.map((product, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
                  >
                    <h3 className="text-lg font-bold text-gray-600 mb-2">
                      Product {index + 1}
                    </h3>
                    <p>
                      <strong>Model No:</strong> {product.modelNo}
                    </p>
                    <p>
                      <strong>Serial No:</strong> {product.serialNo || "N/A"}
                    </p>
                    <p>
                      <strong>Problem:</strong> {product.problem}
                    </p>
                    <p>
                      <strong>Type:</strong>{" "}
                      {capitalize(product.productType || "N/A")}
                    </p>
                    <p>
                      <strong>Accessories:</strong>{" "}
                      {product.selectedAccessories?.join(", ") || "None"}
                    </p>

                    {/* Displaying the servicing status */}
                    {product.servicingCompleted ? (
                      <p className="text-green-600 font-semibold mt-2">
                        Completed
                      </p>
                    ) : (
                      <p className="text-yellow-600 font-semibold mt-2">
                        In Progress
                      </p>
                    )}

                    {Object.keys(product.accessoryDescriptions || {}).length >
                      0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold">
                          Accessory Descriptions:
                        </h4>
                        <ul className="list-disc pl-6 text-gray-700">
                          {Object.entries(product.accessoryDescriptions).map(
                            ([key, value]) => (
                              <li key={key}>
                                <strong>{key}:</strong> {value}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {product.image && (
                      <div className="mt-4">
                        <img
                          src={product.image}
                          alt={`Product ${product.modelNo}`}
                          className="w-full max-w-sm rounded shadow-md"
                        />
                      </div>
                    )}

                    {/* Mark as Done Button */}
                    {!product.servicingCompleted && (
                      <div className="mt-4">
                        <button
                          onClick={() => markAsCompleted(index)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Mark as Done
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No products associated with this order.
              </p>
            )}
          </section>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No details available for this order.
        </p>
      )}

      {/* Technician Name Modal */}
      <TechnicianNameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmTechnician}
      />
    </div>
  );
};

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper to capitalize strings
const capitalize = (str) => {
  if (!str) return ""; // Return an empty string if the input is null/undefined
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Helper to get status color
const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-600";
    case "In Progress":
      return "bg-blue-100 text-blue-600";
    case "Completed":
      return "bg-green-100 text-green-600";
    case "Canceled":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default OrderDetail;
