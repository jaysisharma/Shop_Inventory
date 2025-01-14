import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

// Models
import Product from './models/Product.js';
import Sales from './models/Sales.js';
import RepairService from './models/Repair.js';
import SecondHandProduct from './models/SecondHandProduct.js';
import SaleTransaction from './models/SaleTransaction.js';

// Routes
import repairRouter from './routes/repairRoutes.js';
import productRouter from './routes/productRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import secondHandProductRouter from './routes/secondHandProductRoutes.js';

// DB Connection
import connectDB from './config/db.js';

// Initialize App
const app = express();
const _dirname = path.resolve();

app.use(cors());
app.use(bodyParser.json());
dotenv.config();

// Serve static frontend files
app.use(express.static(path.join(_dirname, 'frontend', 'dist')));

// Handle all routes with index.html (for frontend routing in production)


// Connect to DB
connectDB();

// API Endpoints
app.use('/api/repair-services', repairRouter);
app.use('/api/products', productRouter);
app.use('/api/second-hand-products', secondHandProductRouter);
app.use('/api/activities', activityRoutes);

// Get All Sales
app.get('/api/sales', async (req, res) => {
  try {
    const sales = await Sales.find().populate('products.productId');
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate Sales Report
app.get('/api/sales/report', async (req, res) => {
  try {
    const sales = await Sales.find().populate('products.productId');

    if (!sales.length) {
      return res.status(404).json({ message: 'No sales data available.' });
    }

    let totalRevenue = 0;
    let totalItemsSold = 0;
    const productSummary = {};

    sales.forEach(sale => {
      totalRevenue += sale.totalAmount;
      sale.products.forEach(item => {
        const productId = item.productId._id.toString();
        const productName = item.productId.name;

        totalItemsSold += item.quantity;

        if (!productSummary[productId]) {
          productSummary[productId] = {
            name: productName,
            quantitySold: 0,
            revenueGenerated: 0,
          };
        }

        productSummary[productId].quantitySold += item.quantity;
        productSummary[productId].revenueGenerated += item.quantity * item.salePrice;
      });
    });

    const report = {
      totalRevenue,
      totalItemsSold,
      productSummary: Object.values(productSummary),
    };

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate Repair Service Report
app.get('/api/report', async (req, res) => {
  try {
    const repairServices = await RepairService.find();
    if (!repairServices.length) {
      return res.status(404).json({ message: 'No repair service data available.' });
    }

    let totalRepairCost = 0;
    let totalRepairs = repairServices.length;
    const statusSummary = { Pending: 0, 'In Progress': 0, Completed: 0, Canceled: 0 };
    const productSummary = {
      Camera: { repairsCount: 0, totalRepairCost: 0 },
      Drone: { repairsCount: 0, totalRepairCost: 0 },
      LED: { repairsCount: 0, totalRepairCost: 0 },
      Others: { repairsCount: 0, totalRepairCost: 0 },
    };

    repairServices.forEach(repair => {
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

app.get('*', (_, res) => {
  res.sendFile(path.join(_dirname, 'frontend', 'dist', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
