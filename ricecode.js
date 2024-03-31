const fs = require('fs');

function riceEncode(data, m) {
    let encodedData = '';
    let L = 0;
    let N = 0;

    for (let i = 0; i < data.length; i++) {
        const r = data[i];
        L += r;
        N++;

        const p = L / (L + N);
        const a = Math.floor(-1 / Math.log2(p) + 0.5);

        // Encode the quotient using unary coding
        const quotient = Math.floor(r / m);
        for (let j = 0; j < quotient; j++) {
            encodedData += '1';
        }
        encodedData += '0'; // Unary code termination

        // Encode the remainder using binary coding
        const remainderBinary = (r % m).toString(2);
        const remainderBinaryPadded = remainderBinary.padStart(a, '0');
        encodedData += remainderBinaryPadded;
    }

    return encodedData;
}

function compressPDF(inputFilePath, outputFilePath, m) {
    // Read data from the PDF file
    fs.readFile(inputFilePath, (err, data) => {
        if (err) {
            console.error('Failed to read the file:', err);
            return;
        }

        // Convert data into an array of bytes
        const byteData = Array.from(data);

        // Compress the byte data using Rice Code
        const compressedData = riceEncode(byteData, m);

        // Flagging: Add flag at the beginning to indicate compression format
        const flag = '001'; // Example flag
        const flaggedData = flag + compressedData;

        // Padding: Add padding if necessary
        const paddingLength = (8 - flaggedData.length % 8) % 8; // Calculate padding length
        const paddedData = flaggedData.padEnd(flaggedData.length + paddingLength, '0');

        // Convert binary to ASCII text
        const asciiText = binaryToAscii(paddedData);

        // Write the compressed data to a new file
        fs.writeFile(outputFilePath, asciiText, 'utf8', (err) => {
            if (err) {
                console.error('Failed to write the compressed file:', err);
                return;
            }
            console.log('File compressed successfully:', outputFilePath);
        });
    });
}

// Function to convert binary string to ASCII text
function binaryToAscii(binaryString) {
    let asciiText = '';
    for (let i = 0; i < binaryString.length; i += 8) {
        const byte = binaryString.substr(i, 8);
        asciiText += String.fromCharCode(parseInt(byte, 2));
    }
    return asciiText;
}

// Example usage
const inputFilePath = 'sample.pdf'; // Replace 'input.pdf' with the path to your input PDF file
const outputFilePath = 'compressed.pdf'; // Replace 'compressed.pdf' with the desired output file name
const m = 10; // Set the value of m for Rice Code compression

compressPDF(inputFilePath, outputFilePath, m);
