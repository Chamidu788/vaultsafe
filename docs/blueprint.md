# **App Name**: VaultSafe

## Core Features:

- Password Generator: Generate a strong, random password with customizable length and character types (uppercase, lowercase, digits, special characters). Copy to clipboard.
- Password Encryption & Export: Encrypt the generated password using AES-256-CBC with a user-provided master password. The encryption includes a salt (16 bytes), IV (16 bytes), and key derivation using PBKDF2 (100,000 iterations, 32-byte key). Export as a .safe binary file.
- Password Upload & Decryption: Allow users to upload a .safe file and decrypt it by entering the correct master password. Show error message if incorrect.
- Security and Retry Lock: Limit password decryption attempts to prevent brute-force attacks. Auto-delete exported files after use.

## Style Guidelines:

- Primary color: Deep purple (#673AB7) for a sense of security and sophistication.
- Background color: Light grey (#F0F0F0) for a clean, unobtrusive backdrop.
- Accent color: Soft lavender (#D1C4E9) to highlight interactive elements and provide a gentle contrast.
- Body and headline font: 'Inter' sans-serif font for a clean, modern, objective, and neutral presentation.
- Use minimalist, geometric icons to represent password generation, encryption, and security functions.
- A clean, centered layout with clear sections for password generation, encryption, and decryption to guide the user.