"use strict";
// Grocery Class: Represent a Grocery
class Grocery {
  constructor(item, date, price) {
    this.item = item;
    this.date = date;
    this.price = price.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
  }
}
// UI Class: Handle UI Tasks
class UI {
  static displayGroceries() {
    const groceries = Store.getGrocery();

    groceries.forEach((grocery) => UI.addGroceryToKist(grocery));
  }

  static addGroceryToKist(grocery) {
    const list = document.querySelector("#grocery-list");

    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${grocery.item}</td>
    <td>${grocery.date}</td>
    <td>${grocery.price}</td>
    <td><a href='#' class="use__btn">X</a></td>
    <td><a href='#' class="delete__btn">X</a></td>
    <td><a href='#' class="shopping-list__btn">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteGrocery(el) {
    if (el.classList.contains("delete__btn")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    // Remove previous alert-danger
    if (document.querySelector(".alert-danger")) {
      document.querySelector(".alert").remove();
    }
    // Create and show new alert
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector("body");
    const form = document.querySelector("#grocery-form");
    container.insertBefore(div, form);
    // Vanish alert-success in 3 seconds
    if (div.classList.contains("alert-success")) {
      setTimeout(() => document.querySelector(".alert-success").remove(), 3000);
    }
  }

  static clearFields() {
    document.querySelector("#item").value = "";
    document.querySelector("#date").value = "";
    document.querySelector("#price").value = "";
  }
}

// Store Class: Handles Storage
class Store {
  static getGrocery() {
    let groceries;
    if (localStorage.getItem("groceries") === null) {
      groceries = [];
    } else {
      groceries = JSON.parse(localStorage.getItem("groceries"));
    }

    return groceries;
  }

  static addGrocery(grocery) {
    const groceries = Store.getGrocery();
    groceries.push(grocery);
    localStorage.setItem("groceries", JSON.stringify(groceries));
  }

  static removeGrocery(item) {
    const groceries = Store.getGrocery();
    groceries.forEach((grocery, index) => {
      if (grocery.item === item) {
        groceries.splice(index, 1);
      }
    });

    localStorage.setItem("groceries", JSON.stringify(groceries));
  }
}

// Event: Display Groceries
document.addEventListener("DOMContentLoaded", UI.displayGroceries);

// Event: Add a Grocery
document.querySelector("#grocery-form").addEventListener("submit", (e) => {
  //  Prevent actual submit
  e.preventDefault();

  // Get form values
  const item = document.querySelector("#item").value;
  const date = document.querySelector("#date").value;
  const price = document.querySelector("#price").value;

  // Validate
  if (item == "") {
    UI.showAlert("Please fill in an item field", "danger");
  } else {
    // Instantiate Grocery
    const grocery = new Grocery(item, date, price);

    // Add Grocery to UI
    UI.addGroceryToKist(grocery);

    // Add grocery to store
    Store.addGrocery(grocery);

    // Show success message
    UI.showAlert("Grocery Added", "success");

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Grocery
document.querySelector("#grocery-list").addEventListener("click", (e) => {
  // Remove grocery from UI
  UI.deleteGrocery(e.target);

  // Remove grocery from store
  Store.removeGrocery(
    e.target.parentNode.parentNode.firstElementChild.textContent
  );

  // Show success message
  UI.showAlert("Grocery removed", "success");
});
