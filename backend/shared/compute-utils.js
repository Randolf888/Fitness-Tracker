// Generate a zero-padded random integer with the requested number of digits.
const randomNumberOfNDigits = (digits = 6) => {
  const numDigits = Number(digits);
  if (!Number.isInteger(numDigits) || numDigits <= 0) {
    throw new Error('digits must be a positive integer');
  }

  const max = 10 ** numDigits;
  const value = Math.floor(Math.random() * max);
  return value.toString().padStart(numDigits, '0');
};

module.exports = {
  randomNumberOfNDigits
};
