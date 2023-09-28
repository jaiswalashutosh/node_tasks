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
                jsonObject.push(newData);
            }
            const updatedData = JSON.stringify(jsonObject);
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

    fetchUserWithId: async () => {
        try {

        } catch (error) {

        }
    },

    modifyUser: async () => {
        try {

        } catch (error) {

        }
    },

    removeUser: async () => {
        try {

        } catch (error) {

        }
    },

    paginateUser: async () => {
        try {

        } catch (error) {

        }
    },
}