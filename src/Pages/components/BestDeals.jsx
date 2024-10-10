import { useState, useEffect } from "react";
import { FaStar, FaBoxOpen, FaChartLine } from "react-icons/fa";
import sampleData from "../../data/sampleData.json";

function BestDeals() {
  const [bestDeals, setBestDeals] = useState([]);
  const [sortBy, setSortBy] = useState("orders");

  useEffect(() => {
    // Filter the items that are marked as bestSale and sort by orders initially
    const deals = sampleData.ItemsStock.filter(item => item.bestSale)
      .sort((a, b) => b.orders - a.orders);
    setBestDeals(deals);
  }, []);

  const sortDeals = (criteria) => {
    setSortBy(criteria);
    const sortedDeals = [...bestDeals].sort((a, b) => {
      if (criteria === "rating") return b.rating - a.rating;
      if (criteria === "price") return parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1));
      if (criteria === "stock") return b.amount - a.amount;
      if (criteria === "orders") return b.orders - a.orders;
      return 0;
    });
    setBestDeals(sortedDeals);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Top Selling Products</h1>
      <div className="mb-6 flex justify-center space-x-4">
        <button 
          onClick={() => sortDeals("orders")} 
          className={`px-4 py-2 rounded ${sortBy === "orders" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
        >
          Sort by Orders
        </button>
        <button 
          onClick={() => sortDeals("rating")} 
          className={`px-4 py-2 rounded ${sortBy === "rating" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
        >
          Sort by Rating
        </button>
        <button 
          onClick={() => sortDeals("price")} 
          className={`px-4 py-2 rounded ${sortBy === "price" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
        >
          Sort by Price
        </button>
        <button 
          onClick={() => sortDeals("stock")} 
          className={`px-4 py-2 rounded ${sortBy === "stock" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
        >
          Sort by Stock
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bestDeals.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-indigo-600">{product.price}</span>
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span>{product.rating} ({product.reviews} reviews)</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FaBoxOpen className="mr-2 text-gray-500" />
                  <span className="text-sm text-gray-500">{product.amount} in stock</span>
                </div>
                <div className="flex items-center">
                  <FaChartLine className="mr-2 text-green-500" />
                  <span className="text-sm text-green-500">{product.orders} orders</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BestDeals;
