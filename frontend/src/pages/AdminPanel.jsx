// src/pages/AdminPanel.jsx
import { useState } from "react";
import Sidenav from "../components/Sidenav";
import Dashboard from "./Dashboard";
import ProductListPage from "./ProductListPage";
import AddProductForm from "../components/AddProductForm";

const AdminPanel = () => {
  const [selectedItem, setSelectedItem] = useState("Dashboard");

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidenav */}
      {/* <Sidenav onSelectItem={handleSelectItem} /> */}

      {/* Main Content */}
      {/* <div className="flex-1 p-8 bg-gray-100 overflow-scroll">
        <h1 className="text-3xl font-bold mb-4">{selectedItem}</h1>

        <div>
          {selectedItem === "Dashboard" && <Dashboard />}
          {selectedItem === "Accept Repair Orders" && (
            <p>Manage repair orders here.</p>
          )}
          {selectedItem === "Manage Repair Products" && (
            <p>Manage your repair products here.</p>
          )}
          {selectedItem === "Repair Status Overview" && (
            <p>See the status overview of repairs here.</p>
          )}
          {selectedItem === "Manage Products" && (
            <p>Manage your products here.</p>
          )}
          {selectedItem === "Add New Product" && <AddProductForm />}
          {selectedItem === "Stock Alerts" && (
            <p>View and manage stock alerts here.</p>
          )}
          {selectedItem === "Product Marketplace" && <ProductListPage />}
          {selectedItem === "Manage Second-Hand Items" && (
            <p>Manage your second-hand items here.</p>
          )}
          {selectedItem === "Sell Second-Hand Product" && (
            <p>Sell second-hand products here.</p>
          )}
          {selectedItem === "Second-Hand Marketplace" && (
            <p>View and manage the second-hand marketplace here.</p>
          )}
          {selectedItem === "New Sale" && <p>Create new sales here.</p>}
          {selectedItem === "Sales History" && <p>View sales history here.</p>}
          {selectedItem === "Generate Reports" && <p>Generate reports here.</p>}
          {selectedItem === "Reports" && <p>View reports here.</p>}
          {selectedItem === "Search" && <p>Use search functionality here.</p>}
          {selectedItem === "Settings" && <p>Adjust settings here.</p>}
          {selectedItem === "Logout" && <p>Logout functionality goes here.</p>}
        </div>
      </div> */}
    </div>
  );
};

export default AdminPanel;
