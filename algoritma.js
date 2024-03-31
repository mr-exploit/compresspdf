const fs = require("fs");

const pdfPath = "sample2.pdf"; // Ganti dengan path ke file PDF yang ingin Anda baca
const mParameter = 3; // Golomb parameter

fs.readFile(pdfPath, (err, data) => {
    try {
        const dataString = data.toString("hex"); // Ubah buffer menjadi string hexa

        // Compression using Golomb
        const compressedData = compressGolomb(dataString, mParameter);
        console.log("Compressed Golomb:", compressedData);

        // Decompression using Golomb
        const decompressedData = decompressGolomb(compressedData, mParameter);
        // console.log("Decompressed Golomb:", decompressedData);

        // TODO: Implementasikan langkah-langkah berikutnya untuk membangun struktur PDF dan menulis ke file PDF
         fs.writeFile("compres2.pdf", compressedData, (err) => {
            if (err) {
            console.error("Gagal menyimpan file PDF:", err);
            } else {
            console.log("File PDF berhasil disimpan");
            }
        });
        // fs.writeFile("decompres.pdf", decompressedData, (err) => {
        //     if (err) {
        //     console.error("Gagal menyimpan file PDF:", err);
        //     } else {
        //     console.log("File PDF berhasil disimpan");
        //     }
        // });
    } catch (error) {
        console.error('Error:', error);
    }
});

// Fungsi kompresi menggunakan Golomb
function compressGolomb(data, m) {
    let result = "";
    for (let i = 0; i < data.length; i += 2) {
        const value = parseInt(data.slice(i, i + 2), 16);
        const q = Math.floor(value / m);
        const r = value % m;
        const quotientRepresentation = "0".repeat(q);
        const remainderRepresentation = r.toString(2).padStart(Math.ceil(Math.log2(m)), "0");
        result += quotientRepresentation + remainderRepresentation;
    }
    return result;
}

// Fungsi dekompresi menggunakan Golomb
function decompressGolomb(data, m) {
    let result = Buffer.from("", "hex");
    let i = 0;
    while (i < data.length) {
        let qLength = 0;
        while (data[i] === "0") {
            qLength++;
            i++;
        }
        const rLength = Math.ceil(Math.log2(m));
        const r = parseInt(data.slice(i, i + rLength), 2);
        const value = qLength * m + r;
        const hexValue = value.toString(16).padStart(2, "0");
        result = Buffer.concat([result, Buffer.from(hexValue, "hex")]);
        i += rLength;
    }
    return result;
}

