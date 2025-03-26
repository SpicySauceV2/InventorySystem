function searchTable() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    
    // Get both front and back tables
    const frontTable = document.getElementById('front-store-table');
    const backTable = document.getElementById('back-store-table');

    // Function to search a given table
    function searchInTable(table) {
        const rows = table.getElementsByTagName('tr');  // Get all table rows

        // Loop through all table rows (skip the header row)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            let found = false;  // Flag to track if the row matches the search term

            // Loop through each cell in the row and check if it matches the search input
            const cells = row.getElementsByTagName('td');
            for (let j = 0; j < cells.length; j++) {
                const cell = cells[j];
                if (cell.textContent.toLowerCase().includes(searchInput)) {
                    found = true;
                    break;  // Stop searching as soon as a match is found
                }
            }

            // Show or hide the row based on whether a match was found
            if (found) {
                row.style.display = '';  // Show the row
            } else {
                row.style.display = 'none';  // Hide the row
            }
        }
    }

    // Search in both front and back store tables
    searchInTable(frontTable);
    searchInTable(backTable);
}

// Event listener for the search input
document.getElementById('searchInput').addEventListener('input', searchTable);
