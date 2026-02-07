// hash_password.js
const bcrypt = require('bcryptjs');

// Choose a strong, unique password for your admin account
const plaintextPassword = 'MySecretAdminPassword123!'; // <--- REPLACE THIS WITH YOUR DESIRED ADMIN PASSWORD
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(plaintextPassword, salt);

console.log('Plaintext Password:', plaintextPassword);
console.log('Hashed Password:', hashedPassword);