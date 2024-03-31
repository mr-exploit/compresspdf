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

// Fungsi untuk melakukan dekode data terkompresi berdasarkan pohon Huffman
function decodeData(root, s) {
    let ans = "";
    let curr = root;
    let n = s.length;
    for (let i = 0; i < n; i++) {
        if (s.charAt(i) == "0") {
            curr = curr.left;
        } else {
            curr = curr.right;
        }

        // Reached leaf node
        if (!curr.left && !curr.right) {
            ans += curr.char;
            curr = root;
        }
    }
    return ans;
}

// Fungsi untuk menulis hasil dekompresi ke file baru
function writeDecompressedData(decompressedData, outputFilePath) {
    fs.writeFile(outputFilePath, decompressedData, 'utf8', (err) => {
        if (err) {
            console.error('Gagal menulis file dekompresi:', err);
            return;
        }
        console.log('File PDF telah berhasil didekompresi:', outputFilePath);
    });
}

// Fungsi untuk melakukan dekompresi file PDF menggunakan algoritma Huffman
function decompressPDF(compressedFilePath, codesFilePath, outputFilePath) {
    Promise.all([
        new Promise((resolve, reject) => {
            fs.readFile(compressedFilePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data.trim());
            });
        }),
        new Promise((resolve, reject) => {
            fs.readFile(codesFilePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const codesMap = new Map();
                const lines = data.split('\n');
                for (const line of lines) {
                    const [char, code] = line.split(':');
                    if (char && code) {
                        codesMap.set(code.trim(), char);
                    }
                }
                resolve(codesMap);
            });
        })
    ]).then(([compressedData, codesMap]) => {
        // Bangun pohon Huffman dari tabel kode Huffman
        const huffmanTree = buildHuffmanTree(codesMap);

        // Lakukan dekompresi data menggunakan pohon Huffman dan data terkompresi
        const decodedData = decodeData(huffmanTree, compressedData);
        const asciiText = binaryToAscii(decodedData)


        // Tulis hasil dekompresi ke file baru
        writeDecompressedData(asciiText, outputFilePath);
    }).catch(err => {
        console.error('Error:', err);
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
// Gunakan fungsi untuk melakukan dekompresi file PDF
const compressedFilePath = 'compressedhufman2.pdf'; // Ganti dengan path file PDF yang telah dikompresi
const codesFilePath = 'huffman_codes.txt'; // Ganti dengan nama file yang berisi tabel kode Huffman
const outputFilePathDecompressed = 'decompressed_sample2.pdf'; // Ganti dengan nama dan path untuk file PDF yang telah didekompresi

decompressPDF(compressedFilePath, codesFilePath, outputFilePathDecompressed);
