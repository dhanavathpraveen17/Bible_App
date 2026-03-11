const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, 'public');

if (!fs.existsSync(publicDir)) {
  console.error('Public directory not found');
  process.exit(1);
}

const inputPath = path.join(publicDir, 'favicon.png');

async function resizeFavicon() {
  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(`Original favicon size: ${metadata.width}x${metadata.height}`);
    
    // Create larger icons with cover fit (fills the entire space)
    const sizes = [
      { name: 'favicon-192.png', size: 192 },
      { name: 'favicon-512.png', size: 512 },
      { name: 'favicon-1024.png', size: 1024 },
      { name: 'favicon-2048.png', size: 2048 },
      { name: 'favicon-4096.png', size: 4096 }  // Even larger
    ];
    
    for (const s of sizes) {
      const outputPath = path.join(publicDir, s.name);
      await sharp(inputPath)
        .resize(s.size, s.size, {
          fit: 'cover',  // Fill the entire space
          position: 'center'
        })
        .png()
        .toFile(outputPath);
      console.log(`Created: ${outputPath} (${s.size}x${s.size}) with cover fit`);
    }
    
    // Update main favicon to 4096 for maximum size
    const mainOutput = path.join(publicDir, 'favicon-main.png');
    await sharp(inputPath)
      .resize(4096, 4096, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(mainOutput);
    console.log(`Created: ${mainOutput} (4096x4096)`);
    
  } catch (error) {
    console.error('Error resizing favicon:', error);
    process.exit(1);
  }
}

resizeFavicon();

