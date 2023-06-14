const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6485bd1f7f34318e49c6');


        const appwriteEndpoint = 'YOUR_APPWRITE_ENDPOINT';
        const appwriteProjectId = 'YOUR_APPWRITE_PROJECT_ID';
        const appwriteCollectionId = 'YOUR_APPWRITE_COLLECTION_ID';
        const appwriteApiKey = 'YOUR_APPWRITE_API_KEY';

        const itemForm = document.getElementById('itemForm');
        const itemList = document.getElementById('itemList');

        itemForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const nameInput = document.getElementById('name');
            const descriptionInput = document.getElementById('description');
            const imageNameInput = document.getElementById('imageName');

            const name = nameInput.value;
            const description = descriptionInput.value;
            const imageName = imageNameInput.value;

            createItem(name, description, imageName);

            nameInput.value = '';
            descriptionInput.value = '';
            imageNameInput.value = '';
        });

        function createItem(name, description, imageName) {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('imageName', imageName);

            axios.post(`${appwriteEndpoint}/v1/collections/${appwriteCollectionId}/documents`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Appwrite-Project': appwriteProjectId,
                    'X-Appwrite-Key': appwriteApiKey,
                },
            })
            .then(() => {
                getItemList();
            })
            .catch((error) => {
                console.error('Error creating item:', error);
            });
        }

        function getItemList() {
            axios.get(`${appwriteEndpoint}/v1/collections/${appwriteCollectionId}/documents`, {
                headers: {
                    'X-Appwrite-Project': appwriteProjectId,
                    'X-Appwrite-Key': appwriteApiKey,
                },
            })
            .then((response) => {
                const items = response.data.documents;

                itemList.innerHTML = '';

                items.forEach((item) => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <p>Image Name: ${item.imageName}</p>
                        <button onclick="deleteItem('${item.$id}')">Delete</button>
                    `;

                    itemList.appendChild(listItem);
                });
            })
            .catch((error) => {
                console.error('Error fetching item list:', error);
            });
        }

        function deleteItem(itemId) {
            axios.delete(`${appwriteEndpoint}/v1/collections/${appwriteCollectionId}/documents/${itemId}`, {
                headers: {
                    'X-Appwrite-Project': appwriteProjectId,
                    'X-Appwrite-Key': appwriteApiKey,
                },
            })
            .then(() => {
                getItemList();
            })
            .catch((error) => {
                console.error('Error deleting item:', error);
            });
        }

        // Initial fetch of item list
        getItemList();