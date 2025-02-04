const bcrypt = require('bcryptjs');

async function generateHash() {
  const salt = await bcrypt.genSalt(10);  // Generate salt with 10 rounds
  const hash = await bcrypt.hash('password123', salt);  // Replace 'password123' with your password
  console.log(hash);  // Print the hashed password
}

generateHash();
