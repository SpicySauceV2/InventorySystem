// this promise function will only continue until the promise is done which is successfully retrieve data from the database which is act as an error checker for any data being retrieved 
async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

function fillTable(data, tableId) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = ""; // Clear existing rows
    // Matches name with a png
    const imageMap = {
        "Milk": "/images/Milk.png",
        "Butter": "/images/Butter.png",
        "Red top": "/images/red_top.jpg"
    };
    // fetches the values for the item and store them so they can be assigned later 
    data.forEach((item) => {
        const row = document.createElement("tr");
        const idCell = document.createElement("td");
        const nameCell = document.createElement("td");
        const stockCell = document.createElement("td")
        const select = document.createElement("td")

        idCell.className = "name";
        idCell.setAttribute("data-name", item.item_name);
        idCell.setAttribute("data-image", imageMap[item.item_name] || item.item_name +" image");
        idCell.setAttribute("data-price", `£${item.item_price}`);
        idCell.setAttribute("data-category", item.category_name);
        idCell.setAttribute("data-weight", `${item.item_weight}Kg`);
        idCell.setAttribute("data-id", item.item_id);
        if (tableId=="front-store-table"){
            idCell.setAttribute("data-quantity", item.front_stock);
        }
        else{
            idCell.setAttribute("data-quantity", item.back_stock);
        }
        
        idCell.setAttribute("data-notes", item.item_note || "");

        select.innerHTML = `<input type="checkbox" id="selector" " >`;
        idCell.innerText = item.item_id;
        nameCell.innerText = item.item_name;
        if (tableId=="front-store-table"){
            stockCell.innerText = item.front_stock
        }
        else{
            stockCell.innerText = item.back_stock
        }
    
        row.appendChild(select)
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(stockCell)
        tableBody.appendChild(row);
    });

   document.querySelectorAll(`#${tableId} td`).forEach((item) => {
        item.addEventListener("click", (event) => {
            // Check if the clicked element is NOT a checkbox
            if (event.target.tagName.toLowerCase() !== 'input' || event.target.type !== 'checkbox') {
                showModal(event.target);
            }
        });
    });
}

// called when the modal needs to show for the user 
function showModal(target) {
    const imageUrl = target.getAttribute("data-image");
    document.getElementById("modal-image").src = imageUrl;

    const details = {
        id : target.getAttribute("data-id"),
        name : target.getAttribute("data-name"),
        price: target.getAttribute("data-price"),
        category: target.getAttribute("data-category"),
        weight: target.getAttribute("data-weight"),
        quantity: target.getAttribute("data-quantity"),
        notes: target.getAttribute("data-notes"),

    };


    populateExtraInfo(details,);

    const modal = new bootstrap.Modal(document.getElementById("infoModal"));
    modal.show();
}

function populateExtraInfo(details) {
    const extraInfoBody = document.getElementById("extra-info-body");
    extraInfoBody.innerHTML = ""; // Clear previous info
    // assigns the value to the specific label
    const detailItems = [
        { label: "Id", value: details.id},
        { label: "Name" , value:details.name},
        { label: "Price", value: details.price },
        { label: "Category", value: details.category },
        { label: "Weight", value: details.weight },
        { label: "Quantity", value: details.quantity },
        { label: "Notes", value: details.notes },
    ];

    detailItems.forEach((detail) => {
        const row = document.createElement("tr");
        const detailCell = document.createElement("td");
        const valueCell = document.createElement("td");

        detailCell.innerText = detail.label;
        valueCell.innerText = detail.value;

        row.appendChild(detailCell);
        row.appendChild(valueCell);
        extraInfoBody.appendChild(row);
    });
  

}

function filter() {
    const selectedCategories = Array.from(
        document.querySelectorAll('input[name="category"]:checked')
    ).map((checkbox) => checkbox.value);

    const fromPrice = document.getElementById("fromSlider").value;
    const toPrice = document.getElementById("toSlider").value;

    const params = new URLSearchParams();

    if (selectedCategories.length > 0) {
        params.append("categories", selectedCategories.join(","));
    }

    if (fromPrice || toPrice) {
        params.append("minPrice", fromPrice);
        params.append("maxPrice", toPrice);
    }
    // checks if there is anything in the selected categories array and adds the selected categories to the url 
    if (selectedCategories.length == 0 && fromPrice == 0 && toPrice == 1000)
        initializeTables()
    else
        fetch(`api/filterd_store_items?${params.toString()}`)//endpoint url to get the data 
            .then((response) => response.json())
            .then((data) => fillTable(data, "front-store-table"))
            .catch((error) => console.error("Error fetching front store items:", error));
        fetch(`api/filterd_store_items?${params.toString()}`)//endpoint url to get the data 
            .then((response) => response.json())
            .then((data) => fillTable(data, "back-store-table"))
            .catch((error) => console.error("Error fetching front store items:", error));



}

function updateSliderInputs(fromSlider, toSlider, fromInput, toInput) {
    fromInput.value = fromSlider.value;
    toInput.value = toSlider.value;

    if (parseFloat(fromSlider.value) > parseFloat(toSlider.value)) {
        toSlider.value = fromSlider.value;
        toInput.value = fromSlider.value;
    }

    filter();
}
//checks and changes the value of the slider when the slider has moved 
function syncSliders() {
    const fromSlider = document.getElementById("fromSlider");
    const toSlider = document.getElementById("toSlider");
    const fromInput = document.getElementById("fromInput");
    const toInput = document.getElementById("toInput");

    fromSlider.addEventListener("input", () => updateSliderInputs(fromSlider, toSlider, fromInput, toInput));
    toSlider.addEventListener("input", () => updateSliderInputs(fromSlider, toSlider, fromInput, toInput));

    fromInput.addEventListener("input", () => {
        fromSlider.value = fromInput.value;
        updateSliderInputs(fromSlider, toSlider, fromInput, toInput);
    });
    toInput.addEventListener("input", () => {
        toSlider.value = toInput.value;
        updateSliderInputs(fromSlider, toSlider, fromInput, toInput);
    });
}
function loadCategories() {
    const catDropDown = document.getElementById("category");
    const select = document.getElementById("itemCategory");
    const del = document.getElementById("delItemCategory");

    fetch(`api/get_all_categories`) // Endpoint URL to get the data
        .then((response) => response.json())
        .then((data) => {
           
            catDropDown.innerHTML = "";

            data.forEach((category) => {
                // Create label element
                const label = document.createElement("label");
                label.setAttribute("for", `${category.category_name}Checkbox`);
                label.textContent = category.category_name;

                // Create checkbox element
                const checkbox = document.createElement("input");
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("id", `${category.category_name}Checkbox`);
                checkbox.setAttribute("name", "category");
                checkbox.setAttribute("value", category.category_name);


                // Add event listener to the checkbox
                checkbox.addEventListener("change", filter);

                // Append checkbox and label to dropdown
                catDropDown.appendChild(checkbox);
                catDropDown.appendChild(label);
                catDropDown.appendChild(document.createElement("br")); // Line break for formatting
                
                // populating category selector in delete categories form and add item form
                const optionDel = document.createElement("option"); // Create a new option for 'del'
                optionDel.value = category.category_id;
                optionDel.textContent = category.category_name;
                del.appendChild(optionDel);

                const optionSelect = document.createElement("option"); // Create another new option for 'select'
                optionSelect.value = category.category_id;
                optionSelect.textContent = category.category_name;
                select.appendChild(optionSelect);
                
            });
        })
        .catch((error) => {
            console.error("Error loading categories:", error);
        });
}


document.addEventListener("DOMContentLoaded", () => {
    loadCategories(); 
    syncSliders();
    initializeTables();
});

async function initializeTables() {
    const frontStoreData = await fetchData("api/initialize_store");
    fillTable(frontStoreData, "front-store-table");

    const backStoreData = await fetchData("api/initialize_store");
    fillTable(backStoreData, "back-store-table");
}
