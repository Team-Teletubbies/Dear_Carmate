import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/contracts/');
  },
  filename: (req, file, cb) => {
    const savedName = file.originalname;

    cb(null, savedName);
  },
});

const upload = multer({ storage });

export default upload;
