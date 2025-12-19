import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormField, StyledInput } from './shared/FormElement';
import { TagInput } from '../shared/TagInput';
import { Upload, Megaphone, Loader2, Archive, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { MediaPreview } from './shared/MediaPreview';
import { useCreatePost } from '@/hooks/api/use-feed';

const integratedSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(10, "Description is required"),
  stock: z.string().min(1, "Let us know how many stocks you have"),
  size: z.string().optional(),
  caption: z.string().optional(),
});

const UploadProductForm = () => {
  const { mutate: uploadProduct, isPending } = useCreatePost();
  const [makePost, setMakePost] = useState(false);
  const [media, setMedia] = useState<any[]>([]);

  // Tag States
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(integratedSchema),
    defaultValues: { caption: '' }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newMedia = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type
    }));
    setMedia([...media, ...newMedia]);
  };

  const onSubmit = async (data: any) => {
    if (media.length === 0) return toast.error("Product images are required");
    if (makePost && !data.caption) return toast.error("Caption is required for social post");

    // Construct the data to match backend: type PRODUCT
    const payload = {
      data: {
        type: 'PRODUCT',
        productName: data.name,
        price: Number(data.price),
        stock: Number(data.stock),
        description: data.description,
        size: data.size,
        category: 'General', // Default or add a field for this
        caption: data.caption,
        tags: tags,
        publishToFeed: makePost, // Flag to create the social post
      },
      files: media.map(m => m.file)
    };

    uploadProduct(payload, {
      onSuccess: () => {
        reset();
        setMedia([]);
        setTags([]);
        setMakePost(false);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* SECTION 1: Product Details */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-1 bg-orange-500 rounded-full" />
          <h3 className="font-black text-gray-900 uppercase tracking-wider text-sm">Product Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Product Name" error={errors.name?.message as string}>
            <StyledInput {...register('name')} placeholder="e.g. Vintage Denim Jacket" />
          </FormField>
          <FormField label="Price (₦)" error={errors.price?.message as string}>
            <StyledInput {...register('price')} type="number" placeholder="5000" />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Product Stock" error={errors.stock?.message as string}>
            <StyledInput {...register('stock')} type="number" placeholder="1" />
          </FormField>
          <FormField label="Product Size (optional)" error={errors.size?.message as string}>
            <StyledInput {...register('size')} placeholder="e.g. sm, lg, xlg, 42ft" />
          </FormField>
        </div>

        <FormField label="Product Description" error={errors.description?.message as string}>
          <textarea
            {...register('description')}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-[24px] h-32 resize-none outline-none focus:border-orange-500 transition-all text-sm"
            placeholder="Describe your product materials, size, etc."
          />
        </FormField>
      </div>

      {/* 2. MEDIA GALLEY */}
      <section>
        <label className="text-sm font-bold text-gray-700 ml-1">Product Media</label>
        <label className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-[28px] bg-gray-50/50 hover:bg-orange-50/50 hover:border-orange-200 cursor-pointer transition-all">
          <Upload className="w-6 h-6 text-gray-400 mb-1" />
          <span className="text-xs font-bold text-gray-500">Add Photos/Video</span>
          <input type="file" className="hidden" multiple onChange={handleFileChange} accept="image/*,video/*" />
        </label>
        <MediaPreview files={media} onRemove={(index) => setMedia(media.filter((_, i) => i !== index))} />
      </section>

      {/* SECTION 3: Transformation Toggle */}
      <div className={`p-6 rounded-[32px] border transition-all ${makePost ? 'bg-orange-50/50 border-orange-200' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${makePost ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Megaphone size={20} />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">Announce to Feed?</p>
              <p className="text-xs text-gray-500 font-medium">Create a social post automatically</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setMakePost(!makePost); }}
            className={`w-12 h-6 rounded-full transition-colors relative ${makePost ? 'bg-orange-500' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${makePost ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {makePost && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <FormField label="Post Caption (Required)" error={errors.caption?.message as string}>
              <textarea
                {...register('caption')}
                className="w-full p-4 bg-white border border-orange-200 rounded-2xl h-24 resize-none outline-none focus:ring-2 focus:ring-orange-500/20"
                placeholder="Write an catchy announcement for your followers..."
              />
            </FormField>
            <FormField label="Post Tags">
              <TagInput tags={tags} setTags={setTags} tagInput={tagInput} setTagInput={setTagInput} />
            </FormField>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-5 bg-gray-900 text-white rounded-[28px] font-black text-lg hover:bg-black flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:bg-gray-400 shadow-xl shadow-gray-200"
      >
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <span>{makePost ? "Upload & Share to Feed" : "Save Product Only"}</span>
            {makePost ? (
              <Sparkles size={20} className="text-orange-500" />
            ) : (
              <Archive size={20} className="text-gray-400" />
            )}
          </>
        )}
      </button>
    </form>
  );
};

export default UploadProductForm;