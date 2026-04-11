import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const convertToWebp = async (
  inputPath: string,
  outputDir: string,
  quality: number = 80,
): Promise<string> => {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const fileName = `${path.parse(inputPath).name}.webp`;
  const outputPath = path.join(outputDir, fileName);

  await sharp(inputPath)
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath);

  return outputPath;
};
