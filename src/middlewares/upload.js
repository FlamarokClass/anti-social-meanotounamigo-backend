const multer = require('multer');
const path  = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = path.resolve(process.cwd(), 'uploads');
    cb(null, uploadFolder);
  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}${ext}`);
  }
});

module.exports = multer({ storage });