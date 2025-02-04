const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const subAdminSchema = new mongoose.Schema(
  {
    subadmin_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    status: { type: String, default: "active" },
  },
  { timestamps: true } // Enables createdAt and updatedAt fields
);

subAdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

subAdminSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("SubAdmin", subAdminSchema);
