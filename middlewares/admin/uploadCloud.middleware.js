const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports.upload = async (req, res, next) => {
  try {
    if (!req.files || (Object.keys(req.files).length === 0)) {
      return next();
    }
    // Upload 1 ảnh thumbnail nếu có
    if (req.files.thumbnail && req.files.thumbnail.length > 0) {
      const file = req.files.thumbnail[0];
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((err, res) => {
          if (res) resolve(res);
          else reject(err);
        });
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
      req.body.thumbnail = result.url;
    }

    // Upload nhiều ảnh images nếu có
    if (req.files.images && req.files.images.length > 0) {
      const uploadPromises = req.files.images.map(file => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((err, res) => {
            if (res) resolve(res);
            else reject(err);
          });
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      });

      const results = await Promise.all(uploadPromises);
      req.body.images = results.map(image => image.secure_url);
    }

    next();
  } catch (err) {
    console.error('Upload đến Cloudinary thất bại', err);
  }
};
