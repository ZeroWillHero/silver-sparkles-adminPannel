import React, { useState, useCallback } from 'react';
import { FaPlus, FaUpload, FaTimesCircle } from 'react-icons/fa';
import Cropper from 'react-easy-crop';
import { toast } from 'react-toastify';

function BestDealsAdd() {
  const [deal, setDeal] = useState({
    title: '',
    description: '',
    price: '',
    images: []
  });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [aspect, setAspect] = useState(16 / 9);

  const aspectRatios = [
    { value: 1 / 1, label: '1:1' },
    { value: 16 / 9, label: '16:9' },
    { value: 4 / 3, label: '4:3' },
    { value: 3 / 2, label: '3:2' },
    { value: 2 / 3, label: '2:3' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeal(prevDeal => ({
      ...prevDeal,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(currentImage, croppedAreaPixels);
      setDeal(prevDeal => ({
        ...prevDeal,
        images: [...prevDeal.images, croppedImage]
      }));
      setCurrentImage(null);
      // Reset the file input
      const fileInput = document.getElementById('images');
      if (fileInput) fileInput.value = '';
    } catch (e) {
      console.error('Error cropping image:', e);
      toast.error('Failed to crop image. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newDeal = {
      ...deal,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    console.log('New Best Deal added:', newDeal);
    toast.success('New Best Deal added successfully!');
    setDeal({ title: '', description: '', price: '', images: [] });
    setCurrentImage(null);
  };

  const handleAspectChange = (e) => {
    setAspect(parseFloat(e.target.value));
  };

  const removeImage = (index) => {
    setDeal(prevDeal => ({
      ...prevDeal,
      images: prevDeal.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Add New Best Deal</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div>
          <label htmlFor="title" className="block mb-2 text-sm font-medium">Deal Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={deal.title}
            onChange={handleInputChange}
            className="w-full p-2.5 bg-gray-800 rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500 text-white"
            placeholder="e.g. 2 Chains + 2 Pendants"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            value={deal.description}
            onChange={handleInputChange}
            className="w-full p-2.5 bg-gray-800 rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500 text-white"
            placeholder="e.g. Rope Chain in Yellow Gold"
            rows="3"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block mb-2 text-sm font-medium">Price (LKR)</label>
          <input
            type="text"
            id="price"
            name="price"
            value={deal.price}
            onChange={handleInputChange}
            className="w-full p-2.5 bg-gray-800 rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500 text-white"
            placeholder="e.g. 149000"
            required
          />
        </div>
        <div>
          <label htmlFor="images" className="block mb-2 text-sm font-medium">Upload Images</label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaUpload className="w-8 h-8 mb-4 text-gray-400" />
                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input
                type="file"
                id="images"
                name="images"
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
        </div>
        {currentImage && (
          <>
            <div>
              <label htmlFor="aspect" className="block mb-2 text-sm font-medium">Aspect Ratio</label>
              <select
                id="aspect"
                name="aspect"
                onChange={handleAspectChange}
                className="w-full p-2.5 bg-gray-800 rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500 text-white"
              >
                {aspectRatios.map((ratio) => (
                  <option key={ratio.label} value={ratio.value}>
                    {ratio.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative h-64 w-full">
              <Cropper
                image={currentImage}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <button
              type="button"
              onClick={getCroppedImage}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Crop and Add Image
            </button>
          </>
        )}
        <div className="flex flex-wrap gap-4">
          {deal.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Upload preview ${index + 1}`}
                className="h-24 w-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition duration-300"
              >
                <FaTimesCircle className="text-white" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-green-700 transition duration-300"
        >
          <FaPlus className="mr-2" />
          Add Best Deal
        </button>
      </form>
    </div>
  );
}

function getCroppedImg(imageSrc, pixelCrop) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = 'cropped.jpeg';
        const croppedImageUrl = window.URL.createObjectURL(blob);
        resolve(croppedImageUrl);
      }, 'image/jpeg');
    };
    image.onerror = (error) => reject(error);
  });
}

export default BestDealsAdd;