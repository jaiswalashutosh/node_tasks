// Create function which takes two string arguments and returns concateneted string

const concatenetedString = (str1, str2) => {
    if (typeof str1 !== 'string' || typeof str2 !== 'string') {
        return "Invalid String";
    }
    return str1 + ' ' + str2;
}

const str1 = "Ashutosh";
const str2 = "Jaiswal";

const result = concatenetedString(str1, str2);
console.log(result);
