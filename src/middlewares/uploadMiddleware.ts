import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/contracts/');
  },
  filename: (req, file, cb) => {
    const originalBuffer = Buffer.from(file.originalname, 'latin1');
    const decodedName = originalBuffer.toString('utf-8');

    const ext = path.extname(decodedName);

    cb(null, decodedName);
  },
});

const upload = multer({ storage });

export default upload;
