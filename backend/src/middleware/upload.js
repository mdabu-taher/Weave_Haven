import multer from 'multer';
import path from 'path';

// where to store files and how to name them
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // ensure this folder exists at your repo root
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

export const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    // only images
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }  // max 5 MB
});
