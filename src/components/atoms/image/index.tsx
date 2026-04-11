'use client';

import classNames from 'clsx';
import NextImage, { ImageProps } from 'next/image';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { ImageCompProps } from './image';

const defaultImage = '/assets/images/placeholder.webp';

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f0f0f0" offset="20%" />
      <stop stop-color="#e0e0e0" offset="50%" />
      <stop stop-color="#f0f0f0" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f0f0f0" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

const skeleton = `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`;

export const Image: FC<ImageCompProps & ImageProps> = ({
  alt,
  height,
  src,
  width,
  onClick,
  placeholder = 'blur',
  className,
  useBaseUrl,
  priority,
  errorImage,
  errorClassName,
  ...props
}) => {
  const [image, setImage] = useState<string>();
  const [errClassName, setErrClassName] = useState<string>();

  useEffect(() => {
    if (src) {
      setImage(useBaseUrl ? `${process.env.CDN_URL}/${src}` : src);
    } else {
      setImage(errorImage || defaultImage);
      setErrClassName(errorClassName || '!p-3 !object-contain');
    }
    // eslint-disable-next-line
  }, [src, useBaseUrl, errorImage]);

  const handleError = (event?: SyntheticEvent<HTMLImageElement, Event>) => {
    if (event) {
      setImage(errorImage || defaultImage);
      setErrClassName(errorClassName || '!p-3 !object-contain');
    }
  };

  return (
    <NextImage
      {...props}
      src={image || (!errClassName ? skeleton : defaultImage)}
      blurDataURL={skeleton}
      placeholder={placeholder}
      alt={alt}
      height={height}
      width={width}
      className={classNames([className, onClick && 'cursor-pointer', errClassName])}
      onClick={onClick}
      onError={handleError}
      priority={priority}
    />
  );
};
