const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'courseImages',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'courseVideos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi'],
  },
});

const uploadImage = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });

module.exports = { uploadImage, uploadVideo };
