const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

const pdfPath = "sample2.pdf";
const mParameter = 3;

fs.readFile(pdfPath, async (err, data) => {
    try {
        const dataString = data.toString("hex");

        // Compression using Golomb
        const compressedData = compressGolomb(dataString, mParameter);

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();

        // Embed the Helvetica font
        // const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);

        // Add text using the embedded font
        const textSize = 12;
        const text = page.drawText(compressedData, { x: 50, y: 500,  size: textSize });

        // Save the PDF to a file
        const pdfBytes = await pdfDoc.save();
        fs.writeFile("compressed.pdf", pdfBytes, (err) => {
            if (err) {
                console.error("Failed to save PDF file:", err);
            } else {
                console.log("PDF file saved successfully");
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
});


// ... (fungsi compressGolomb dan decompressGolomb tetap seperti sebelumnya)
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
