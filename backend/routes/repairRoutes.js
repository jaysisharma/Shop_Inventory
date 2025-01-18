import express from "express";
import RepairService from "../models/Repair.js";
import Sales from "../models/Sales.js";
import SaleTransaction from "../models/SaleTransaction.js"; // Assuming you have this model
import router from "./productRoutes.js";

const repairRouter = express.Router();

repairRouter.get("/total-repairs-this-month", async (req, res) => {
  try {
    // Calculate the start and end of the current month
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    // Query the database for completed repairs this month
    const completedRepairs = await RepairService.find({
      repairStatus: "Completed",
      completionDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Check if any repairs were found
    if (!completedRepairs.length) {
      return res.status(404).json({ message: "No completed repairs this month." });
    }

    // Calculate total repair cost
    const totalRepairCost = completedRepairs.reduce(
      (sum, repair) => sum + (repair.repairCost || 0),
      0
    );

    // Send the result
    res.status(200).json({
      totalRepairs: completedRepairs.length,
      totalRepairCost,
      completedRepairs,
    });
  } catch (error) {
    console.error("Error fetching repairs:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});


repairRouter.get("/total-repairs-count-this-month", async (req, res) => {
  try {
    // Calculate the start and end of the current month
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    // Query the database for completed repairs this month
    const completedRepairs = await RepairService.find({
      repairStatus: "Completed",
      completionDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Return the total count of completed repairs for the current month
    res.status(200).json({
      totalRepairs: completedRepairs.length,
    });
  } catch (error) {
    console.error("Error fetching repairs count:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});


// Get all repair services
repairRouter.get("/", async (req, res) => {
  try {
    const repairServices = await RepairService.find();
    if (!repairServices.length) {
      return res.status(404).json({ message: "No repair services found." });
    }
    res.status(200).json({
      message: "Repair services retrieved successfully.",
      data: repairServices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving repair services",
      error: error.message,
    });
  }
});



repairRouter.get("/total-revenue", async (req, res) => {
  try {
    // Calculate total revenue from Sales
    const sales = await Sales.find();
    let totalRevenueFromSales = 0;
    sales.forEach((sale) => {
      totalRevenueFromSales += sale.totalAmount;
    });

    // Calculate total revenue from Second-Hand Product Sales
    const saleTransactions = await SaleTransaction.find();
    let totalRevenueFromSecondHandProducts = 0;
    saleTransactions.forEach((transaction) => {
      totalRevenueFromSecondHandProducts += transaction.totalAmount;
    });

    // Calculate total revenue from Repair Services
    const repairServices = await RepairService.find();
    let totalRevenueFromRepairServices = 0;
    repairServices.forEach((service) => {
      totalRevenueFromRepairServices += service.repairCost;
    });

    // Sum up all the revenues
    const totalRevenue =
      totalRevenueFromSales + totalRevenueFromSecondHandProducts + totalRevenueFromRepairServices;

    res.status(200).json({
      totalRevenue,
      totalRevenueFromSales,
      totalRevenueFromSecondHandProducts,
      totalRevenueFromRepairServices,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Optional: Generate a report of repair services (commented out)
repairRouter.get("/report", async (req, res) => {
  try {
    const repairServices = await RepairService.find();
    if (!repairServices.length) {
      return res.status(404).json({ message: "No repair service data available." });
    }

    let totalRepairCost = 0;
    let totalRepairs = repairServices.length;
    const statusSummary = {
      Pending: 0,
      "In Progress": 0,
      Completed: 0,
      Canceled: 0,
    };
    const productSummary = {
      Camera: { repairsCount: 0, totalRepairCost: 0 },
      Drone: { repairsCount: 0, totalRepairCost: 0 },
      LED: { repairsCount: 0, totalRepairCost: 0 },
      Others: { repairsCount: 0, totalRepairCost: 0 },
    };

    repairServices.forEach((repair) => {
      totalRepairCost += repair.repairCost;
      statusSummary[repair.repairStatus]++;

      const productName = repair.productName;
      if (productSummary[productName]) {
        productSummary[productName].repairsCount++;
        productSummary[productName].totalRepairCost += repair.repairCost;
      }
    });

    const report = {
      totalRepairCost,
      totalRepairs,
      statusSummary,
      productSummary,
    };

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get a single repair service by ID
repairRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const repairService = await RepairService.findById(id);
    if (!repairService) {
      return res.status(404).json({ message: "Repair service not found." });
    }
    res.status(200).json({
      message: "Repair service retrieved successfully.",
      data: repairService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving repair service",
      error: error.message,
    });
  }
});

// Create a new repair service
repairRouter.post("/", async (req, res) => {
  try {
    const repair = new RepairService(req.body);
    const savedRepair = await repair.save();
    res.status(201).json({
      message: "Repair service created successfully!",
      data: savedRepair,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating repair service",
      error: error.message,
    });
  }
});

repairRouter.patch("/:repairServiceId/products/:productIndex", async (req, res) => {
  const { repairServiceId, productIndex } = req.params;
  const { servicingCompleted, technicianName } = req.body; // Extract servicingCompleted and technicianName from the request body

  if (typeof servicingCompleted !== "boolean") {
    return res.status(400).json({ message: "servicingCompleted must be a boolean value." });
  }

  if (technicianName && typeof technicianName !== "string") {
    return res.status(400).json({ message: "technicianName must be a string." });
  }

  try {
    // Find the repair service by ID
    const repairService = await RepairService.findById(repairServiceId);
    if (!repairService) {
      return res.status(404).json({ message: "Repair service not found." });
    }

    // Check if the product exists in the products array by index
    const product = repairService.products[productIndex];
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Update the servicingCompleted field for the specific product
    product.servicingCompleted = servicingCompleted;

    // If a technicianName is provided, update it in the repair service schema
    if (technicianName) {
      repairService.technicianName = technicianName;  // Set technician name globally for the repair service
    }

    // Save the updated repair service document
    await repairService.save();

    return res.status(200).json({ message: "Product servicing status updated successfully.", repairService });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating product servicing status." });
  }
});


// Update a repair service by ID
repairRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedRepairService = await RepairService.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    if (!updatedRepairService) {
      return res.status(404).json({ message: "Repair service not found." });
    }
    res.status(200).json({
      message: "Repair service updated successfully.",
      data: updatedRepairService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating repair service",
      error: error.message,
    });
  }
});


// Get total repairs completed this month



// Update repair status by ID
repairRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { repairStatus, repairCost } = req.body;

  // Validate if the repairStatus is provided and valid
  if (!repairStatus) {
    return res.status(400).json({ message: "Repair status is required." });
  }

  // Validate if repairCost is a non-negative number if provided
  if (repairCost !== undefined && (isNaN(repairCost) || repairCost < 0)) {
    return res
      .status(400)
      .json({ message: "Repair cost must be a valid non-negative number." });
  }

  // Prepare the update data object
  const updateData = {
    repairStatus,
    ...(repairCost !== undefined && { repairCost }), // Only include repairCost if it's provided
  };

  // If the status is updated to 'Completed', set the completion date
  if (repairStatus === "Completed") {
    updateData.completionDate = new Date(); // Set today's date as the completion date
  }

  try {
    // Update the repair service by ID with the provided update data
    const updatedOrder = await RepairService.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    );

    // If no order is found, send a 404 error
    if (!updatedOrder) {
      return res.status(404).json({ message: "Repair order not found." });
    }

    // Successfully updated the order, send the updated order back in the response
    res.status(200).json({
      message: "Repair order updated successfully.",
      data: updatedOrder,
    });
  } catch (error) {
    // Log the error and send a 500 server error response
    console.error("Error updating repair order:", error);
    res.status(500).json({ message: "Server error." });
  }
});



// Delete a repair service by ID
repairRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRepairService = await RepairService.findByIdAndDelete(id);
    if (!deletedRepairService) {
      return res.status(404).json({ message: "Repair service not found." });
    }
    res.status(200).json({
      message: "Repair service deleted successfully.",
      data: deletedRepairService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting repair service",
      error: error.message,
    });
  }
});

export default repairRouter;
