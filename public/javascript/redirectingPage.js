document.addEventListener("DOMContentLoaded", (event) => {
    // Code for buttons on /hub page
    if (window.location.pathname === "/hub") {
        const storageButton = document.getElementById("storage");
        if (storageButton) {
            storageButton.addEventListener("click", () => {
                window.location.href = "/inventory";
            });
        }

        const warehouseButton = document.getElementById("warehouse");
        if (warehouseButton) {
            warehouseButton.addEventListener("click", () => {
                window.location.href = "/warehouse_resupply";
            });
        }

        const financialButton = document.getElementById("financial");
        if (financialButton) {
            financialButton.addEventListener("click", () => {
                window.location.href = "/financial";
            });
        }
    }

    // Code for the back button on /inventory page
    else{
        const hubButton = document.getElementById("back");
        if (hubButton) {
            hubButton.addEventListener("click", () => {
                window.location.href = "/hub";
            });
        }
    }
});