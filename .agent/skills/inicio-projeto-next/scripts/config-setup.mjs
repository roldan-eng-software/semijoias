import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();

// 1. Configure Tailwind
const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.ts');
const tailwindConfigJsPath = path.join(projectRoot, 'tailwind.config.js');

const tailwindFile = fs.existsSync(tailwindConfigPath) ? tailwindConfigPath : 
                   fs.existsSync(tailwindConfigJsPath) ? tailwindConfigJsPath : null;

if (tailwindFile) {
  let content = fs.readFileSync(tailwindFile, 'utf8');
  
  // Replace plugins: [] with plugins: [require("daisyui")]
  if (!content.includes('daisyui')) {
    content = content.replace(/plugins: \[([^\]]*)]/, 'plugins: [$1, require("daisyui")]');
    // Add daisyui config at the end of the object
    content = content.replace(/export default config;/, 'config.daisyui = { themes: ["light", "dark", "cupcake"] };\nexport default config;');
  }
  
  fs.writeFileSync(tailwindFile, content);
  console.log('✅ Tailwind configured with DaisyUI');
}

// 2. Clear and set globals.css
const globalsCssPath = path.join(projectRoot, 'src/app/globals.css');
if (fs.existsSync(globalsCssPath)) {
  const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
}
`;
  fs.writeFileSync(globalsCssPath, cssContent);
  console.log('✅ globals.css updated');
}

// 3. Simple layout update for theme-change
const layoutPath = path.join(projectRoot, 'src/app/layout.tsx');
if (fs.existsSync(layoutPath)) {
  let content = fs.readFileSync(layoutPath, 'utf8');
  // Add data-theme to html tag
  content = content.replace(/<html lang="en">/, '<html lang="pt-br" data-theme="light">');
  fs.writeFileSync(layoutPath, content);
  console.log('✅ layout.tsx updated with data-theme');
}

console.log('🚀 Base configurations completed successfully!');
