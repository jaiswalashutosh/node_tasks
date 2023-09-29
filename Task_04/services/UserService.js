const fs = require('fs').promises;


module.exports = {
    addUser: async (data) => {
        try {
            const newData = {
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address
            }
            const response = await fs.readFile('./assets/users.json', 'utf8');
            const jsonObject = await JSON.parse(response);
            if (newData) {
                const userExists = (userID, userEmail) => {
                    return jsonObject.some(user => user.id === userID || user.email === userEmail);
                }
                if (await userExists(data.id, data.email)) {
                    throw new Error(`User with ID ${data.id} or Email ${data.email} already exists.`)
                } else {
                    jsonObject.push(newData);
                }
            }
            const updatedData = JSON.stringify(jsonObject);
            console.log(updatedData)
            await fs.writeFile('./assets/users.json', updatedData);
            return JSON.parse(updatedData);
        } catch (error) {
            console.log(`Could not post user: ${error.message}`);
            throw error;
        }
    },

    fetchUser: async () => {
        try {
            const response = await fs.readFile('./assets/users.json', 'utf8');
            if (!response) {
                throw new Error("File content is empty or falsy");
            }
            const jsonObject = await JSON.parse(response);
            if (!jsonObject) {
                throw new Error("Can't convert to JSON object");
            }
            return jsonObject;
        } catch (error) {
            console.log(`Could not fetch users: ${error.message}`);
            throw error;
        }
    },

    fetchUserWithId: async (id) => {
        try {
            const response = await fs.readFile('./assets/users.json', 'utf8');
            if (!response) {
                throw new Error("File content is empty or falsy");
            }
            const jsonObject = await JSON.parse(response);
            if (!jsonObject) {
                throw new Error("Can't convert to JSON object");
            }
            const userExists = (userID) => {
                return jsonObject.findIndex(user => user.id === userID)
            }
            const userIndex = await userExists(id);
            console.log(userIndex)

            let finalData = [];

            if (userIndex !== -1) {
                const idExists = jsonObject.some(user => user.id === id);
                if (idExists) {
                    console.log(jsonObject[userIndex]);
                    finalData.push(jsonObject[userIndex]);
                } else {
                    throw new Error(`User not found!`)
                }
            } else {
                // console.log(`User not found!`)
                throw new Error(`User not found!`)
            }
            return finalData;
        } catch (error) {
            console.log(`Could not fetch user: ${error.message}`);
            throw error;
        }
    },

    modifyUser: async (id, data) => {
        try {
            const newData = {
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address
            }
            const response = await fs.readFile('./assets/users.json', 'utf8');
            if (!response) {
                throw new Error("File content is empty or falsy");
            }
            const jsonObject = await JSON.parse(response);
            if (!jsonObject) {
                throw new Error("Can't convert to JSON object");
            }

            const userExists = (userID) => {
                return jsonObject.findIndex(user => user.id === userID)
            }

            const userIndex = await userExists(id);
            console.log(userIndex);

            if (userIndex !== -1) {
                if (id === data.id) {
                    const idExists = jsonObject.some(user => user.id === id);
                    if (idExists) {
                        if (userIndex >= 0 && userIndex < jsonObject.length) {
                            jsonObject[userIndex] = { ...jsonObject[userIndex], ...newData };
                        }
                    }
                } else {
                    throw new Error("Param id and update data id are different");

                }

            } else {
                throw new Error(`User not found!`);
            }
            const updatedData = JSON.stringify(jsonObject);
            await fs.writeFile('./assets/users.json', updatedData);
            console.log(JSON.parse(updatedData)[userIndex]);
            return (JSON.parse(updatedData)[userIndex]);

        } catch (error) {
            console.log(`Could not update user: ${error.message}`);
            throw error;
        }
    },

    removeUser: async (id) => {
        try {
            const response = await fs.readFile('./assets/users.json', 'utf8');
            if (!response) {
                throw new Error("File content is empty or falsy");
            }
            const jsonObject = await JSON.parse(response);
            if (!jsonObject) {
                throw new Error("Can't convert to JSON object");
            }
            const userExists = (userID) => {
                return jsonObject.findIndex(user => user.id === userID)
            }
            const userIndex = await userExists(id);
            console.log(userIndex)

            let removedData = [];

            if (userIndex !== -1) {
                const idExists = jsonObject.some(user => user.id === id);
                if (idExists) {
                    console.log(jsonObject[userIndex]);
                    const removedUser = jsonObject.splice(userIndex, 1); // Remove the user at userIndex
                    removedData.push(removedUser);
                    const updatedData = JSON.stringify(jsonObject);
                    await fs.writeFile('./assets/users.json', updatedData);
                } else {
                    throw new Error(`User not found!`)
                }
            } else {
                throw new Error(`User not found!`)
            }
            const updatedData = JSON.stringify(jsonObject);
            await fs.writeFile('./assets/users.json', updatedData);
            return removedData;

        } catch (error) {
            console.log(`Could not delete user: ${error.message}`);
            throw error;
        }
    },

    // paginateUser: async () => {
    //     try {

    //     } catch (error) {

    //     }
    // },
}