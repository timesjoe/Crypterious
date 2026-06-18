/**
 * Crypterious Workbench - Algorithm Metadata
 */

const ciphersData = {
  // Ciphers
  caesar: {
    name: 'Caesar Cipher',
    category: 'ciphers',
    shortDesc: 'A simple substitution cipher where each letter is shifted by a fixed number of positions.',
    description: 'The Caesar Cipher is one of the simplest and most widely known encryption techniques. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet.',
    history: 'Named after Julius Caesar, who, according to Suetonius, used it with a shift of three to protect messages of military significance. While Caesar\'s is the first recorded use, other substitution ciphers are known to have been used earlier.',
    strengths: 'Extremely simple to understand and implement. Good for teaching basic cryptography concepts.',
    weaknesses: 'Extremely weak. With only 25 possible keys (excluding a shift of 0/26), it can be easily brute-forced in milliseconds. It is also vulnerable to frequency analysis.',
    complexity: 'O(N) time complexity, where N is the length of the message. Space complexity is O(N) to store the result.',
    params: [
      {
        id: 'shift',
        name: 'Shift Value',
        type: 'number',
        min: 1,
        max: 25,
        default: 3,
        description: 'Number of positions to shift each letter in the alphabet.'
      }
    ],
    presets: [
      { name: 'Caesar\'s Shift (3)', params: { shift: 3 } },
      { name: 'ROT13 equivalent (13)', params: { shift: 13 } },
      { name: 'Strong Shift (21)', params: { shift: 21 } }
    ]
  },
  vigenere: {
    name: 'Vigenère Cipher',
    category: 'ciphers',
    shortDesc: 'A method of encrypting alphabetic text by using a series of interwoven Caesar ciphers.',
    description: 'The Vigenère Cipher is a method of encrypting alphabetic text by using a series of interwoven Caesar ciphers, based on the letters of a keyword. It is a polyalphabetic substitution cipher, meaning it uses multiple substitution alphabets.',
    history: 'First described by Giovan Battista Bellaso in 1553, the cipher was later misattributed to Blaise de Vigenère in the 19th century, who published a stronger autokey cipher in 1586. It was long considered unbreakable, earning the description "le chiffre indéchiffrable" (the indecipherable cipher).',
    strengths: 'Much stronger than monoalphabetic ciphers because it flattens the frequency distribution of letters, rendering simple frequency analysis ineffective.',
    weaknesses: 'Vulnerable to Kasiski examination and index of coincidence analysis, which can determine the key length. Once the key length is found, the ciphertext can be treated as multiple interleaved Caesar ciphers and solved.',
    complexity: 'O(N) time complexity, where N is the length of the plaintext. Space complexity is O(N).',
    params: [
      {
        id: 'key',
        name: 'Keyword',
        type: 'text',
        default: 'KEY',
        placeholder: 'Enter keyword (letters only)...',
        description: 'The word used to determine the shift pattern. Repeated over the plaintext.'
      }
    ],
    presets: [
      { name: 'Classic Key', params: { key: 'SECRET' } },
      { name: 'Long Key', params: { key: 'CRYPTERIOUS' } }
    ]
  },
  rot13: {
    name: 'ROT13',
    category: 'ciphers',
    shortDesc: 'A special case of the Caesar cipher with a fixed shift of 13.',
    description: 'ROT13 ("rotate by 13 places") is a simple substitution cipher that replaces a letter with the 13th letter after it in the Latin alphabet. Because there are 26 letters in the basic Latin alphabet, ROT13 is its own inverse (applying it twice yields the original text).',
    history: 'Originating in Netnews groups in the early 1980s, ROT13 became a de facto standard for hiding spoilers, punchlines, puzzle solutions, and offensive materials from a reader\'s glance.',
    strengths: 'No key setup required; extremely fast and easy to apply.',
    weaknesses: 'Provides zero cryptographic security. Anyone who knows it is ROT13 can instantly decrypt it.',
    complexity: 'O(N) time complexity, O(N) space complexity.',
    params: [],
    presets: []
  },
  railfence: {
    name: 'Rail Fence Cipher',
    category: 'ciphers',
    shortDesc: 'A transposition cipher that writes plaintext diagonally and reads off row by row.',
    description: 'The Rail Fence Cipher (also called the Zig-Zag Cipher) is a form of transposition cipher. It obtains its name from the way in which the plaintext is written down diagonally on successive "rails" of an imaginary fence, then read off row by row.',
    history: 'Historically used in ancient Greece and during the American Civil War by both Union and Confederate forces as a quick, manual cipher system.',
    strengths: 'Scrambles the order of letters, breaking up common digrams and trigrams. Cannot be cracked with simple monoalphabetic substitution analysis.',
    weaknesses: 'Very small key space (number of rails is usually small compared to text length). Easily broken by trying a few possible rail counts and reading the columns.',
    complexity: 'O(N) time complexity, O(N) space complexity.',
    params: [
      {
        id: 'rails',
        name: 'Number of Rails',
        type: 'number',
        min: 2,
        max: 10,
        default: 3,
        description: 'The height of the fence (number of rows used to write the message in a zig-zag pattern).'
      }
    ],
    presets: [
      { name: 'Standard (3 Rails)', params: { rails: 3 } },
      { name: 'Deep Fence (5 Rails)', params: { rails: 5 } }
    ]
  },

  // Encoders
  base64: {
    name: 'Base64 Encoding',
    category: 'encoders',
    shortDesc: 'Encodes binary data into an ASCII string format using 64 safe characters.',
    description: 'Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It translates every 3 bytes (24 bits) of data into 4 characters (6 bits each) from a set of 64 characters (A-Z, a-z, 0-9, +, /) along with padding (=).',
    history: 'Designed in the early days of email (MIME protocol) to ensure that binary attachments (like images or documents) could be safely transmitted over communication channels that were originally designed to handle text only.',
    strengths: 'Ensures data integrity during transport across systems that may interpret control characters differently. Universally supported.',
    weaknesses: 'Not a form of encryption. It is fully reversible without any key. It increases data size by approximately 33%.',
    complexity: 'O(N) time complexity, where N is the length of data. Space complexity is O(N).',
    params: [],
    presets: []
  },
  hex: {
    name: 'Hexadecimal (Base 16)',
    category: 'encoders',
    shortDesc: 'Encodes bytes into a readable string of base-16 digits (0-9, A-F).',
    description: 'Hexadecimal encoding converts each byte (8 bits) of input into two base-16 digits (0-9, A-F or a-f). Each nibble (4 bits) corresponds directly to one hex digit.',
    history: 'A foundational representation in computer science, used to present memory addresses, color codes (HTML hex colors), and raw binary strings in a human-readable format.',
    strengths: 'Exact, fixed-width representation of binary data (2 characters per byte). Easy to parse and read.',
    weaknesses: 'Provides zero security. Doubles the size of the data representation.',
    complexity: 'O(N) time complexity, O(N) space complexity.',
    params: [
      {
        id: 'separator',
        name: 'Separator',
        type: 'select',
        options: [
          { value: 'none', label: 'None (e.g., 48656c6c6f)' },
          { value: 'space', label: 'Space (e.g., 48 65 6c 6c 6f)' },
          { value: 'colon', label: 'Colon (e.g., 48:65:6c:6c:6f)' },
          { value: 'prefix', label: 'Hex Prefix (e.g., \\x48\\x65)' }
        ],
        default: 'none',
        description: 'How to separate individual byte representations in the output.'
      }
    ],
    presets: [
      { name: 'Compact Hex', params: { separator: 'none' } },
      { name: 'Spaced Bytes', params: { separator: 'space' } }
    ]
  },
  binary: {
    name: 'Binary (Base 2)',
    category: 'encoders',
    shortDesc: 'Converts text characters to their raw 8-bit binary representation.',
    description: 'Binary encoding converts text characters into their binary form (0s and 1s) based on their character encoding (typically ASCII/UTF-8 byte values). Each character is shown as an 8-bit block.',
    history: 'Binary is the fundamental language of digital computers, representing the low-level state of transistors (off/on, 0/1).',
    strengths: 'Provides a direct view of how data is stored at the lowest level in computer hardware.',
    weaknesses: 'Extremely verbose (8 characters of output per character of input). No security.',
    complexity: 'O(N) time complexity, O(N) space complexity.',
    params: [
      {
        id: 'separator',
        name: 'Group Separator',
        type: 'select',
        options: [
          { value: 'space', label: 'Space (e.g., 01001000 01000101)' },
          { value: 'none', label: 'None (e.g., 0100100001000101)' }
        ],
        default: 'space',
        description: 'Whether to separate 8-bit chunks with spaces for readability.'
      }
    ],
    presets: []
  },
  url: {
    name: 'URL Encoding (Percent Encoding)',
    category: 'encoders',
    shortDesc: 'Converts reserved or unsafe characters into percent-encoded formats for safe URL transfer.',
    description: 'URL Encoding, also known as Percent Encoding, is a mechanism for encoding information in a Uniform Resource Identifier (URI). Characters that are not allowed in URLs are replaced with a percent sign (%) followed by their hexadecimal ASCII value.',
    history: 'Defined in RFC 3986 to ensure URLs are transmitted safely across the internet without parts of the path, query parameters, or hash being misinterpreted as control characters.',
    strengths: 'Ensures special characters (like ?, &, =, spaces) are preserved when sent inside URL parameters.',
    weaknesses: 'Not encryption. Highly readable, easily decoded by any browser.',
    complexity: 'O(N) time complexity.',
    params: [],
    presets: []
  },
  morse: {
    name: 'Morse Code',
    category: 'encoders',
    shortDesc: 'Translates letters and numbers into sequences of dots (short signals) and dashes (long signals).',
    description: 'Morse Code is a method used in telecommunication to encode text characters as standardized sequences of two different signal durations, called dots (dit) and dashes (dah).',
    history: 'Developed by Samuel Morse and Alfred Vail in the 1830s for the electrical telegraph system. It revolutionized long-distance communication and was crucial in aviation, maritime distress signaling (SOS), and military operations.',
    strengths: 'Can be transmitted via audio, light flashes, electrical pulses, or manual tapping. Highly resilient to noise over long distances.',
    weaknesses: 'Very slow to transmit and decode manually. Case-insensitive and limited support for special characters.',
    complexity: 'O(N) time complexity.',
    params: [],
    presets: []
  },

  // Hashes
  sha256: {
    name: 'SHA-256 Hash',
    category: 'hashes',
    shortDesc: 'A cryptographic hash function that generates a fixed-size 256-bit (32-byte) unique signature.',
    description: 'SHA-256 (Secure Hash Algorithm 2) is a cryptographic hash function designed by the United States National Security Agency (NSA). It takes an input of any size and produces a fixed-length 256-bit output. Cryptographic hashes are "one-way"—it is computationally infeasible to reconstruct the input from the hash.',
    history: 'Published in 2001, SHA-2 is widely used in security protocols (SSL/TLS, SSH), code signing, and forms the basis of the Bitcoin consensus mechanism.',
    strengths: 'Collision resistant (extremely hard to find two different inputs with the same hash) and exhibits a strong avalanche effect (a tiny change in input completely changes the output hash).',
    weaknesses: 'Vulnerable to length extension attacks, which is why HMAC is preferred for message authentication. Also, with the rise of ASICs, raw SHA-256 is fast to compute, making it less suitable for password hashing without a salt and slow-down wrapper (like bcrypt/argon2).',
    complexity: 'O(N) time complexity, where N is the length of the message. Space complexity is O(1) as the output size is always 64 hex characters.',
    params: [],
    presets: []
  },
  sha1: {
    name: 'SHA-1 Hash',
    category: 'hashes',
    shortDesc: 'A legacy 160-bit cryptographic hash function, now considered cryptographically broken.',
    description: 'SHA-1 is a cryptographic hash function which takes an input and produces a 160-bit (20-byte) hash value known as a message digest. It is now considered insecure and has been deprecated for cryptographic purposes.',
    history: 'Designed by the NSA and published in 1995 as a Federal Information Processing Standard. In 2017, CWI Amsterdam and Google announced they had generated a collision attack against SHA-1 (the SHAttered attack).',
    strengths: 'Very fast to compute. Still widely used for non-cryptographic checksum verification (such as in Git commit IDs).',
    weaknesses: 'No longer secure against collision attacks. A well-funded adversary can create two different documents that produce the exact same SHA-1 hash.',
    complexity: 'O(N) time complexity, fixed-size output of 40 hex characters.',
    params: [],
    presets: []
  },
  sha512: {
    name: 'SHA-512 Hash',
    category: 'hashes',
    shortDesc: 'A highly secure 512-bit (64-byte) cryptographic hash function from the SHA-2 family.',
    description: 'SHA-512 is a member of the SHA-2 family, producing a 512-bit message digest. It operates on 64-bit words, making it exceptionally fast on 64-bit hardware, often faster than SHA-256 on modern processors.',
    history: 'Released alongside SHA-256 in 2001, providing an even larger state size and higher security margin against quantum search algorithms (Grover\'s algorithm).',
    strengths: 'Extremely high collision resistance and resistance to quantum computing pre-image attacks due to its 512-bit output size.',
    weaknesses: 'Like SHA-256, it is vulnerable to length extension attacks and is too fast to compute for safe direct password storage.',
    complexity: 'O(N) time complexity, fixed-size output of 128 hex characters.',
    params: [],
    presets: []
  },
  keccak256: {
    name: 'Keccak-256 Hash',
    category: 'hashes',
    shortDesc: 'The standard cryptographic hash function of the Ethereum blockchain.',
    description: 'Keccak-256 is the hashing algorithm used extensively in the Ethereum blockchain (e.g. for generating Ethereum addresses, contract storage keys, and transaction hashes). While it was submitted to the NIST SHA-3 competition, NIST finalized SHA-3 with slightly different padding rules, making Keccak-256 hashes distinct from standard SHA-3 hashes.',
    history: 'Designed by Guido Bertoni, Joan Daemen, Michaël Peeters, and Gilles Van Assche. Ethereum adopted it in 2015 before NIST standardized SHA-3 (FIPS-202) in late 2015, which is why Ethereum retains the original Keccak padding.',
    strengths: 'Extremely secure, collision-resistant, and serves as the cryptographic anchor for Ethereum state trees and smart contracts.',
    weaknesses: 'Like SHA-256, it is fast to calculate, meaning it is not suitable for slow password hashing without salt stretching.',
    complexity: 'O(N) time complexity, fixed-size output of 64 hex characters.',
    params: [],
    presets: []
  },
  aes_gcm: {
    name: 'AES-GCM (Symmetric)',
    category: 'ciphers',
    shortDesc: 'Advanced Encryption Standard in Galois/Counter Mode. Secure, high-speed authenticated encryption.',
    description: 'AES-GCM is the modern standard for symmetric encryption. It provides both confidentiality (encryption) and integrity/authenticity (verification) using an authentication tag. GCM is widely used in TLS 1.3, SSH, and secure browser-to-server communications.',
    history: 'AES was selected by NIST in 2001 (originally named Rijndael). The Galois/Counter Mode (GCM) was designed by David A. McGrew and John Viega in 2004 to provide authenticated encryption with associated data (AEAD).',
    strengths: 'Highly secure, supports hardware acceleration in most modern CPUs, and provides built-in tamper detection (authenticated encryption).',
    weaknesses: 'Extremely sensitive to IV reuse. If the same IV and key are used to encrypt two different messages, the security of GCM is completely broken (the key can be recovered).',
    complexity: 'O(N) time complexity, where N is the length of data. Performs in parallel blocks.',
    params: [
      {
        id: 'passphrase',
        name: 'Passphrase',
        type: 'text',
        default: 'CryptoPass123!',
        placeholder: 'Enter password/passphrase...',
        description: 'Used to derive the symmetric key. Running SHA-256 on this yields the 256-bit AES key.'
      },
      {
        id: 'salt',
        name: 'Salt',
        type: 'text',
        default: 'SaltWord',
        placeholder: 'Optional salt...',
        description: 'Combined with the passphrase to derive the key.'
      }
    ],
    presets: [
      { name: 'Standard Pass', params: { passphrase: 'CryptoPass123!', salt: 'SaltWord' } }
    ]
  },
  rsa_oaep: {
    name: 'RSA-OAEP (Asymmetric)',
    category: 'ciphers',
    shortDesc: 'Asymmetric encryption using RSA with Optimal Asymmetric Encryption Padding.',
    description: 'RSA-OAEP is the recommended standard for asymmetric encryption. It uses a public-private keypair: the public key is shared to encrypt data, and only the owner of the private key can decrypt it. OAEP padding adds randomness to prevent plaintext leakage.',
    history: 'RSA was first described in 1977 by Ron Rivest, Adi Shamir, and Leonard Adleman. OAEP was introduced by Mihir Bellare and Phillip Rogaway in 1994 and subsequently standardized in PKCS#1 v2.0.',
    strengths: 'Asymmetric design allows secure data transmission without sharing a pre-negotiated secret key. High security margin.',
    weaknesses: 'Slow and computationally intensive. Cannot encrypt data larger than the key size minus padding (e.g. for a 2048-bit key, maximum plaintext is 190 bytes). Normally used to encrypt a symmetric AES key, not raw large messages.',
    complexity: 'O(N^3) key generation. O(N^2) encryption/decryption. Very heavy mathematically.',
    params: [
      {
        id: 'keypair_action',
        name: 'RSA Key Management',
        type: 'button_action',
        description: 'Click to generate a fresh 2048-bit RSA-OAEP public/private keypair.'
      },
      {
        id: 'publicKey',
        name: 'RSA Public Key (PEM)',
        type: 'textarea',
        default: '',
        placeholder: '-----BEGIN PUBLIC KEY-----\n...',
        description: 'Required for Encryption. Encrypts the input message.'
      },
      {
        id: 'privateKey',
        name: 'RSA Private Key (PEM)',
        type: 'textarea',
        default: '',
        placeholder: '-----BEGIN PRIVATE KEY-----\n...',
        description: 'Required for Decryption. Decrypts the cipher text.'
      }
    ],
    presets: []
  },
  ecdsa: {
    name: 'ECDSA Signature',
    category: 'ciphers',
    shortDesc: 'Elliptic Curve Digital Signature Algorithm. Used in blockchain to verify ownership.',
    description: 'ECDSA is an asymmetric algorithm used to digitally sign messages, verifying that a message came from a specific sender. Blockchains like Bitcoin and Ethereum rely on ECDSA signatures to authorize transactions. This workbench implements the standard NIST P-256 curve.',
    history: 'Proposed by Scott Vanstone in 1992 and standardized in 1999. It adapted the Digital Signature Algorithm (DSA) to Elliptic Curve cryptography, offering the same security as RSA with much smaller key sizes.',
    strengths: 'Very small key and signature sizes (256-bit key offers same security as 3072-bit RSA). Extremely fast signing.',
    weaknesses: 'Extremely vulnerable to weak random number generators. If a random value (nonce) is reused or leaked even once during signing, the private key can be instantly calculated.',
    complexity: 'Very fast signing and verification. O(1) mathematical complexity over the base field.',
    params: [
      {
        id: 'ec_keypair_action',
        name: 'EC Key Management',
        type: 'button_action',
        description: 'Click to generate a fresh Elliptic Curve P-256 keypair.'
      },
      {
        id: 'privateKey',
        name: 'EC Private Key (PEM)',
        type: 'textarea',
        default: '',
        placeholder: '-----BEGIN PRIVATE KEY-----\n...',
        description: 'Required for Signing. Creates the digital signature.'
      },
      {
        id: 'publicKey',
        name: 'EC Public Key (PEM)',
        type: 'textarea',
        default: '',
        placeholder: '-----BEGIN PUBLIC KEY-----\n...',
        description: 'Required for Verification. Verifies the signature authenticity.'
      },
      {
        id: 'signature',
        name: 'Hex Signature',
        type: 'text',
        default: '',
        placeholder: 'Hex signature to verify...',
        description: 'Required for Verification. The signature string generated during signing.'
      }
    ],
    presets: []
  },
  pbkdf2: {
    name: 'PBKDF2 (KDF)',
    category: 'ciphers',
    shortDesc: 'Password-Based Key Derivation Function 2. Stretches keys to resist brute-force attacks.',
    description: 'PBKDF2 is a key derivation function that applies a pseudorandom function (like HMAC-SHA256) to a passphrase along with a salt, repeating this process thousands of times. It is used to turn weak user passwords into strong cryptographic keys.',
    history: 'Standardized by RSA Laboratories in Public-Key Cryptography Standards (PKCS) #5 v2.0 in 2000. It is a classic key-stretching mechanism.',
    strengths: 'Configurable work factor. By increasing the iterations, you make brute-force/dictionary attacks mathematically expensive and slow for hackers.',
    weaknesses: 'Vulnerable to ASIC/GPU hardware acceleration because it consumes very little memory. Algorithms like Argon2 or scrypt are preferred for modern password storage because they are memory-hard.',
    complexity: 'O(I) time complexity, where I is the number of iterations.',
    params: [
      {
        id: 'salt',
        name: 'Salt String',
        type: 'text',
        default: 'custom-salt-string',
        placeholder: 'Salt...',
        description: 'Protects against rainbow tables. Combined with the password.'
      },
      {
        id: 'iterations',
        name: 'Iterations Count',
        type: 'number_input',
        default: 10000,
        min: 1000,
        max: 200000,
        description: 'Number of hashing rounds (higher = slower and more secure).'
      },
      {
        id: 'hash',
        name: 'Internal Hash',
        type: 'select',
        options: [
          { value: 'SHA-256', label: 'SHA-256' },
          { value: 'SHA-512', label: 'SHA-512' },
          { value: 'SHA-1', label: 'SHA-1' }
        ],
        default: 'SHA-256',
        description: 'The hashing function used in the HMAC loop.'
      }
    ],
    presets: [
      { name: 'Standard (10k rounds)', params: { iterations: 10000, salt: 'standard-salt' } },
      { name: 'Stretched (100k rounds)', params: { iterations: 100000, salt: 'standard-salt' } }
    ]
  }
};

// Export if in Node.js environment, otherwise keep global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ciphersData };
}
