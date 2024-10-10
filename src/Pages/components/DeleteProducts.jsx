import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACK_END_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/all`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`${backendUrl}/api/product/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setProducts(products.filter((product) => product.id !== productId));
      setError(null);
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      
      setError(error.response.data.error || "Failed to delete product. Please try again later.");
      toast.error(
        error.response?.data?.error ||
          "Failed to delete product. Please try again later."
      );
    }
  };

  

  return (
    <div className="p-5 rounded-xl bg-gray-900 text-white">
      <ToastContainer />
      <h2 className="font-bold text-lg mb-4">Delete Products</h2>
      {error && (
        <div className="mb-4 p-2 bg-red-600 text-white rounded">{error}</div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-gray-800 rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-sm ">
              <th className="px-4 py-2 ">Product</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Product ID</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t border-gray-700 text-sm text-center"
              >
                <td className="px-4 py-2">{product.title}</td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">{product.id}</td>
                <td className="px-4 py-2">{product.gender}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-gray-600 text-white p-1 rounded-full"
                  >
                    <MdDeleteForever />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeleteProducts;
