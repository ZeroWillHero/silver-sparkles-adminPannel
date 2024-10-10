import React, { useState, useEffect } from "react";
import Orders from "./components/Stock/order";
import OutOfStock from "./components/Stock/outofstock";
import Sold from "./components/Stock/Sold";
import { FaSearch } from "react-icons/fa";

function Order() {
  const [currentView, setCurrentView] = useState("orders");
  const [searchInput, setSearchInput] = useState("");
  const [itemsStock, setItemsStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const filteredItems = itemsStock.filter((item) =>
    item.product && item.product.name && item.product.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const renderContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    switch (currentView) {
      case "orders":
        return (
          <div>
            <Orders
              pageIdentifier="orders"
            />
          </div>
        );
      case "sold":
        return (
          <div>
            <Sold
              pageIdentifier="sold"
            />
          </div>
        );
      case "outofstock":
        return (
          <div>
            <OutOfStock
              pageIdentifier="Outof Stock"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="my-4">
        <div className="flex gap-3">
          <button onClick={() => setCurrentView("orders")}>
            <h2 className="font-bold">Orders</h2>
          </button>
          <button onClick={() => setCurrentView("sold")}>
            <h2 className="font-bold">Sold Items</h2>
          </button>
          <button onClick={() => setCurrentView("outofstock")}>
            <h2 className="font-bold">Out of Stock</h2>
          </button>
        </div>
      </div>
      <div className="update-state bg-white min-h-screen rounded-lg">
        <div className="bg-white p-8 rounded-lg">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Order;
