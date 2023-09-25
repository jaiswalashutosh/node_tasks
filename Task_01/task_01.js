// Write a javascript function that take an array of numbers as parameter. Find the pairs from array where sum of pair is specified number.

let findPairs = (arr, sum) => {
  // Check if the array length is less than 5 or if there are any non-number elements
  if (arr.length < 5 || arr.some(item => typeof item !== 'number')) {
    return "Invalid array";
  }

  const pairs = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === sum) {
        pairs.push([arr[i], arr[j]]);
      }
    }
  }
  return pairs;
}

const inputArr = [29, 295, 103, -15, 100, -23, -19, 67, 30, 44, 87, -55, 16, -250];
const pairSum = 45;

const result = findPairs(inputArr, pairSum);
console.log(result);