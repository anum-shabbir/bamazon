
Bamazon is Amazon-like storefront with the MySQL. The app will take in orders from customers and deplete stock from the store's inventory. 

## BamazonCustomer.js
The app prompts users with two messages.


1.The first asks them the ID of the product they would like to buy.
2. The second message asks how many units of the product they would like to buy.


Once the customer has placed the order, the application checks if store has enough of the product to meet the customer's request.

If not, the app logs a phrase  **"Insufficient quantity!"**, and then prevent the order from going through.

However, if the store does have enough of the product, app fulfill the customer's order and database is updated with remaining quantity.
Once the update goes through, the customer is displayed the total cost of their purchase.
![Screenshot](https://raw.githubusercontent.com/anum-shabbir/bamazon/master/BamazonManager-addInv.PNG)

Video Tutorial: 
https://github.com/anum-shabbir/bamazon/blob/master/BamazonCustomer-tutorial.mp4

## BamazonManager.js

Running this file will let Manager do following set of menu options:
1. View Products for Sale
2. View Low Inventory
3. Add to Inventory
4. Add New Product

If a manager selects **View Products for Sale**, the app lists every available item: the item IDs, names, prices, and quantities.
If a manager selects **View Low Inventory**, it lists all items with an inventory count lower than five.
If a manager selects **Add to Inventory**, the app displays a prompt that will let the manager "add more" of any item currently in the store.
If a manager selects **Add New Product**, it allows the manager to add a completely new product to the store.

![Screenshot](https://github.com/anum-shabbir/bamazon/blob/master/BamazonManager-lowInv.PNG)
![Screenshot](https://github.com/anum-shabbir/bamazon/blob/master/BamazonManager-addInv.PNG)

Video Tutorial: 
https://github.com/anum-shabbir/bamazon/blob/master/BamazonManager-tutorial.mp4
