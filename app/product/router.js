const router = require("express").Router();
const os = require("os");
const multer = require("multer");
const productController = require("./controller");
router.post("/products", multer({ dest: os.tmpdir() }).single("image"), productController.store);
module.exports = router;
