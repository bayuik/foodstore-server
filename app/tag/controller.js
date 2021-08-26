const Tag = require("./model");
const { policyFor } = require("../policy");

async function store(req, res, next) {
  try {
    let policy = policyFor(req.user);
    let payload = req.body;
    let tag = new Tag(payload);

    if (!policy.can("create", "Tag")) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk membuat tag",
      });
    }

    await tag.save();
    return res.json(tag);
  } catch (err) {
    if (err && err.name === "validationError") {
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
    let tag = await Tag.findOneAndUpdate({ _id: req.params.id }, payload, { new: true, runValidators: true });

    if (!policy.can("update", "Tag")) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk mengupdate tag",
      });
    }

    return res.json(tag);
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

async function destroy(req, res, next) {
  try {
    let policy = policyFor(req.user);
    let tag = await Tag.findOneAndDelete({ _id: req.params.id });

    if (!policy.can("delete", "Tag")) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk menghapus tag",
      });
    }

    return res.json(tag);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  store,
  update,
  destroy,
};
