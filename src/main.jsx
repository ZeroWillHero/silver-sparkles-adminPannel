import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NotFound from "./NotFound";
import Products from "./Pages/Products.jsx";
import Order from "./Pages/Order.jsx";
// import Payment from './Pages/Payment.jsx';
import MediaManager from "./Pages/MediaManager.jsx";
// import Messages from './Pages/Messages.jsx';
import Home from "./Pages/Home";
import Login from "./auth/Login.jsx";
import BestDeals from "./Pages/components/BestDeals.jsx";
import BestDealsAdd from "./Pages/components/BestDealsAdd.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="Products" element={<Products />} />
          <Route path="Order" element={<Order />} />
          {/* <Route path="Payment" element={<Payment />} /> */}
          <Route path="Media_Manager" element={<MediaManager />} />
          <Route path="BestDeals" element={<BestDeals />} />
          <Route path="BestDealsAdd" element={<BestDealsAdd />} />
          {/* <Route path="Messages" element={<Messages />} /> */}
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
