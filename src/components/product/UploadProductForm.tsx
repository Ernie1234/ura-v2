// src/components/UploadProductForm.tsx
import React, { useState, useEffect, useCallback, memo } from 'react'; // Added memo
import { mockApi } from '@/services/mockApi';
import type { ProductCategory } from '@/types/product';
import { Upload, X } from 'lucide-react'; 

// --- Helper Components Defined OUTSIDE to Prevent Re-Renders ---

interface InputFieldProps {
  label: string; 
  name: string; // Use string for general props
  value: string; // Receive value as prop
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; // Receive stable handler
  placeholder?: string;
}

// src/components/UploadProductForm.tsx

// Updated Prop Definition for InputField
interface InputFieldProps {
  label: string; 
  name: string; 
  value: string;
  // Use the full generic type here to match the type of the 'handleChange' function
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; 
  placeholder?: string;
}

const InputField = memo<InputFieldProps>(({ label, name, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-700 font-medium text-sm mb-1">{label}</label>
    <input
      id={name}
      type="text"
      name={name}
      value={value}
      // Cast the handler down to the element type actually being rendered here
      onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void} 
      placeholder={placeholder}
      className="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" 
    />
  </div>
));
// ... (The same fix applies to TextareaField)
InputField.displayName = 'InputField';

interface TextareaFieldProps {
  label: string; 
  name: string; 
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows: number;
}

const TextareaField = memo<TextareaFieldProps>(({ label, name, value, onChange, rows }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-700 font-medium text-sm mb-1">{label}</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void} // Cast for type compatibility
      rows={rows}
      className="w-full p-2.5 border border-gray-300 rounded-lg text-base resize-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
    />
  </div>
));
TextareaField.displayName = 'TextareaField';

// --- Main Component ---

const productInitialState = {
  name: 'Black Vintage Shirt',
  category: 'Clothing',
  description: 'Made from soft, breathable fabric, it pairs perfectly with jeans or layered under a jacket for a bold, minimalist look.',
  pricing: '5000',
  stock: '100',
  size: 'XL',
  productCaption: '',
};

type FormKeys = keyof typeof productInitialState;


const UploadProductForm: React.FC = () => {
  const [formData, setFormData] = useState(productInitialState);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]); 

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await mockApi.get('categories'); 
      if (data) setCategories(data as ProductCategory[]);
    };
    fetchCategories();
  }, []);

  // Handler must be stable (useCallback)
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
        const newFiles: string[] = [];
        for (let i = 0; i < files.length; i++) {
            newFiles.push(URL.createObjectURL(files[i]));
        }
        setUploadedFiles(prev => [...prev, ...newFiles]);
        e.target.value = ''; 
    }
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(uploadedFiles[index]); 
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };


  const FormControls = () => (
    <div className="lg:w-full lg:p-6 lg:border lg:rounded-lg lg:bg-white lg:shadow-sm">
      <h3 className="font-bold text-lg mb-4 text-gray-700">Product Image / Video</h3>
      
      {/* ... (Drag & Drop Area) ... */}
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 transition-colors mb-4"
        onClick={() => document.getElementById('file-upload-input')?.click()}
      >
        <Upload className="w-8 h-8 mx-auto text-gray-500 mb-2" />
        <p className="text-gray-700 font-semibold mb-1">Drop files to upload</p>
        <p className="text-gray-500 mb-2">or</p>
        <button type="button" className="text-orange-500 font-medium hover:text-orange-600">
          Select photos/video
        </button>
        <p className="text-xs text-gray-400 mt-2">Maximum upload file size: 200mb</p>
        <input 
          id="file-upload-input"
          type="file" 
          multiple 
          hidden 
          onChange={handleFileUpload}
          accept="image/*,video/*"
        />
      </div>


      {/* Uploaded Files Preview (Thumbnails) */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-1">
        {uploadedFiles.map((src, index) => (
        // For UploadProductForm.tsx
        <div key={index} className="flex-shrink-0 relative w-20 h-20 rounded-lg border border-gray-300"> 
            {/* Image now has rounded corners and overflow hidden */}
            <img 
            src={src} 
            alt={`Upload preview ${index + 1}`} 
            className="w-full h-full object-cover rounded-lg overflow-hidden" 
            />
            {/* FIX: Button is now visible outside the image boundaries */}
            <button
            type="button"
            onClick={() => handleRemoveFile(index)}
            className="absolute top-0 right-0 transform -translate-y-1 translate-x-1 bg-red-500 text-white rounded-full p-0.5 text-xs hover:bg-red-600 z-10" 
            >
            <X className="w-3 h-3" />
            </button>
        </div>
        ))}
      </div>

      {/* Caption/Post Area */}
      <TextareaField label="Add Caption" name="productCaption" value={formData.productCaption} onChange={handleChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void} rows={3} />


      {/* Upload Button */}
      <button 
        type="submit"
        className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
      >
        Upload Product
      </button>
    </div>
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); console.log('Final Data:', formData, uploadedFiles); }} className="px-4 lg:px-0">
      <h2 className="text-xl font-bold mb-6 text-gray-900 hidden lg:block">Upload and manage your products</h2>
      
      {/* Desktop Layout: 2 Columns */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        
        {/* Left Column: Product Details */}
        <div className="lg:order-1">
            <InputField 
                label="Name of Product" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                />

          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 font-medium text-sm mb-1">Product Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-base appearance-none bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <TextareaField label="Description" name="description" value={formData.description} onChange={handleChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void} rows={4} />

          <InputField 
            label="Pricing" 
            name="pricing" 
            value={formData.pricing} 
            onChange={handleChange} 
            placeholder="₦0.00" />
          <InputField label="Available Stock" name="stock" value={formData.stock} onChange={handleChange} placeholder="100" />
          <InputField label="Size" name="size" value={formData.size} onChange={handleChange} placeholder="XL" />
        </div>

        {/* Right Column: Upload Controls */}
        <div className="mt-8 lg:mt-0 lg:order-2">
          <FormControls />
        </div>
      </div>
    </form>
  );
};

export default UploadProductForm;