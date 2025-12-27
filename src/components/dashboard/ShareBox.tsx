import { useState, useRef, useEffect } from 'react';
import { ImageIcon, Video, Tag, SendHorizonal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreatePost } from '@/hooks/api/use-feed';
import { useAuthContext } from '@/context/auth-provider';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TagInput } from '../shared/TagInput';
import { cn } from '@/lib/utils';

const ShareBox = () => {
  const { user } = useAuthContext();
  const { mutate, isPending } = useCreatePost();

  const [content, setContent] = useState('');
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  // Determine if the selected file is a video
  const isVideo = rawFiles[0]?.type.startsWith('video/');

  // Cleanup preview URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRawFiles([file]);
      // Revoke old URL if it exists
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePost = () => {
    if (!content.trim() && rawFiles.length === 0) return;
    mutate({ 
      data: { type: 'POST', caption: content, tags }, 
      files: rawFiles 
    }, {
      onSuccess: () => {
        setContent(''); setRawFiles([]); setPreviewUrl(null);
        setTags([]); setShowTagInput(false);
      }
    });
  };

  return (
    <div className="rounded-[28px] bg-white/40 backdrop-blur-xl p-4 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full">
      <div className="flex flex-col gap-4">
        
        {/* Top Row: Avatar + Input + Send */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0 border-2 border-white/80 shadow-sm">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback className="bg-[#f97316] text-white font-bold text-xs">
              {user?.firstName?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 flex items-center gap-2">
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="h-11 rounded-2xl bg-white/40 border-white/20 text-[14px] font-medium placeholder:text-gray-400 focus-visible:ring-[#f97316]/30 focus-visible:border-[#f97316]/50 transition-all"
            />
            
            <Button
              onClick={handlePost}
              disabled={isPending || (!content.trim() && rawFiles.length === 0)}
              className="h-11 w-11 rounded-2xl bg-gray-950 hover:bg-black text-white shrink-0 shadow-lg shadow-gray-200 active:scale-90 transition-all flex items-center justify-center"
            >
              <SendHorizonal size={18} strokeWidth={2.5} />
            </Button>
          </div>
        </div>

        {/* Preview Area - Handles Image and Video */}
        {previewUrl && (
          <div className="relative rounded-2xl overflow-hidden border border-white/40 bg-black/5 group">
            <button
              onClick={() => { setRawFiles([]); setPreviewUrl(null); }}
              className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full text-white z-20 hover:bg-black transition-colors"
            >
              <X size={14} />
            </button>

            {isVideo ? (
              <video 
                src={previewUrl} 
                className="w-full max-h-80 object-contain bg-black" 
                controls
                autoPlay
                muted
              />
            ) : (
              <img 
                src={previewUrl} 
                className="w-full object-cover max-h-80" 
                alt="preview" 
              />
            )}
          </div>
        )}

        {/* Tagging Area */}
        {showTagInput && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <TagInput 
              tags={tags} setTags={setTags} 
              tagInput={tagInput} setTagInput={setTagInput} 
            />
          </div>
        )}

        {/* Bottom Tool Row */}
        <div className="flex items-center gap-6 px-1 pt-1">
          <input 
            type="file" hidden ref={fileInputRef} 
            accept="image/*,video/*" 
            onChange={handleFileChange} 
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500 hover:text-[#f97316] transition-colors"
          >
            <ImageIcon size={18} className="text-[#f97316]" />
            <span className="hidden xs:inline">Image</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500 hover:text-[#f97316] transition-colors"
          >
            <Video size={18} className="text-red-400" />
            <span className="hidden xs:inline">Video</span>
          </button>

          <button
            onClick={() => setShowTagInput(!showTagInput)}
            className={cn(
              "flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors",
              showTagInput ? 'text-[#f97316]' : 'text-gray-500 hover:text-[#f97316]'
            )}
          >
            <Tag size={18} className={showTagInput ? "text-[#f97316]" : "text-blue-400"} />
            <span className="hidden xs:inline">Tag</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareBox;