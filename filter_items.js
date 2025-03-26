function updateSelectedCategories() {
    const checkboxes = document.querySelectorAll('input[name="category"]:checked');
    const selectedCategories = Array.from(checkboxes).map((checkbox) => checkbox.value);

    // Update the displayed categories
    document.getElementById("selectedCategories").textContent = 
    selectedCategories.length > 0 ? selectedCategories.join(', ') : "No categories selected.";

    // Send a GET request if any category is selected
    if (selectedCategories.length > 0) {
    fetch(`/api/items?categories=${encodeURIComponent(selectedCategories.join(','))}`)
        .then(response => response.json())
        .then(data => {
        console.log(data); // Debugging output: see the returned items in the console
        updateTable(data); // Function to populate the table with the retrieved data
        })
        .catch(error => console.error("Error fetching items:", error));
    }
}


// Add event listener to each checkbox
const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateSelectedCategories);
});


