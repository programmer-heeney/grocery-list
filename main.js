"use strict";
// Grocery Class: Represent a Grocery
class Grocery {
  constructor(item, date, price, opened) {
    this.item = item;
    this.date = date;
    this.price = price.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
    this.opened = opened;
  }
}
// UI Class: Handle UI Tasks
class UI {
  static displayGroceries() {
    const groceries = Store.getGrocery();

    groceries.forEach((grocery) => UI.addGroceryToList(grocery));
  }

  static addGroceryToList(grocery) {
    const list = document.querySelector("#grocery-list");
    const preRow = list.lastChild;
    const row = document.createElement("tr");
    let rowIndex;

    if (!preRow) {
      rowIndex = 0;
    } else {
      rowIndex = preRow.sectionRowIndex + 1;
    }
    row.innerHTML = `
    <td>${grocery.item}</td>
    <td>${grocery.date}</td>
    <td>${grocery.price}</td>
    <td><input type="checkbox" id="opened-${rowIndex}" class="opened"><label for="opened-${rowIndex}"></label></td>
    <td><i class="fas fa-trash-alt delete__btn btn"></i></td>
    <td><input type="checkbox" id="shopping-list-${rowIndex}" class="shopping-list"><label for="shopping-list-${rowIndex}"></label></td>
    `;

    list.appendChild(row);
    if (grocery.opened) {
      const check = document.querySelector(`#opened-${rowIndex}`);
      console.log(`#opened-${rowIndex}`);
      check.checked = true;
    }
  }

  static deleteGrocery(el) {
    if (el.classList.contains("delete__btn")) {
      UI.animateOut(el.parentNode.parentNode);
      setTimeout(() => {
        el.parentElement.parentElement.remove();
      }, 300);
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

  static animateOut(row) {
    // Effect animation
    row.classList.add("anim-out");
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

  static removeGrocery(item, item__index) {
    const groceries = Store.getGrocery();
    groceries.forEach((grocery, index) => {
      if (grocery.item === item && index == item__index) {
        groceries.splice(index, 1);
      }
    });

    localStorage.setItem("groceries", JSON.stringify(groceries));
  }

  static checkOpened(check, item__index) {
    const groceries = Store.getGrocery();
    const row = groceries.find((grocery, index) => item__index === index);

    check === true ? (row.opened = true) : (row.opened = false);
    groceries.splice(item__index, 1, row);
    localStorage.setItem("groceries", JSON.stringify(groceries));

    console.log(row);
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
    UI.addGroceryToList(grocery);

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
  if (e.target.classList.contains("delete__btn")) {
    const index = Number(e.target.parentNode.parentNode.sectionRowIndex);
    Store.removeGrocery(
      e.target.parentNode.parentNode.firstElementChild.textContent,
      index
    );
  }

  // Handles a Checkbox
  if (e.target.nodeName == "INPUT") {
    const index = Number(e.target.parentNode.parentNode.sectionRowIndex);
    Store.checkOpened(e.target.checked, index);
  }

  // Show success message
  if (e.target.classList.contains("delete__btn")) {
    UI.showAlert("Grocery removed", "success");
  }
});
