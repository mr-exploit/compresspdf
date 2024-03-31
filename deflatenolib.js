const fs = require('fs');

// Fungsi untuk melakukan kompresi menggunakan algoritma DEFLATE
function deflate(data) {
    let compressedData = [];

    // Lakukan kompresi pada data
    for (let i = 0; i < data.length; i++) {
        let currentChar = data[i];
        let count = 1;

        // Hitung jumlah kemunculan karakter yang sama berurutan
        while (i + 1 < data.length && data[i + 1] === currentChar) {
            count++;
            i++;
        }

        // Simpan karakter dan jumlahnya dalam bentuk [jumlah, karakter]
        compressedData.push([count, currentChar]);
    }

    // Konversi hasil kompresi menjadi string
    return compressedData.map(pair => pair.join('')).join('');
}



function compressdeflate(input, output){
    // Baca data dari file PDF
    fs.readFile(input, (err, data) => {
        if (err) {
            console.error('Gagal membaca file:', err);
            return;
        }

        // Konversi data menjadi string untuk sementara
        const textData = data.toString('utf8');

        // Kompresi data teks menggunakan algoritma DEFLATE
        const compressedText = deflate(textData);

        // Tulis data yang telah dikompresi ke dalam file baru
        fs.writeFile(output, compressedText, (err) => {
            if (err) {
                console.error('Gagal menulis file kompresi:', err);
                return;
            }
            console.log('File PDF telah berhasil dikompresi');
        });
    });
}

// Fungsi untuk melakukan dekompresi menggunakan algoritma DEFLATE
const fileasli = "filepdf/fileasli/sample2.pdf";
const compress = "filepdf/compress/compresssample2.pdf";

compressdeflate(fileasli, compress)