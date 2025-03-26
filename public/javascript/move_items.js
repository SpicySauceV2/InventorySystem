document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("move_back").addEventListener("click", () => moveItems("front"));
    document.getElementById("move_front").addEventListener("click", () => moveItems("back"));
});

function moveItems(table) {
    const tableId = table;
    const grid = document.getElementById(`${tableId}-store-table`);
    const checkBoxes = grid.getElementsByTagName("INPUT");
    let isSelected = false;

    const selectedData = [];

    // Loop through checkboxes to check which ones are selected
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            const row = checkBoxes[i].closest("tr"); // Find the closest <tr>

            if (row) { // Ensure the row exists
                // Get the <td> elements within the row
                const tdCells = row.getElementsByTagName("td");

                if (tdCells.length >= 3) {
                    const id = tdCells[1].innerText;
                    const name = tdCells[2].innerText;
                    const stock = tdCells[3].innerText;

                    // Debugging logs
                    console.log("Row:", row);
                    console.log("ID", id);
                    console.log("Name:", name);
                    console.log("Stock:", stock);

                    if (name && stock && id) {
                        selectedData.push({
                            name: name,
                            stock: stock,
                            Id: id,
                            table: tableId,
                        });
                        isSelected = true; // Flag that at least one checkbox is selected
                    } else {
                        console.error("Missing name or stock data in row.");
                    }
                }
            } else {
                console.error("Row not found for checkbox.");
            }
        }
    }

    if (isSelected) {
        Modal(selectedData); // Pass selected items to modal
    } else {
        alert("No items selected.");
        console.error("No items selected.");
    }
}

function Modal(selectedItems) {
    populateData(selectedItems); // Populate the data in the modal

    const move = new bootstrap.Modal(document.getElementById("moveModal"));
    move.show();
}

function populateData(selectedItems) {
    const extraInfoBody = document.getElementById("info-body");
    extraInfoBody.innerHTML = ""; // Clear previous info

    selectedItems.forEach((details) => {
        // Create a row for each selected item
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        const nameCell = document.createElement("td");
        const stockCell = document.createElement("td");
        const quantityCell = document.createElement("td");

        idCell.innerText = details.Id;
        nameCell.innerText = details.name;
        stockCell.innerText = details.stock;
        quantityCell.innerHTML = `
        <input type="number" name="quantity-${details.Id}" min="1" max="${details.stock}" value="1" class="quantity-input" />
        <input type="hidden" name="id-${details.Id}" value="${details.Id}" />
        <input type="hidden" name="tableid" value="${details.table}" />`;

        // Append cells to the row
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(stockCell);
        row.appendChild(quantityCell);

        // Append the row to the table body
        extraInfoBody.appendChild(row);
    });
}

document.getElementById("Moved-items").addEventListener("submit", function(event) {
    let form = event.target;
    let formData = new FormData(form);

    // Initialize an array to store item objects
    let items = [];

    // Loop through the form data and properly structure it
    formData.forEach((value, key) => {
        if (key.startsWith('quantity-')) {
            const index = key.split('-')[1];
            const id = formData.get(`id-${index}`); // Get the corresponding id for this index
            items.push({ quantity: value, id: id }); // Add the item to the array
        }
    });

    // Get the tableid from the form data
    const tableid = formData.get('tableid');

    // Prepare the data to send to the server
    const dataToSend = {
        items: items,  // An array of item objects
        tableid: tableid  // The tableid value
    };

    console.log("Data being sent:", dataToSend); // Log the data being sent to the backend

    // Send the data to the server
    fetch('api/move-items', { 
        method: 'PUT',
        body: JSON.stringify(dataToSend),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log("Successfully moved items:", data.message);
            initializeTables(); // Update the table after the move
        } else if (data.error) {
            console.error("Error moving items:", data.error);
        }
    })
    .catch(error => {
        console.error("Error moving items:", error);
    });
});