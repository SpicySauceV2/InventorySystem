document.addEventListener("DOMContentLoaded", () => {
    const deleteItem = document.getElementById("delete-item-button");
    const deleteCategory = document.getElementById("delCategory");
    const extraInfoBody = document.querySelector("#extra-info-body");
    

    deleteItem.addEventListener("click", () => {
        // Extract data from the first modal's table
        console.log("pressed")
        const row = extraInfoBody;
        const cell = row.getElementsByTagName("td");
        const id = cell[1].textContent.trim();
        if (!id) {
            alert("Invalid item ID");
            return;
        }
        fetch(`api/updated_item?id=${id}`) // Endpoint URL to get the data
            .then((response) => {
                // Check if the response is ok (status 200)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // Parse the response as JSON
            })
            .then((data) => {
                console.log("Received data:", data); // Log the data for debugging
                validateDelete(data, id);
            
            })
            .catch((error) => {
                console.error("Error fetching front store items:", error); // Handle fetch error
            });
    });
    deleteCategory.addEventListener("click",() => {
        caregory = document.getElementById("delItemCategory").value
        fetch(`api/delete_category?id=${caregory}`,{
            method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
        })
            .then((response) => {
                if (response.ok) {
                    alert('Category deleted successfully');
                    location.reload(); // Reload the page or update the UI dynamically
                } else {
                    return response.json().then((error) => {
                        alert(`Error: ${error.message}`);
                    });
                }
            })



    })
    function validateDelete(data, id) {
        if (data[0].front_stock === 0 && data[0].back_stock === 0) {
            fetch(`api/delete_item?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (response.ok) {
                        alert('Item deleted successfully');
                        location.reload(); // Reload the page or update the UI dynamically
                    } else {
                        return response.json().then((error) => {
                            alert(`Error: ${error.message}`);
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Failed to delete the item');
                });
        } else {
            alert("Can't delete item due to stock still present");
        }
    }
});