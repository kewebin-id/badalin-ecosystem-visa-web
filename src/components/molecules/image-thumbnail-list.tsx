'use client';

import { Image } from '@/components/atoms';
import { Eye } from 'lucide-react';

interface ImageThumbnailListProps {
  images: string[];
  onPreview: (image: { src: string; alt: string }) => void;
  altPrefix?: string;
  className?: string;
}

export const ImageThumbnailList = ({
  images,
  onPreview,
  altPrefix = 'Image',
  className = '',
}: ImageThumbnailListProps) => {
  if (!images || images.length === 0) return null;

  return (
    <div className={`mt-2 flex flex-wrap gap-2 ${className}`}>
      {images.map((url, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPreview({ src: url, alt: `${altPrefix} ${i + 1}` })}
          className="relative h-12 w-12 rounded-lg border border-gray-200 overflow-hidden hover:opacity-80 transition-opacity group cursor-pointer"
        >
          <Image
            src={url}
            alt={`${altPrefix} ${i + 1}`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Eye className="h-4 w-4 text-white" />
          </div>
        </button>
      ))}
    </div>
  );
};
