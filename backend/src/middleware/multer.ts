import multer from "multer";

// const storage = multer.diskStorage;
const storage = multer.memoryStorage();
const uploadFile = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 }, }).single('file');

export default uploadFile;