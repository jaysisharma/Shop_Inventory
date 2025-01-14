import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewRepairOrder = () => {
  const { id } = useParams();
  const [repairOrder, setRepairOrder] = useState(null);

  useEffect(() => {
    const fetchRepairOrder = async () => {
      try {
        const response = await axios.get(`/api/repair-orders/${id}`);
        setRepairOrder(response.data.repairOrder);
      } catch (error) {
        console.error(error);
        alert('Error fetching repair order');
      }
    };

    fetchRepairOrder();
  }, [id]);

  if (!repairOrder) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Repair Order Details</h1>
      <div>
        <p><strong>Customer Name:</strong> {repairOrder.customerName}</p>
        <p><strong>Contact No:</strong> {repairOrder.contactNo}</p>
        <p><strong>Model No:</strong> {repairOrder.modelNo}</p>
        <p><strong>Serial No:</strong> {repairOrder.serialNo}</p>
        <p><strong>Problem:</strong> {repairOrder.problem}</p>
        <p><strong>Expectation Amount:</strong> {repairOrder.expectationAmount}</p>
        <p><strong>Total Amount:</strong> {repairOrder.totalAmount}</p>
        {/* Display other fields as necessary */}
      </div>
    </div>
  );
};

export default ViewRepairOrder;
