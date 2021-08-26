const Category = require("./model");
const { policyFor } = require("../policy");

async function store(req, res, next) {
  try {
    let policy = policyFor(req.user);
    let payload = req.body;
    let category = new Category(payload);

    if (!policy.can("create", "Category")) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk membuat kategori",
      });
    }

    await category.save();
    return res.json(category);
  } catch (err) {
    if (err && err.name == "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
}

async function update(req, res, next) {
  try {
    let policy = policyFor(req.user);
    let payload = req.body;
    let category = await Category.findOneAndUpdate({ _id: req.params.id }, payload, { new: true, runValidators: true });

    if (!policy.can("update", "Category")) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk mengupdate kategori",
      });
    }

    return res.json(category);
  } catch (err) {
    if (err && err.name == "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
}

async function destroy(req, res, next) {
  try {
    let policy = policyFor(req.user);
    let deleted = await Category.findOneAndDelete({ _id: req.params.id });

    if (!policy.can("delete", "Category")) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk menghapus kategori",
      });
    }
    return res.json(deleted);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  store,
  update,
  destroy,
};
