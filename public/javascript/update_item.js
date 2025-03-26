document.addEventListener("DOMContentLoaded", () => {
  const updateButton = document.querySelector("#infoModal .btn-primary");
  const updateInfoBody = document.querySelector("#update-info-body");
  const extraInfoBody = document.querySelector("#extra-info-body");


  updateButton.addEventListener("click", () => {
  

    // Extract data from the first modal's table
    const row = extraInfoBody
    const cell = row.getElementsByTagName("td");
    const id = cell[1].textContent.trim();

    // Log the extracted ID for debugging
    console.log("Extracted ID:", id);
   
    fetch(`api/updated_item?id=${id}`)//endpoint url to get the data 
    .then((response) => {
      // Check if the response is ok (status 200)
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();  // Parse the response as JSON
  })
  .then((data) => {
      console.log("Received data:", data);  // Log the data for debugging
      updateTable(data);  // Call the function to update the table
  })
  .catch((error) => {
      console.error("Error fetching front store items:", error);  // Handle fetch error
  });
      
     
    });
    function updateTable(data){
        // Clear previous data in the update modal
    updateInfoBody.innerHTML = "";
    const item = data[0];
    const detailItems = [
      { label: "id" , value:item.item_id},
      { label: "Name" , value:item.item_name},
      { label: "Price", value: item.item_price },
      { label: "Category", value: item.category_name },
      { label: "Weight", value: item.item_weight },
      { label: "Front_stock", value: item.front_stock },
      { label: "Back_stock", value: item.back_stock},
      { label: "Note", value: item.item_note },
      ];
      detailItems.forEach((detail) => {
        const row = document.createElement("tr");
        const detailCell = document.createElement("td");
        const valueCell = document.createElement("td");
        const updateCell = document.createElement("td");

        detailCell.innerText = detail.label;
        valueCell.innerText = detail.value;
        if (detail.label === "id") {
          updateCell.innerHTML = `<input type="hidden" name="id" value="${detail.value}" />`;
        }
        if (detail.label === "Name") {
          updateCell.innerHTML = `<input type="text" name="name" value="${detail.value}" id="name">`;
        }
        if (detail.label === "Price") {
          updateCell.innerHTML = `<input type="number" name="price" min="0.01"  value="${detail.value}" step="0.01">`;
        }
        if (detail.label === "Category") {
          updateCell.innerHTML = `<select name="category" id="all_categories"></select>`;
        }
        if (detail.label === "Weight") {
          updateCell.innerHTML = `<input type="number" name="weight" min="0.01"  value="${detail.value}" step="0.01">`;
        valueCell.innerText = detail.value+" kg";
          
        }
        if (detail.label === "Front_stock") {
          updateCell.innerHTML = `<input type="number" name="front_stock" min="0"  value="${detail.value}">`;
        }
        if (detail.label === "Back_stock") {
          updateCell.innerHTML = `<input type="number" name="back_stock" min="0"  value="${detail.value}">`;
        }
        if (detail.label === "Note") {
          updateCell.innerHTML = `<textarea class="form-control" name="note" id="itemDescription" rows="3" placeholder="Enter item description">${detail.value}</textarea>`;
        }
        
      
        row.appendChild(detailCell);
        row.appendChild(valueCell);
        row.appendChild(updateCell);
        updateInfoBody.appendChild(row);
    });
    const select = document.getElementById("all_categories");

  fetch('api/get_all_categories') 
    .then(response => response.json())
    .then(data => {

      data.forEach(category => {
        const option = document.createElement("option");
        option.value = category.category_id; 
        option.textContent = category.category_name; 
        select.appendChild(option);
      });
    })
    .catch(error => console.error("Error fetching categories:", error));

    
    document.querySelector("#update-item-form").addEventListener("submit", (e) => {
      e.preventDefault();
    
      // Collect data from the form
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
    
      console.log("Data to send:", data);
    
      // Send data to the server
      fetch("api/updateItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          console.log("Server response:", result);
          window.location.href = window.location.href
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        });
    }); 


    
    // Open the update modal
    const updateModal = new bootstrap.Modal(document.getElementById("updateModal"));
    updateModal.show();
    
  }
});

