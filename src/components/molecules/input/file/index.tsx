'use client';

import { Image } from '@/components/atoms';
import { ImagePreviewModal } from '@/components/molecules/image-preview-modal';
import { cn } from '@/shared/utils';
import { AlertTriangle, FileText, Plus, Sparkles, Upload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Control } from 'react-hook-form';
import { toast } from 'sonner';

export interface UploadFile {
  name: string;
  base64: string;
}

export interface GlobalUploadProps {
  maxFiles?: number;
  maxSize?: number; // in bytes
  isDragDrop?: boolean;
  allowedTypes?: string[];
  value?: UploadFile[];
  onChange: (files: UploadFile[], rawFiles?: File[]) => void;
  errorMessage?: string;
  required?: boolean;
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>;
  isTouched?: boolean;
  capture?: 'environment' | 'user';
  disabled?: boolean;
  label?: string;
  className?: string;
  isReadingOcr?: boolean;
  dropzoneText?: string;
}

export const InputFile = ({
  maxFiles = 3,
  maxSize = 5 * 1024 * 1024, // 5MB
  isDragDrop = false,
  allowedTypes = ['.png', '.jpeg', '.jpg', '.pdf'],
  value = [],
  onChange,
  className,
  label,
  errorMessage,
  required,
  isTouched,
  capture,
  disabled,
  isReadingOcr,
  dropzoneText,
}: GlobalUploadProps) => {
  const isPdf = (src: string) => typeof src === 'string' && src.toLowerCase().includes('.pdf');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<{
    src: string;
    name: string;
  } | null>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        toast.error('Invalid file type', {
          description: `Allowed types: ${allowedTypes.join(', ')}`,
        });
        return false;
      }
      if (file.size > maxSize) {
        toast.error('File too large', {
          description: `Maximum size is ${maxSize / (1024 * 1024)}MB`,
        });
        return false;
      }
      return true;
    },
    [allowedTypes, maxSize],
  );

  const convertToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => {
        reject(new Error('Failed to convert file to base64'));
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const checkDuplicateFile = useCallback(
    (fileName: string, currentFiles: UploadFile[]): boolean => {
      return currentFiles.some((file) => file.name === fileName);
    },
    [],
  );

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const currentFiles = [...value];
      const remainingSlots = maxFiles - currentFiles.length;

      if (remainingSlots <= 0) {
        toast.error('Maximum files reached', {
          description: `You can only upload up to ${maxFiles} files`,
        });
        return;
      }

      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      // Check for duplicate files
      const duplicateFiles = filesToProcess.filter((file) =>
        checkDuplicateFile(file.name, currentFiles),
      );
      if (duplicateFiles.length > 0) {
        toast.error('Duplicate file detected', {
          description: `File "${duplicateFiles[0].name}" has already been uploaded`,
        });
        return;
      }

      const invalidFiles = filesToProcess.filter((file) => !validateFile(file));

      if (invalidFiles.length > 0) {
        return;
      }

      try {
        const base64Promises = filesToProcess.map(async (file) => {
          const base64 = await convertToBase64(file);
          return {
            name: file.name,
            base64,
          };
        });

        const newFiles = await Promise.all(base64Promises);
        const updatedFiles = [...currentFiles, ...newFiles];
        onChange(updatedFiles, filesToProcess);
      } catch (error) {
        toast.error('Upload failed', {
          description: error instanceof Error ? error.message : 'Failed to process files',
        });
      }
    },
    [value, maxFiles, onChange, checkDuplicateFile, validateFile, convertToBase64],
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDragDrop) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isDragDrop) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = value.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  // Variant A: Drag and Drop
  if (isDragDrop) {
    return (
      <div className={cn('w-full', className)}>
        {label && (
          <label className="text-md font-normal tracking-[0.4px]">
            {label}
            {required && <span className="text-danger-500">*</span>}
          </label>
        )}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={cn(
            'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
            label && 'mt-2',
            isDragging && !disabled
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 bg-gray-50',
            !disabled && 'hover:border-gray-400 hover:bg-gray-100 cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
            errorMessage && 'border-danger-500',
          )}
          style={{ minHeight: '200px', padding: '2rem' }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
            capture={capture}
            disabled={disabled}
          />
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <Upload className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 leading-relaxed max-w-[200px]">
                {dropzoneText || 'Drag and drop files here, or click to select'}
                {required && !label && <span className="text-danger-500 ml-1">*</span>}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Supported formats: {allowedTypes.join(', ')}
              </p>
              {maxFiles > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  Maximum {maxFiles} file{maxFiles > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          {value.length > 0 && (
            <div className="mt-4 w-full">
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {value.map((file, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square overflow-hidden rounded-md border border-gray-200 bg-gray-100 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage({ src: file.base64, name: file.name });
                    }}
                  >
                    {isPdf(file.base64) ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gray-50 text-gray-400">
                        <FileText className="h-8 w-8" />
                        <span className="text-[8px] uppercase font-bold px-1 text-center line-clamp-1">
                          {file.name}
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={file.base64}
                        alt={file.name}
                        className="h-full w-full object-cover"
                        height={100}
                        width={100}
                      />
                    )}
                    {!disabled && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(index);
                        }}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-danger-500 text-white transition-opacity group-hover:opacity-100 md:opacity-0 z-10"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {isReadingOcr && (
          <p className="mt-1 flex items-center gap-1 text-[10px] text-primary-500 animate-pulse">
            <Sparkles className="size-3" />
            Reading OCR...
          </p>
        )}
        {errorMessage && isTouched && (
          <p className="mt-1 flex items-center gap-1 text-sm text-danger-500">
            <AlertTriangle className="size-4 min-h-4 min-w-4 text-danger-500" />
            {errorMessage}
          </p>
        )}
        {previewImage && (
          <ImagePreviewModal
            open={!!previewImage}
            onOpenChange={(open) => {
              if (!open) setPreviewImage(null);
            }}
            imageSrc={previewImage.src}
            imageAlt={previewImage.name}
            imageName={previewImage.name}
          />
        )}
      </div>
    );
  }

  // Variant B: Square Thumbnail
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="text-md font-normal tracking-[0.4px]">
          {label}
          {required && <span className="text-danger-500">*</span>}
        </label>
      )}
      <div className={cn(label && 'mt-2', 'flex flex-wrap gap-4')}>
        {value.map((file, index) => (
          <div
            key={index}
            className="group relative h-[100px] w-[100px] overflow-hidden rounded-md border border-gray-200 bg-gray-100 cursor-pointer"
            onClick={() => {
              setPreviewImage({ src: file.base64, name: file.name });
            }}
          >
            {isPdf(file.base64) ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gray-50 text-gray-400">
                <FileText className="h-8 w-8" />
                <span className="text-[8px] uppercase font-bold px-1 text-center line-clamp-1">
                  {file.name}
                </span>
              </div>
            ) : (
              <Image
                src={file.base64}
                alt={file.name}
                className="h-full w-full object-cover"
                height={100}
                width={100}
              />
            )}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-danger-500 text-white transition-opacity group-hover:opacity-100 md:opacity-0 z-10"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        {value.length < maxFiles && !disabled && (
          <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={cn(
              'flex h-[100px] w-[100px] items-center justify-center rounded-md border-2 border-dashed transition-colors',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
              errorMessage
                ? 'border-danger-500 bg-danger-50 hover:border-danger-600'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100',
            )}
          >
            <Plus className="h-6 w-6 text-gray-500" />
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        capture={capture}
        disabled={disabled}
      />
      {isReadingOcr && (
        <p className="mt-1 flex items-center gap-1 text-[10px] text-primary-500 animate-pulse">
          <Sparkles className="size-3" />
          Reading OCR...
        </p>
      )}
      {errorMessage && isTouched && (
        <p className="mt-1 flex items-center gap-1 text-sm text-danger-500">
          <AlertTriangle className="size-4 min-h-4 min-w-4 text-danger-500" />
          {errorMessage}
        </p>
      )}
      {previewImage && (
        <ImagePreviewModal
          open={!!previewImage}
          onOpenChange={(open) => {
            if (!open) setPreviewImage(null);
          }}
          imageSrc={previewImage.src}
          imageAlt={previewImage.name}
          imageName={previewImage.name}
        />
      )}
    </div>
  );
};
