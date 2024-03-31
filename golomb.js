const fs = require('fs');

// Fungsi untuk mengonversi string hexadecimal menjadi array of bytes
function hexToBytes(hex) {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return bytes;
}

// Fungsi untuk mengonversi array of bytes menjadi string hexadecimal
function bytesToHex(bytes) {
    return Buffer.from(bytes).toString('hex');
}

// Fungsi untuk mengonversi bilangan bulat ke representasi biner
function intToBinary(num) {
    return num.toString(2);
}

// Fungsi untuk mengonversi representasi biner ke bilangan bulat
function binaryToInt(binary) {
    return parseInt(binary, 2);
}

// Fungsi untuk mengompresi data menggunakan algoritma Golomb
function compressGolomb(data, n) {
    const compressedData = [];
    const div = Math.pow(2, n);

    data.forEach(num => {
        const q = Math.floor(num / div);
        const r = num % div;
        compressedData.push('1'.repeat(q) + '0' + intToBinary(r));
    });

    return compressedData.join('');
}

// Fungsi untuk mengonversi data kompresi menjadi ASCII dari nilai biner
function compressedToASCII(compressedData) {
    const numBytes = Math.ceil(compressedData.length / 8);
    const bytes = [];

    for (let i = 0; i < numBytes; i++) {
        const byte = compressedData.substr(i * 8, 8);
        bytes.push(binaryToInt(byte));
    }

    return Buffer.from(bytes).toString('ascii');
}

// Baca file PDF dan ubah menjadi string hexadecimal
const pdfData = fs.readFileSync('sample.pdf');
const hexString = pdfData.toString('hex');

// Konversi string hexadecimal menjadi array of bytes
const bytesArray = hexToBytes(hexString);

// Contoh nilai parameter n
const n = 3;

// Kompresi data menggunakan algoritma Golomb
const compressedData = compressGolomb(bytesArray, n);

// Konversi data kompresi menjadi ASCII
const compressedASCII = compressedToASCII(compressedData);

// Simpan data kompresi ke dalam file
fs.writeFileSync('compressed.pdf', compressedASCII);

console.log('File PDF berhasil dikompresi menggunakan algoritma Golomb.');
