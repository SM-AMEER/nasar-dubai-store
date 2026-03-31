let items = JSON.parse(localStorage.getItem("items")) || [];

function saveData() {
    localStorage.setItem("items", JSON.stringify(items));
}

function addItem() {
    let name = document.getElementById("itemName").value;
    let size = document.getElementById("itemSize").value;
    let qty = parseInt(document.getElementById("itemQty").value);
    let alertLevel = parseInt(document.getElementById("alertLevel").value);

    if (!name || !size || isNaN(qty) || isNaN(alertLevel)) {
        alert("Enter valid details");
        return;
    }

    items.push({ name, size, qty, alertLevel });

    saveData();
    displayItems();

    // ✅ CLEAR INPUT FIELDS
    document.getElementById("itemName").value = "";
    document.getElementById("itemSize").value = "";
    document.getElementById("itemQty").value = "";
    document.getElementById("alertLevel").value = "";
}
function sellItem(index) {
    if (items[index].qty > 0) {
        items[index].qty--;

        if (items[index].qty <= items[index].alertLevel) {
            alert(`⚠️ Low stock: ${items[index].name} (${items[index].size})`);
        }
    } else {
        alert("Out of stock!");
    }

    saveData();
    displayItems();
}

function deleteItem(index) {
    items.splice(index, 1);
    saveData();
    displayItems();
}

function displayItems(filteredItems = items) {
    let list = document.getElementById("list");
    list.innerHTML = "";

    filteredItems.forEach((item, index) => {
        list.innerHTML += `
            <div class="item">
                <h3>${item.name} (${item.size})</h3>
                <p>Stock: ${item.qty}</p>
                <button onclick="sellItem(${index})">Sell 1</button>
                <button onclick="deleteItem(${index})">Delete</button>
            </div>
        `;
    });
}
function searchItem() {
    let search = document.getElementById("search").value.toLowerCase();

    let filtered = items.filter(item =>
        item.name.toLowerCase().includes(search) ||
        item.size.toLowerCase().includes(search)
    );

    displayItems(filtered);
}

// Load data on start
displayItems();

// EXPORT DATA
function exportData() {
    let dataStr = JSON.stringify(items);
    let blob = new Blob([dataStr], { type: "application/json" });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "stock-backup.json";
    a.click();
}

// IMPORT DATA
function importData(event) {
    let file = event.target.files[0];

    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
        items = JSON.parse(e.target.result);
        saveData();
        displayItems();
        alert("✅ Data Restored Successfully!");
    };

    reader.readAsText(file);
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}
