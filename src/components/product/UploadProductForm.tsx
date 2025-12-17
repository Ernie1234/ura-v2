import React, { useState, useEffect, useCallback, memo } from 'react';
import { mockApi } from '@/services/mockApi';
import type { ProductCategory } from '@/types/product';
import { Upload, X, Loader2 } from 'lucide-react'; 
import { useCreatePost } from '@/hooks/api/use-feed';
import { toast } from 'sonner';

// 1. Define the Initial State (Empty)
const productInitialState = {
  name: '',
  category: '',
  description: '',
  pricing: '',
  stock: '',
  size: '',
  productCaption: '',
};

const UploadProductForm: React.FC = () => {
  // 2. State Hooks
  const [formData, setFormData] = useState(productInitialState);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]); 
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]); 

  const { mutate, isPending } = useCreatePost();

  // 3. Fetch Categories & Set Default
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await mockApi.get('categories'); 
      if (data) {
        const cats = data as ProductCategory[];
        setCategories(cats);
        if (cats.length > 0) {
          setFormData(prev => ({ ...prev, category: cats[0].name }));
        }
      }
    };
    fetchCategories();
  }, []);

  // 4. Handlers
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setRawFiles(prev => [...prev, ...selectedFiles]); 
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setUploadedFiles(prev => [...prev, ...newPreviews]); 
    e.target.value = ''; 
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(uploadedFiles[index]);
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setRawFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.pricing) {
      return toast.error("Product name and price are required.");
    }
    if (rawFiles.length === 0) {
      return toast.error("Please upload at least one image.");
    }

    const payload = {
      type: 'PRODUCT',
      productName: formData.name,
      category: formData.category,
      description: formData.description,
      price: Number(formData.pricing),
      stock: Number(formData.stock),
      size: formData.size,
      caption: formData.productCaption || `New arrival: ${formData.name}`,
    };

    mutate({ data: payload, files: rawFiles }, {
      onSuccess: () => {
        setFormData(productInitialState);
        setRawFiles([]);
        uploadedFiles.forEach(url => URL.revokeObjectURL(url));
        setUploadedFiles([]);
        toast.success("Product uploaded successfully!");
      }
    });
  };

  return (
    <form onSubmit={handleFinalSubmit} className="px-4 lg:px-0 pb-10">
      <h2 className="text-xl font-bold mb-6 text-gray-900 hidden lg:block">Add New Product</h2>
      
      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          <InputField 
            label="Product Name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="e.g. Vintage Leather Bag" 
          />

          <div>
            <label className="block text-gray-700 font-medium text-sm mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-base bg-white focus:ring-1 focus:ring-orange-500 outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <TextareaField 
            label="Description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows={4} 
            placeholder="Tell us about the materials, quality, etc."
          />
          
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Price (₦)" name="pricing" value={formData.pricing} onChange={handleChange} placeholder="0" />
            <InputField label="Stock" name="stock" value={formData.stock} onChange={handleChange} placeholder="1" />
          </div>
          
          <InputField label="Size (Optional)" name="size" value={formData.size} onChange={handleChange} placeholder="M, L, XL or 42, 44" />
        </div>

        {/* RIGHT COLUMN */}
        <div className="mt-8 lg:mt-0">
          <div className="lg:p-6 lg:border lg:rounded-lg lg:bg-white lg:shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-gray-700">Product Media</h3>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 transition-colors mb-4"
              onClick={() => document.getElementById('file-upload-input')?.click()}
            >
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">Click to upload images/video</p>
              <input 
                id="file-upload-input"
                type="file" 
                multiple 
                hidden 
                onChange={handleFileUpload}
                accept="image/*,video/*"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {uploadedFiles.map((src, index) => (
                <div key={src} className="relative w-20 h-20 rounded-lg border overflow-hidden"> 
                  <img src={src} className="w-full h-full object-cover" alt="Preview" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <TextareaField 
              label="Post Caption" 
              name="productCaption" 
              value={formData.productCaption} 
              onChange={handleChange} 
              rows={3} 
              placeholder="What should followers see in their feed?"
            />

            <button 
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 disabled:bg-gray-300 transition-all flex justify-center items-center gap-2"
            >
              {isPending ? <Loader2 className="animate-spin" /> : 'Publish Product'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

// --- Missing Helper Components (Defined here to ensure scope availability) ---

interface InputFieldProps {
  label: string; 
  name: string; 
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputField = memo<InputFieldProps>(({ label, name, value, onChange, placeholder }) => (
  <div className="mb-2">
    <label className="block text-gray-700 font-medium text-sm mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2.5 border border-gray-300 rounded-lg text-base focus:ring-1 focus:ring-orange-500 outline-none" 
    />
  </div>
));

interface TextareaFieldProps {
  label: string; 
  name: string; 
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows: number;
  placeholder?: string;
}

const TextareaField = memo<TextareaFieldProps>(({ label, name, value, onChange, rows, placeholder }) => (
  <div className="mb-2">
    <label className="block text-gray-700 font-medium text-sm mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className="w-full p-2.5 border border-gray-300 rounded-lg text-base resize-none focus:ring-1 focus:ring-orange-500 outline-none"
    />
  </div>
));

export default UploadProductForm;