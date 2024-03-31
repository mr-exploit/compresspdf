const fs = require('fs');

// Node untuk pohon Huffman
class HuffmanNode {
    constructor(char, freq) {
        this.char = char;
        this.freq = freq;
        this.left = null;
        this.right = null;
    }
}

// Fungsi untuk membangun tabel frekuensi karakter dari data
function buildFrequencyTable(data) {
    const freqMap = new Map();
    for (const char of data) {
        freqMap.set(char, (freqMap.get(char) || 0) + 1);
    }
    return freqMap;
}

// Fungsi untuk membangun pohon Huffman dari tabel frekuensi
function buildHuffmanTree(freqMap) {
    const priorityQueue = [];
    for (const [char, freq] of freqMap.entries()) {
        const node = new HuffmanNode(char, freq);
        priorityQueue.push(node);
    }

    while (priorityQueue.length > 1) {
        priorityQueue.sort((a, b) => a.freq - b.freq);
        const left = priorityQueue.shift();
        const right = priorityQueue.shift();
        const parent = new HuffmanNode(null, left.freq + right.freq);
        parent.left = left;
        parent.right = right;
        priorityQueue.push(parent);
    }

    return priorityQueue.shift();
}

// Fungsi rekursif untuk membangun kode biner dari pohon Huffman
function buildHuffmanCodes(node, prefix, codesMap) {
    if (node) {
        if (node.char) {
            codesMap.set(node.char, prefix);
        }
        buildHuffmanCodes(node.left, prefix + '0', codesMap);
        buildHuffmanCodes(node.right, prefix + '1', codesMap);
    }
}

// Fungsi untuk mengonversi data ke string biner berdasarkan tabel kode Huffman
function encodeData(data, codesMap) {
    let encodedData = '';
    for (const char of data) {
        encodedData += codesMap.get(char);
    }
    return encodedData;
}


	console.log("cek curr", curr)
// Fungsi untuk menulis hasil kompresi ke file baru
function writeCompressedData(encodedData, codesMap, outputFilePath) {
    let compressedData = '';

    // Menulis tabel kode Huffman ke file
    for (const [char, code] of codesMap.entries()) {
        compressedData += `${char}:${code}\n`;
        // compressedData += `${code}\n`;
        console.log("compressedData", compressedData)
    }
    compressedData += '\n'; // Pisahkan tabel kode dengan data terkompresi

    // Menambahkan flag
    const flag = '001'; // Contoh flag
    compressedData = flag + compressedData;

    // Padding jika diperlukan
    const paddingLength = (8 - compressedData.length % 8) % 8; // Hitung panjang padding
    compressedData += '0'.repeat(paddingLength); // Tambahkan padding

   
    // Konversi dari biner ke ASCII
    const asciiText = binaryToAscii(compressedData);

    // Tulis hasil kompresi ke file baru
    fs.writeFile(outputFilePath, compressedData, 'utf8', (err) => {
        if (err) {
            console.error('Gagal menulis file kompresi:', err);
            return;
        }
        console.log('File PDF telah berhasil dikompresi:', outputFilePath);
    });
}

// Fungsi untuk mengonversi string biner ke teks ASCII
function binaryToAscii(binaryString) {
    let asciiText = '';
    for (let i = 0; i < binaryString.length; i += 8) {
        const byte = binaryString.substr(i, 8);
        asciiText += String.fromCharCode(parseInt(byte, 2));
    }
    return asciiText;
}

// Fungsi untuk melakukan kompresi file PDF menggunakan algoritma Huffman
function compressPDF(inputFilePath, outputFilePath) {
    // Baca data dari file PDF
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Gagal membaca file:', err);
            return;
        }
        // console.log('data', data)
        // Bangun tabel frekuensi karakter
         // Ambil 32 karakter pertama dari data sebagai contoh
         const sampleData = data.slice(0, 32);

        const freqMap = buildFrequencyTable(sampleData);

        // Bangun pohon Huffman dari tabel frekuensi
        const huffmanTree = buildHuffmanTree(freqMap);

        // Bangun tabel kode Huffman dari pohon Huffman
        const codesMap = new Map();
        buildHuffmanCodes(huffmanTree, '', codesMap);

        // Mengonversi data ke string biner menggunakan tabel kode Huffman
        const encodedData = encodeData(data, codesMap);

        // Menulis hasil kompresi ke file baru
        writeCompressedData(encodedData, codesMap, outputFilePath);
    });
}

// Gunakan fungsi untuk mengompresi file PDF
const inputFilePath = 'sample2.pdf'; // Ganti dengan path file PDF yang ingin dikompresi
const outputFilePath = 'compressedhufman2.pdf'; // Ganti dengan nama dan path untuk file PDF yang telah dikompresi

compressPDF(inputFilePath, outputFilePath);
