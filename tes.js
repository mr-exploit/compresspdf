const fs = require("fs");

const pdfPath = "sample.pdf"; // Ganti dengan path ke file PDF yang ingin Anda baca


fs.readFile(pdfPath, (err, data) => {
  if (err) {
    console.error("Gagal membaca file PDF:", err);
    return;
  }

  // Data dari file PDF sekarang tersimpan dalam variabel 'data' dalam bentuk buffer.
//   console.log(data.toString("hex")); // Data buffer dari file PDF
  const dataString = data.toString("hex"); // Data string dari file PDF
    console.log(dataString);


    // // Menyimpan file PDF ke dalam bentuk file
    // fs.writeFile("sample2.pdf", data, (err) => {
    //     if (err) {
    //       console.error("Gagal menyimpan file PDF:", err);
    //     } else {
    //       console.log("File PDF berhasil disimpan");
    //     }
    //   });


//  // Menyimpan teks yang telah diekstrak ke dalam file .txt
//  fs.writeFile(textPath , data, (err) => {
//     if (err) {
//       console.error("Gagal menyimpan teks:", err);
//     } else {
//       console.log("Teks berhasil disimpan ke", textPath );
//     }
//   });
});


