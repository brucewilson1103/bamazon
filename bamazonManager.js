var mysql = require("mysql");
var inquirer = require("inquirer");
require('dotenv').config()

var connection = mysql.createConnection({
  host: process.env.DB_HOST,

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: process.env.DB_USER,

  // Your password
  password: process.env.DB_PASS,
  database: "bamazon"
});


connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  // start();
  console.log("connected");
  console.log("_________________________________________")
  connection.query("SELECT product_name, item_id FROM products", function (err, results) {
    if (err) throw err;
    console.log("\n" + results.length + " Different Types of Inventory Items\n")
    for (var i = 0; i < results.length; i++) {
      console.log("Product Name: " + results[i].product_name + "\nItem ID: " + results[i].item_id + "\n___________________\n")
    };
    
    start();
  });

});

function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Welcome to Bamazon! How can I help you today?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product","EXIT"]
    })
    .then(function (answer) {
      // based on their answer, call the different functions
      console.log(answer)
      switch (answer.action) {
        case "View Products for Sale":
          viewProducts();
          break;

          case "View Low Inventory":
          viewLowInventory();
          break;

        case "EXIT":
          connection.end();
          break;
      }
    });
  }

function viewLowInventory(){
  connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, results){
    if (err) throw (err);
    console.log(results);
  })
  
};