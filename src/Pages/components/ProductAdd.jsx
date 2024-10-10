import React, { useState, useCallback } from "react";
import CustomDropdown from "./CustomDropdown";
import Cropper from "react-easy-crop";
import { AiFillCloseCircle } from "react-icons/ai";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductAdd = ({ onSubmit }) => {
  const [product, setProduct] = useState({
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
    style: "",
    images: [null, null, null, null], // Initialize with placeholders for 4 image slots
  });
  const [cropping, setCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageIndex, setImageIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
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

  const handleCheckboxChange = (e) => {
    const { name, checked, value } = e.target;

    const updatedProduct = { ...product }; // Create a copy of product
    if (
      name === "gold" ||
      name === "silver" ||
      name === "rose gold" ||
      name === "white gold"
    ) {
      //console.log(name);
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
      //console.log(name);
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

    setProduct(updatedProduct);
    console.log(product); // Update state with the modified product object
  };

  const handleImageRemove = (e, index) => {
    e.stopPropagation();
    e.preventDefault();
    const updatedImages = [...product.images];
    updatedImages[index] = null; // Set the specific index to null instead of splicing
    setProduct({ ...product, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      if (key !== "images" && key !== "length" && key !== "color") {
        formData.append(key, product[key]);
      }
    });
    for (let i = 0; i < product.images.length; i++) {
      if (product.images[i]) {
        console.log("image", product.images);
        const response = await fetch(product.images[i]);
        console.log("response", response);
        const blob = await response.blob();
        formData.append("images", blob, `image-${i}.jpeg`);
      }
    }

    for (let i = 0; i < product.length?.length; i++) {
      // Check if length is defined
      if (product.length[i]) {
        console.log("length", product.length[i]);
        formData.append("length", product.length[i]);
      }
    }

    for (let i = 0; i < product.color?.length; i++) {
      // Check if color is defined
      if (product.color[i]) {
        console.log("color", product.color[i]);
        formData.append("color", product.color[i]);
      }
    }

    console.log("form  data ", formData);

    try {
      const backendUrl = import.meta.env.VITE_BACK_END_URL;
      const response = await fetch(`${backendUrl}/api/product/add`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });
      if (response.ok) {
        toast.success("Product added successfully!");
        setProduct({
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
          style: "",
          images: [null, null, null, null],
        });
      } else {
        toast.error("Failed to add product.");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
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
      const updatedImages = [...product.images];
      updatedImages[imageIndex] = croppedImageUrl;
      setProduct({ ...product, images: updatedImages });
      setCropping(false);
    } catch (e) {
      toast.error("Error cropping image: " + e.message);
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
      <form onSubmit={handleSubmit} className="max-w-5xl m-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              placeholder="Product Name"
              className="p-3 border-none rounded-lg bg-gray-200"
              required
            />
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Price"
              className="p-3 border-none rounded-lg bg-gray-200"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1">
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Product Description"
              className="p-3 border-none rounded-lg bg-gray-200"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-3 font-bold gap-4 my-4">
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="p-3 border-none rounded-lg bg-gray-200"
            required
          />
          <CustomDropdown
            label="Category"
            options={[
              { label: "rings", value: "rings" },
              { label: "chains", value: "chains" },
              { label: "pendants", value: "pendants" },
              { label: "earrings", value: "earrings" },
              { label: "bracelets", value: "bracelets" },
              { label: "anklets", value: "anklets" },
              { label: "bundles", value: "bundles" },
              { label: "watches", value: "watches" },
            ]}
            name="category"
            value={product.category}
            onChange={handleChange}
            required
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
            value={product.weight}
            onChange={handleChange}
            required
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
            value={product.length}
            onChange={handleChange}
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
            value={product.width}
            onChange={handleChange}
            required
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
            value={product.ring_size}
            onChange={handleChange}
            required
          />
          <CustomDropdown
            label="Stone"
            options={[
              { label: "natural-diamonds", value: "natural-diamonds" },
              { label: "american-diamonds", value: "american-diamonds" },
            ]}
            name="stone"
            value={product.stone}
            onChange={handleChange}
            required
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
            value={product.metal}
            onChange={handleChange}
            required
          />
          <CustomDropdown
            label="Style"
            options={[
              { label: "Cuban", value: "Cuban" },
              { label: "Tennis", value: "Tennis" },
              { label: "Figaro", value: "Figaro" },
              { label: "Rope", value: "Rope" },
              { label: "Palm", value: "Palm" },
              { label: "Our Exclusive", value: "Our Exclusive" },
            ]}
            name="style"
            value={product.style}
            onChange={handleChange}
            required
          />
          <CustomDropdown
            label="Gender"
            options={[
              { label: "Male", value: "men" },
              { label: "Female", value: "women" },
              { label: "Unisex", value: "unisex" },
            ]}
            name="gender"
            value={product.gender}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-3 font-bold gap-4 my-4">
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <FormLabel component="legend">Assign Color</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={product.color.includes("gold")}
                    onChange={handleCheckboxChange}
                    name="gold"
                  />
                }
                label="gold"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={product.color.includes("silver")}
                    onChange={handleCheckboxChange}
                    name="silver"
                  />
                }
                label="silver"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={product.color.includes("rose gold")}
                    onChange={handleCheckboxChange}
                    name="rose gold"
                  />
                }
                label="rose gold"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={product.color.includes("white gold")}
                    onChange={handleCheckboxChange}
                    name="white gold"
                  />
                }
                label="white gold"
              />
            </FormGroup>
            <FormHelperText>Be careful</FormHelperText>
          </FormControl>
          <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
            <FormLabel component="legend">Assign Length</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={product.length.includes("100cm")}
                    onChange={handleCheckboxChange}
                    name="100cm"
                  />
                }
                label="100cm"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={product.length.includes("200cm")}
                    onChange={handleCheckboxChange}
                    name="200cm"
                  />
                }
                label="200cm"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={product.length.includes("300cm")}
                    onChange={handleCheckboxChange}
                    name="300cm"
                  />
                }
                label="300cm"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={product.length.includes("400cm")}
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
        <div className="grid grid-cols-8 gap-5 mt-4">
          <div className="col-span-6 bg-gray-200 p-2 h-full">
            {product.images[0] ? (
              <div className="relative h-full">
                <img
                  src={product.images[0]}
                  alt="Main product"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => handleImageRemove(e, 0)}
                  className="text-red-500 absolute top-1 right-1"
                >
                  <AiFillCloseCircle size={24} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="main-image-upload"
                className="cursor-pointer h-full w-full flex items-center justify-center"
              >
                <div className="py-1 px-3 bg-blue-500 text-white rounded-md">
                  + Select Image
                </div>
              </label>
            )}
            <input
              type="file"
              onChange={(e) => handleImageChange(e, 0)}
              className="hidden"
              id="main-image-upload"
            />
          </div>
          <div className="col-span-2 flex flex-col gap-5">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-200 p-2 h-full relative">
                {product.images[index + 1] ? (
                  <div className="relative h-full">
                    <img
                      src={product.images[index + 1]}
                      alt={`image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => handleImageRemove(e, index + 1)}
                      className="text-red-500 absolute top-1 right-1"
                    >
                      <AiFillCloseCircle size={24} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor={`image-upload-${index + 1}`}
                    className="cursor-pointer text-blue-500 h-full w-full flex items-center justify-center"
                  >
                    <div className="py-1 px-3 bg-blue-500 text-white rounded-md">
                      + Select Image
                    </div>
                  </label>
                )}
                <input
                  type="file"
                  onChange={(e) => handleImageChange(e, index + 1)}
                  className="hidden"
                  id={`image-upload-${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-8 bg-blue-500 text-white rounded-lg"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default ProductAdd;
