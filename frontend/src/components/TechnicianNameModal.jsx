import React, { useState } from "react";

const TechnicianNameModal = ({ isOpen, onClose, onConfirm }) => {
  const [technicianName, setTechnicianName] = useState("Saroj Sharma");

  // List of technicians to choose from
  const technicians = [
    "Saroj Sharma",
    "Anil Kumar",
    "Ravi Singh",
    "Priya Patel",
    "Meena Devi"
  ];

  const handleSubmit = () => {
    onConfirm(technicianName);
    onClose();
  };

  if (!isOpen) return null; // Don't render if modal is not open

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Select Technician
        </h3>
        <select
          value={technicianName}
          onChange={(e) => setTechnicianName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          {technicians.map((tech, index) => (
            <option key={index} value={tech}>
              {tech}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianNameModal;
