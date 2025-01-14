import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidenav from "./components/Sidenav";

// Dashboard & Settings
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

// Product Management
import ProductListPage from "./pages/ProductListPage";
import AddProductForm from "./components/AddProductForm";
import ManageProduct from "./pages/ManageProduct";
import EditProduct from "./pages/EditProduct";
import ProductDetailPage from "./pages/ProductDetailPage";
import LowStock from "./components/LowStock";

// Second-Hand Marketplace
import SecondHandMarketplace from "./pages/Second_Hand/Marketplace";
import SecondHandManageProduct from "./pages/Second_Hand/Manage";
import AddSecondHandProduct from "./components/second_hand/AddSecondHandForm";
import EditSecondHandProduct from "./pages/Second_Hand/EditSecondHandProduct";

// Repair Orders
import CreateRepairOrder from "./pages/Repair/CreateRepairOrder";
import RepairOrdersList from "./pages/Repair/RepairOrdersList";
import ViewRepairOrder from "./pages/Repair/ViewRepairOrder";
import UpdateRepairOrder from "./pages/Repair/UpdateRepairOrder";
import OrderDetail from "./pages/Repair/OrderDetail";

// Billing & Reports
import GenerateBill from "./pages/Bill/GenerateBill";
import Report from "./pages/Report";

// Miscellaneous
import About from "./pages/About";

function App() {
  return (
    <div className="md:flex h-screen md:overflow-hidden">
      {/* Sidebar */}
      <Sidenav />

      {/* Main Content */}
      <div className="flex-1 overflow-scroll">
        <Routes>
          {/* Dashboard & Settings */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />

          {/* Product Management */}
          <Route path="/product-marketplace" element={<ProductListPage />} />
          <Route path="/add-product" element={<AddProductForm />} />
          <Route path="/manage-products" element={<ManageProduct />} />
          <Route path="/edit-product/:productId" element={<EditProduct />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/stock-alerts" element={<LowStock />} />

          {/* Second-Hand Marketplace */}
          <Route
            path="/second-hand-marketplace"
            element={<SecondHandMarketplace />}
          />
          <Route
            path="/manage-second-hand"
            element={<SecondHandManageProduct />}
          />
          <Route
            path="/add-second-hand-product"
            element={<AddSecondHandProduct />}
          />
          <Route
            path="/edit-second-hand-product/:productId"
            element={<EditSecondHandProduct />}
          />

          {/* Repair Orders */}
          <Route path="/repair-orders" element={<RepairOrdersList />} />
          <Route path="/repair-orders/create" element={<CreateRepairOrder />} />
          <Route path="/edit-order/:id" element={<UpdateRepairOrder />} />

          <Route path="/repair-orders/:id" element={<ViewRepairOrder />} />
          <Route
            path="/repair-orders/update/:id/"
            element={<UpdateRepairOrder />}
          />
          <Route path="/order-detail/:id" element={<OrderDetail />} />

          {/* Billing & Reports */}
          <Route path="/bill" element={<GenerateBill />} />
          <Route path="/reports" element={<Report />} />

          {/* Miscellaneous */}
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
