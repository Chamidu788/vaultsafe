import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generatePassword(
  length: number,
  includeUppercase: boolean,
  includeLowercase: boolean,
  includeNumbers: boolean,
  includeSymbols: boolean
): string {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let charPool = "";
  let password = "";

  const selectedTypes = [];
  if (includeUppercase) selectedTypes.push(uppercaseChars);
  if (includeLowercase) selectedTypes.push(lowercaseChars);
  if (includeNumbers) selectedTypes.push(numberChars);
  if (includeSymbols) selectedTypes.push(symbolChars);

  if (selectedTypes.length === 0) {
    return "Select at least one character type.";
  }

  // Ensure at least one character from each selected type
  selectedTypes.forEach(type => {
    password += type[Math.floor(Math.random() * type.length)];
    charPool += type;
  });

  const remainingLength = length - password.length;
  for (let i = 0; i < remainingLength; i++) {
    password += charPool[Math.floor(Math.random() * charPool.length)];
  }

  // Shuffle the password to ensure randomness of character positions
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}
