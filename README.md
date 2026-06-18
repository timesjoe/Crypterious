# 🔒 Crypterious

> **An Interactive Cryptography Workbench & Visual Educational Playground**
> A local-first, zero-dependency web application designed to demonstrate and visualize classic ciphers, encoders/decoders, hashing functions, and modern asymmetric/blockchain cryptography.

---

## 🚀 Live Demo
You can access the hosted version directly on GitHub Pages:
**[timesjoe.github.io/Crypterious](https://timesjoe.github.io/Crypterious/)**

---

## 🎨 Interactive Live Visualizers
Every cryptographic algorithm is paired with a real-time, responsive visualizer that updates as you type:

* **Caesar & ROT13**: Double alphabet alignment wheels demonstrating shift mapping.
* **Vigenère**: Live algebraic matrix lookup highlighting character offsets (`C = (P + K) mod 26`).
* **Rail Fence (Zig-Zag)**: Dynamic multi-rail visual grid rendering of the diagonal path.
* **Base64**: Step-by-step bit-expansion layout illustrating how 3 8-bit bytes are grouped into 4 6-bit indices.
* **AES-GCM**: Conceptual block flow displaying key derivation (PBKDF2), IV nonce setup, GCM authenticated block encryption, and final payload structure.
* **RSA-OAEP**: Displays keys validation status and asymmetric exponent mapping nodes (`C = M^e mod n`).
* **ECDSA**: A side-by-side workflow diagram comparing signing (Private Key + Msg -> Signature) with verification (Public Key + Msg + Signature -> Validity).
* **PBKDF2**: Real-time simulation of PBKDF2 stretching rounds (password + salt + iterations -> key).
* **Keccak-256 & SHA Hashes**: Step-by-step hashing visualizer explaining blockchain address derivation (e.g., Ethereum).

---

## 🛠️ Supported Operations

### 🔑 Ciphers & Cryptography
*   **AES-GCM**: Symmetric 256-bit Authenticated Encryption (using native browser Web Crypto API).
*   **RSA-OAEP**: 2048-bit asymmetric encryption/decryption with PEM key formatting.
*   **ECDSA NIST P-256**: Key signing and signature verification standard for blockchain identities.
*   **PBKDF2**: Key derivation stretching.
*   **Classic Ciphers**: Caesar (dynamic shift), Vigenère (dynamic keyword), ROT13, Rail Fence (dynamic rails).

### 📝 Encoders & Decoders
*   **Base64**: Standard binary-to-text encoding.
*   **Hexadecimal (Base 16)**: Configurable separators (None, Space, Colon, and `\x` prefix).
*   **Binary (Base 2)**: 8-bit conversions with custom spacing.
*   **URL Encoding**: Browser percent-encoding.
*   **Morse Code**: Signal code dots and dashes.

### 🧮 Hashing Algorithms
*   **Keccak-256**: Ethereum hash standard (Keccak pre-NIST SHA-3).
*   **SHA-256**: Bitcoin & SHA-2 hash digest.
*   **SHA-512 & SHA-1**: High-strength and legacy hash digests.

---

## ⚡ Key Achievements & Design Philosophy

1. **Local-First, Zero Dependencies**: Built with raw HTML5, Vanilla CSS, and native JavaScript. No bundlers, npm packages, or package managers required.
2. **Offline Mode**: A local copy of the `js-sha3` library is bundled to ensure Keccak-256 works offline without cross-origin script blocking.
3. **PEM Keypair Generator**: Asynchronous Web Crypto API handles on-the-fly generation of valid 2048-bit RSA-OAEP and EC P-256 keypairs directly in-browser.
4. **Glassmorphism Theme**: Cyberpunk-inspired aesthetic featuring a modern, responsive dark mode with clean styling tokens.

---

## 💻 Local Setup

Since Crypterious is built as a static application, getting started is simple:

### Option 1: Direct Execution
Open the `index.html` file in any modern web browser by double-clicking it.

### Option 2: Serve Locally
If you want to run a local web server (highly recommended for HTTPS-restricted Web Crypto features):

* **Python 3**:
  ```bash
  python -m http.server 8000
  ```
  Open `http://localhost:8000` in your browser.

* **Node.js (npx)**:
  ```bash
  npx serve
  ```
  Open `http://localhost:3000` (or the port specified).

---

## 🔮 Future Roadmap

* **Local Storage Persistence**: Save derived keypairs, configuration settings, and past inputs across page reloads.
* **Diffie-Hellman Playground**: Visual demonstration of Alice and Bob establishing a shared secret key.
* **File Cryptography**: Drag-and-drop interface for calculating file checksums or encrypting small files locally.
* **Light Theme Switcher**: Toggle control in header to alternate between default dark-mode and light-mode.

---

## 📄 License
This project is licensed under the MIT License.
