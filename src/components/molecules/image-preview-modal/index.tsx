'use client';

import { Button } from '@/components/atoms';
import { cn } from '@/shared/utils';
import { Minimize2, X, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export interface ImagePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  imageAlt?: string;
  imageName?: string;
}

export const ImagePreviewModal = ({
  open,
  onOpenChange,
  imageSrc,
  imageAlt = 'Preview',
  imageName,
}: ImagePreviewModalProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom and position when modal opens/closes
  useEffect(() => {
    if (open) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [open]);

  // Handle zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(5, scale + delta));
    setScale(newScale);
  };

  // Handle mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom functions
  const handleZoomIn = () => {
    setScale((prev) => Math.min(5, prev + 0.25));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.25));
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Constrain position when zoomed
  useEffect(() => {
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={(e) => {
        // Only close if clicking on the backdrop, not on the image
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onOpenChange(false);
        }
      }}
      tabIndex={-1}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange(false);
        }}
        className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        aria-label="Close preview"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Zoom Controls */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-gray-600 rounded-md p-1">
        <Button
          type="button"
          variant="transparent"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          disabled={scale <= 0.5}
          className="h-8 w-8 p-0 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs text-white px-2 min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <Button
          type="button"
          variant="transparent"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          disabled={scale >= 5}
          className="h-8 w-8 p-0 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        {scale > 1 && (
          <Button
            type="button"
            variant="transparent"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleResetZoom();
            }}
            className="h-8 w-8 p-0 text-white hover:bg-gray-700 ml-1"
            title="Reset zoom"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Image Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onClick={(e) => {
          e.stopPropagation();
          // Prevent closing parent modal
        }}
        onWheel={(e) => {
          e.stopPropagation();
          handleWheel(e);
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleMouseDown(e);
        }}
        onMouseMove={(e) => {
          e.stopPropagation();
          handleMouseMove(e);
        }}
        onMouseUp={(e) => {
          e.stopPropagation();
          handleMouseUp();
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          handleMouseUp();
        }}
      >
        <div
          ref={imageRef}
          className="relative transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            maxWidth: '100vw',
            maxHeight: '100vh',
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={2000}
            height={2000}
            className="max-w-[100vw] max-h-[100vh] object-contain"
            style={{ userSelect: 'none' }}
            draggable={false}
            priority
          />
        </div>

        {/* Zoom hint */}
        {scale === 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded pointer-events-none">
            Scroll to zoom • Click and drag when zoomed • Click outside to close
          </div>
        )}
      </div>
    </div>
  );
};
