const fs = require('fs');
// To map each character its huffman value
let codes = {};

// To store the frequency of character of the input data
let freq = {};

// A Huffman tree node
class MinHeapNode {
	constructor(data, freq) {
		this.left = null;
		this.right = null;
		this.data = data;
		this.freq = freq;
	}

	// Define the comparison method for sorting the nodes in the heap
	compareTo(other) {
		return this.freq - other.freq;
	}
}

// Create an empty min-heap
let minHeap = [];

// Utility function to print characters along with their huffman value
function printCodes(root, str) {
	if (!root) {
		return;
	}
	if (root.data !== "$") {
		console.log(root.data + " : " + str);
	}
	printCodes(root.left, str + "0");
	printCodes(root.right, str + "1");
}

// Utility function to store characters along with their huffman value in a hash table
function storeCodes(root, str) {
	if (!root) {
		return;
	}
	if (root.data !== "$") {
		codes[root.data] = str;
	}
	storeCodes(root.left, str + "0");
	storeCodes(root.right, str + "1");
}

// Function to build the Huffman tree and store it in minHeap
function HuffmanCodes(size) {
	for (let key in freq) {
		minHeap.push(new MinHeapNode(key, freq[key]));
	}
	// Convert the array to a min-heap using the built-in sort method
	minHeap.sort((a, b) => a.compareTo(b));
	while (minHeap.length !== 1) {
		let left = minHeap.shift();
		let right = minHeap.shift();
		let top = new MinHeapNode("$", left.freq + right.freq);
		top.left = left;
		top.right = right;
		minHeap.push(top);
		// Sort the array to maintain the min-heap property
		minHeap.sort((a, b) => a.compareTo(b));
	}
	storeCodes(minHeap[0], "");
}

// Utility function to store map each character with its frequency in input string
function calcFreq(str) {
	for (let i = 0; i < str.length; i++) {
		let char = str.charAt(i);
		if (freq[char]) {
			freq[char]++;
		} else {
			freq[char] = 1;
		}
	}
}

// Function iterates through the encoded string s
// If s[i] == '1' then move to node.right
// If s[i] == '0' then move to node.left
// If leaf node, append the node.data to our output string
function decode_file(root, s) {
	let ans = "";
	let curr = root;
	let n = s.length;
	for (let i = 0; i < n; i++) {
		if (s.charAt(i) == "0") {
			curr = curr.left;
		} else {
			curr = curr.right;
		}

		// Reached leaf node
		if (!curr.left && !curr.right) {
			ans += curr.data;
			curr = root;
		}
	}
	return ans + "\0";
}



function compressPDF(inputFilePath, compressedData , decompressdata) {
    // Baca data dari file PDF
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Gagal membaca file:', err);
            return;
        }
        // console.log('data', data)
        // Bangun tabel frekuensi karakter
         // Ambil 32 karakter pertama dari data sebagai contoh
        //  const str = data.slice(0, 32);
         const str = data
		//  const str = data.slice(0, 32);
        // console.log("cek data str \n", str)
        // Driver code
        // let str = "geeksforgeeks";
        let encodedString = "";
        let decodedString = "";
        calcFreq(str);
        HuffmanCodes(str.length);
        console.log("Character With their Frequencies:")
        let keys = Array.from(Object.keys(codes))
        keys.sort()
        for (var key of keys)
            console.log(key, codes[key])

        for (var i of str)
            encodedString += codes[i]

            console.log("\nEncoded Huffman data:")
            // console.log(encodedString)
            const asciiText = binaryToAscii(encodedString)

            // Tulis hasil kompresi ke file baru
            fs.writeFile(compressedData, asciiText, 'utf8', (err) => {
                if (err) {
                    console.error('Gagal menulis file kompresi:', err);
                    return;
                }
                // console.log('File PDF telah berhasil dikompresi:', asciiText);
            });

            // Function call
            decodedString = decode_file(minHeap[0], encodedString)
            console.log("\nDecoded Huffman Data:")
            // console.log(decodedString)

            
            fs.writeFile(decompressdata, decodedString, 'utf8', (err) => {
                if (err) {
                    console.error('Gagal menulis file kompresi:', err);
                    return;
                }
                // console.log('File PDF telah berhasil dikompresi:', decodedString);
            });
        });      
}
// Fungsi untuk mengonversi string biner ke teks ASCII
function binaryToAscii(binaryString) {
    let asciiText = '';
    for (let i = 0; i < binaryString.length; i += 8) {
        const byte = binaryString.substr(i, 8);
        asciiText += String.fromCharCode(parseInt(byte, 2));
    }
    return asciiText;
}
// Gunakan fungsi untuk mengompresi file PDF
const inputFilePath = 'sample.pdf'; // Ganti dengan path file PDF yang ingin dikompresi
const outputfilePath = 'filepdf/tesss.pdf'; // Ganti dengan nama dan path untuk file PDF yang telah dikompresi
const decompresoutputfilePath = 'filepdf/decompress.pdf'; // Ganti dengan nama dan path untuk file PDF yang telah dikompresi
compressPDF(inputFilePath, outputfilePath, decompresoutputfilePath);