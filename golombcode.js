const pdfParser = require("pdf-parse");
const jszip = require("jszip");

function golombEncode(n, k) {
  // Hitung kode unary
  let unaryCode = "";
  for (let i = 0; i < n; i++) {
    unaryCode += "1";
  }

  // Hitung quotient dan remainder untuk kode biner
  let quotient = Math.floor(n / k);
  let remainder = n % k;

  // Bangun kode biner dengan padding bit
  let binaryCode = remainder.toString(2);
  while (binaryCode.length % k !== 0) {
    binaryCode = "0" + binaryCode;
  }

  // Gabungkan kode unary dan biner
  return unaryCode + quotient.toString(2) + binaryCode;
}

function golombDecode(code, k) {
  // Ekstrak kode unary dan biner
  let unaryCode = "";
  let i = 0;
  while (code[i] === "1") {
    unaryCode += code[i];
    i++;
  }
  let binaryCode = code.substring(i);

  // Hitung nilai n dari kode unary
  let n = unaryCode.length;

  // Hitung nilai integer dari kode biner
  let integerValue = parseInt(binaryCode, 2);

  // Kembalikan nilai n dan integer
  return { n, integerValue };
}

function compressPdf(pdfPath, outputPath) {
  pdfParser(pdfPath).then(async (data) => {
    // Ekstrak data numerik
    const numericalData = extractNumericalData(data);

    // Enkode data numerik dengan Golomb
    const encodedData = numericalData.map((value) => golombEncode(value, 2));

    // Buat arsip ZIP
    const zip = new jszip();
    zip.file("compressed_data.json", JSON.stringify(encodedData));

    // Simpan arsip ZIP sebagai PDF
    const compressedPdf = await zip.generateAsync({ type: "nodebuffer" });
    fs.writeFileSync(outputPath, compressedPdf);

    console.log("Kompresi PDF berhasil!");
  });
}

function extractNumericalData(data) {
  // Gunakan regex untuk mencocokkan angka
  const regex = /[-+]?\d+(?:\.\d+)?/g;
  const matches = data
console.log("matches", matches)
  // Konversi string ke angka
  const numericalData = matches.map((match) => parseFloat(match));

  // Kembalikan data numerik
  return numericalData;
}
// Contoh penggunaan
const inputPdfPath = "./sample2.pdf";
const outputPdfPath = "./compressed.pdf";
compressPdf(inputPdfPath, outputPdfPath);