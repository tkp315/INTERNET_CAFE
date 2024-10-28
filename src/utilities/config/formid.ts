import formidable, { Fields, Files, File } from 'formidable';
import path from 'path';
import fs from 'fs';
import { NextApiRequest } from 'next';
// Define the upload directory
const uploadDir: string = path.join('/public/uploads');

// Ensure that the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define the formidable configuration with types
export const formidableConfig: formidable.Options = {
  uploadDir, // Where files will be stored temporarily
  keepExtensions: true, // Keep file extensions
  maxFileSize: 10 * 1024 * 1024, // 10MB limit
  multiples: false, // Disable multiple file uploads
};

// Helper function to parse form data
export const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> => {
  const form = formidable(formidableConfig);

  return new Promise((resolve, reject) => {
    form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};
