/**
 * Crypterious Workbench - Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    selectedAlgo: 'caesar',
    mode: 'encode', // 'encode' or 'decode' (has no effect on one-way hashes)
    inputText: 'Hello, Crypterious! Explore ciphers here.',
    outputText: '',
    autoConvert: true,
    params: {
      shift: 3,
      key: 'SECRET',
      rails: 3,
      separator: 'none',
      binarySeparator: 'space'
    }
  };

  // DOM Elements
  const el = {
    tabs: document.querySelectorAll('.nav-tab'),
    algoSelector: document.getElementById('algo-select'),
    modeEncode: document.getElementById('mode-encode'),
    modeDecode: document.getElementById('mode-decode'),
    modeToggleContainer: document.getElementById('mode-toggle-container'),
    paramsContainer: document.getElementById('params-container'),
    inputText: document.getElementById('input-text'),
    outputText: document.getElementById('output-text'),
    convertBtn: document.getElementById('convert-btn'),
    autoConvertCheck: document.getElementById('auto-convert'),
    copyInputBtn: document.getElementById('copy-input-btn'),
    copyOutputBtn: document.getElementById('copy-output-btn'),
    clearInputBtn: document.getElementById('clear-input-btn'),
    swapBtn: document.getElementById('swap-btn'),
    visualizerContent: document.getElementById('visualizer-content'),
    visualizerSection: document.getElementById('visualizer-section'),
    
    // Details tab elements
    detailTitle: document.getElementById('detail-title'),
    detailCategory: document.getElementById('detail-category'),
    detailDesc: document.getElementById('detail-desc'),
    detailHistory: document.getElementById('detail-history'),
    detailStrengths: document.getElementById('detail-strengths'),
    detailWeaknesses: document.getElementById('detail-weaknesses'),
    detailComplexity: document.getElementById('detail-complexity'),
    detailPresetsContainer: document.getElementById('detail-presets'),
    
    // Layout views
    viewWorkbench: document.getElementById('view-workbench'),
    viewCatalog: document.getElementById('view-catalog'),
    catalogGrid: document.getElementById('catalog-grid')
  };

  // Morse Code Dictionary
  const morseCodeMap = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
    'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
    'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
    '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
    '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
    ' ': '/'
  };
  const morseDecodeMap = Object.entries(morseCodeMap).reduce((acc, [char, code]) => {
    acc[code] = char;
    return acc;
  }, {});

  // --- CRYPTO LOGIC IMPLEMENTATIONS ---

  const algorithms = {
    // Caesar Cipher
    caesar: {
      encode: (text, params) => {
        const shift = parseInt(params.shift) || 0;
        return text.split('').map(char => {
          const code = char.charCodeAt(0);
          if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
          } else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + shift) % 26) + 97);
          }
          return char;
        }).join('');
      },
      decode: (text, params) => {
        const shift = parseInt(params.shift) || 0;
        return text.split('').map(char => {
          const code = char.charCodeAt(0);
          if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
          } else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
          }
          return char;
        }).join('');
      }
    },

    // Vigenère Cipher
    vigenere: {
      encode: (text, params) => {
        const key = (params.key || 'KEY').toUpperCase().replace(/[^A-Z]/g, '');
        if (!key) return text;
        let keyIdx = 0;
        return text.split('').map(char => {
          const code = char.charCodeAt(0);
          if (code >= 65 && code <= 90) {
            const shift = key.charCodeAt(keyIdx % key.length) - 65;
            keyIdx++;
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
          } else if (code >= 97 && code <= 122) {
            const shift = key.charCodeAt(keyIdx % key.length) - 65;
            keyIdx++;
            return String.fromCharCode(((code - 97 + shift) % 26) + 97);
          }
          return char;
        }).join('');
      },
      decode: (text, params) => {
        const key = (params.key || 'KEY').toUpperCase().replace(/[^A-Z]/g, '');
        if (!key) return text;
        let keyIdx = 0;
        return text.split('').map(char => {
          const code = char.charCodeAt(0);
          if (code >= 65 && code <= 90) {
            const shift = key.charCodeAt(keyIdx % key.length) - 65;
            keyIdx++;
            return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
          } else if (code >= 97 && code <= 122) {
            const shift = key.charCodeAt(keyIdx % key.length) - 65;
            keyIdx++;
            return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
          }
          return char;
        }).join('');
      }
    },

    // ROT13
    rot13: {
      encode: (text) => {
        return algorithms.caesar.encode(text, { shift: 13 });
      },
      decode: (text) => {
        return algorithms.caesar.decode(text, { shift: 13 });
      }
    },

    // Rail Fence Cipher
    railfence: {
      encode: (text, params) => {
        const rails = parseInt(params.rails) || 3;
        if (rails < 2 || text.length <= rails) return text;
        
        const fence = Array.from({ length: rails }, () => []);
        let rail = 0;
        let direction = 1; // 1 for down, -1 for up
        
        for (let i = 0; i < text.length; i++) {
          fence[rail].push(text[i]);
          rail += direction;
          if (rail === rails - 1 || rail === 0) direction = -direction;
        }
        
        return fence.map(row => row.join('')).join('');
      },
      decode: (text, params) => {
        const rails = parseInt(params.rails) || 3;
        if (rails < 2 || text.length <= rails) return text;
        
        // Reconstruct the zig-zag matrix indices
        const fence = Array.from({ length: rails }, () => Array(text.length).fill(null));
        let rail = 0;
        let direction = 1;
        
        for (let i = 0; i < text.length; i++) {
          fence[rail][i] = '*'; // Mark position
          rail += direction;
          if (rail === rails - 1 || rail === 0) direction = -direction;
        }
        
        // Fill fence row by row with ciphertext characters
        let charIdx = 0;
        for (let r = 0; r < rails; r++) {
          for (let c = 0; c < text.length; c++) {
            if (fence[r][c] === '*' && charIdx < text.length) {
              fence[r][c] = text[charIdx++];
            }
          }
        }
        
        // Read off in zig-zag order
        let result = '';
        rail = 0;
        direction = 1;
        for (let i = 0; i < text.length; i++) {
          result += fence[rail][i];
          rail += direction;
          if (rail === rails - 1 || rail === 0) direction = -direction;
        }
        return result;
      }
    },

    // Base64 Encoding
    base64: {
      encode: (text) => {
        try {
          return btoa(unescape(encodeURIComponent(text)));
        } catch (e) {
          return `Error during Base64 encoding: ${e.message}`;
        }
      },
      decode: (text) => {
        try {
          return decodeURIComponent(escape(atob(text)));
        } catch (e) {
          return `Invalid Base64 string to decode. Detailed error: ${e.message}`;
        }
      }
    },

    // Hexadecimal Encoding
    hex: {
      encode: (text, params) => {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        const hexArr = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'));
        
        const sep = params.separator || 'none';
        if (sep === 'space') return hexArr.join(' ');
        if (sep === 'colon') return hexArr.join(':');
        if (sep === 'prefix') return '\\x' + hexArr.join('\\x');
        return hexArr.join('');
      },
      decode: (text, params) => {
        try {
          // Normalize string by removing spaces, colons, prefix patterns
          let cleaned = text.trim();
          if (cleaned.startsWith('\\x')) {
            cleaned = cleaned.replace(/\\x/g, '');
          } else {
            cleaned = cleaned.replace(/[:\s]/g, '');
          }
          
          if (cleaned.length % 2 !== 0) {
            return 'Error: Invalid Hexadecimal string (odd length).';
          }
          
          if (/[^0-9a-fA-F]/.test(cleaned)) {
            return 'Error: Hexadecimal string contains invalid characters.';
          }
          
          const bytes = new Uint8Array(cleaned.length / 2);
          for (let i = 0; i < cleaned.length; i += 2) {
            bytes[i / 2] = parseInt(cleaned.substr(i, 2), 16);
          }
          return new TextDecoder().decode(bytes);
        } catch (e) {
          return `Error decoding Hexadecimal: ${e.message}`;
        }
      }
    },

    // Binary Encoding
    binary: {
      encode: (text, params) => {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        const binArr = Array.from(bytes).map(b => b.toString(2).padStart(8, '0'));
        
        const sep = params.binarySeparator !== 'none';
        return binArr.join(sep ? ' ' : '');
      },
      decode: (text) => {
        try {
          const cleaned = text.replace(/[^01]/g, '');
          if (cleaned.length === 0) return '';
          if (cleaned.length % 8 !== 0) {
            return `Warning: Binary string length (${cleaned.length}) is not a multiple of 8. Trailing bits ignored.`;
          }
          
          const bytes = new Uint8Array(cleaned.length / 8);
          for (let i = 0; i < cleaned.length; i += 8) {
            bytes[i / 8] = parseInt(cleaned.substr(i, 8), 2);
          }
          return new TextDecoder().decode(bytes);
        } catch (e) {
          return `Error decoding Binary: ${e.message}`;
        }
      }
    },

    // URL Encoding
    url: {
      encode: (text) => {
        return encodeURIComponent(text);
      },
      decode: (text) => {
        try {
          return decodeURIComponent(text);
        } catch (e) {
          return `Error decoding URL: ${e.message}`;
        }
      }
    },

    // Morse Code
    morse: {
      encode: (text) => {
        return text.toUpperCase().split('').map(char => {
          if (morseCodeMap[char]) return morseCodeMap[char];
          if (char === '\n') return '\n';
          return ''; // Ignore unsupported chars
        }).filter(item => item !== '').join(' ');
      },
      decode: (text) => {
        // Morse words are usually separated by '/' or three spaces. We treat '/' as space.
        const words = text.trim().split(/\s*\/\s*|\s{3,}/);
        return words.map(word => {
          const letters = word.split(/\s+/);
          return letters.map(letter => morseDecodeMap[letter] || '').join('');
        }).join(' ');
      }
    },

    // Hashes (One-way: only encode, decode outputs explanatory error)
    sha256: {
      encode: async (text) => {
        return cryptoHash(text, 'SHA-256');
      },
      decode: () => {
        return 'Hashing functions (like SHA-256) are mathematically one-way. They cannot be decrypted or decoded back to plaintext.';
      }
    },
    sha1: {
      encode: async (text) => {
        return cryptoHash(text, 'SHA-1');
      },
      decode: () => {
        return 'Hashing functions (like SHA-1) are mathematically one-way. They cannot be decrypted or decoded back to plaintext.';
      }
    },
    sha512: {
      encode: async (text) => {
        return cryptoHash(text, 'SHA-512');
      },
      decode: () => {
        return 'Hashing functions (like SHA-512) are mathematically one-way. They cannot be decrypted or decoded back to plaintext.';
      }
    },
    keccak256: {
      encode: (text) => {
        if (typeof keccak_256 !== 'undefined') {
          return keccak_256(text);
        }
        return 'Error: Keccak-256 library (js-sha3) failed to load. Ensure you have an internet connection to load the CDN script.';
      },
      decode: () => {
        return 'Hashing functions (like Keccak-256) are mathematically one-way. They cannot be decrypted or decoded back to plaintext.';
      }
    },
    aes_gcm: {
      encode: async (text, params) => {
        try {
          const passphrase = params.passphrase || 'CryptoPass123!';
          const saltText = params.salt || 'SaltWord';
          const key = await aesDeriveKey(passphrase, saltText);
          
          const encoder = new TextEncoder();
          const plaintextBytes = encoder.encode(text);
          const iv = crypto.getRandomValues(new Uint8Array(12));
          
          const ciphertextBuffer = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            plaintextBytes
          );
          
          const combined = new Uint8Array(iv.length + ciphertextBuffer.byteLength);
          combined.set(iv, 0);
          combined.set(new Uint8Array(ciphertextBuffer), iv.length);
          
          return Array.from(combined).map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
          return `AES Encryption Error: ${e.message}`;
        }
      },
      decode: async (text, params) => {
        try {
          const passphrase = params.passphrase || 'CryptoPass123!';
          const saltText = params.salt || 'SaltWord';
          const key = await aesDeriveKey(passphrase, saltText);
          
          const cleaned = text.replace(/[^0-9a-fA-F]/g, '');
          if (cleaned.length < 24) return 'Error: Ciphertext is too short to contain IV and encrypted payload.';
          
          const combined = new Uint8Array(cleaned.length / 2);
          for (let i = 0; i < cleaned.length; i += 2) {
            combined[i / 2] = parseInt(cleaned.substr(i, 2), 16);
          }
          
          const iv = combined.slice(0, 12);
          const ciphertext = combined.slice(12);
          
          const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            ciphertext
          );
          
          return new TextDecoder().decode(decryptedBuffer);
        } catch (e) {
          return `AES Decryption Error: ${e.message}. (Ensure your passphrase, salt, and ciphertext are correct)`;
        }
      }
    },
    rsa_oaep: {
      encode: async (text, params) => {
        try {
          const pem = params.publicKey || '';
          if (!pem.trim()) return 'Error: Please generate or input an RSA Public Key first.';
          
          const keyData = pemToBinary(
            pem,
            '-----BEGIN PUBLIC KEY-----',
            '-----END PUBLIC KEY-----'
          );
          
          const key = await crypto.subtle.importKey(
            'spki',
            keyData,
            { name: 'RSA-OAEP', hash: 'SHA-256' },
            false,
            ['encrypt']
          );
          
          const encoder = new TextEncoder();
          const encrypted = await crypto.subtle.encrypt(
            { name: 'RSA-OAEP' },
            key,
            encoder.encode(text)
          );
          
          return Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
          return `RSA Encryption Error: ${e.message}. (Ensure your public key is in valid SPKI/PEM format)`;
        }
      },
      decode: async (text, params) => {
        try {
          const pem = params.privateKey || '';
          if (!pem.trim()) return 'Error: Please generate or input an RSA Private Key first.';
          
          const keyData = pemToBinary(
            pem,
            '-----BEGIN PRIVATE KEY-----',
            '-----END PRIVATE KEY-----'
          );
          
          const key = await crypto.subtle.importKey(
            'pkcs8',
            keyData,
            { name: 'RSA-OAEP', hash: 'SHA-256' },
            false,
            ['decrypt']
          );
          
          const cleaned = text.replace(/[^0-9a-fA-F]/g, '');
          const ciphertext = new Uint8Array(cleaned.length / 2);
          for (let i = 0; i < cleaned.length; i += 2) {
            ciphertext[i / 2] = parseInt(cleaned.substr(i, 2), 16);
          }
          
          const decrypted = await crypto.subtle.decrypt(
            { name: 'RSA-OAEP' },
            key,
            ciphertext
          );
          
          return new TextDecoder().decode(decrypted);
        } catch (e) {
          return `RSA Decryption Error: ${e.message}. (Ensure your private key matches the public key and ciphertext hex is valid)`;
        }
      }
    },
    ecdsa: {
      encode: async (text, params) => {
        try {
          const pem = params.privateKey || '';
          if (!pem.trim()) return 'Error: Please generate or input an EC Private Key first.';
          
          const keyData = pemToBinary(
            pem,
            '-----BEGIN PRIVATE KEY-----',
            '-----END PRIVATE KEY-----'
          );
          
          const key = await crypto.subtle.importKey(
            'pkcs8',
            keyData,
            { name: 'ECDSA', namedCurve: 'P-256' },
            false,
            ['sign']
          );
          
          const encoder = new TextEncoder();
          const signature = await crypto.subtle.sign(
            { name: 'ECDSA', hash: 'SHA-256' },
            key,
            encoder.encode(text)
          );
          
          const hexSig = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
          
          state.params.signature = hexSig;
          const sigField = document.getElementById('param-signature');
          if (sigField) sigField.value = hexSig;
          
          return hexSig;
        } catch (e) {
          return `ECDSA Signing Error: ${e.message}`;
        }
      },
      decode: async (text, params) => {
        try {
          const pem = params.publicKey || '';
          const hexSig = params.signature || '';
          if (!pem.trim()) return 'Error: Please input an EC Public Key first.';
          if (!hexSig.trim()) return 'Error: Please provide a Hex Signature to verify.';
          
          const keyData = pemToBinary(
            pem,
            '-----BEGIN PUBLIC KEY-----',
            '-----END PUBLIC KEY-----'
          );
          
          const key = await crypto.subtle.importKey(
            'spki',
            keyData,
            { name: 'ECDSA', namedCurve: 'P-256' },
            false,
            ['verify']
          );
          
          const sigCleaned = hexSig.replace(/[^0-9a-fA-F]/g, '');
          const sigBytes = new Uint8Array(sigCleaned.length / 2);
          for (let i = 0; i < sigCleaned.length; i += 2) {
            sigBytes[i / 2] = parseInt(sigCleaned.substr(i, 2), 16);
          }
          
          const encoder = new TextEncoder();
          const isValid = await crypto.subtle.verify(
            { name: 'ECDSA', hash: 'SHA-256' },
            key,
            sigBytes,
            encoder.encode(text)
          );
          
          return isValid 
            ? '✓ VALID ECDSA SIGNATURE: The digital signature matches the EC Public Key and message content. The payload is authentic!'
            : '✗ INVALID SIGNATURE: Signature verification failed. The signature does not correspond to the message or public key.';
        } catch (e) {
          return `ECDSA Verification Error: ${e.message}`;
        }
      }
    },
    pbkdf2: {
      encode: async (text, params) => {
        try {
          const password = text;
          const salt = params.salt || 'custom-salt-string';
          const iterations = parseInt(params.iterations) || 10000;
          const hashName = params.hash || 'SHA-256';
          
          const encoder = new TextEncoder();
          const passwordBytes = encoder.encode(password);
          const saltBytes = encoder.encode(salt);
          
          const baseKey = await crypto.subtle.importKey(
            'raw',
            passwordBytes,
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
          );
          
          const derivedBits = await crypto.subtle.deriveBits(
            {
              name: 'PBKDF2',
              salt: saltBytes,
              iterations: iterations,
              hash: hashName
            },
            baseKey,
            256
          );
          
          return Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
          return `PBKDF2 Derivation Error: ${e.message}`;
        }
      },
      decode: () => {
        return 'PBKDF2 is a key derivation function. Key stretching is mathematically one-way; you cannot decode the output back to your password.';
      }
    }
  };

  // Helper for SHA hashing using Crypto API
  async function cryptoHash(text, algo) {
    try {
      const msgUint8 = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (e) {
      return `Hashing Error: ${e.message}. (Web Cryptography API might require HTTPS or localhost)`;
    }
  }

  // --- CRYPTOGRAPHIC UTILITIES ---

  async function aesDeriveKey(passphrase, saltText) {
    const encoder = new TextEncoder();
    const passphraseBytes = encoder.encode(passphrase);
    const saltBytes = encoder.encode(saltText);
    
    const baseKey = await crypto.subtle.importKey(
      'raw',
      passphraseBytes,
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 10000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  function pemToBinary(pem, header, footer) {
    const cleaned = pem
      .replace(header, '')
      .replace(footer, '')
      .replace(/\s/g, '');
    const binaryStr = atob(cleaned);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return bytes.buffer;
  }

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function formatPEM(base64, header, footer) {
    let result = header + '\n';
    for (let i = 0; i < base64.length; i += 64) {
      result += base64.substr(i, 64) + '\n';
    }
    result += footer;
    return result;
  }

  async function generateRSAKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      },
      true,
      ["encrypt", "decrypt"]
    );
    
    const pubBuffer = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privBuffer = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    
    const pubPEM = formatPEM(arrayBufferToBase64(pubBuffer), '-----BEGIN PUBLIC KEY-----', '-----END PUBLIC KEY-----');
    const privPEM = formatPEM(arrayBufferToBase64(privBuffer), '-----BEGIN PRIVATE KEY-----', '-----END PRIVATE KEY-----');
    
    state.params.publicKey = pubPEM;
    state.params.privateKey = privPEM;
    
    const pubField = document.getElementById('param-publicKey');
    const privField = document.getElementById('param-privateKey');
    
    if (pubField) pubField.value = pubPEM;
    if (privField) privField.value = privPEM;
    
    triggerConversion();
    showToast('Generated fresh 2048-bit RSA-OAEP Key Pair!');
  }

  async function generateECKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256"
      },
      true,
      ["sign", "verify"]
    );
    
    const pubBuffer = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privBuffer = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    
    const pubPEM = formatPEM(arrayBufferToBase64(pubBuffer), '-----BEGIN PUBLIC KEY-----', '-----END PUBLIC KEY-----');
    const privPEM = formatPEM(arrayBufferToBase64(privBuffer), '-----BEGIN PRIVATE KEY-----', '-----END PRIVATE KEY-----');
    
    state.params.publicKey = pubPEM;
    state.params.privateKey = privPEM;
    
    const pubField = document.getElementById('param-publicKey');
    const privField = document.getElementById('param-privateKey');
    
    if (pubField) pubField.value = pubPEM;
    if (privField) privField.value = privPEM;
    
    triggerConversion();
    showToast('Generated fresh EC P-256 Key Pair!');
  }

  // --- PARAMETERS RENDERER ---

  function renderParams() {
    const meta = ciphersData[state.selectedAlgo];
    el.paramsContainer.innerHTML = '';
    
    if (!meta || !meta.params || meta.params.length === 0) {
      el.paramsContainer.innerHTML = '<p class="no-params-text">No configurable parameters for this algorithm.</p>';
      return;
    }

    meta.params.forEach(param => {
      const wrapper = document.createElement('div');
      wrapper.className = 'param-group';
      
      const labelContainer = document.createElement('div');
      labelContainer.className = 'param-label-container';
      
      const label = document.createElement('label');
      label.htmlFor = `param-${param.id}`;
      label.textContent = param.name;
      labelContainer.appendChild(label);
      
      // Dynamic value badge
      const badge = document.createElement('span');
      badge.className = 'param-val-badge';
      badge.id = `param-val-${param.id}`;
      labelContainer.appendChild(badge);
      
      wrapper.appendChild(labelContainer);

      let input;
      if (param.type === 'number') {
        input = document.createElement('input');
        input.type = 'range';
        input.min = param.min;
        input.max = param.max;
        input.value = state.params[param.id] !== undefined ? state.params[param.id] : param.default;
        input.id = `param-${param.id}`;
        
        badge.textContent = input.value;
        input.addEventListener('input', (e) => {
          badge.textContent = e.target.value;
          state.params[param.id] = parseInt(e.target.value);
          triggerConversion();
        });
      } else if (param.type === 'number_input') {
        input = document.createElement('input');
        input.type = 'number';
        input.min = param.min;
        input.max = param.max;
        input.value = state.params[param.id] !== undefined ? state.params[param.id] : param.default;
        input.id = `param-${param.id}`;
        badge.style.display = 'none';
        
        input.addEventListener('input', (e) => {
          state.params[param.id] = parseInt(e.target.value) || param.default;
          triggerConversion();
        });
      } else if (param.type === 'select') {
        input = document.createElement('select');
        input.id = `param-${param.id}`;
        
        param.options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          if (state.params[param.id] === opt.value || (!state.params[param.id] && param.default === opt.value)) {
            option.selected = true;
          }
          input.appendChild(option);
        });

        badge.style.display = 'none'; // Hide numerical badge for selection
        input.addEventListener('change', (e) => {
          state.params[param.id] = e.target.value;
          triggerConversion();
        });
      } else if (param.type === 'textarea') {
        input = document.createElement('textarea');
        input.id = `param-${param.id}`;
        input.className = 'text-area param-textarea';
        input.value = state.params[param.id] !== undefined ? state.params[param.id] : param.default;
        input.placeholder = param.placeholder || '';
        input.rows = 4;
        badge.style.display = 'none';
        
        input.addEventListener('input', (e) => {
          state.params[param.id] = e.target.value;
          triggerConversion();
        });
      } else if (param.type === 'button_action') {
        input = document.createElement('button');
        input.type = 'button';
        input.className = 'action-btn';
        input.style.width = '100%';
        input.style.background = 'linear-gradient(135deg, var(--accent-purple), #7c3aed)';
        input.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.3)';
        input.textContent = param.name;
        input.id = `param-${param.id}`;
        badge.style.display = 'none';
        
        input.addEventListener('click', async () => {
          const oldText = input.textContent;
          input.textContent = 'Generating Keypair...';
          input.disabled = true;
          try {
            if (param.id === 'keypair_action') {
              await generateRSAKeyPair();
            } else if (param.id === 'ec_keypair_action') {
              await generateECKeyPair();
            }
          } catch (e) {
            showToast(`Keygen Error: ${e.message}`);
          } finally {
            input.textContent = oldText;
            input.disabled = false;
          }
        });
      } else {
        // Default text parameter
        input = document.createElement('input');
        input.type = 'text';
        input.id = `param-${param.id}`;
        input.value = state.params[param.id] !== undefined ? state.params[param.id] : param.default;
        input.placeholder = param.placeholder || '';
        
        badge.style.display = 'none';
        input.addEventListener('input', (e) => {
          let cleanedVal = e.target.value;
          // Specific input constraints
          if (param.id === 'key') {
            cleanedVal = cleanedVal.replace(/[^A-Za-z]/g, '');
            input.value = cleanedVal;
          }
          state.params[param.id] = cleanedVal;
          triggerConversion();
        });
      }

      const desc = document.createElement('p');
      desc.className = 'param-desc';
      desc.textContent = param.description;
      
      wrapper.appendChild(input);
      wrapper.appendChild(desc);
      el.paramsContainer.appendChild(wrapper);
    });
  }

  // --- CORE CONVERSION CONTROLLER ---

  async function triggerConversion() {
    const text = el.inputText.value;
    state.inputText = text;
    
    // Manage UI display for one-way hash algorithms
    const isHash = ciphersData[state.selectedAlgo].category === 'hashes';
    if (isHash) {
      el.modeToggleContainer.style.display = 'none';
      el.swapBtn.style.opacity = '0.3';
      el.swapBtn.style.pointerEvents = 'none';
      state.mode = 'encode'; // Hashing is always forward/encode
    } else {
      el.modeToggleContainer.style.display = 'flex';
      el.swapBtn.style.opacity = '1';
      el.swapBtn.style.pointerEvents = 'auto';
    }

    const algoHandler = algorithms[state.selectedAlgo];
    if (!algoHandler) return;

    let result = '';
    try {
      if (state.mode === 'encode') {
        const res = algoHandler.encode(text, state.params);
        if (res instanceof Promise) {
          el.outputText.value = 'Calculating cryptographic digest...';
          result = await res;
        } else {
          result = res;
        }
      } else {
        result = algoHandler.decode(text, state.params);
      }
    } catch (err) {
      result = `Error: ${err.message}`;
    }

    state.outputText = result;
    el.outputText.value = result;
    
    // Character and Word Counter
    updateCounters();
    
    // Update live step-by-step visualizer
    renderVisualization();
  }

  function updateCounters() {
    const inCount = el.inputText.value.length;
    const outCount = el.outputText.value.length;
    
    document.getElementById('input-counter').textContent = `${inCount} char${inCount !== 1 ? 's' : ''}`;
    document.getElementById('output-counter').textContent = `${outCount} char${outCount !== 1 ? 's' : ''}`;
  }

  // --- INTERACTIVE VISUALIZER ---

  function renderVisualization() {
    const algo = state.selectedAlgo;
    const input = state.inputText;
    const output = state.outputText;
    
    el.visualizerContent.innerHTML = '';
    
    if (!input) {
      el.visualizerContent.innerHTML = '<div class="vis-empty">Enter text in the input box to see live step-by-step processing.</div>';
      return;
    }

    const maxCharsToShow = 18;
    const isTruncated = input.length > maxCharsToShow;
    const displayInput = isTruncated ? input.substring(0, maxCharsToShow) : input;

    // 1. Caesar Visualizer
    if (algo === 'caesar' || algo === 'rot13') {
      const shift = algo === 'rot13' ? 13 : (parseInt(state.params.shift) || 0);
      
      let html = `<div class="vis-caesar">
        <h4>Letter Mapping (Shift: ${shift})</h4>
        <div class="alphabet-flow">
          <div class="alphabet-row original">
            <span class="row-label">PLAIN:</span>
            ${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => `<span class="letter-node val-${c}">${c}</span>`).join('')}
          </div>
          <div class="alphabet-row shifted">
            <span class="row-label">SHIFT:</span>
            ${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((c, i) => {
              const shiftedChar = String.fromCharCode(((i + shift) % 26) + 65);
              return `<span class="letter-node shifted-val-${shiftedChar}">${shiftedChar}</span>`;
            }).join('')}
          </div>
        </div>
        
        <h4 style="margin-top: 20px;">Character Processing (First ${displayInput.length} chars)</h4>
        <div class="process-flow">`;
      
      displayInput.split('').forEach((char, i) => {
        const code = char.charCodeAt(0);
        let outChar = output[i] || '';
        let isAlpha = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
        
        html += `
          <div class="process-node ${isAlpha ? 'active-alpha' : 'special-char'}">
            <div class="char-box input-char">${escapeHtml(char)}</div>
            <div class="arrow-down">↓</div>
            <div class="explanation-small">${isAlpha ? `shift +${shift}` : 'skip'}</div>
            <div class="arrow-down">↓</div>
            <div class="char-box output-char">${escapeHtml(outChar)}</div>
          </div>
        `;
      });
      
      if (isTruncated) html += `<div class="vis-more">... and ${input.length - maxCharsToShow} more characters</div>`;
      html += `</div></div>`;
      el.visualizerContent.innerHTML = html;
    }
    
    // 2. Vigenère Visualizer
    else if (algo === 'vigenere') {
      const rawKey = state.params.key || 'KEY';
      const key = rawKey.toUpperCase().replace(/[^A-Z]/g, '');
      
      if (!key) {
        el.visualizerContent.innerHTML = '<div class="vis-empty">Please enter a valid alphabetic keyword to visualize the Vigenère shift logic.</div>';
        return;
      }

      // Generate key alignment over input
      let alignedKey = '';
      let keyIdx = 0;
      const keyAlignHTML = [];
      
      displayInput.split('').forEach((char, i) => {
        const code = char.charCodeAt(0);
        const isAlpha = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
        const outChar = output[i] || '';
        
        if (isAlpha) {
          const kChar = key[keyIdx % key.length];
          const shift = kChar.charCodeAt(0) - 65;
          alignedKey += kChar;
          keyIdx++;
          
          keyAlignHTML.push(`
            <div class="process-node active-alpha">
              <div class="char-box input-char" title="Plaintext letter">${escapeHtml(char)}</div>
              <div class="node-operator">+</div>
              <div class="char-box key-char" title="Key letter (Shift: +${shift})">${kChar}</div>
              <div class="arrow-down">↓</div>
              <div class="char-box output-char" title="Ciphertext letter">${escapeHtml(outChar)}</div>
            </div>
          `);
        } else {
          keyAlignHTML.push(`
            <div class="process-node special-char">
              <div class="char-box input-char">${escapeHtml(char)}</div>
              <div class="node-operator"> </div>
              <div class="char-box key-char skipped">-</div>
              <div class="arrow-down">↓</div>
              <div class="char-box output-char">${escapeHtml(outChar)}</div>
            </div>
          `);
        }
      });

      let html = `<div class="vis-vigenere">
        <h4>Key Alignment and Shift Application</h4>
        <div class="process-flow">
          ${keyAlignHTML.join('')}
        </div>
        ${isTruncated ? `<div class="vis-more">... and ${input.length - maxCharsToShow} more characters</div>` : ''}
        
        <div class="vigenere-math-guide">
          <h5>Mathematical Equation</h5>
          <p>Ciphertext character index <code>C = (P + K) mod 26</code> where <code>P</code> is plaintext index and <code>K</code> is key index.</p>
        </div>
      </div>`;
      el.visualizerContent.innerHTML = html;
    }
    
    // 3. Rail Fence Visualizer
    else if (algo === 'railfence') {
      const rails = parseInt(state.params.rails) || 3;
      if (rails < 2) return;
      
      // We limit visualizer rails width to 30 to prevent layout breakage
      const limit = Math.min(input.length, 30);
      const subInput = input.substring(0, limit);
      
      const grid = Array.from({ length: rails }, () => Array(limit).fill('&nbsp;'));
      let r = 0;
      let dir = 1;
      
      for (let c = 0; c < limit; c++) {
        grid[r][c] = subInput[c];
        r += dir;
        if (r === rails - 1 || r === 0) dir = -dir;
      }
      
      let html = `<div class="vis-railfence">
        <h4>Zig-Zag Path Grid (First ${limit} chars)</h4>
        <div class="railfence-grid" style="grid-template-rows: repeat(${rails}, 1fr)">`;
        
      for (let row = 0; row < rails; row++) {
        html += `<div class="rail-row">
          <span class="rail-num">Rail ${row + 1}:</span>
          <div class="rail-cells">`;
        for (let col = 0; col < limit; col++) {
          const char = grid[row][col];
          const hasChar = char !== '&nbsp;';
          html += `<span class="rail-cell ${hasChar ? 'filled' : 'empty'}">${escapeHtml(char)}</span>`;
        }
        html += `</div></div>`;
      }
      
      html += `</div>
        <p class="vis-desc-sub">
          <strong>How it works:</strong> The message is written in a zig-zag format across the lines, 
          then read line-by-line: 
          <code>${output.length > 40 ? output.substring(0, 40) + '...' : output}</code>
        </p>
      </div>`;
      el.visualizerContent.innerHTML = html;
    }
    
    // 4. Base64 Bitwise Visualizer
    else if (algo === 'base64') {
      let html = `<div class="vis-base64">
        <h4>Base64 Encoding Map: 3 Bytes (24 bits) to 4 Characters (6 bits each)</h4>`;

      // Take first 3 chars of input
      const sample = input.substring(0, 3);
      const bytes = new TextEncoder().encode(sample);
      
      if (bytes.length > 0) {
        let binaryStr = '';
        bytes.forEach(b => {
          binaryStr += b.toString(2).padStart(8, '0');
        });

        // Split binary string into 6-bit chunks
        const chunks = [];
        for (let i = 0; i < 24; i += 6) {
          if (i < binaryStr.length) {
            chunks.push(binaryStr.substr(i, 6));
          } else if (binaryStr.length > 0) {
            // Padding bits
            const padLen = 6 - (binaryStr.length - i);
            if (padLen < 6) {
              chunks.push(binaryStr.substr(i) + '0'.repeat(padLen));
            }
          }
        }

        const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        const resultChars = chunks.map((chunk, idx) => {
          // Check if it's pure padding
          const bitIndex = idx * 6;
          if (bitIndex >= binaryStr.length) return '=';
          const decimal = parseInt(chunk, 2);
          return base64Chars[decimal];
        });
        
        while (resultChars.length < 4) {
          resultChars.push('=');
        }

        html += `
          <div class="b64-vis-block">
            <div class="b64-row">
              <span class="b64-cell-label">Plain Text:</span>
              <div class="b64-cells">
                ${Array.from(sample).map(c => `<span class="b64-cell text-cell">${escapeHtml(c)}</span>`).join('')}
                ${sample.length < 3 ? '<span class="b64-cell text-cell pad-cell">[Padding]</span>'.repeat(3 - sample.length) : ''}
              </div>
            </div>
            
            <div class="b64-row">
              <span class="b64-cell-label">Byte Values (Decimal):</span>
              <div class="b64-cells">
                ${Array.from(bytes).map(b => `<span class="b64-cell dec-cell">${b}</span>`).join('')}
                ${bytes.length < 3 ? '<span class="b64-cell dec-cell pad-cell">0</span>'.repeat(3 - bytes.length) : ''}
              </div>
            </div>
            
            <div class="b64-row">
              <span class="b64-cell-label">Binary Bits (8-bit):</span>
              <div class="b64-cells bin-row">
                ${Array.from(bytes).map(b => `<span class="b64-cell bin-cell">${b.toString(2).padStart(8, '0')}</span>`).join('')}
                ${bytes.length < 3 ? '<span class="b64-cell bin-cell pad-cell">00000000</span>'.repeat(3 - bytes.length) : ''}
              </div>
            </div>
            
            <div class="vis-divider">Regrouping into 6-bit blocks ↓</div>
            
            <div class="b64-row">
              <span class="b64-cell-label">6-bit Binary Chunks:</span>
              <div class="b64-cells-six">
                ${chunks.map((chunk, idx) => {
                  const isPad = (idx * 6) >= binaryStr.length;
                  return `<span class="b64-cell bin6-cell ${isPad ? 'pad-cell' : ''}">${chunk}</span>`;
                }).join('')}
                ${chunks.length < 4 ? '<span class="b64-cell bin6-cell pad-cell">000000</span>'.repeat(4 - chunks.length) : ''}
              </div>
            </div>

            <div class="b64-row">
              <span class="b64-cell-label">Base64 Index Dec:</span>
              <div class="b64-cells-six">
                ${chunks.map((chunk, idx) => {
                  const isPad = (idx * 6) >= binaryStr.length;
                  const dec = parseInt(chunk, 2);
                  return `<span class="b64-cell dec6-cell ${isPad ? 'pad-cell' : ''}">${isPad ? '-' : dec}</span>`;
                }).join('')}
                ${chunks.length < 4 ? '<span class="b64-cell dec6-cell pad-cell">-</span>'.repeat(4 - chunks.length) : ''}
              </div>
            </div>
            
            <div class="b64-row">
              <span class="b64-cell-label">Base64 Character:</span>
              <div class="b64-cells-six">
                ${resultChars.map(c => `<span class="b64-cell char6-cell ${c === '=' ? 'pad-cell' : ''}">${c}</span>`).join('')}
              </div>
            </div>
          </div>
          <p class="vis-desc-sub" style="margin-top: 15px;">
            This bitwise operation runs for every block of 3 bytes of your text to generate the Base64 representation.
          </p>
        `;
      } else {
        html += '<div class="vis-empty">Please type some characters to visualize.</div>';
      }
      html += '</div>';
      el.visualizerContent.innerHTML = html;
    }
    
    // 5. AES-GCM Visualizer
    else if (algo === 'aes_gcm') {
      const pass = state.params.passphrase || 'CryptoPass123!';
      const salt = state.params.salt || 'SaltWord';
      
      el.visualizerContent.innerHTML = `
        <div class="vis-hash-block">
          <h4>AES-GCM 256-bit Encrypted Block Pipeline</h4>
          <div class="aes-vis-pipeline">
            <div class="aes-step">
              <div class="aes-title">1. Key Derivation (PBKDF2)</div>
              <div class="aes-box">Passphrase: <code>"${escapeHtml(pass)}"</code> + Salt: <code>"${escapeHtml(salt)}"</code> ──► PBKDF2 (10k rounds) ──► 256-bit Secret Key</div>
            </div>
            
            <div class="aes-connector">↓</div>
            
            <div class="aes-step">
              <div class="aes-title">2. GCM Initialization Vector (IV)</div>
              <div class="aes-box">Generated 12-byte random cryptographic nonce: <code>${state.mode === 'encode' ? 'Dynamic Random Nonce' : 'Extracted from hex payload header'}</code></div>
            </div>
            
            <div class="aes-connector">↓</div>
            
            <div class="aes-step">
              <div class="aes-title">3. AES Galois Counter Mode Engine</div>
              <div class="aes-box main-engine">
                Plaintext <code>"${escapeHtml(displayInput)}${isTruncated ? '...' : ''}"</code> ──► [AES Engine + Key + IV + Counter] ──► Ciphertext + 16-byte Authenticated Tag (Integrity)
              </div>
            </div>
            
            <div class="aes-connector">↓</div>
            
            <div class="aes-step">
              <div class="aes-title">4. Combined Output Payload</div>
              <div class="aes-box final-payload">
                Format: <code>[12-byte IV] + [Encrypted Data] + [16-byte Auth Tag]</code> (encoded in Hex)
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    // 6. RSA-OAEP Visualizer
    else if (algo === 'rsa_oaep') {
      const hasPub = (state.params.publicKey || '').trim().length > 0;
      const hasPriv = (state.params.privateKey || '').trim().length > 0;
      
      el.visualizerContent.innerHTML = `
        <div class="vis-hash-block">
          <h4>RSA-OAEP 2048-bit Asymmetric Pipeline</h4>
          <div class="rsa-vis-pipeline">
            <div class="rsa-keys-status">
              <span class="key-status-badge ${hasPub ? 'active' : 'inactive'}">Public Key: ${hasPub ? 'LOADED ✓' : 'EMPTY ✗'}</span>
              <span class="key-status-badge ${hasPriv ? 'active' : 'inactive'}">Private Key: ${hasPriv ? 'LOADED ✓' : 'EMPTY ✗'}</span>
            </div>
            
            <div class="rsa-flow-chart">
              <div class="rsa-node">
                <span class="rsa-node-label">Plaintext Input</span>
                <code>"${escapeHtml(displayInput)}${isTruncated ? '...' : ''}"</code>
              </div>
              <div class="rsa-math-arrow">
                <span>Encrypt (with Public Key)</span>
                <span class="rsa-math">C = M<sup>e</sup> mod n</span>
                <span>───►</span>
              </div>
              <div class="rsa-node cipher-node">
                <span class="rsa-node-label">Ciphertext (Hex)</span>
                <code>${output && !output.includes('Error') ? output.substring(0, 16) + '...' : 'Waiting...'}</code>
              </div>
              <div class="rsa-math-arrow">
                <span>Decrypt (with Private Key)</span>
                <span class="rsa-math">M = C<sup>d</sup> mod n</span>
                <span>───►</span>
              </div>
              <div class="rsa-node">
                <span class="rsa-node-label">Recovered Text</span>
                <code>Plain Message</code>
              </div>
            </div>
            <p class="vis-desc-sub" style="margin-top: 15px; text-align: center;">
              RSA relies on the prime factorization mathematical trapdoor: computing keys is easy, but factoring their product <code>n = p * q</code> is computationally impossible.
            </p>
          </div>
        </div>
      `;
    }
    
    // 7. ECDSA Visualizer
    else if (algo === 'ecdsa') {
      const hasPub = (state.params.publicKey || '').trim().length > 0;
      const hasPriv = (state.params.privateKey || '').trim().length > 0;
      const sig = state.params.signature || '';
      
      el.visualizerContent.innerHTML = `
        <div class="vis-hash-block">
          <h4>ECDSA Elliptic Curve P-256 Digital Signatures</h4>
          <div class="ecdsa-vis-pipeline">
            <div class="rsa-keys-status">
              <span class="key-status-badge ${hasPriv ? 'active' : 'inactive'}">Private Key (Sign): ${hasPriv ? 'LOADED ✓' : 'EMPTY ✗'}</span>
              <span class="key-status-badge ${hasPub ? 'active' : 'inactive'}">Public Key (Verify): ${hasPub ? 'LOADED ✓' : 'EMPTY ✗'}</span>
            </div>
            
            <div class="ecdsa-split-views">
              <div class="ecdsa-card-panel">
                <h5>1. Signing Flow (Encrypt/Sign Mode)</h5>
                <div class="ecdsa-box-concept">
                  <code>Plain Message</code> + <code>Private Key</code> ──► <strong>ECDSA Sign (SHA-256)</strong> ──► <code>Signature (Hex)</code>
                </div>
              </div>
              
              <div class="ecdsa-card-panel">
                <h5>2. Verification Flow (Decrypt/Verify Mode)</h5>
                <div class="ecdsa-box-concept">
                  <code>Plain Message</code> + <code>Public Key</code> + <code>Signature</code> ──► <strong>ECDSA Verify</strong> ──► <code>Valid / Invalid Badge</code>
                </div>
              </div>
            </div>
            
            <div class="signature-display-box" style="margin-top: 15px;">
              <strong>Active Signature:</strong> <code>${sig ? sig.substring(0, 32) + '...' : '(None Generated)'}</code>
            </div>
          </div>
        </div>
      `;
    }
    
    // 8. PBKDF2 Visualizer
    else if (algo === 'pbkdf2') {
      const salt = state.params.salt || 'salt';
      const iterations = state.params.iterations || 10000;
      const hashName = state.params.hash || 'SHA-256';
      
      el.visualizerContent.innerHTML = `
        <div class="vis-hash-block">
          <h4>PBKDF2 Key Stretching Engine</h4>
          <div class="pbkdf2-vis-flow">
            <div class="pbkdf-input-bubble">
              Password: <code>"${escapeHtml(displayInput)}${isTruncated ? '...' : ''}"</code>
            </div>
            <div class="pbkdf-arrow">↓</div>
            <div class="pbkdf-loop-block">
              <div class="loop-iterations">Iterations Loop: ${iterations.toLocaleString()} rounds</div>
              <div class="loop-math">DerivedKey<sub>i</sub> = HMAC-${hashName}(Password, Salt + Iteration<sub>i</sub>)</div>
              <div class="loop-subtext">Adding salt prevents rainbow table attacks and stretches computation time</div>
            </div>
            <div class="pbkdf-arrow">↓</div>
            <div class="pbkdf-output-bubble">
              Derived Key: <code>${output && !output.startsWith('Error') ? output.substring(0, 24) + '...' : 'Waiting...'}</code>
            </div>
          </div>
        </div>
      `;
    }
    
    // 9. Keccak-256 Visualizer
    else if (algo === 'keccak256') {
      el.visualizerContent.innerHTML = `
        <div class="vis-hash-block">
          <h4>Keccak-256 Hashing Block</h4>
          <div class="hash-concept-diagram">
            <div class="hash-input-bubble" title="Message of arbitrary size">${escapeHtml(displayInput)}${isTruncated ? '...' : ''}</div>
            <div class="hash-pipe-arrow">───►</div>
            <div class="hash-function-block" style="border-color: var(--accent-purple);">
              <div class="hash-fn-name" style="color: var(--accent-purple);">Keccak-256 Engine</div>
              <div class="hash-fn-details" style="color: var(--accent-cyan);">Ethereum Wallet/Address Standard</div>
            </div>
            <div class="hash-pipe-arrow">───►</div>
            <div class="hash-output-bubble" style="color: var(--accent-purple); border-color: rgba(168, 85, 247, 0.3); background: rgba(168, 85, 247, 0.1);" title="Fixed 64-character hash">${output && !output.startsWith('Error') ? output.substring(0, 20) + '...' : 'Waiting...'}</div>
          </div>
          
          <div class="keccak-blockchain-use" style="margin-top: 15px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 8px; font-size: 0.75rem; border-left: 3px solid var(--accent-purple); width: 100%; max-width: 600px;">
            <h5>Blockchain Application Example:</h5>
            <p style="margin-top: 3px;">
              An Ethereum Address is generated by taking the public key (64 bytes), hashing it with <strong>Keccak-256</strong>, and keeping the last 20 bytes:
            </p>
            <p style="margin-top: 5px; font-family: var(--font-mono); color: var(--accent-cyan);">
              Keccak256(PubKey) ──► <code>0x${output && !output.startsWith('Error') ? output.substring(0, 16) : '...'}...</code> ──► Last 40 hex chars ──► Address: <code>0x${output && output.length === 64 && !output.startsWith('Error') ? output.substring(24, 64) : '...'}</code>
            </p>
          </div>
        </div>
      `;
    }
    
    // 10. Binary/Hex/Morse/URL Simple Translation Visualizer
    else {
      let label = 'Encoded Character';
      let title = 'Char-by-Char Mapping';
      
      if (algo === 'hex') {
        label = 'Hex Byte';
        title = 'Hexadecimal Conversion Table';
      } else if (algo === 'binary') {
        label = '8-Bit Binary';
        title = 'Binary Conversion Table';
      } else if (algo === 'morse') {
        label = 'Morse Pattern';
        title = 'Morse Code Translation';
      } else if (algo === 'url') {
        label = 'URL Equivalent';
        title = 'URL Character Percent-Encoding';
      } else if (algo.startsWith('sha')) {
        title = 'Cryptographic Hash Generation';
        el.visualizerContent.innerHTML = `
          <div class="vis-hash-block">
            <h4>${title}</h4>
            <div class="hash-concept-diagram">
              <div class="hash-input-bubble" title="Message of arbitrary size">${escapeHtml(displayInput)}${isTruncated ? '...' : ''}</div>
              <div class="hash-pipe-arrow">───►</div>
              <div class="hash-function-block">
                <div class="hash-fn-name">${ciphersData[algo].name} Engine</div>
                <div class="hash-fn-details">One-Way Math Compression</div>
              </div>
              <div class="hash-pipe-arrow">───►</div>
              <div class="hash-output-bubble" title="Fixed length output hex string">${output.substring(0, 20)}...</div>
            </div>
            <p class="vis-desc-sub" style="margin-top: 15px; text-align: center;">
              A cryptographic hash function processes input through iterative bitwise compression rounds.
              It is impossible to retrieve the input from the hash because data is mixed, shifted, and truncated during hashing.
            </p>
          </div>
        `;
        return;
      }

      // Standard Map Table
      let tableRows = [];
      const len = Math.min(input.length, 10);
      
      if (algo === 'morse') {
        input.toUpperCase().substring(0, len).split('').forEach(char => {
          const m = morseCodeMap[char] || '(skip)';
          tableRows.push(`
            <tr>
              <td><code>'${escapeHtml(char === ' ' ? 'Space' : char)}'</code></td>
              <td><span class="code-badge morse-badge">${m}</span></td>
            </tr>
          `);
        });
      } else if (algo === 'hex') {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(input.substring(0, len));
        Array.from(bytes).forEach((b, idx) => {
          const char = input[idx] || '';
          tableRows.push(`
            <tr>
              <td><code>'${escapeHtml(char)}'</code> <span class="byte-val">(Dec: ${b})</span></td>
              <td><span class="code-badge hex-badge">0x${b.toString(16).toUpperCase().padStart(2, '0')}</span></td>
            </tr>
          `);
        });
      } else if (algo === 'binary') {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(input.substring(0, len));
        Array.from(bytes).forEach((b, idx) => {
          const char = input[idx] || '';
          tableRows.push(`
            <tr>
              <td><code>'${escapeHtml(char)}'</code> <span class="byte-val">(Dec: ${b})</span></td>
              <td><span class="code-badge bin-badge">${b.toString(2).padStart(8, '0')}</span></td>
            </tr>
          `);
        });
      } else if (algo === 'url') {
        input.substring(0, len).split('').forEach(char => {
          const encoded = encodeURIComponent(char);
          const changed = char !== encoded;
          tableRows.push(`
            <tr>
              <td><code>'${escapeHtml(char)}'</code></td>
              <td><span class="code-badge url-badge ${changed ? 'changed' : 'unchanged'}">${escapeHtml(encoded)}</span></td>
            </tr>
          `);
        });
      }

      let html = `
        <div class="vis-mapping-table">
          <h4>${title} (First ${len} chars)</h4>
          <table class="mapping-table">
            <thead>
              <tr>
                <th>Plain Input</th>
                <th>${label}</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows.join('')}
            </tbody>
          </table>
          ${input.length > len ? `<div class="vis-more-small">... and ${input.length - len} more characters</div>` : ''}
        </div>
      `;
      el.visualizerContent.innerHTML = html;
    }
  }

  function escapeHtml(string) {
    if (!string) return '&nbsp;';
    return string
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- CATALOG RENDERER ---

  function renderCatalog() {
    el.catalogGrid.innerHTML = '';
    
    // Group by category
    const categories = {
      ciphers: { title: 'Ciphers & Cryptography', icon: '🔒' },
      encoders: { title: 'Encoders & Formatters', icon: '📝' },
      hashes: { title: 'Cryptographic Hashes', icon: '🔑' }
    };

    Object.entries(categories).forEach(([catKey, catMeta]) => {
      const section = document.createElement('div');
      section.className = 'catalog-section';
      
      const title = document.createElement('h3');
      title.className = 'catalog-sec-title';
      title.innerHTML = `${catMeta.icon} ${catMeta.title}`;
      section.appendChild(title);
      
      const cardsGrid = document.createElement('div');
      cardsGrid.className = 'catalog-cards-grid';
      
      Object.entries(ciphersData)
        .filter(([_, data]) => data.category === catKey)
        .forEach(([algoKey, data]) => {
          const card = document.createElement('div');
          card.className = 'catalog-card';
          
          card.innerHTML = `
            <h4>${data.name}</h4>
            <p>${data.shortDesc}</p>
            <div class="card-footer">
              <span class="badge-${catKey}">${catKey.toUpperCase()}</span>
              <button class="card-action-btn" data-algo="${algoKey}">Open in Workbench</button>
            </div>
          `;
          
          cardsGrid.appendChild(card);
        });
        
      section.appendChild(cardsGrid);
      el.catalogGrid.appendChild(section);
    });

    // Add event listeners to the catalog actions
    el.catalogGrid.querySelectorAll('.card-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const algo = e.target.getAttribute('data-algo');
        switchToWorkbenchAlgo(algo);
      });
    });
  }

  function switchToWorkbenchAlgo(algo) {
    state.selectedAlgo = algo;
    el.algoSelector.value = algo;
    
    // Switch views
    el.tabs.forEach(t => t.classList.remove('active'));
    document.querySelector('.nav-tab[data-view="workbench"]').classList.add('active');
    
    el.viewWorkbench.style.display = 'grid';
    el.viewCatalog.style.display = 'none';
    
    // Update algorithm description & history panel
    updateAlgoDetails();
    
    // Re-render parameters & compute
    renderParams();
    triggerConversion();
  }

  function updateAlgoDetails() {
    const data = ciphersData[state.selectedAlgo];
    if (!data) return;

    el.detailTitle.textContent = data.name;
    el.detailCategory.textContent = data.category.toUpperCase();
    el.detailCategory.className = `category-badge cat-${data.category}`;
    el.detailDesc.textContent = data.description;
    el.detailHistory.textContent = data.history;
    el.detailStrengths.textContent = data.strengths;
    el.detailWeaknesses.textContent = data.weaknesses;
    el.detailComplexity.textContent = data.complexity;

    // Presets
    el.detailPresetsContainer.innerHTML = '';
    if (data.presets && data.presets.length > 0) {
      data.presets.forEach(preset => {
        const btn = document.createElement('button');
        btn.className = 'preset-btn';
        btn.textContent = preset.name;
        btn.addEventListener('click', () => {
          Object.entries(preset.params).forEach(([pk, pv]) => {
            state.params[pk] = pv;
            const inputField = document.getElementById(`param-${pk}`);
            if (inputField) {
              inputField.value = pv;
              const valBadge = document.getElementById(`param-val-${pk}`);
              if (valBadge) valBadge.textContent = pv;
            }
          });
          triggerConversion();
        });
        el.detailPresetsContainer.appendChild(btn);
      });
    } else {
      el.detailPresetsContainer.innerHTML = '<p class="no-params-text">No presets for this algorithm.</p>';
    }
  }

  // --- EVENT LISTENERS & INITIALIZATION ---

  // Navigation
  el.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.getAttribute('data-view');
      el.tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (view === 'workbench') {
        el.viewWorkbench.style.display = 'grid';
        el.viewCatalog.style.display = 'none';
        triggerConversion(); // Refresh output state
      } else {
        el.viewWorkbench.style.display = 'none';
        el.viewCatalog.style.display = 'block';
        renderCatalog();
      }
    });
  });

  // Algorithm selector dropdown change
  el.algoSelector.addEventListener('change', (e) => {
    state.selectedAlgo = e.target.value;
    updateAlgoDetails();
    renderParams();
    triggerConversion();
  });

  // Mode Selection (Encode vs Decode)
  el.modeEncode.addEventListener('click', () => {
    state.mode = 'encode';
    el.modeEncode.classList.add('active');
    el.modeDecode.classList.remove('active');
    triggerConversion();
  });

  el.modeDecode.addEventListener('click', () => {
    state.mode = 'decode';
    el.modeDecode.classList.add('active');
    el.modeEncode.classList.remove('active');
    triggerConversion();
  });

  // Input Changes
  el.inputText.addEventListener('input', () => {
    if (state.autoConvert) {
      triggerConversion();
    }
  });

  // Convert Button
  el.convertBtn.addEventListener('click', () => {
    triggerConversion();
  });

  // Auto Convert Toggle
  el.autoConvertCheck.addEventListener('change', (e) => {
    state.autoConvert = e.target.checked;
    el.convertBtn.style.display = state.autoConvert ? 'none' : 'block';
  });

  // Clipboard Copiers
  el.copyInputBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(el.inputText.value);
    showToast('Input text copied to clipboard!');
  });

  el.copyOutputBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(el.outputText.value);
    showToast('Output result copied to clipboard!');
  });

  // Clear Input
  el.clearInputBtn.addEventListener('click', () => {
    el.inputText.value = '';
    triggerConversion();
    el.inputText.focus();
  });

  // Swap Input & Output (if not a hashing algorithm)
  el.swapBtn.addEventListener('click', () => {
    const isHash = ciphersData[state.selectedAlgo].category === 'hashes';
    if (isHash) return;

    const currentOut = el.outputText.value;
    // Swap text
    el.inputText.value = currentOut;
    
    // Swap mode
    state.mode = state.mode === 'encode' ? 'decode' : 'encode';
    if (state.mode === 'encode') {
      el.modeEncode.classList.add('active');
      el.modeDecode.classList.remove('active');
    } else {
      el.modeDecode.classList.add('active');
      el.modeEncode.classList.remove('active');
    }

    triggerConversion();
    showToast('Swapped input/output and inverted mode!');
  });

  // Toast notifier helper
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('visible');
    }, 50);

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2500);
  }

  // --- BOOTSTRAP ---
  // Populate dropdown options
  el.algoSelector.innerHTML = '';
  const categories = {
    ciphers: 'Ciphers',
    encoders: 'Encoders / Decoders',
    hashes: 'Cryptographic Hashes'
  };

  Object.entries(categories).forEach(([catKey, catName]) => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = catName;
    
    Object.entries(ciphersData)
      .filter(([_, d]) => d.category === catKey)
      .forEach(([key, d]) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = d.name;
        if (key === state.selectedAlgo) opt.selected = true;
        optgroup.appendChild(opt);
      });
      
    el.algoSelector.appendChild(optgroup);
  });

  // Initial render
  updateAlgoDetails();
  renderParams();
  triggerConversion();
});
