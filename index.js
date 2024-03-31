const fs = require("fs");

const pdfPath = "sample.pdf"; // Ganti dengan path ke file PDF yang ingin Anda baca

// membaca file pdf
fs.readFile(pdfPath, (data) => {
    try {
         // Data dari file PDF sekarang tersimpan dalam variabel 'data' dalam bentuk buffer.
        //   console.log(data.toString("hex")); // Data buffer dari file PDF
        const dataString = data.toString("hex"); // Data string dari file PDF
        // console.log(dataString);
        // const dataBuffer = Buffer.from(dataString, "hex"); // Data buffer dari data string
        // console.log(dataBuffer);
        // Take a sample of 30 hex values
        const sampleHex = dataString.slice(0, 30 * 2); // Each hex value is represented by 2 characters

        console.log("Sample of 30 hex values:", sampleHex);
         // Count the frequency of each unique hex value
         const frequencyMap = {};
         for (let i = 0; i < sampleHex.length; i += 2) {
             const hexValue = sampleHex.slice(i, i + 2);
             frequencyMap[hexValue] = (frequencyMap[hexValue] || 0) + 1;
         }
 
         console.log("Frequency Map:", frequencyMap);
        
        // Take a sample of 30 characters
    } catch (error) {
        console.log('pesan error :',error);
    }
});


