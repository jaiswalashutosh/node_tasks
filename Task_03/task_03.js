const fs = require('fs').promises;

// Function to read data from a file.
const readData = async (path) => {
    try {
        const response = await fs.readFile(path, 'utf8');
        const jsonObject = await JSON.parse(response);
        console.log(jsonObject)
    } catch (error) {
        console.log(error);
    }
}

readData('data.json');


// Function to write data to a file.
const writeData = async (path, data) => {
    try {
        await fs.writeFile(path, data);
    } catch (error) {
        console.log(error);
    }
};

writeData('demo.txt', 'This is a demo data to implement write functionality using File Systems!--');


// Function to append data to a file.
const appendData = async (path, newData) => {
    try {
        const existingData = await fs.readFile(path, 'utf8');
        const dataArr = await JSON.parse(existingData);
        dataArr.push(newData);

        const updatedData = JSON.stringify(dataArr);
        await fs.writeFile(path, updatedData);
    } catch (error) {
        console.error(error);
    }
};

const newData = {
    id: "126",
    name: "User126"

}
appendData('data.json', newData);