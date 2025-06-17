import fs from 'fs';
import path from 'path';

export function dbinit(targetPath) {
  try {
    console.log(`Ensuring database directory exists at: ${targetPath}`);
    if (!fs.existsSync(targetPath)) {
      console.log(`Creating database directory: ${targetPath}`);
      fs.mkdirSync(targetPath, { recursive: true });
      
      // Verify creation
      if (!fs.existsSync(targetPath)) {
        throw new Error(`Failed to create directory: ${targetPath}`);
      }
      console.log('Directory created successfully');
    } else {
      console.log('Directory already exists');
    }
  } catch (err) {
    console.error('Directory creation failed:', err);
    throw err;
  }
}