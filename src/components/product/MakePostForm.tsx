import React, { useState, useCallback } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { useCreatePost } from '@/hooks/api/use-feed';
import { toast } from 'sonner';

const postInitialState = {
  caption: '',
};

const MakePostForm: React.FC = () => {
  // 1. State Management
  const [postData, setPostData] = useState(postInitialState);
  const [rawFiles, setRawFiles] = useState<File[]>([]); // For Cloudinary/Backend
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]); // For UI Previews

  const { mutate, isPending } = useCreatePost();

  // 2. Handlers
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostData(prev => ({ ...prev, caption: e.target.value }));
  }, []);

  const handleMediaSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Append new files to state
    setRawFiles(prev => [...prev, ...selectedFiles]);
    
    // Generate and append preview URLs
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setUploadedFiles(prev => [...prev, ...newPreviews]);
    
    // Reset input value so user can pick the same file again if they deleted it
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(uploadedFiles[index]);
    
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setRawFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!postData.caption.trim()) {
      return toast.error("Please add a caption to your post.");
    }
    if (rawFiles.length === 0) {
      return toast.error("Please select at least one image or video.");
    }

    const payload = {
      type: 'POST', // Specifically set to POST for the polymorphic backend
      caption: postData.caption,
    };

    mutate({ data: payload, files: rawFiles }, {
      onSuccess: () => {
        // Reset form on success
        setPostData(postInitialState);
        setRawFiles([]);
        uploadedFiles.forEach(url => URL.revokeObjectURL(url));
        setUploadedFiles([]);
        toast.success("Post shared successfully!");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 lg:px-0">
      
      {/* Upload Area */}
      <div 
        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/30 transition-all mb-6"
        onClick={() => !isPending && document.getElementById('media-upload-input')?.click()}
      >
        <Camera className="w-10 h-10 mx-auto text-gray-400 mb-2" />
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
      {uploadedFiles.length > 0 && (
        <div className="flex space-x-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {uploadedFiles.map((src, index) => (
            <div key={src} className="flex-shrink-0 relative w-24 h-24 rounded-lg border border-gray-200 shadow-sm"> 
              <img 
                src={src} 
                alt={`Upload preview ${index + 1}`} 
                className="w-full h-full object-cover rounded-lg overflow-hidden" 
              />
              <button
                type="button"
                disabled={isPending}
                onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors z-10" 
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Caption Input */}
      <div className="mb-8">
        <label htmlFor="caption" className="block text-gray-700 font-medium text-sm mb-2">Add Caption</label>
        <textarea
          id="caption"
          name="caption"
          placeholder="Write something about this new post..."
          value={postData.caption}
          onChange={handleChange}
          rows={4}
          disabled={isPending}
          className="w-full p-3 border border-gray-300 rounded-xl text-base resize-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none disabled:bg-gray-50 transition-all"
        />
      </div>

      {/* Submit Button */}
      <button 
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl text-lg hover:bg-orange-600 disabled:bg-gray-300 transition-all flex justify-center items-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            <span>Posting...</span>
          </>
        ) : (
          "Share Post"
        )}
      </button>
    </form>
  );
};

export default MakePostForm;