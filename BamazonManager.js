// The manager module is part of bamazon.
// Managers can view products for sale.
// They can view low inventory.
// They can add to inventory.
// Managers can also add new products.

// Required node modules.
var mysql = require("mysql");
var inquirer = require("inquirer");

// Connects to the database.
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'root',
	database: 'bamazon'
});

// If connection doesn't work, throws error, else...
connection.connect(function (err) {
	if (err) throw err;

	// Lets manager pick action.
	selectAction();

});

// Manager picks action they wish to complete.
var selectAction = function () {
	inquirer.prompt([
		{
			type: 'list',
			name: 'action',
			message: 'What would you like to do?',
			choices: [
				"View Products for Sale",
				"View Low Inventory",
				"Add to Inventory",
				"Add New Product",
				"Exit"
			]
		}
	]).then(function (answer) {

		// Different functions called based on managers selection
		switch (answer.action) {
			case "View Products for Sale":
				viewProducts();
				break;

			case "View Low Inventory":
				viewLowInventory();
				break;

			case "Add to Inventory":
				addInventory();
				break;

			case "Add New Product":
				addProduct();
				break;

			case "Exit":
				connection.end();
				break;

		}
	});
};

// Displays list of all available products.
var viewProducts = function () {
	var query = "Select * FROM products";
	connection.query(query, function (err, res) {
		if (err) throw err;
		console.log("\n---------------- BAMAZON Product List --------------------------");
		console.log("----------------------------------------------------------------");
		for (var i = 0; i < res.length; i++) {
			console.log("ID: " + res[i].ItemID + " || Name: " + res[i].ProductName + " || Department: " + res[i].DepartmentName  + " || Price: $" + res[i].Price + " || Quantity: " + res[i].StockQuantity);
		}
		console.log("------------------------------------------------------------------")

		// Lets manager select new action.
		selectAction();
	});
};

// Displays products with low inventory.
var viewLowInventory = function () {
	var query = "SELECT ItemID, ProductName, StockQuantity FROM products WHERE StockQuantity < 5";
	connection.query(query, function (err, res) {
		if (err) throw err;
		console.log("\n---------------- BAMAZON Low Inventory List --------------------------");
		console.log("----------------------------------------------------------------");

		for (var i = 0; i < res.length; i++) {
			console.log("Product ID: " + res[i].ItemID + " || Product Name: " + res[i].ProductName + " || Quantity: " + res[i].StockQuantity);
		}
		console.log("------------------------------------------------------------------")

		// Lets manager select new action.
		selectAction();
	});
};

// Adds new stock to selected product.
var addInventory = function () {


	inquirer.prompt([
		{
			name: "product_ID",
			type: "input",
			message: "Enter product ID that you would like to add stock to."
		},
		{
			name: "stock",
			type: "input",
			message: "How much stock would you like to add?"
		}
	]).then(function (answer) {

		// Pushes new stock to database.
		connection.query("SELECT * FROM products", function (err, results) {

			var chosenItem;

			// Gets product who's stock needs to be updated.
			for (var i = 0; i < results.length; i++) {
				if (results[i].ItemID === parseInt(answer.product_ID)) {
					chosenItem = results[i];
				}
			}
			console.log("------------------------------------------------------------------")


			// Adds new stock  to existing stock.
			var updatedStock = parseInt(chosenItem.StockQuantity) + parseInt(answer.stock);

			console.log("Stock Updated Successfully!");

			// Updates stock for selected product in database.
			connection.query("UPDATE products SET ? WHERE ?", [{
				StockQuantity: updatedStock
			}, {
				ItemID: answer.product_ID
			}], function (err, res) {
				if (err) {
					throw err;
				} else {

					// Lets manager select new action.
					console.log("------------------------------------------------------------------")
					selectAction();
				}
			});

		});

	});
};

// Adds new product to database.
var addProduct = function () {
	inquirer.prompt([{
		name: "ProductName",
		type: "input",
		message: "What is the product you would like to add?"
	}, {
		name: "DepartmentName",
		type: "input",
		message: "What is the department for this product?"
	}, {
		name: "Price",
		type: "input",
		message: "What is the price for the product, e.g. 25.00?"
	}, {
		name: "StockQuantity",
		type: "input",
		message: "How much stock do you have to start with?"
	}]).then(function (answer) {
		connection.query("INSERT INTO products SET ?", {
			ProductName: answer.ProductName,
			DepartmentName: answer.DepartmentName,
			Price: answer.Price,
			StockQuantity: answer.StockQuantity
		}, function (err, res) {
			if (err) {
				throw err;
			} else {
				console.log("------------------------------------------------------------------")
				console.log("Your product was added successfully!");
				console.log("------------------------------------------------------------------")
				selectAction();


			}
		});
	});
};

