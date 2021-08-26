const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const deliveryAddressSchema = Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama alamat harus diisi"],
      maxLength: [255, "Panjang maksimal nama alamat adalah 255 karakter"],
    },
    kelurahan: {
      type: String,
      required: [true, "kelurahan harus diisi"],
      maxLength: [255, "Panjang maksimal kelurahan adalah 255 karakter"],
    },
    kecamatan: {
      type: String,
      required: [true, "kecamatan harus diisi"],
      maxLength: [255, "Panjang maksimal kecamatan adalah 255 karakter"],
    },
    kabupaten: {
      type: String,
      required: [true, "kabupaten harus diisi"],
      maxLength: [255, "panjang maksimal kabupaten adalah 255 karakter"],
    },
    provinsi: {
      type: String,
      required: [true, "provinsi harus diisi"],
      maxLength: [255, "panjang maksimal provinsi adalah 255 karakter"],
    },
    detail: {
      type: String,
      required: [true, "Detail harus diisi"],
      maxLength: [1000, "panjang maksimal detail adalah 1000 karakter"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timesamps: true }
);

module.exports = model("DeliveryAddress", deliveryAddressSchema);
