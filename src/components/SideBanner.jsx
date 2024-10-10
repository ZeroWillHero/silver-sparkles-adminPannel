import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SideBanner.css";

export default function PopularProducts() {
  const accessToken = localStorage.getItem('accessToken');
  const backendUrl = import.meta.env.VITE_BACK_END_URL;
  const [mostOrderedProducts, setMostOrderedProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    const fetchMostOrderedProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/order/mostorder`,{
          headers: {
              'Authorization': `Bearer ${accessToken}`
          }
      });
        setMostOrderedProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching most ordered products:", error);
      }
    };

    fetchMostOrderedProducts();
  }, []);

  const toggleProducts = () => {
    setShowProducts(!showProducts);
  };

    const getImageUrl = (item) => {
    // Assuming item.images is an array of objects with 'url' property
    const images = JSON.parse(item);
    return images[0].url;
  };

  return (
    <div className="p-5 bg-white rounded-md">
      <div>
        <h2 className="flex items-center justify-center text-xl text-white font-bold mb-5 bg-gray-700 p-2 rounded-md">
          Popular Products
        </h2>
        <div
          className={`transition-all duration-500 ${
            showProducts ? "h-auto" : "max-h-96"
          } overflow-y-auto hide-scrollbar`}
        >
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pb-2">Product</th>
                <th className="text-left pb-2">Order</th>
              </tr>
            </thead>
            <tbody>
              {mostOrderedProducts.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="flex items-center py-2">
                    <img
                      src={`${getImageUrl(product.product.images)}`} // Adjust image URL as per your backend response structure
                      alt={product.title}
                      className="w-18 h-12 mr-3 rounded-md"
                    />
                    <div>
                      <div className="font-medium">{product.product.title}</div>
                      <div className="text-sm text-gray-500">
                        {product.type}
                      </div>
                    </div>
                  </td>
                  <td className="py-2">{product.totalSold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
