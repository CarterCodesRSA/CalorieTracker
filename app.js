// Storage Controller

//Item Controller -----------------------------------------------------------------------------
const itemCTRL = (function() {
  //item constructor
  const Item = function(id, name, calories) {
    (this.id = id), (this.name = name), (this.calories = calories);
  };

  //Data structure / State
  const data = {
    items: [],
    currentItem: {},
    totalCalories: 0
  };

  return {
    //only what is returned will be globally available, everything else is a locally defined
    logData: function() {
      return data;
    },
    getItems: function() {
      return data.items;
    },
    getTotalCalories: function() {
      let total = 0;
      data.items.forEach(function(item) {
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },
    addItem: function(name, calories) {
      let id;
      //create ID
      if (data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }
      calories = parseInt(calories);

      //create new item

      newItem = new Item(id, name, calories);
      data.items.push(newItem);
      return newItem;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getItemByID: function(id) {
      let foundItem = null;
      data.items.forEach(function(item) {
        if (item.id === id) {
          foundItem = item;
        }
      });
      return foundItem;
    },
    updateItem: function(name, calories) {
      calories = parseInt(calories);
      let found = null;

      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      //get ides
      ids = data.items.map(function(item) {
        return item.id;
      });

      const index = ids.indexOf(id);

      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    }
  };
})();
//UI Controller -----------------------------------------------------------------------------
const UICTRL = (function() {
  //private selectors
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemName: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
    listItems: "#item-list li",
    clearBtn: ".clear-btn"
  };

  //public methods
  return {
    populateItemList: function(items) {
      let html = "";

      items.forEach(item => {
        html += ` <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
      </li>`;
      });
      //Insert List items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getSelectors: function() {
      return UISelectors;
    },
    getItemInput: function() {
      0;
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    addListItem: function(item) {
      //create list item
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      //add html
      li.innerHTML = `
      <strong>${item.name}: </strong><em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function(updateItem) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //convert node list into array

      listItems = Array.from(listItems);

      listItems.forEach(function(item) {
        const itemID = item.getAttribute("id");
        if (itemID === `item-${updateItem.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${
            updateItem.name
          }: </strong><em>${updateItem.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },
    deleteListItem: function(id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //turn into array
      listItems = Array.from(listItems);
      listItems.forEach(function(item) {
        item.remove();
      });
    },

    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemName).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function() {
      document.querySelector(
        UISelectors.itemName
      ).value = itemCTRL.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = itemCTRL.getCurrentItem().calories;
      UICTRL.showEditState();
    },
    clearEditState: function() {
      UICTRL.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    }
  };
})();

//App controller -----------------------------------------------------------------------------
const appCTRL = (function(itemCTRL, UICTRL) {
  //load event listeners
  const loadEventListeners = function() {
    //get selectors from the UI controller
    const UISelectors = UICTRL.getSelectors();

    //add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    //Back btn event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICTRL.clearEditState);
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);

    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault;
        return false;
      }
    });
  };
  //Add item submit
  const itemAddSubmit = function(e) {
    //get form input from ui controller
    const input = UICTRL.getItemInput();
    if (input.name !== "" && input.calories !== "") {
      //add item
      const newItem = itemCTRL.addItem(input.name, input.calories);

      UICTRL.addListItem(newItem);

      //Get total calories
      const totalCalories = itemCTRL.getTotalCalories();
      //set total calories to ui
      UICTRL.showTotalCalories(totalCalories);

      //clear fields
      UICTRL.clearInput();
    }

    e.preventDefault();
  };
  const clearAllItemsClick = function() {
    itemCTRL.clearAllItems();

    UICTRL.removeItems();

    const totalCalories = itemCTRL.getTotalCalories();
    //set total calories to ui
    UICTRL.showTotalCalories(totalCalories);
  };

  const itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      //get the list item and set it to current Item
      const listID = e.target.parentNode.parentNode.id;
      //spit the item-# into just a number
      const listIDArray = listID.split("-");

      const id = parseInt(listIDArray[1]);

      //get item by ID

      let itemToEdit = itemCTRL.getItemByID(id);
      console.log("itemToEdit: ", itemToEdit);

      itemCTRL.setCurrentItem(itemToEdit);

      //Add item to form

      UICTRL.addItemToForm();
    }

    e.preventDefault;
  };

  const itemUpdateSubmit = function(e) {
    //Get item input
    const input = UICTRL.getItemInput();

    const updatedInput = itemCTRL.updateItem(input.name, input.calories);

    //Update ui

    UICTRL.updateListItem(updatedInput);
    const totalCalories = itemCTRL.getTotalCalories();
    //set total calories to ui
    UICTRL.showTotalCalories(totalCalories);
    UICTRL.clearEditState();

    e.preventDefault();
  };

  const itemDeleteSubmit = function(e) {
    console.log("hello");
    //get current item
    const currentItem = itemCTRL.getCurrentItem();

    //delete item
    itemCTRL.deleteItem(currentItem.id);

    UICTRL.deleteListItem(currentItem.id);

    const totalCalories = itemCTRL.getTotalCalories();
    //set total calories to ui
    UICTRL.showTotalCalories(totalCalories);
    UICTRL.clearEditState();

    e.preventDefault();
  };

  //public methods
  return {
    init: function() {
      console.log("Initalizing App...");

      //set init state
      UICTRL.clearEditState();
      //Fetch items from data structure
      const items = itemCTRL.getItems();

      //populate list with items if there are values to add
      UICTRL.populateItemList(items);

      //Get total calories
      const totalCalories = itemCTRL.getTotalCalories();
      //set total calories to ui
      UICTRL.showTotalCalories(totalCalories);

      //Load even listeners
      loadEventListeners();
    }
  };
})(itemCTRL, UICTRL);

appCTRL.init();
