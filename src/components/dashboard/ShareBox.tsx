// src/components/dashboard/ShareBox.tsx
import { useState, useRef } from 'react';
import { ImageIcon, Video, Tag, SendHorizonal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreatePost } from '@/hooks/api/use-feed';
import { useAuthContext } from '@/context/auth-provider';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TagInput } from '../shared/TagInput';

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setRawFiles([file]); // Match payload structure
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handlePost = () => {
        if (!content.trim() && rawFiles.length === 0) return;

        const payload = {
            type: 'POST',
            caption: content,
            tags: tags, // Adding the tags to the payload
        };

        mutate({ data: payload, files: rawFiles }, {
            onSuccess: () => {
                setContent('');
                setRawFiles([]);
                setPreviewUrl(null);
                setTags([]);
                setShowTagInput(false);
            }
        });
    };

    return (
        <div className="rounded-xl bg-white p-3 md:p-4 shadow-sm border border-gray-100 w-full">
            <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback className="bg-orange-500 text-white">
                        {user?.firstName?.[0]}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center gap-2 w-full">
                        <Input
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share something..."
                            className="flex-1 rounded-full bg-[#FFF3E8]/50 border-none text-sm focus-visible:ring-1 focus-visible:ring-orange-200 h-10 md:h-11"
                        />
                        <Button
                            onClick={handlePost}
                            disabled={isPending || (!content.trim() && rawFiles.length === 0)}
                            className="rounded-full bg-orange-500 hover:bg-orange-600 h-10 w-10 shrink-0"
                        >
                            <SendHorizonal size={18} />
                        </Button>
                    </div>

                    {previewUrl && (
                        <div className="relative mt-2 w-full max-h-52 overflow-hidden rounded-lg border border-gray-100">
                            <button
                                onClick={() => { setRawFiles([]); setPreviewUrl(null); }}
                                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white z-10"
                            >
                                <X size={14} />
                            </button>
                            <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                        </div>
                    )}

                    {showTagInput && (
                        <div className="pt-1">
                            <TagInput 
                                tags={tags} 
                                setTags={setTags} 
                                tagInput={tagInput} 
                                setTagInput={setTagInput} 
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-50 overflow-x-auto no-scrollbar">
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1.5 text-[12px] md:text-[13px] font-medium text-gray-500 hover:text-orange-600 shrink-0"
                        >
                            <ImageIcon size={18} className="text-orange-500" /> Image
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1.5 text-[12px] md:text-[13px] font-medium text-gray-500 hover:text-orange-600 shrink-0"
                        >
                            <Video size={18} className="text-red-500" /> Video
                        </button>
                        <button
                            onClick={() => setShowTagInput(!showTagInput)}
                            className={`flex items-center gap-1.5 text-[12px] md:text-[13px] font-medium shrink-0 ${showTagInput ? 'text-blue-600' : 'text-gray-500'}`}
                        >
                            <Tag size={18} className="text-blue-500" /> Tag
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareBox;