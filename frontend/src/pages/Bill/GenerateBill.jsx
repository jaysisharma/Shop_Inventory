import React, { useState } from "react";
import { jsPDF } from "jspdf";

const GenerateBill = () => {
  const [customerName, setCustomerName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState([{ name: "", description: "", price: 0 }]);
  const [errors, setErrors] = useState({
    customerName: "",
    contactNo: "",
    items: [],
    discount: "",
  });

  // Add a new item to the list
  const addItem = () => {
    setItems([...items, { name: "", description: "", price: 0 }]);
  };

  // Update an item in the list
  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === "price" ? parseFloat(value) || 0 : value;
    setItems(updatedItems);
  };

  // Remove an item from the list
  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Validate fields
  const validate = () => {
    let valid = true;
    const newErrors = {
      customerName: "",
      contactNo: "",
      items: [],
      discount: "",
    };

    // Validate Customer Name
    if (!customerName.trim()) {
      newErrors.customerName = "Customer name is required";
      valid = false;
    }

    // Validate Contact No (must be numeric and a specific length, e.g., 8 digits)
    if (!contactNo.trim()) {
      newErrors.contactNo = "Contact number is required";
      valid = false;
    } else if (!/^\d+$/.test(contactNo)) {
      newErrors.contactNo = "Contact number must be numeric";
      valid = false;
    } else if (contactNo.length < 8 || contactNo.length > 10) {
      newErrors.contactNo = "Contact number must be between 8 and 10 digits";
      valid = false;
    }

    // Validate Items
    const itemErrors = items.map((item, index) => {
      const itemError = {};
      if (!item.name.trim()) {
        itemError.name = `Item ${index + 1}: Name is required`;
      }
      if (!item.description.trim()) {
        itemError.description = `Item ${index + 1}: Description is required`;
      }
      if (item.price <= 0) {
        itemError.price = `Item ${index + 1}: Price must be greater than 0`;
      }
      return itemError;
    });

    const hasItemError = itemErrors.some(
      (error) => Object.keys(error).length > 0
    );
    if (hasItemError) {
      newErrors.items = itemErrors;
      valid = false;
    }

    // Validate Discount
    if (discount < 0 || discount > subtotal) {
      newErrors.discount = "Discount should be between 0 and subtotal";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Calculate total
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal - discount;

  // Handle form submission
  const generateBill = () => {
    if (validate()) {
      generatePDF();
      // Clear form fields and errors
      setCustomerName("");
      setContactNo("");
      setDiscount(0);
      setItems([]);
      setErrors({
        customerName: "",
        contactNo: "",
        items: [],
        discount: "",
      });
    }
  };

  // Handle contact number input to prevent alphabets
  const handleContactNoChange = (e) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) {
      alert("Add Phone Number || Invalid Number ");
    } else {
      setContactNo(value);
    }
  };

  // Generate PDF Function
  const generatePDF = () => {
    const doc = new jsPDF();

    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;

    doc.setFont("helvetica");

    // Header
    const today = new Date().toLocaleDateString(); // Get today's date
    doc.setFontSize(12);
    doc.text(`Date: ${today}`, pageWidth - margin - 10, 25, { align: "right" }); // Add date at the top-right

    // Add watermark text
    doc.setTextColor(200, 200, 200); // Light gray color for the watermark
    doc.setFontSize(50);
    doc.text("Sharma Video Care", pageWidth / 2, 100, {
      align: "center",
      angle: -30,
    });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Reset text color to black for the main text
    doc.text("Sharma Video Care", pageWidth / 2, 40, { align: "center" });

    doc.setFontSize(12);
    doc.text("Mahavir Chowk- 4, JanakpurDham", pageWidth / 2, 50, {
      align: "center",
    });
    doc.text(
      "Phone: +977 9804861447 | Email: video.care@gmail.com",
      pageWidth / 2,
      60,
      { align: "center" }
    );

    doc.setLineWidth(0.5);
    doc.line(margin, 75, pageWidth - margin, 75); // Line under header

    // Customer Info
    doc.setFontSize(12);
    doc.text(`Customer Name: ${customerName}`, margin, 85);
    doc.text(`Contact No: ${contactNo}`, margin, 95);

    // Items Table
    doc.text("Item List", margin, 110);
    doc.setFontSize(10);

    const startY = 120;
    doc.text("Product Name", margin, startY);
    doc.text("Description", margin + 70, startY);
    doc.text("Price", pageWidth - margin - 10, startY, { align: "right" });

    items.forEach((item, index) => {
      const yPosition = startY + 10 + index * 10;
      doc.text(item.name, margin, yPosition);
      doc.text(item.description, margin + 70, yPosition);
      doc.text(
        `Rs ${item.price.toFixed(2)}`,
        pageWidth - margin - 10,
        yPosition,
        { align: "right" }
      );
    });

    doc.setLineWidth(0.5);
    doc.line(
      margin,
      startY + items.length * 10 + 5,
      pageWidth - margin,
      startY + items.length * 10 + 5
    ); // Line under the table

    // Summary
    const summaryY = startY + items.length * 10 + 15;
    doc.setFontSize(12);
    doc.text(`Subtotal: `, margin, summaryY);
    doc.text(`Rs ${subtotal.toFixed(2)}`, pageWidth - margin - 10, summaryY, {
      align: "right",
    });

    doc.text(`Discount:`, margin, summaryY + 10);
    doc.text(
      `Rs ${discount.toFixed(2)}`,
      pageWidth - margin - 10,
      summaryY + 10,
      { align: "right" }
    );

    doc.setLineWidth(0.5);
    doc.line(margin, summaryY + 20, pageWidth - margin, summaryY + 20); // Line before total

    doc.text(`Total:`, margin, summaryY + 25);
    doc.text(`Rs ${total.toFixed(2)}`, pageWidth - margin - 10, summaryY + 25, {
      align: "right",
    });

    doc.save("bill.pdf");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-lg p-6 rounded-lg">
        {/* Bill Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Sharma Video Care
          </h1>
          <p className="text-lg text-gray-600">
            Mahavir Chowk- 4, JanakpurDham
          </p>
          <p className="text-sm text-gray-500">
            Phone: +977 9804861447 | Email: video.care@gmail.com
          </p>

          <hr className="my-4 border-gray-300" />
          <h2 className="text-xl font-semibold text-gray-700">Statement</h2>
          <p className="text-sm text-gray-600">
            Date: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Customer Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Customer Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block font-medium">Customer Name</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-2 w-full"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm">{errors.customerName}</p>
              )}
            </div>
            <div>
              <label className="block font-medium">Contact No</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg p-2 w-full"
                value={contactNo}
                onChange={handleContactNoChange}
                placeholder="Enter contact number"
              />
              {errors.contactNo && (
                <p className="text-red-500 text-sm">{errors.contactNo}</p>
              )}
            </div>
          </div>
        </div>

        {/* Items List Table */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Itemized List
          </h3>
          <table className="w-full table-auto border-collapse mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-b border-gray-400 p-2 text-left">
                  Item Name
                </th>
                <th className="border-b border-gray-400 p-2 text-left">
                  Description
                </th>
                <th className="border-b border-gray-400 p-2 text-right">
                  Price
                </th>
                <th className="border-b border-gray-400 p-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border-b border-gray-300 p-2">
                    <input
                      type="text"
                      className="border border-gray-300 rounded-lg p-1 w-full"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(index, "name", e.target.value)
                      }
                      placeholder="Item name"
                    />
                    {errors.items[index]?.name && (
                      <p className="text-red-500 text-sm">
                        {errors.items[index].name}
                      </p>
                    )}
                  </td>
                  <td className="border-b border-gray-300 p-2">
                    <input
                      type="text"
                      className="border border-gray-300 rounded-lg p-1 w-full"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                      placeholder="Description"
                    />
                    {errors.items[index]?.description && (
                      <p className="text-red-500 text-sm">
                        {errors.items[index].description}
                      </p>
                    )}
                  </td>
                  <td className="border-b border-gray-300 p-2 text-right">
                    <input
                      type="number"
                      className="border border-gray-300 rounded-lg p-1 w-full text-right"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(index, "price", e.target.value)
                      }
                      placeholder="Price"
                    />
                    {errors.items[index]?.price && (
                      <p className="text-red-500 text-sm">
                        {errors.items[index].price}
                      </p>
                    )}
                  </td>
                  <td className="border-b border-gray-300 p-2 text-center">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded-lg"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            onClick={addItem}
          >
            Add New Item
          </button>
        </div>

        {/* Discount Field */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Discount</h3>
          <input
            type="number"
            className="border border-gray-300 rounded-lg p-2 w-full"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            placeholder="Enter discount"
          />
          {errors.discount && (
            <p className="text-red-500 text-sm">{errors.discount}</p>
          )}
        </div>

        {/* Bill Summary */}
        <div className="border-t border-gray-300 pt-4">
          <div className="flex justify-between font-semibold text-lg">
            <span>Subtotal:</span> <span>Rs {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Discount:</span> <span>- Rs {discount.toFixed(2)}</span>
          </div>
          <div className="my-2 h-[1px] bg-gray-300" />
          <div className="flex justify-between font-semibold text-xl">
            <span>Total:</span> <span>Rs {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Generate PDF and Bill Button */}
        <div className="text-center mt-6">
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
            onClick={generateBill}
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateBill;
