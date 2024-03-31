const fs = require('fs');

// Fungsi untuk mengonversi bilangan bulat ke Punctured Elias Code
function puncturedEliasCode(n) {
    if (n === 0) return '10'; // Kode khusus untuk n = 0
    let binary = n.toString(2); // Konversi ke representasi biner
    binary = binary.split('').reverse().join(''); // Balikkan bit-bitnya
    const onesCount = binary.replace(/0/g, '').length; // Hitung jumlah bit 1
    let code = '1'; // Mulai dengan 1
    for (let i = 0; i < binary.length; i++) {
        code += binary[i];
        if (binary[i] === '1') code += '1'; // Tambahkan flag setelah setiap bit 1
    }
    code += '0'; // Akhiri dengan 0
    return code;
}

// Fungsi untuk mengompresi file PDF menggunakan Punctured Elias Codes
function compressPDF(inputFilePath, outputFilePath) {
    // Baca data dari file PDF
    fs.readFile(inputFilePath, (err, data) => {
        if (err) {
            console.error('Gagal membaca file:', err);
            return;
        }

        // Mengonversi data menjadi bilangan bulat
        const n = data.length;

        // Mengonversi bilangan bulat menjadi Punctured Elias Code
        const compressedCode = puncturedEliasCode(n);
        console.log("compressedCode", compressedCode)
        // Ubah kode Punctured Elias ke dalam bentuk teks ASCII
        const asciiText = String.fromCharCode(parseInt(compressedCode, 2));

        // Tulis kode yang telah dikompresi ke dalam file baru
        fs.writeFile(outputFilePath, asciiText, 'utf8', (err) => {
            if (err) {
                console.error('Gagal menulis file kompresi:', err);
                return;
            }
            console.log('File PDF telah berhasil dikompresi:', outputFilePath);
        });
    });
}

// Fungsi untuk melakukan dekompresi Punctured Elias Codes
function decompressPuncturedEliasCode(code) {
    let binary = '';
    // Ubah kode ASCII ke nilai biner
    for (let i = 0; i < code.length; i++) {
        binary += code[i].charCodeAt(0).toString(2).padStart(8, '0');
        console.log("binary", binary)
    }
    // Hapus flag di akhir
    binary = binary.slice(0, -1);
    // Balikkan bit-bitnya
    binary = binary.split('').reverse().join('');
    // Inisialisasi bilangan bulat awal
    let n = 0;
    // Proses dekompresi
    for (let i = 0; i < binary.length; i++) {
        if (binary[i] === '1') {
            let j = i;
            while (binary[j] === '1') j++;
            i = j;
            n += Math.pow(2, j - i);
        }
    }
    return n;
}

// Fungsi untuk melakukan dekompresi file PDF
function decompressPDF(inputFilePath, outputFilePath) {
    // Baca data dari file yang telah dikompresi
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Gagal membaca file:', err);
            return;
        }

        // Lakukan dekompresi Punctured Elias Codes
        const originalSize = decompressPuncturedEliasCode(data);

        // Tulis data asli yang telah didekompresi ke dalam file baru
        fs.writeFile(outputFilePath, Buffer.alloc(originalSize), (err) => {
            if (err) {
                console.error('Gagal menulis file dekompresi:', err);
                return;
            }
            console.log('File PDF telah berhasil didekompresi:', outputFilePath);
        });
    });
}

// Gunakan fungsi untuk mengompresi file PDF
const inputFilePath = 'sample2.pdf'; // Ganti dengan path file PDF yang ingin dikompresi
const outputFilePath = 'compressed.pdf'; // Ganti dengan nama dan path untuk file PDF yang telah dikompresi
const decompressoutputFilePath = 'decompressed.pdf'; // Ganti dengan nama dan path untuk file PDF yang telah dikompresi

compressPDF(inputFilePath, outputFilePath);

// decompressPDF(outputFilePath, decompressoutputFilePath);