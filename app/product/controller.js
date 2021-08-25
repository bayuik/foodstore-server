const fs = require("fs");
const path = require("path");
const Product = require("./model");
const config = require("../config");

async function store(req, res, next) {
  try {
    let payload = req.body;
    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
      let filename = `${req.file.filename}.${originalExt}`;
      let target_path = path.resolve(config.rootPath, `public/upload/${filename}`);
      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);
      src.on("end", async () => {
        try {
          let product = new Product({ ...payload, image_url: filename });
          await product.save();
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });
      src.on("error", async () => {
        next(err);
      });
    } else {
      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
}

async function index(req, res, next) {
  try {
    let { limit = 10, skip = 0 } = req.query;
    let products = await Product.find().limit(parseInt(limit)).skip(parseInt(skip));
    return res.json(products);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    let payload = req.body;
    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
      let filename = req.file.filename + "." + originalExt;
      let target_path = path.resolve(config.rootPath, `public/upload/${filename}`);
      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);
      src.on("end", async () => {
        try {
          let product = await Product.findOne({ _id: req.params.id });
          let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }
          product = await Product.findOneAndUpdate({ _id: req.params.id }, { ...payload, image_url: filename }, { new: true, runValidators: true });
          return res.json(product);
        } catch (err) {
          // ----- cek tipe error ---- //
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });
      src.on("error", async () => {
        next(err);
      });
    } else {
      // (6) update produk jika tidak ada file upload
      let product = await Product.findOneAndUpdate({ _id: req.params.id }, payload, { new: true, runValidators: true });
      return res.json(product);
    }
  } catch (err) {
    // ----- cek tipe error ---- //
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
}

module.exports = {
  index,
  update,
  store,
};