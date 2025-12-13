// src/components/MakePostForm.tsx (Revisions for controlled inputs and file handling)
import React, { useState, useCallback } from 'react';
import { Camera, X } from 'lucide-react'; // Added X icon

const postInitialState = {
  caption: '',
};

const MakePostForm: React.FC = () => {
  const [postData, setPostData] = useState(postInitialState);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]); 

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostData(prev => ({ ...prev, caption: e.target.value }));
  }, []);

  const handleMediaSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Post Submitted:', postData, uploadedFiles);
    // Cleanup: uploadedFiles.forEach(url => URL.revokeObjectURL(url));
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 lg:px-0">
      
      {/* Select Media/Video Area */}
      <div 
        className="w-full border-2 border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 transition-colors mb-6"
        onClick={() => document.getElementById('media-upload-input')?.click()}
      >
        <Camera className="w-10 h-10 mx-auto text-gray-500 mb-2" />
        <p className="font-semibold text-gray-800">Select Media / Video</p>
        <p className="text-sm text-gray-500 mt-1">Maximum upload file size: 200mb</p>
        <input 
          id="media-upload-input"
          type="file" 
          multiple 
          hidden 
          onChange={handleMediaSelection} 
          accept="image/*,video/*"
        />
      </div>

      {/* Uploaded Files Preview (Thumbnails) */}
      <div className="flex space-x-3 mb-6 overflow-x-auto pb-1">
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

      {/* Caption Input */}
      <div className="mb-8">
        <label htmlFor="caption" className="block text-gray-700 font-medium text-sm mb-2">Add Caption</label>
        <textarea
          id="caption"
          name="caption"
          placeholder="Write something about this new post"
          value={postData.caption}
          onChange={handleChange}
          rows={3}
          className="w-full p-2.5 border border-gray-300 rounded-lg text-base resize-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
        />
      </div>

      {/* Post Button */}
      <button 
        type="submit"
        className="w-full py-2.5 bg-orange-500 text-white font-bold rounded-lg text-lg hover:bg-orange-600 transition-colors"
      >
        Post
      </button>
    </form>
  );
};

export default MakePostForm;