import React from "react";

function ItemDetails({ selectedItem, onClose, pageIdentifier, onConform }) {
  if (!selectedItem) return null;
  const backendUrl = import.meta.env.VITE_BACK_END_URL;

  const colormap = (data)=>{
    console.log(data); 
    const data1 = JSON.parse(data);

    const color = data1.map((color) => {
      return color.color;
    });

    return color.join(", ");
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 max-w-screen-md w-full relative shadow-inner">
        <div className="absolute top-0 right-0">
          <h1
            className={`text-xl font-bold uppercase py-2 text-white px-6 rounded-bl-lg rounded-tr-lg ${
              pageIdentifier === "sold"
                ? "bg-red-500"
                : pageIdentifier === "unsold"
                ? "bg-blue-500"
                : pageIdentifier === "stock"
                ? "bg-yellow-500"
                : pageIdentifier === "orders" && selectedItem.Paid
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {pageIdentifier === "orders"
              ? selectedItem.Paid
                ? "Pre paid"
                : "Cash on delivery"
              : pageIdentifier === "stock"
              ? selectedItem.stock
              : selectedItem.status}
          </h1>
        </div>
        <div className="flex gap-5">
          <div>
            <img
              src={`${selectedItem.product.images[0].url}`}
              alt={selectedItem.tittle}
              className="w-full h-full object-cover"
            />
          </div>
          {pageIdentifier === "orders" ? (
            <div>
              <h2 className="text-2xl font-bold">{selectedItem.product.tittle}</h2>
              <p className="text-gray-700 mt-2">
                <span className="font-bold">Name :</span> {selectedItem.name}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Address :</span> {selectedItem.address}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">E-Mail :</span> {selectedItem.user.email}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Phone :</span> {selectedItem.phone}
              </p>
              <hr className="my-2" />
              <p className="text-gray-700">
                <span className="font-bold">Color :</span> {colormap(selectedItem.product.color)}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Quantity :</span> {selectedItem.quantity}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Size :</span> {selectedItem.product.ring_size}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Material :</span> {selectedItem.product.metal}
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
              <p className="text-gray-700 mt-2">
                <span className="font-bold">Name :</span> {selectedItem.name}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Address :</span> {selectedItem.address}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">E-Mail :</span> {selectedItem.user.email}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Phone :</span> {selectedItem.phone}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Price :</span> {selectedItem.totalPrice}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Quantity :</span> {selectedItem.quantity}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Order Create Date :</span> {selectedItem.createdAt}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Order Confrom Date :</span> {selectedItem.updatedAt}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-5 items-center relative">
          {pageIdentifier === "orders" ? (
            <div className="absolute left-0 bottom-0 text-lg bg-black px-3 py-1 rounded-md">
              <span className="text-white">
                <h2 className="font-bold">{selectedItem.totalPrice} /=</h2>
              </span>
            </div>
          ) : null}
          {pageIdentifier === "orders" ? (
            <button
              className="mt-4 bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
              onClick={() => {
                onConform();
                onClose();
              }}
            >
              Conform
            </button>
          ) : null}
          <button
            className="mt-4 bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;
