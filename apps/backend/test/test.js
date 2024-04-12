const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

async function testHashAndCompare() {
  // Example password
  const originalPassword = 'mySecurePassword';

  // Hash the password
  const hashedPassword = await hashPassword(originalPassword);
  console.log('Hashed Password:', hashedPassword);

  // Simulate user login with the entered password
  const enteredPassword = 'mySecurePassword';

  // Compare the entered password with the stored hashed password
  const passwordMatch = await comparePassword(enteredPassword, hashedPassword);

  // Check the result
  if (passwordMatch) {
    console.log('Password is correct. User is authenticated.');
  } else {
    console.log('Incorrect password. Authentication failed.');
  }
}

// Run the test
testHashAndCompare();
