// scripts/generateImageMap.js
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../assets/images');
const files = fs.readdirSync(imagesDir).filter(file => file.endsWith('_thumbnail.png') || file.endsWith('.jpg'));

const imageMap = files.reduce((acc, file) => {
  const key = file;
  const requirePath = `require('../../assets/images/${file}')`;
  acc[key] = requirePath;
  return acc;
}, {});

const output = `// Auto-generated image mapping
export const imageMap: { [key: string]: any } = {
${Object.entries(imageMap).map(([key, value]) => `  '${key}': ${value},`).join('\n')}
};`;

fs.writeFileSync(path.join(__dirname, '../components/ExerciseList/imageMap.ts'), output);
console.log('Image mapping generated!');