const zlib = require('zlib');
const fs = require("fs");

const pdfPath = 'Jadwal_v2.pdf';

// Baca file PDF
fs.readFile(pdfPath, (err, data) => {
    if (err) {
        console.error('Gagal membaca file PDF:', err);
        return;
    }

    // Kompresi menggunakan zlib
    zlib.deflate(data, (err, compressedData) => {
        if (err) {
            console.error('Gagal melakukan kompresi:', err);
            return;
        }

        // Tulis ke file hasil kompresi
        fs.writeFile('compressed.pdf', compressedData, (err) => {
            if (err) {
                console.error('Gagal menyimpan file hasil kompresi:', err);
                return;
            }

            console.log('File hasil kompresi berhasil disimpan');
        });

        // Dekompresi menggunakan zlib
        zlib.inflate(compressedData, (err, decompressedData) => {
            if (err) {
                console.error('Gagal melakukan dekompresi:', err);
                return;
            }

            // Tulis ke file hasil dekompresi
            fs.writeFile('decompressed.pdf', decompressedData, (err) => {
                if (err) {
                    console.error('Gagal menyimpan file hasil dekompresi:', err);
                    return;
                }

                console.log('File hasil dekompresi berhasil disimpan');
            });
        });
    });
});
