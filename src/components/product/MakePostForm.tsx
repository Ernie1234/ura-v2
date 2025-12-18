// src/components/dashboard/MakePostForm.tsx
import React, { useState, useCallback } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { useCreatePost } from '@/hooks/api/use-feed';
import { toast } from 'sonner';
import { TagInput } from '../shared/TagInput';

const postInitialState = {
  caption: '',
};

const MakePostForm: React.FC = () => {
  const [postData, setPostData] = useState(postInitialState);
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  
  // Tag States
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const { mutate, isPending } = useCreatePost();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostData(prev => ({ ...prev, caption: e.target.value }));
  }, []);

  const handleMediaSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!postData.caption.trim()) {
      return toast.error("Please add a caption to your post.");
    }
    if (rawFiles.length === 0) {
      return toast.error("Please select at least one image or video.");
    }

    // 🚨 Updated Payload to include Tags
    const payload = {
      type: 'POST',
      caption: postData.caption,
      tags: tags, 
    };

    mutate({ data: payload, files: rawFiles }, {
      onSuccess: () => {
        setPostData(postInitialState);
        setRawFiles([]);
        setTags([]);
        uploadedFiles.forEach(url => URL.revokeObjectURL(url));
        setUploadedFiles([]);
        toast.success("Post shared successfully!");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 lg:px-0 max-w-2xl mx-auto overflow-hidden">
      <div 
        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/30 transition-all mb-6"
        onClick={() => !isPending && document.getElementById('media-upload-input')?.click()}
      >
        <Camera className="w-10 h-10 mx-auto text-gray-400 mb-2" />
        <p className="font-semibold text-gray-800">Select Media / Video</p>
        <p className="text-xs text-gray-500 mt-1">Maximum upload file size: 200mb</p>
        <input 
          id="media-upload-input"
          type="file" 
          multiple 
          hidden 
          onChange={handleMediaSelection} 
          accept="image/*,video/*"
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="flex space-x-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {uploadedFiles.map((src, index) => (
            <div key={src} className="flex-shrink-0 relative w-20 h-20 md:w-24 md:h-24 rounded-lg border border-gray-200"> 
              <img src={src} className="w-full h-full object-cover rounded-lg" alt="preview" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-gray-700 font-medium text-sm mb-2">Add Caption</label>
        <textarea
          placeholder="Write something about this new post..."
          value={postData.caption}
          onChange={handleChange}
          rows={3}
          className="w-full p-3 border border-gray-200 rounded-xl text-sm md:text-base resize-none focus:border-orange-500 outline-none transition-all"
        />
      </div>

      {/* 🚨 Tag Section Implementation */}
      <div className="mb-8">
        <label className="block text-gray-700 font-medium text-sm mb-2">Tags</label>
        <TagInput 
            tags={tags} 
            setTags={setTags} 
            tagInput={tagInput} 
            setTagInput={setTagInput} 
            placeholder="Add relevant tags (e.g. food, tech, promo)..."
        />
      </div>

      <button 
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl text-lg hover:bg-orange-600 disabled:bg-gray-300 transition-all flex justify-center items-center gap-2"
      >
        {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : "Share Post"}
      </button>
    </form>
  );
};

export default MakePostForm;