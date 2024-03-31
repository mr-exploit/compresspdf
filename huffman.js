codes={}
function frequency(str)
{
	var freqs = {};
	for(var i in str)
	{
		if (freqs[str[i]] == undefined)
			freqs[str[i]] = 1;
		else
			freqs[str[i]] = freqs[str[i]] + 1;
	}
	return freqs;
}
w = frequency("aaabccdeeeeeffg");
//console.log("Frequency : ");
//console.log(w);

function sortFreq(freqs)
{
	var tuples = [];
	for(var i in freqs)
		tuples.push([freqs[i], i]);
	return tuples.sort();
}

//console.log("Sorted Freqs : " + sortFreq(w));

function buildTree(tuples)
{
	while(tuples.length> 1)
	{
		var least=[tuples[0][1],tuples[1][1]];
		var rest=tuples.slice(2,tuples.length);
		var combfreq=tuples[0][0]+tuples[1][0];
		tuples=rest;
		add=[combfreq,least];
		tuples.push(add);
		tuples.sort();
	}
	return tuples;
}

//console.log(buildTree(sortFreq(w)));

function trimTree(tuples)
{
	return tuples[0][1];
}

//console.log(trimTree(buildTree(sortFreq(w))));

function assignCodes(node, pat)
{
	pat = pat ||"";
	if (typeof(node) == typeof(""))
		codes[node] = pat;
	else
	{
		assignCodes(node[0], pat + "0");
		assignCodes(node[1], pat + "1");
	}
}

tree = trimTree(buildTree(sortFreq(w)));
assignCodes(tree);

function encode(str)
{
	output = "";
	for(var ch in str)
		output = output + codes[str[ch]];
	return output;
}
str = "aaabccdeeeeeffg";
console.log("Input Data : " + str);
console.log("Encoded Data : " + encode(str));

function decode(tree, str)
{
	output = "";
	s = tree;
	for(var i in str)
	{
		if(str[i] == 0)
			s = s[0];
		else
			s = s[1];
		if(typeof s == typeof "")
		{
			output = output + s;
			s = tree;
		}
	}
	return output;
}

console.log("Decoded Data: " + decode(tree, encode(str)));			
//decode(tree, encode(str));
