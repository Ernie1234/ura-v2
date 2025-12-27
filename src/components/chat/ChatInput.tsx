import { Camera, Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { uploadImageToCloudinary } from '@/services/cloudinary.service';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onSendMedia: (data: any) => void;
  onTyping: () => void;
}

export const ChatInput = ({ onSendMessage, onSendMedia, onTyping }: ChatInputProps) => {
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onSendMedia({ url, type: file.type.startsWith('video') ? 'video' : 'image', fileName: file.name });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-100">
      <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200/50">
        <input type="file" id="chat-file" hidden onChange={handleFile} />
        <label htmlFor="chat-file" className="cursor-pointer text-gray-400 hover:text-orange-600 transition-colors">
          {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
        </label>
        <Input 
          value={text}
          onChange={(e) => { setText(e.target.value); onTyping(); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Message..."
          className="bg-transparent border-none focus-visible:ring-0 text-gray-800 flex-1"
        />
        <Button 
          onClick={handleSend}
          disabled={!text.trim() && !isUploading}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl h-9 w-9 p-0"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
};