// Storage Controller

//Item Controller
const itemCTRL = (function() {
  //item constructor
  const Item = function(id, name, calories) {
    (this.id = id), (this.name = name), (this.calories = calories);
  };

  //Data structure / State
  const data = {
    items: [
      {
        id: 0,
        name: "Steak Dinner",
        calories: 1200
      },
      {
        id: 1,
        name: "Ice Cream",
        calories: 1200
      }
    ],
    currentItem: null,
    totalCalories: 0
  };

  return {
    //only what is returned will be globally available, everything else is a locally defined
    logData: function() {
      return data;
    },
    getItems: function() {
      return data.items;
    }
  };
})();
//UI Controller
const UICTRL = (function() {
  const UISelectors = {
    itemList: "#item-list"
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
    }
  };
})();

//App controller
const appCTRL = (function(itemCTRL, UICTRL) {
  //public methods
  return {
    init: function() {
      console.log("Initalizing App...");

      //Fetch items from data structure
      const items = itemCTRL.getItems();

      //populate list with ites
      UICTRL.populateItemList(items);
    }
  };
})(itemCTRL, UICTRL);

appCTRL.init();
