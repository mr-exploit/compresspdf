const fs = require("fs");

const pdfPath = "sample2.pdf"; // Ganti dengan path ke file PDF yang ingin Anda baca
const mParameter = 3; // Golomb parameter

fs.readFile(pdfPath, (err, data) => {
    try {
        const dataString = data.toString("hex"); // Ubah buffer menjadi string hexa

        // Find "stream" and "endstream" positions
        const streamStartIndex = dataString.indexOf("73747265616d") + 12; // ASCII code for "stream"
        const streamEndIndex = dataString.indexOf("656e6473747265616d"); // ASCII code for "endstream"

        // Extract data between "stream" and "endstream"
        const streamData = dataString.substring(streamStartIndex, streamEndIndex);

        // Compression using Golomb
        const compressedData = compressGolomb(streamData, mParameter);
        console.log("Compressed Golomb:", compressedData);

        // Reassemble the full PDF with the compressed data
        const compressedPDF = dataString.substring(0, streamStartIndex) + compressedData + dataString.substring(streamEndIndex);

        // TODO: Implementasikan langkah-langkah berikutnya untuk membangun struktur PDF dan menulis ke file PDF
        fs.writeFile("compres2.pdf", Buffer.from(compressedPDF, "hex"), (err) => {
            if (err) {
                console.error("Gagal menyimpan file PDF:", err);
            } else {
                console.log("File PDF berhasil disimpan");
            }
        });
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
