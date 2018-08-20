// The customer module is part of bamazon.
// Users can view a list of products in bamazon.
// And select to purchase products.

// Required node modules.
var mysql = require("mysql");
var inquirer = require("inquirer");

// Connects to the database.
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database:  'bamazon'
});


// If connection doesn't work, throws error, else...
connection.connect(function(err) {
  if (err) throw err;

  // Displays list of available products.
  displayProducts();

});

// Displays list of all available products.
var displayProducts = function() {
	var query = "Select * FROM products";
	connection.query(query, function(err, res) {

		if (err) throw err;

		console.log("---------------- BAMAZON Product List --------------------------")
		console.log("----------------------------------------------------------------")
		for (var i = 0; i < res.length; i++) {
			console.log("ID: " + res[i].ItemID + " || Name: " +
						res[i].ProductName + " || Department: " + res[i].DepartmentName  + " || Price: $" + res[i].Price + " || Stock: " + res[i].StockQuantity);
		}

		// Requests product and number of product items user wishes to purchase.
		console.log("------------------------------------------------------------------")
		customerPrompt();
	});
};


var customerPrompt = function() {
    inquirer.prompt({
        name: "action",
        type: "list",

        message: " Would like to do some shopping?\n",
        choices: ["Yes", "No"]
    }).then(function(answer) {
        switch(answer.action) {
            case 'Yes':
			requestProduct();
            break;

            case 'No':
                connection.end();
            break;
        }
    })
};

// Requests product and number of product items user wishes to purchase.
var requestProduct = function() {
	inquirer.prompt([{
		name: "productID",
		type: "input",
		message: "Please enter product ID for product you want.",
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false;
		}
	}, {
		name: "productUnits",
		type: "input",
		message: "How many units do you want?",
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false
		}
	}]).then(function(answer) {

		// Queries database for selected product.
		var query = "Select StockQuantity, price, DepartmentName FROM products WHERE ?";
		connection.query(query, { ItemID: answer.productID}, function(err, res) {
			
			if (err) throw err;

			var available_stock = res[0].StockQuantity;
			var price_per_unit = res[0].price;

			var productDepartment = res[0].DepartmentName;

			// Checks there's enough inventory  to process user's request.
			if (available_stock >= answer.productUnits) {

				// Processes user's request passing in data to complete purchase.
				completePurchase(available_stock, price_per_unit, productDepartment, answer.productID, answer.productUnits);
			} else {

				// Tells user there isn't enough stock left.
				console.log("----------------------------------------------------------------")
				console.log("Sorry! There isn't enough stock left!");
				console.log("----------------------------------------------------------------")

				// Lets user request a new product.
				customerPrompt();
			}
		});
	});
};


// Completes user's request to purchase product.
var completePurchase = function(availableStock, Price, productDepartment, selectedProductID, selectedProductUnits) {
	
	// Updates stock quantity once purchase complete.
	var updatedStockQuantity = availableStock - selectedProductUnits;

	// Calculates total price for purchase based on unit price, and number of units.

	var totalPrice = Price * selectedProductUnits;

	
	// Updates stock quantity on the database based on user's purchase.
	var query = "UPDATE products SET ? WHERE ?";
	connection.query(query, [{
		StockQuantity: updatedStockQuantity,
		//product_sales: updatedProductSales
	}, {
		ItemID: selectedProductID
	}], function(err, res) {

		if (err) throw err;
		// Tells user purchase is a success.
		console.log("-----------------------------------------------------------")
		console.log("\n\nYour purchase is complete of amount: $" + totalPrice + "\n" );
		console.log("-----------------------------------------------------------")

		displayProducts();


		// Updates department revenue based on purchase.
		//updateDepartmentRevenue(updatedProductSales, productDepartment);
		// Displays products so user can make a new selection.
	});
};

