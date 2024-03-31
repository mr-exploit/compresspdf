const fs = require('fs');
const zlib = require('zlib');

// Fungsi untuk melakukan kompresi file PDF
function compressPDF(inputFilePath, outputFilePath) {
    // Baca data dari file PDF
    fs.readFile(inputFilePath, (err, data) => {
        if (err) {
            console.error('Gagal membaca file:', err);
            return;
        }

        // Kompresi data menggunakan zlib
        zlib.deflate(data, (err, compressedData) => {
            if (err) {
                console.error('Gagal melakukan kompresi:', err);
                return;
            }

            // Tulis data yang telah dikompresi ke dalam file baru
            fs.writeFile(outputFilePath, compressedData, (err) => {
                if (err) {
                    console.error('Gagal menulis file kompresi:', err);
                    return;
                }
                console.log('File PDF telah berhasil dikompresi:', outputFilePath);
            });
        });
    });
}


// Fungsi untuk melakukan dekompresi file PDF
function decompressPDF(compressedFilePath, outputFilePath) {
    // Baca data yang telah dikompresi dari file
    fs.readFile(compressedFilePath, (err, compressedData) => {
        if (err) {
            console.error('Gagal membaca file kompresi:', err);
            return;
        }

        // Dekompresi data menggunakan zlib
        zlib.inflate(compressedData, (err, data) => {
            if (err) {
                console.error('Gagal melakukan dekompresi:', err);
                return;
            }

            // Tulis data yang telah didekompresi ke dalam file baru
            fs.writeFile(outputFilePath, data, (err) => {
                if (err) {
                    console.error('Gagal menulis file dekompresi:', err);
                    return;
                }
                console.log('File PDF telah berhasil didekompresi:', outputFilePath);
            });
        });
    });
}


// Gunakan fungsi untuk mengompresi file PDF
// const inputFilePath = 'sample2.pdf'; // Ganti dengan path file PDF yang ingin dikompresi
const outputFilePath = 'compresseddeflate.pdf'; // Ganti dengan nama dan path untuk file PDF yang telah dikompresi

const decompressedFilePath = 'decompresseddeflate.pdf'; // Ganti dengan nama dan path untuk file PDF yang telah didekompresi

// compressPDF(inputFilePath, outputFilePath);

decompressPDF(outputFilePath, decompressedFilePath);
