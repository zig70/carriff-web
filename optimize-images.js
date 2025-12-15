import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// CONFIGURATION
const ASSETS_DIR = './src/assets'; // Update this if your assets path is different
const QUALITY = 80; // WebP quality (0-100)

async function processDirectory(directory) {
  // Ensure the directory exists before reading
  if (!fs.existsSync(directory)) {
    console.error(`❌ Directory not found: ${directory}`);
    return;
  }

  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively process subdirectories
      await processDirectory(filePath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        await convertToWebP(filePath, file, ext);
      }
    }
  }
}

async function convertToWebP(filePath, fileName, ext) {
  const outputFileName = fileName.replace(ext, '.webp');
  const outputPath = path.join(path.dirname(filePath), outputFileName);

  // Skip if WebP version already exists
  if (fs.existsSync(outputPath)) {
    console.log(`Skipping: ${outputFileName} (already exists)`);
    return;
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Resize massive images if they are wider than 1920px
    if (metadata.width > 1920) {
        image.resize({ width: 1920 });
    }

    await image
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    // Calculate savings
    const originalSize = fs.statSync(filePath).size;
    const newSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(2);

    console.log(`✅ Converted: ${fileName} -> ${outputFileName} | Saved ${savings}%`);
    
  } catch (err) {
    console.error(`❌ Error converting ${fileName}:`, err);
  }
}

console.log('🚀 Starting image optimization...');
processDirectory(ASSETS_DIR).then(() => {
  console.log('✨ Optimization complete!');
});