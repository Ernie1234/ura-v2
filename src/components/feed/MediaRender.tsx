// src/components/feed/MediaRenderer.tsx
import React from 'react';

interface MediaRendererProps {
  url: string;
  className?: string;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({ url, className }) => {
  // Simple check for video extensions or Cloudinary resource type
  const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes('/video/upload/');

  if (isVideo) {
    return (
      <video 
        src={url} 
        controls 
        muted 
        className={`${className} bg-black`}
        playsInline
      />
    );
  }

  return (
    <img 
      src={url} 
      alt="Post content" 
      className={className} 
      loading="lazy"
    />
  );
};