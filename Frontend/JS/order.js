// Order page scripts
// This file is split into sections for readability.

let numOfBites, numOfMeals;

let finalOrder = [
    0,  // bite 1
    0,  // bite 2
    0,  // bite 3
    0,  // meal 1
    0,  // meal 2
    0   // meal 3
];
let finalPrice = 0;


/* API */

let menu = {};
async function getResponse() {
    const response = await fetch (
        'http://localhost:3000/api/menu',
        {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    if (!response.ok) {
        console.log('Cannot get response from server.');
        return -1;
    };

    menuJson = await response.json();
    menu = menuJson[1];
    numOfBites = menuJson[0].numBites;
    numOfMeals = menu.length;

    return 0;
}

/* NAVIGATION LINKS */

let links = document.querySelectorAll("#navbar a");

// Mouse hover interactions
links.forEach(element => {
    element.addEventListener("mouseover", function(e) {
        this.style.color = "lightgray";
    });
    element.addEventListener("mouseout", function(e) {
        this.style.color = "";
    })
});

/* TABS */

let tabtitles = document.querySelectorAll("#tabselect h1");
let tab1 = document.querySelector("#tab1");
let tab2 = document.querySelector("#tab2");

// Default tab settings
tabtitles[0].style.color = "black";
tab1.style.display = "block";
tab2.style.display = "none";

// Tab interactions
tabtitles.forEach(title => {
    // Mouse hover interactions
    title.addEventListener("mouseover", function(e) {
        this.style.backgroundColor = "rgb(121, 226, 195)";
    });
    title.addEventListener("mouseout", function(e) {
        this.style.backgroundColor = "";
    });

    // Changing tabs
    title.addEventListener("click", function(e) {

        // Close details pane when changing tabs
        document.querySelector("#openitem").style.display = "none";
        document.querySelector("#checkout").style.display = "none";
        document.querySelector("#tabs").style.display = "block";
        // Prevents disappearing checkout button if user changes tabs before submitting order
        document.querySelector("#orderSubmit").style.display = "";


        // Styling clicked tab title and showing tab
        if (this.textContent == "BITES") {
            tabtitles[0].style.color = "black";
            tab1.style.display = "block";

            tabtitles[1].style.color = "";
            tab2.style.display = "none";
        } else {
            tabtitles[0].style.color = "";
            tab1.style.display = "none";

            tabtitles[1].style.color = "black";
            tab2.style.display = "block";
        }
        
    });
});

// init() handles page functions after receiving an API response
async function init() {
    await getResponse();
    console.log(menu);

    /* DYNAMIC MENUS */

    for (let i = 0; i < menu.length; i++) {    
        // Creating elements
        const orderDiv = document.createElement("div");
        const orderImg = document.createElement("img");
        const orderTitle = document.createElement("h3");
        const orderDesc = document.createElement("p");
    
        // Filling elements with menu data
        console.log(menu[i].image);
        if (i < 3) {
            orderImg.src = menu[i].image;
            orderTitle.appendChild(document.createTextNode(menu[i].title));
            orderDesc.appendChild(document.createTextNode(menu[i].sdesc));
        } else {
            orderImg.src = menu[i].image;
            orderTitle.appendChild(document.createTextNode(menu[i].title));
            orderDesc.appendChild(document.createTextNode(menu[i].sdesc));
        }
    
        // Placing all elements into the menu item container
        orderDiv.appendChild(orderImg);
        orderDiv.appendChild(orderTitle);
        orderDiv.appendChild(orderDesc);
        orderDiv.className = "orderitem";
        orderDiv.id = i;
    
        // Place menu item onto page
        // Lower id objects are bites; Higher are meals
        if (i < numOfBites) {
            tab1.appendChild(orderDiv);
        } else {
            tab2.appendChild(orderDiv);
        }
    
    }
    
    /* DETAILS PANE */
    
    let orderItems = document.querySelectorAll(".orderitem");
    let detailPane = document.querySelector("#openitem");
    
    
    // showMenuItem takes a menu item's id and fills the detail pane with the 
    // required information.
    function showMenuItem(id) {
        detailPane.querySelector("#imgblock img").src = menu[id].image;
        detailPane.querySelector("#wordblock h3").textContent = menu[id].name;
        detailPane.querySelector("#wordblock p").textContent = menu[id].ldesc;
    }
    
    let itemId = -1;
    
    // Clicking a menu item opens the detail pane for that item
    orderItems.forEach(orderItem => {
        // Mouse hover interactions
        orderItem.addEventListener("mouseover", function(e) {
            this.style.backgroundColor = "rgb(121, 226, 195)";
        });
        orderItem.addEventListener("mouseout", function(e) {
            this.style.backgroundColor = "";
        });
    
        // Placing item information into detail pane and revealing it
        orderItem.addEventListener("click", function(e) {
            // Filling in image, title, and description
            showMenuItem(this.id);
            // Filling in order amount
            document.querySelector("#additem p").textContent = finalOrder[this.id];
        
            // Ensuring the right buttons are disabled
            if (finalOrder[this.id] <= 0) {
                detailPane.querySelector("#incbtn").disabled = false;
                detailPane.querySelector("#decbtn").disabled = true;
            } else if (finalOrder[this.id] >= 10) {
                detailPane.querySelector("#incbtn").disabled = true;
                detailPane.querySelector("#decbtn").disabled = false;
            }
            // Revealing detail pane
            document.querySelector("#openitem").style.display = "block";
            document.querySelector("#tabs").style.display = "none";
            itemId = this.id;
        });
    });
    
    /* ORDERING */
    
    // Buttons interaction
    detailPane.querySelectorAll("#additem button").forEach(button => {
        button.addEventListener("mouseover", function(e) {
            this.style.backgroundColor = "gray";
        });
        button.addEventListener("mouseout", function(e) {
            this.style.backgroundColor = "";
        });
    });
    
    // Allowing buttons to modify (and limit) order value
    let decbtn = detailPane.querySelector("#decbtn");
    let incbtn = detailPane.querySelector("#incbtn");
    incbtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
    
        // Orders must be 10 or less
        finalOrder[itemId]++;
        if (finalOrder[itemId] >= 10) {
            this.disabled = true;
            decbtn.disabled = false;
            finalOrder[itemId] = 10;
        } else {
            this.disabled = false;
            decbtn.disabled = false;
        }
    
        // Setting shown order amount
        detailPane.querySelector("#additem p").textContent = finalOrder[itemId];
    });
    decbtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
    
        // Orders must be 0 or more
        finalOrder[itemId]--;
        if (finalOrder[itemId] <= 0) {
            this.disabled = true;
            incbtn.disabled = false;
            finalOrder[itemId] = 0;
        } else {
            this.disabled = false;
            incbtn.disabled = false;
        }
    
        // Setting shown order amount
        detailPane.querySelector("#additem p").textContent = finalOrder[itemId];
    });
    
    /* EXIT */

    // Button interactions
    document.querySelectorAll(".exit").forEach(button => {
        button.addEventListener("mouseover", function() {
            this.style.backgroundColor = "rgb(121, 226, 195)";
        })
        button.addEventListener("mouseout", function() {
            this.style.backgroundColor = "";
        })
        button.addEventListener("click", function(e) {
            e.preventDefault();
    
            button.parentNode.style.display = "none";
            document.querySelector("#tabs").style.display = "block";
            document.querySelector("#orderSubmit").style.display = "";
    
        })
    })
    
    /* CHECKOUT */
    
    // Button interactions
    document.querySelector("#orderSubmit").addEventListener("mouseover", function(e) {
        this.style.backgroundColor = "rgb(121, 226, 195)";
    });
    document.querySelector("#orderSubmit").addEventListener("mouseout", function(e) {
        this.style.backgroundColor = "";
    });
    // Most of the work is done when the user clicks the checkout button
    document.querySelector("#orderSubmit").addEventListener("click", function(e) {
        e.preventDefault();
    
        // Create a list of items the user has selected
        const summary = document.querySelectorAll(".summary");
        let hiddenItems = 0;
        for (let i = 0; i < menu.length; i++) {
            summary[i].querySelector(".itemLabel").textContent = menu[i].title + ": ";
            if (finalOrder[i] > 0) {
                summary[i].style.display = "";
                summary[i].querySelector(".itemNum").textContent = finalOrder[i];
            } else {
                summary[i].style.display = "none";
                hiddenItems++;
            }
        }
    
        // Notify user if they have not selected any items
        if (hiddenItems == finalOrder.length) {
            summary[0].style.display = "";
            summary[0].querySelector(".itemLabel").textContent = "No items to checkout.";
            summary[0].querySelector(".itemNum").style.display = "none";
            summary[0].querySelector(".remBtn").style.display = "none";
            document.querySelector("#checkoutSubmit").disabled = true;
        } else {
            summary[0].querySelector(".itemNum").style.display = "";
            summary[0].querySelector(".remBtn").style.display = "";
            document.querySelector("#checkoutSubmit").disabled = false;
        }
    
        // Hide the other panes and only show checkout (hide checkout button too)
        document.querySelector("#checkout").style.display = "block";
        document.querySelector("#openitem").style.display = "none";
        document.querySelector("#tabs").style.display = "none";
        document.querySelector("#orderSubmit").style.display = "none";

        //Get price of final order
        sendData(finalOrder);
    });
    
    // Create generic div template for each item
    let checkoutMenu = document.querySelector("#orderSummary");
    for (let i = 0; i < menu.length; i++) {
        let itemDiv = document.createElement("div");
        itemDiv.className = "summary";
    
        let itemLabel = document.createElement("p");
        itemLabel.textContent = "Item " + (i + 1) + ": ";
        itemLabel.className = "itemLabel";
        let itemNum = document.createElement("p");
        itemNum.textContent = 0;
        itemNum.className = "itemNum";
        let remBtn = document.createElement("button");
        remBtn.textContent = "X";
        remBtn.className = "remBtn";
        remBtn.id = i;
    
        itemDiv.appendChild(itemLabel);
        itemDiv.appendChild(itemNum);
        itemDiv.appendChild(remBtn);
    
        checkoutMenu.appendChild(itemDiv);
    }
    
    // Checkout confirm button interactions
    document.querySelector("#checkoutSubmit").addEventListener("mouseover", function(e) {
        this.style.backgroundColor = "rgb(121, 226, 195)";
    });
    document.querySelector("#checkoutSubmit").addEventListener("mouseout", function(e) {
        this.style.backgroundColor = "";
    });
    document.querySelector("#checkoutSubmit").addEventListener("click", function(e) {
        e.preventDefault();
    
        // Extra form validation for redundancy
        for (num of finalOrder) {
            if (num < 0 || num > 10) {
                alert("Invalid order amounts. Minimum of 0 and Maximum of 10 allowed.");
                break;
            } else {
                alert("Order confirmed. You will be charged when picking up your order.");
                break;
            }
        }
    });
    
    // Remove order button interactions
    document.querySelectorAll(".remBtn").forEach(btn => {
        btn.addEventListener("mouseover", function() {
            this.style.color = "rgb(200, 0, 0)";
        });
        btn.addEventListener("mouseout", function() {
            this.style.color = "";
        });
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            this.parentNode.style.display = "none";
            finalOrder[this.id] = 0;
    
            let hiddenItems = 0;
            let summary = document.querySelectorAll(".summary");
            summary.forEach(item => {
                if (item.style.display == "none") {
                    hiddenItems++;
                }
            })

            // No items to checkout message
            if (hiddenItems == finalOrder.length) {
                summary[0].style.display = "";
                summary[0].querySelector(".itemLabel").textContent = "No items to checkout.";
                summary[0].querySelector(".itemNum").style.display = "none";
                summary[0].querySelector(".remBtn").style.display = "none";
                document.querySelector("#checkoutSubmit").disabled = true;
            } else {
                summary[0].querySelector(".itemNum").style.display = "";
                summary[0].querySelector(".remBtn").style.display = "";
                document.querySelector("#checkoutSubmit").disabled = false;
            }    

            // Adjust price
            sendData(finalOrder);
        });
    });
    
}
init();

// Price calculation and POSTing
async function sendData(data) {

    try {
      const response = await fetch("http://localhost:3000/api/checkout", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        },
      });
      priceObj = await response.json();

      console.log(priceObj);
      document.querySelector('#finalPrice').textContent = "Order: $" + priceObj.cost;
      document.querySelector('#finalTax').textContent = "Tax: $" + priceObj.tax;
      document.querySelector('#finalTotal').textContent = "Total: $" + (+priceObj.cost + +priceObj.tax);
    } catch (e) {
      console.error(e);
    }
  }




/* Adapt page for use on a mobile device */

// Check if view window starts small
if (window.innerWidth < 820) {
    document.querySelectorAll(".orderitem").forEach(item => {
        if (item == document.querySelector("#additem"))
        item.style.display = "block";
        item.style.width = "auto";
        item.style.height = "fit-content";
    });
    document.querySelectorAll("#openitem *").forEach(item => {
        item.style.display = "block";
        item.style.width = "auto";
        item.style.height = "auto";
        item.style.margin = "auto";
        item.style.textAlign = "center";

    });
    document.querySelectorAll("#additem").forEach(item => {
        item.style.display = "";
        item.style.width = "";
        item.style.height = "";
        item.style.margin = "";
        item.style.textAlign = "";
    })
    document.querySelectorAll("#additem *").forEach(item => {
        item.style.display = "";
        item.style.width = "";
        item.style.height = "";
        item.style.margin = "";
        item.style.textAlign = "";
    })
    document.querySelector("#orderSummary").style.maxWidth = "100%";

}
// Check if view window becomes small or vice versa
window.onresize = () => {
    if (window.innerWidth < 820) {
        document.querySelectorAll(".orderitem").forEach(item => {
            if (item.className != "#additem") {
                item.style.display = "block";
                item.style.width = "auto";
                item.style.height = "fit-content";
            }

        });
        document.querySelectorAll("#openitem *").forEach(item => {
            item.style.display = "block";
            item.style.width = "auto";
            item.style.height = "auto";
            item.style.margin = "auto";
            item.style.textAlign = "center";
    
        });
        document.querySelectorAll("#additem").forEach(item => {
            item.style.display = "";
            item.style.width = "";
            item.style.height = "";
            item.style.margin = "";
            item.style.textAlign = "";
        });
        document.querySelectorAll("#additem *").forEach(item => {
            item.style.display = "";
            item.style.width = "";
            item.style.height = "";
            item.style.margin = "";
            item.style.textAlign = "";
        });
        document.querySelector("#orderSummary").style.maxWidth = "100%";
    } else {
        document.querySelectorAll(".orderitem").forEach(item => {
            item.style.display = "";
            item.style.width = "";
            item.style.height = "";
        });
        document.querySelectorAll("#openitem *").forEach(item => {
            item.style.display = "";
            item.style.width = "";
            item.style.height = "";
            item.style.margin = "";
            item.style.textAlign = "";
    
        });
        document.querySelector("#orderSummary").style.maxWidth = "";
    }
}