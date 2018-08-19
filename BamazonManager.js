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
    database:  'bamazon'
});

// If connection doesn't work, throws error, else...
connection.connect(function(err) {
  if (err) throw err;

  // Lets manager pick action.
  selectAction();

});

// Manager picks action they wish to complete.
var selectAction = function() {
	inquirer.prompt([
	{
		type: 'list',
		name: 'action',
		message: 'What would you like to do?',
		choices: [
			"View Products for Sale",
			"View Low Inventory",
			"Add to Inventory",
			"Add New Product"
		]
	}
	]).then(function(answer) {

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
		}
	});
};

// Displays list of all available products.
var viewProducts = function() {
	var query = "Select * FROM products";
	connection.query(query, function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log("Product ID: " + res[i].ItemID + " || Product Name: " + res[i].ProductName + " || Price: " + res[i].Price + " || Quantity: " + res[i].StockQuantity);
		}

		// Lets manager select new action.
		selectAction();
	});
};

// Displays products with low inventory.
var viewLowInventory = function() {
	var query = "SELECT ItemID, ProductName, StockQuantity FROM products WHERE StockQuantity < 5";
	connection.query(query, function(err, res) {
		if (err) throw err;
		for (var i = 0; i < res.length; i++) {
			console.log("Product ID: " + res[i].ItemID + " || Product Name: " + res[i].ProductName + " || Quantity: " + res[i].StockQuantity);
		}

		// Lets manager select new action.
		selectAction();
	});
};

// Adds new stock to selected product.
var addInventory = function() {

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
	]).then(function(answer) {

		// Pushes new stock to database.
		connection.query("SELECT * FROM products", function(err, results) {
			
			var chosenItem;

			// Gets product who's stock needs to be updated.
			for (var i = 0; i < results.length; i++) {
				if (results[i].ItemID === parseInt(answer.product_ID)) {
					chosenItem = results[i];
				}
			}

			// Adds new stock  to existing stock.
			var updatedStock = parseInt(chosenItem.StockQuantity) + parseInt(answer.stock);

			console.log("Updated stock: " + updatedStock);

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
					selectAction();
				}
			});
			
		});

	});
};

// Adds new product to database.
var addProduct = function() {
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
	}]).then(function(answer) {
		connection.query("INSERT INTO products SET ?", {
			ProductName: answer.ProductName,
			DepartmentName: answer.DepartmentName,
			Price: answer.Price,
			StockQuantity: answer.StockQuantity
		}, function(err, res) {
			if (err) {
				throw err;
			} else {
				console.log("Your product was added successfully!");

				// Checks if department exists.
				checkIfDepartmentExists(answer.DepartmentName);
			}
		});
	});
};

// Checks if department exists.
var checkIfDepartmentExists = function(departmentName) {

	var query = "Select DepartmentName FROM departments";
	connection.query(query, function(err, res) {
		if (err) throw err;

		// If deparment already exists, no need to add it.
		for (var i = 0; i < res.length; i++) {
			if (departmentName === res[i].DepartmentName) {
				console.log("This department already exists so no need to add it: " + departmentName);
				selectAction();
			}
		}

		// If department doesn't exist, adds new department. 
		addNewDepartment(departmentName);
	});
};


// Adds new department.
// Nice feature to let both managers and supervisors add departments.
var addNewDepartment = function(departmentName) {
	console.log('We will add this new department: ' + departmentName);

	// Adds department to departments table in database.
	connection.query("INSERT INTO departments SET ?", {
        DepartmentName: departmentName
		}, function(err, res) {
			if (err) {
				throw err;
			} else {
				console.log("New department was added successfully!");
				selectAction();
			}
		});
};