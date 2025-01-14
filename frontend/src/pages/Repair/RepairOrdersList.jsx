import { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash"; // For debounce functionality
import { format } from "date-fns";
import { useNavigate } from "react-router-dom"; // For redirecting with navigate

const RepairOrdersList = () => {
  const [repairOrders, setRepairOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [repairCost, setRepairCost] = useState(0); // State to hold repair cost input

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending"); // Default to Pending
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isConfirmingDone, setIsConfirmingDone] = useState(false); // State for Done confirmation
  const [orderToMarkDone, setOrderToMarkDone] = useState(null); // Order to mark as Done
  const [isConfirmingInProgress, setIsConfirmingInProgress] = useState(false); // State for In Progress confirmation
  const [orderToMarkInProgress, setOrderToMarkInProgress] = useState(null); // Order to mark as In Progress
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false); // State for Cancel confirmation
  const [orderToCancel, setOrderToCancel] = useState(null); // Order to cancel
  const navigate = useNavigate(); // For redirecting with navigate

  // Fetch repair orders
  useEffect(() => {
    const fetchRepairOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "https://shop-inventory-rorw.onrender.com/api/repair-services"
        );
        const orders = response.data.data || [];
        setRepairOrders(orders);
        setFilteredOrders(
          orders.slice((page - 1) * ordersPerPage, page * ordersPerPage)
        );
      } catch (error) {
        setError("Error fetching repair orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRepairOrders();
  }, [page]);

  // Debounced search handler
  const handleSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);

  // Filter orders based on search query and selected status
  useEffect(() => {
    const filtered = repairOrders
      .filter(
        (order) =>
          (statusFilter === "Pending" && order.repairStatus === "Pending") ||
          (statusFilter === "Completed" &&
            order.repairStatus === "Completed") ||
          (statusFilter === "In Progress" &&
            order.repairStatus === "In Progress") ||
          (statusFilter === "Canceled" && order.repairStatus === "Canceled")
      )
      .filter((order) =>
        order.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    setFilteredOrders(
      filtered.slice((page - 1) * ordersPerPage, page * ordersPerPage)
    );
  }, [searchQuery, repairOrders, statusFilter, page]);

  // Handle mark order as "Done"
  const handleDone = async (id) => {
    setOrderToMarkDone(id);
    setIsConfirmingDone(true); // Open the Done confirmation modal
  };

  // Confirm Done action
  const confirmDone = async () => {
    if (orderToMarkDone) {
      try {
        const response = await axios.patch(
          `https://shop-inventory-rorw.onrender.com/api/repair-services/${orderToMarkDone}`,
          {
            repairStatus: "Completed",
            repairCost: repairCost, // Send repairCost to the backend
          }
        );
        if (response.status === 200) {
          setRepairOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderToMarkDone
                ? { ...order, repairStatus: "Completed", repairCost }
                : order
            )
          );
        } else {
          setError("Failed to update repair status.");
        }
      } catch (error) {
        setError("Error updating repair status.");
      }
      setIsConfirmingDone(false); // Close the Done modal
    }
  };

  // Handle mark order as "In Progress"
  const handleInProgress = async (id) => {
    setOrderToMarkInProgress(id);
    setIsConfirmingInProgress(true); // Open the In Progress confirmation modal
  };

  // Confirm In Progress action
  const confirmInProgress = async () => {
    if (orderToMarkInProgress) {
      try {
        const response = await axios.patch(
          `https://shop-inventory-rorw.onrender.com/api/repair-services/${orderToMarkInProgress}`,
          { repairStatus: "In Progress" }
        );
        if (response.status === 200) {
          setRepairOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderToMarkInProgress
                ? { ...order, repairStatus: "In Progress" }
                : order
            )
          );
        } else {
          setError("Failed to update repair status.");
        }
      } catch (error) {
        setError("Error updating repair status.");
      }
      setIsConfirmingInProgress(false); // Close the In Progress modal
    }
  };

  // Handle cancel order
  const handleCancel = async (id) => {
    setOrderToCancel(id);
    setIsConfirmingCancel(true); // Open the Cancel confirmation modal
  };

  // Confirm Cancel action
  const confirmCancel = async () => {
    if (orderToCancel) {
      try {
        const response = await axios.patch(
          `https://shop-inventory-rorw.onrender.com/api/repair-services/${orderToCancel}`,
          { repairStatus: "Canceled" }
        );
        if (response.status === 200) {
          setRepairOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderToCancel
                ? { ...order, repairStatus: "Canceled" }
                : order
            )
          );
        } else {
          setError("Failed to update repair status.");
        }
      } catch (error) {
        setError("Error updating repair status.");
      }
      setIsConfirmingCancel(false); // Close the Cancel modal
    }
  };

  // Handle edit (Redirect to Edit page)
  const handleEdit = (order) => {
    navigate(`/edit-order/${order._id}`); // Redirect to Edit page with order ID using navigate
  };

  // Handle delete
  const handleDelete = async () => {
    if (orderToDelete) {
      try {
        await axios.delete(
          `https://shop-inventory-rorw.onrender.com/api/repair-services/${orderToDelete}`
        );
        setRepairOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderToDelete)
        );
        setIsConfirmingDelete(false); // Close the modal after deletion
      } catch (error) {
        setError("Error deleting order.");
      }
    }
  };

  // Show delete confirmation modal
  const confirmDelete = (orderId) => {
    setOrderToDelete(orderId);
    setIsConfirmingDelete(true);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Repair Orders
      </h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusFilter("Pending")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              statusFilter === "Pending"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("In Progress")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              statusFilter === "In Progress"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setStatusFilter("Completed")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              statusFilter === "Completed"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setStatusFilter("Canceled")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              statusFilter === "Canceled"
                ? "bg-red-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Canceled
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by Customer Name"
          onChange={(e) => handleSearch(e.target.value)}
          className="p-2 border rounded-lg w-full max-w-xs"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <span className="loader"></span>
        </div>
      ) : filteredOrders.length > 0 ? (
        <>
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-100 text-left text-lg">
                <th className="py-3 px-6 border-b">Customer Name</th>
                <th className="py-3 px-6 border-b">Phone Num</th>
                <th className="py-3 px-6 border-b">Repair Status</th>
                <th className="py-3 px-6 border-b">Total Items</th>
                <th className="py-3 px-6 border-b">Expected Delivery</th>
                <th className="py-3 px-6 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 border-b">{order.customerName}</td>
                  <td className="py-3 px-6 border-b">{order.contactNumber}</td>
                  <td className="py-3 px-6 border-b">{order.repairStatus}</td>
                  <td className="py-3 px-6 border-b">
                    {order.products?.length || 0}
                  </td>
                  <td className="py-3 px-6 border-b">
                    {order.expectedDeliveryDate
                      ? format(
                          new Date(order.expectedDeliveryDate),
                          "yyyy-MM-dd"
                        )
                      : "N/A"}
                  </td>
                  <td className="py-3 px-6 border-b flex space-x-2">
                    <button
                      onClick={() => handleEdit(order)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDone(order._id)}
                      className={`bg-green-500 text-white px-2 py-1 rounded ${
                        order.repairStatus === "Completed"
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      disabled={order.repairStatus === "Completed"}
                    >
                      Done
                    </button>
                    <button
                      onClick={() => handleInProgress(order._id)}
                      className={`bg-yellow-500 text-white px-2 py-1 rounded ${
                        order.repairStatus === "In Progress"
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      disabled={
                        order.repairStatus === "In Progress" ||
                        order.repairStatus === "Completed"
                      }
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleCancel(order._id)}
                      className={`bg-red-500 text-white px-2 py-1 rounded ${
                        order.repairStatus === "Canceled"
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      disabled={
                        order.repairStatus === "Canceled" ||
                        order.repairStatus === "Completed"
                      }
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => confirmDelete(order._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/order-detail/${order._id}`)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={filteredOrders.length < ordersPerPage}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No orders available.</p>
      )}

      {/* Delete Confirmation Modal */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this order?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Done Confirmation Modal */}
      {isConfirmingDone && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Done</h3>
            <p>Are you sure you want to mark this order as Completed?</p>

            <label className="block text-sm font-medium text-gray-700 mt-4">
              Repair Cost
            </label>
            <input
              type="number"
              min="0"
              value={repairCost}
              onChange={(e) => setRepairCost(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg mt-2"
              placeholder="Enter repair cost"
            />

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsConfirmingDone(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDone}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In Progress Confirmation Modal */}
      {isConfirmingInProgress && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm In Progress</h3>
            <p>Are you sure you want to mark this order as In Progress?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsConfirmingInProgress(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmInProgress}
                className="px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {isConfirmingCancel && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Cancel</h3>
            <p>Are you sure you want to cancel this order?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsConfirmingCancel(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairOrdersList;

