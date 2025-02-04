const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for the Administration User
const administrationSchema = new mongoose.Schema(
  {
    administration_name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true, // Ensures the username is unique
      trim: true,
    },
    login_email: {
      type: String,
      required: true,
      unique: true, // Ensures the email is unique
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Password should have a minimum length
    },
    created_at: {
      type: Date,
      default: Date.now, // Automatically sets the current date on creation
    },
    updated_at: {
      type: Date,
      default: Date.now, // Automatically sets the current date on creation
    },
    status: {
      type: String,
      enum: ['active', 'inactive'], // Only active or inactive statuses allowed
      default: 'active',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Hash password before saving to database
administrationSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt with a factor of 10
    const hashedPassword = await bcrypt.hash(this.password, salt); // Hash password
    this.password = hashedPassword; // Set hashed password
    next(); // Proceed to saving the document
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
});

administrationSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare hashed password
};

const Administration = mongoose.model('Administration', administrationSchema);

module.exports = Administration;
