import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidenav = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // By default sidebar is open
  const location = useLocation(); // Get current route
  const [isMobile, setIsMobile] = useState(false); // Track if the device is mobile

  const toggleDropdown = (section) => {
    setOpenDropdown((prev) => (prev === section ? null : section));
  };

  const renderDropdown = (section, links) => (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        openDropdown === section
          ? "max-h-screen opacity-100 translate-y-0"
          : "max-h-0 opacity-0 translate-y-[-20px]"
      }`}
    >
      <ul className="p-2 flex flex-col gap-2 ml-4">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className={`hover:bg-gray-700 p-2 rounded transition-all duration-300 ${
              location.pathname === link.path
                ? "bg-blue-500 text-white"
                : "text-gray-300"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </ul>
    </div>
  );

  // Close sidebar on route change (only for mobile)
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false); // Only close sidebar on mobile on route change
    }
  }, [location, isMobile]); // Add isMobile to the dependency array

  // Detect screen size (mobile or desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true); // Keep the sidebar open on desktop
        setIsMobile(false); // Not mobile
      } else {
        setIsSidebarOpen(false); // Sidebar should be closed on mobile
        setIsMobile(true); // It's mobile
      }
    };

    handleResize(); // Check initial size
    window.addEventListener("resize", handleResize); // Add event listener for resize

    return () => window.removeEventListener("resize", handleResize); // Clean up the event listener
  }, []);

  return (
    <div className="relative">
      {/* Hamburger Menu for Mobile */}
      <div
        className="lg:hidden absolute top-4 left-4 text-white z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={isSidebarOpen ? "currentColor" : "red"} // Change stroke color based on state
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0 opacity-100 h-screen" : "translate-x-[-100%] opacity-0 h-8"
        } lg:block bg-gray-800 text-white w-64 flex flex-col transition-all duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className="flex items-center justify-center p-4 bg-blue-600">
          <div className="text-xl font-bold">Inventory Manager</div>
        </div>

        {/* Navigation */}
        <ul className="p-4 flex flex-col gap-4">
          <Link
            to="/"
            className={`hover:bg-gray-700 p-2 rounded transition-all duration-300 ${
              location.pathname === "/" ? "bg-blue-500 text-white" : "text-gray-300"
            }`}
          >
            📊 Dashboard
          </Link>

          {/* Repairs Dropdown */}
          <li>
            <button
              onClick={() => toggleDropdown("repairs")}
              className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded transition-all duration-300"
            >
              <span>🛠️ Repairs</span>
              <svg
                className={`w-4 h-4 transform transition-all duration-300 ${
                  openDropdown === "repairs" ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {renderDropdown("repairs", [
              { name: "Create Repair Orders", path: "/repair-orders/create" },
              { name: "Repair Order List", path: "/repair-orders/" },
            ])}
          </li>

          {/* Products Dropdown */}
          <li>
            <button
              onClick={() => toggleDropdown("products")}
              className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded transition-all duration-300"
            >
              <span>📦 Products</span>
              <svg
                className={`w-4 h-4 transform transition-all duration-300 ${
                  openDropdown === "products" ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {renderDropdown("products", [
              { name: "Manage Products", path: "/manage-products" },
              { name: "Add New Product", path: "/add-product" },
              { name: "Stock Alerts", path: "/stock-alerts" },
              { name: "Product Marketplace", path: "/product-marketplace" },
            ])}
          </li>

          {/* Second-Hand Products Dropdown */}
          <li>
            <button
              onClick={() => toggleDropdown("secondHand")}
              className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded transition-all duration-300"
            >
              <span>🔄 Second-Hand Products</span>
              <svg
                className={`w-4 h-4 transform transition-all duration-300 ${
                  openDropdown === "secondHand" ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {renderDropdown("secondHand", [
              { name: "Manage Second-Hand Items", path: "/manage-second-hand" },
              {
                name: "Second-Hand Marketplace",
                path: "/second-hand-marketplace",
              },
            ])}
          </li>

          {/* Static Links */}
          <Link
            to="/reports"
            className={`hover:bg-gray-700 p-2 rounded transition-all duration-300 ${
              location.pathname === "/reports" ? "bg-blue-500 text-white" : "text-gray-300"
            }`}
          >
            📈 Reports
          </Link>
          <Link
            to="/bill"
            className={`hover:bg-gray-700 p-2 rounded transition-all duration-300 ${
              location.pathname === "/bill" ? "bg-blue-500 text-white" : "text-gray-300"
            }`}
          >
            📈 Bill
          </Link>
          <Link
            to="/settings"
            className={`hover:bg-gray-700 p-2 rounded transition-all duration-300 ${
              location.pathname === "/settings" ? "bg-blue-500 text-white" : "text-gray-300"
            }`}
          >
            ⚙️ Settings
          </Link>
          <Link
            to="/logout"
            className={`hover:bg-gray-700 p-2 rounded transition-all duration-300 ${
              location.pathname === "/logout" ? "bg-blue-500 text-white" : "text-gray-300"
            }`}
          >
            🔒 Logout
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidenav;
