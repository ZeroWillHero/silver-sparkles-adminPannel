import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const backendUrl = import.meta.env.VITE_BACK_END_URL;
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/order/income-chart-data`
          ,{
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        setSalesData(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div className="p-5 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Monthly Sales</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={salesData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            type="category"
            allowDuplicatedCategory={false}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalSales"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
