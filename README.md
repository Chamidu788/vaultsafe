# VaultSafe 🔐

VaultSafe is a powerful, secure, and entirely client-side password management tool. All operations happen **directly in your browser**, ensuring your data remains private and under your control.

---

## 🚀 How It Works

🔹 **Generate**  
Create one or more strong, random passwords based on your selected criteria (length, character types, etc.).

🔹 **Encrypt**  
All generated passwords and any associated notes are encrypted using **AES-256**, protected with a master password only you know.

🔹 **Export**  
Encrypted data is saved into a `.safe` file which is securely downloaded to your device. This file contains **no plain-text data**.

🔹 **Decrypt**  
To retrieve your saved passwords, simply upload the `.safe` file and enter your master password. The file is decrypted **locally in your browser**.

---

## 🔐 Your Security is Paramount

VaultSafe is built on a **"zero-knowledge"** architecture:

- 🔒 Your **master password** is never sent over the internet.
- 🌐 All encryption and decryption happens **entirely on your device**.
- 📂 No data is stored on any server — your privacy is fully protected.

---

## 👨‍💻 Developed By

A project by [MC Digital Innovate](https://mcdi.vercel.app)

- 👤 [Chamindu Kavishka](https://chamindu1.vercel.app)  
- 👩‍💻 [Maheshika Devindya](https://maheshika1.vercel.app)

---

## 📁 File Format

`.safe` – Encrypted JSON file containing your password data. Can only be decrypted with the correct master password on the VaultSafe interface.

---

## 📣 Disclaimer

> VaultSafe is intended as a personal, secure, offline password tool. Users are responsible for securely storing their `.safe` files and remembering their master password. **There is no password recovery option.**

---

## 📸 Preview

*(Add screenshots or demo GIFs here if available)*

---

## 🛠️ License

This project is open source and available under the [MIT License](LICENSE).
