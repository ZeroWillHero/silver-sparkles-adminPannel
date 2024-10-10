import React, { useState, useCallback, useEffect } from "react";
import { MdEditSquare } from "react-icons/md";
import { IoCloudDone } from "react-icons/io5";
import CustomDropdown from "./CustomDropdown";
import Cropper from "react-easy-crop";
import { AiFillCloseCircle } from "react-icons/ai";
import axios from "axios";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
//import { toast } from "react-toastify";
//import "react-toastify/dist/ReactToastify.css";

const UpdateProduct = ({ products }) => {
  const backendUrl = import.meta.env.VITE_BACK_END_URL;
  const [editedProducts, setEditedProducts] = useState([...products]);
  const [editIndex, setEditIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageIndex, setImageIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    stock: "",
    metal: "",
    weight: "",
    length: [],
    width: "",
    ring_size: "",
    color: [],
    stone: "",
    gender: "",
    review: "",
    style: "",
    images: [null, null, null, null],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/all`);
        console.log("get data", response.data);
        const productsWithImages = response.data.map((product) => {
          // console.log(product.images.length);
          for (let i = 0; i < product.images.length; i++) {
            // console.log('run time',i);
            // console.log(product.images[i].url);
            if (product.images[i]) {
              product.images[i] = `${product.images[i].url}`;
            }
          }

          if (product.color) {
            product.color = JSON.parse(product.color);
            product.color = product.color.map((color) => {
              return color.color;
            });
          }

          if (product.length) {
            product.length = JSON.parse(product.length);
            product.length = product.length.map((length) => {
              return length.length;
            });
          }
        });
        setEditedProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  const handleEdit = (index, field, value) => {
    const updatedProducts = [...editedProducts];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setEditedProducts(updatedProducts);
    setEditFormData({ ...editFormData, [field]: value });
  };

  const handleImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result);
        setImageIndex(index);
        setCropping(true);
      };
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/all`);
      console.log("get data", response.data);
      const productsWithImages = response.data.map((product) => {
        // console.log(product.images.length);
        for (let i = 0; i < product.images.length; i++) {
          // console.log('run time',i);
          // console.log(product.images[i].url);
          if (product.images[i]) {
            product.images[i] = `${product.images[i].url}`;
          }
        }

        if (product.color) {
          product.color = JSON.parse(product.color);
          product.color = product.color.map((color) => {
            return color.color;
          });
        }

        if (product.length) {
          product.length = JSON.parse(product.length);
          product.length = product.length.map((length) => {
            return length.length;
          });
        }
      });
      setEditedProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const findcolorandlength = (product) => {
    console.log("findcolorandlength");
    const foundItem = editedProducts.find(
      (item) => item.length === searchValue
    );

    if (foundItem) {
      console.log("Found item:", foundItem);
      return true;
    } else {
      console.log("Value not found in the array");
      return false;
    }
  };

  const handleImageRemove = (index) => {
    const newImages = [...editFormData.images];
    newImages[index] = null;
    setEditFormData({ ...editFormData, images: newImages });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked, value } = e.target;

    const updatedProduct = { ...editFormData }; // Create a copy of editFormData
    if (
      name === "gold" ||
      name === "silver" ||
      name === "rose gold" ||
      name === "white gold"
    ) {
      console.log(name);
      if (checked) {
        updatedProduct.color.push(name);
      } else {
        for (let i = updatedProduct.color.length - 1; i >= 0; i--) {
          if (updatedProduct.color[i] === name) {
            updatedProduct.color.splice(i, 1);
          }
        }
      }
    } else {
      console.log(name);
      if (checked) {
        updatedProduct.length.push(name);
      } else {
        for (let i = updatedProduct.length.length - 1; i >= 0; i--) {
          if (updatedProduct.length[i] === name) {
            updatedProduct.length.splice(i, 1);
          }
        }
      }
    }

    setEditFormData(updatedProduct);
    //console.log(editFormData); // Update state with the modified product object
  };

  const handleSave = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const updatedProduct = { ...editFormData };
      console.log(updatedProduct);
      const formData = new FormData();
      Object.keys(updatedProduct).forEach((key) => {
        if (key !== "images" && key !== "length" && key !== "color") {
          formData.append(key, updatedProduct[key]);
        }
      });
      for (let i = 0; i < updatedProduct.images.length; i++) {
        const image = updatedProduct.images[i];
        //console.log("images", image);
        if (image) {
          if (image.startsWith("blob:")) {
            // Handle blob URLs
            console.log("blob", image);
            const response = await fetch(image);
            const blob = await response.blob();
            formData.append("images", blob, `image-${i}.jpeg`);
          } else if (image.startsWith(`https://res.cloudinary.com/`)) {
            // Handle external URLs
            const response = await fetch(image);
            console.log(response);
            if (response.ok) {
              const blob = await response.blob();
              console.log("blod", blob);
              formData.append("images", blob, `image-${i}.jpeg`);
            } else {
              console.error("Failed to fetch image from URL:", image);
              // Optionally handle the error, e.g., skip this image or add a placeholder
            }
          } else {
            // If it's neither a blob nor a known external URL, handle accordingly
            console.warn("Unknown image URL format:", image);
          }
        }
      }

      for (let i = 0; i < updatedProduct.length?.length; i++) {
        // Check if length is defined
        if (updatedProduct.length[i]) {
          console.log("length", updatedProduct.length[i]);
          formData.append("length", updatedProduct.length[i]);
        }
      }

      for (let i = 0; i < updatedProduct.color?.length; i++) {
        // Check if color is defined
        if (updatedProduct.color[i]) {
          console.log("color", updatedProduct.color[i]);
          formData.append("color", updatedProduct.color[i]);
        }
      }
      await axios.put(
        `${backendUrl}/api/product/update/${editFormData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      

      const updatedProducts = [...editedProducts];
      updatedProducts[editIndex] = editFormData;
      setEditedProducts(updatedProducts);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      setEditIndex(null);

      setEditFormData({
        title: "",
        category: "",
        price: "",
        description: "",
        stock: "",
        metal: "",
        weight: "",
        length: [],
        width: "",
        ringSize: "",
        color: [],
        stone: "",
        gender: "",
        review: "",
        style: "",
        images: [null, null, null, null],
      });
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    const selectedProduct = editedProducts[index];
    setEditFormData({
      ...selectedProduct,
      images: [...selectedProduct.images],
    });
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
    const image = new Image();
    image.src = imageSrc;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const fileUrl = URL.createObjectURL(blob);
        resolve(fileUrl);
      }, "image/jpeg");
    });
  };

  const handleCrop = async () => {
    try {
      const croppedImageUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      const newImages = [...editFormData.images];
      newImages[imageIndex] = croppedImageUrl;
      setEditFormData({ ...editFormData, images: newImages });
      setCropping(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {cropping && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative w-3/5 h-4/5 m-10 bg-white p-4">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
            <button
              onClick={handleCrop}
              className="absolute bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Crop
            </button>
            <button
              onClick={() => setCropping(false)}
              className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="p-5 mb-10 rounded-xl bg-gray-900 text-white">
        <h2 className="font-bold text-lg mb-4">Products List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-gray-800 rounded-lg">
            <thead>
              <tr className="bg-gray-700 text-sm">
                <th className="px-4 py-2">Products</th>
                <th className="px-4 py-2">Product ID</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Category</th>
                {/* <th className="px-4 py-2">Discount</th>
                <th className="px-4 py-2">Date</th> */}
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {editedProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-t border-gray-700 text-sm"
                >
                  <td className="px-4 py-2 text-center">{product.title}</td>
                  <td className="px-4 py-2 text-center">{product.id}</td>
                  <td className="px-4 py-2 text-center">{product.price}</td>
                  <td className="px-4 py-2 text-center">{product.category}</td>
                  {/* <td className="px-4 py-2 text-center">{product.discount}</td>
                  <td className="px-4 py-2 text-center">{product.date}</td> */}
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleEditClick(index)}
                      className="hover:bg-gray-500 font-bold bg-gray-600 text-white p-1 rounded-full"
                    >
                      <MdEditSquare />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showPopup && (
          <div className="fixed bottom-8 right-8 bg-gray-100 text-black p-4 rounded-lg shadow-xl border-l-4 border-lime-400 flex items-center gap-3">
            <IoCloudDone /> Changes saved successfully!
          </div>
        )}
      </div>

      {/* Edit Product section */}

      <div className="p-5 rounded-xl bg-gray-800 text-white mt-4">
        <h2 className="font-bold text-lg mb-4">Edit Product</h2>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold mb-2">
                Product Name
              </label>
              <input
                type="text"
                id="title"
                value={editFormData.title}
                onChange={(e) => handleEdit(editIndex, "title", e.target.value)}
                className="text-black p-3 border-none rounded-lg bg-gray-200 w-full"
                placeholder="Product Name"
              />
            </div>
            <div>
              <label htmlFor="id" className="block text-sm font-bold mb-2">
                Product ID
              </label>
              <input
                type="text"
                id="id"
                value={editFormData.id}
                className="p-3 text-black border-none rounded-lg bg-gray-200 w-full"
                placeholder="Product ID"
                disabled
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-bold mb-2">
                Price
              </label>
              <input
                type="text"
                id="amount"
                value={editFormData.price}
                onChange={(e) => handleEdit(editIndex, "price", e.target.value)}
                className="p-3 text-black border-none rounded-lg bg-gray-200 w-full"
                placeholder="price"
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-bold mb-2">
                Stock
              </label>
              <input
                type="text"
                id="stock"
                value={editFormData.stock}
                onChange={(e) => handleEdit(editIndex, "stock", e.target.value)}
                className="p-3 text-black border-none rounded-lg bg-gray-200 w-full"
                placeholder="Stock"
              />
            </div>

            <div className="col-span-3">
              <div className="grid grid-cols-3 font-bold gap-4 my-4 mb-10">
                {/* <CustomDropdown
                  label="Size"
                  options={[
                    { label: "Small", value: "S" },
                    { label: "Medium", value: "M" },
                    { label: "Large", value: "L" },
                    { label: "Extra Large", value: "XL" },
                    { label: "XXL", value: "XXL" },
                  ]}
                  name="size"
                  value={editFormData.size}
                  onChange={(e) =>
                    handleEdit(editIndex, "size", e.target.value)
                  }
                /> */}
                {/* <CustomDropdown
                  label="Color"
                  options={[
                    { label: "gold", value: "gold" },
                    { label: "Green", value: "green" },
                    { label: "Blue", value: "blue" },
                  ]}
                  name="color"
                  value={editFormData.color}
                  onChange={(e) =>
                    handleEdit(editIndex, "color", e.target.value)
                  }
                /> */}
                <CustomDropdown
                  label="Category"
                  options={[
                    { label: "rings", value: "rings" },
                    { label: "Tops", value: "tops" },
                    { label: "Bottoms", value: "bottoms" },
                    { label: "Dresses", value: "dresses" },
                    { label: "Accessories", value: "accessories" },
                  ]}
                  name="category"
                  value={editFormData.category}
                  onChange={(e) =>
                    handleEdit(editIndex, "category", e.target.value)
                  }
                />

                <CustomDropdown
                  label="Weight"
                  options={[
                    { label: "< 100g", value: "< 100g" },
                    { label: "100g", value: "100g" },
                    { label: "200g", value: "200g" },
                    { label: "300g", value: "300g" },
                    { label: "400g", value: "400g" },
                    { label: "500g", value: "500g" },
                  ]}
                  name="weight"
                  value={editFormData.weight}
                  onChange={(e) =>
                    handleEdit(editIndex, "weight", e.target.value)
                  }
                />
                {/* <CustomDropdown
                  label="Length"
                  options={[
                    { label: "100cm", value: "100cm" },
                    { label: "200cm", value: "200cm" },
                    { label: "300cm", value: "300cm" },
                    { label: "400cm", value: "400cm" },
                    { label: "500cm", value: "500cm" },
                  ]}
                  name="length"
                  value={editFormData.length}
                  onChange={(e) =>
                    handleEdit(editIndex, "length", e.target.value)
                  }
                /> */}
                <CustomDropdown
                  label="Width"
                  options={[
                    { label: "100cm", value: "100cm" },
                    { label: "200cm", value: "200cm" },
                    { label: "300cm", value: "300cm" },
                    { label: "400cm", value: "400cm" },
                    { label: "500cm", value: "500cm" },
                  ]}
                  name="width"
                  value={editFormData.width}
                  onChange={(e) =>
                    handleEdit(editIndex, "width", e.target.value)
                  }
                />
                <CustomDropdown
                  label="Ring Size"
                  options={[
                    { label: "5", value: "5" },
                    { label: "6", value: "6" },
                    { label: "7", value: "7" },
                    { label: "8", value: "8" },
                    { label: "9", value: "9" },
                  ]}
                  name="ring_size"
                  value={editFormData.ring_size}
                  onChange={(e) =>
                    handleEdit(editIndex, "ring_size", e.target.value)
                  }
                />
                <CustomDropdown
                  label="Stone"
                  options={[
                    { label: "natural-diamonds", value: "natural-diamonds" },
                    { label: "Ruby", value: "ruby" },
                    { label: "Sapphire", value: "sapphire" },
                    { label: "Emerald", value: "emerald" },
                    { label: "Topaz", value: "topaz" },
                  ]}
                  name="stone"
                  value={editFormData.stone}
                  onChange={(e) =>
                    handleEdit(editIndex, "category", e.target.value)
                  }
                />
                <CustomDropdown
                  label="Metal"
                  options={[
                    { label: "Gold", value: "gold" },
                    { label: "Silver", value: "silver" },
                    { label: "Platinum", value: "platinum" },
                    { label: "Titanium", value: "titanium" },
                    { label: "Rose Gold", value: "rose gold" },
                  ]}
                  name="metal"
                  value={editFormData.metal}
                  onChange={(e) =>
                    handleEdit(editIndex, "category", e.target.value)
                  }
                />
                <CustomDropdown
                  label="Gender"
                  options={[
                    { label: "Male", value: "men" },
                    { label: "Female", value: "women" },
                    { label: "Unisex", value: "unisex" },
                  ]}
                  name="gender"
                  value={editFormData.gender}
                  onChange={(e) =>
                    handleEdit(editIndex, "gender", e.target.value)
                  }
                />
                <CustomDropdown
                  label="Style"
                  options={[
                    { label: "Cuban", value: "Cuban" },
                    { label: "Vintage", value: "vintage" },
                    { label: "Classic", value: "classic" },
                    { label: "Retro", value: "retro" },
                    { label: "Bohemian", value: "bohemian" },
                  ]}
                  name="style"
                  value={editFormData.style}
                  onChange={(e) =>
                    handleEdit(editIndex, "style", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1">
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-bold mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    type="description"
                    id="description"
                    value={editFormData.description}
                    onChange={(e) =>
                      handleEdit(editIndex, "description", e.target.value)
                    }
                    className="p-3 text-black border-none rounded-lg bg-gray-200 w-full"
                    placeholder="description"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 font-bold gap-4 my-4">
                <FormControl
                  sx={{ m: 3 }}
                  component="fieldset"
                  variant="standard"
                >
                  <FormLabel component="legend" sx={{ color: "white" }}>
                    Assign Color
                  </FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editFormData.color.includes("gold")}
                          onChange={handleCheckboxChange}
                          name="gold"
                        />
                      }
                      label="gold"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editFormData.color.includes("silver")}
                          onChange={handleCheckboxChange}
                          name="silver"
                        />
                      }
                      label="silver"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editFormData.color.includes("rose gold")}
                          onChange={handleCheckboxChange}
                          name="rose gold"
                        />
                      }
                      label="rose gold"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editFormData.color.includes("white gold")}
                          onChange={handleCheckboxChange}
                          name="white gold"
                        />
                      }
                      label="white gold"
                    />
                  </FormGroup>
                  <FormHelperText>Be careful</FormHelperText>
                </FormControl>
                <FormControl
                  sx={{ m: 3 }}
                  component="fieldset"
                  variant="standard"
                >
                  <FormLabel component="legend" sx={{ color: "white" }}>
                    Assign Length
                  </FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editFormData.length.includes("100cm")}
                          onChange={handleCheckboxChange}
                          name="100cm"
                        />
                      }
                      label="100cm"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editFormData.length.includes("200cm")}
                          onChange={handleCheckboxChange}
                          name="200cm"
                        />
                      }
                      label="200cm"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editFormData.length.includes("300cm")}
                          onChange={handleCheckboxChange}
                          name="300cm"
                        />
                      }
                      label="300cm"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={editFormData.length.includes("400cm")}
                          onChange={handleCheckboxChange}
                          name="400cm"
                        />
                      }
                      label="400cm"
                    />
                  </FormGroup>
                  <FormHelperText>Be careful</FormHelperText>
                </FormControl>
              </div>

              {/* Image Upload Grid */}

              <div className="grid grid-cols-8 gap-5 mt-4">
                <div className="col-span-6 bg-gray-200 p-2 h-full relative">
                  {editFormData.images[0] ? (
                    <>
                      <img
                        src={editFormData.images[0]}
                        alt="Main product"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleImageRemove(0)}
                        className="text-red-500 absolute top-1 right-1"
                      >
                        <AiFillCloseCircle size={20} />
                      </button>
                    </>
                  ) : (
                    <label
                      htmlFor="main-image-upload"
                      className="cursor-pointer h-full w-full flex items-center justify-center"
                    >
                      <div className="py-1 px-3 bg-blue-500 text-white rounded-md">
                        + Select Image
                      </div>
                      <input
                        type="file"
                        onChange={(e) => handleImageChange(e, 0)}
                        className="hidden"
                        id="main-image-upload"
                      />
                    </label>
                  )}
                </div>
                <div className="col-span-2 flex flex-col gap-5">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-gray-200 p-2 h-48 relative">
                      {editFormData.images[index + 1] ? (
                        <>
                          <img
                            src={editFormData.images[index + 1]}
                            alt={`image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleImageRemove(index + 1)}
                            className="text-red-500 absolute top-1 right-1"
                          >
                            <AiFillCloseCircle size={20} />
                          </button>
                        </>
                      ) : (
                        <label
                          htmlFor={`image-upload-${index + 1}`}
                          className="cursor-pointer text-blue-500 h-full w-full flex items-center justify-center"
                        >
                          <div className="py-1 px-3 bg-blue-500 text-white rounded-md">
                            + Select Image
                          </div>
                          <input
                            type="file"
                            onChange={(e) => handleImageChange(e, index + 1)}
                            className="hidden"
                            id={`image-upload-${index + 1}`}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSave}
                className="mt-4 px-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
