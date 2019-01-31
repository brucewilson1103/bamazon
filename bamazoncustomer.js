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
  connection.query("SELECT product_name, item_id, price FROM products", function (err, results) {
    if (err) throw err;
    console.log("\n" + results.length + " Different Types of Inventory Items\n")
    for (var i = 0; i < results.length; i++) {
      console.log("Product Name: " + results[i].product_name + "\nItem ID: " + results[i].item_id + "\nPrice: $" + results[i].price + "\n___________________\n")
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
      choices: ["Order Something", "EXIT"]
    })
    .then(function (answer) {
      // based on their answer, call the different functions
      console.log(answer)
      switch (answer.action) {
        case "Order Something":
          orderSomething();
          break;

        case "EXIT":
          connection.end();
          break;
      }
      // if (answer.postOrBid === "POST") {
      //   postAuction();
      // }
      // else if(answer.postOrBid === "BID") {
      // //   bidAuction();
      // // } else{
      //   connection.end();
      // }
    });
}

// function to handle customer ordering an item
var orderSomething = function () {
   
  inquirer
    .prompt([{
        name: "item",
        type: "input",
        message: "What is the ID number of the item that you would like to order?",
        validate: function (value) {
          // also should add less than results.length
              if (isNaN(value) === false) {
                return true;
              }
              return false
              console.log("Please enter a valid id number" );
            }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many units of this item would you like to buy?",
        validate: function (value) {
          // also should add less than results.length
              if (isNaN(value) === false) {
                return true;
              }
              return false
              console.log("Please enter a valid id number" );
            }
        
      }
          
    ])

    // maybe  answer.action
    .then(function (answer) {
      // when finished prompting, this will check the quantity of the ordered item in the database. If the quantity ordered exists then place the order.
        //If not state "Inifficient Quantity! and prevent the order from going through"
        connection.query("SELECT stock_quantity, price FROM products WHERE ?",  [{item_id: answer.item}], function (err, results) {
          if (err) throw err;
          console.log(results[0].stock_quantity);
          var inventory = results[0].stock_quantity;
          var price = results[0].price;
          console.log(price);

          if (inventory > answer.quantity){
            connection.query(
              // maybe use the update command to communicate with the SQL database
              "UPDATE products SET ? WHERE ?", 
              [{
                stock_quantity: inventory - answer.quantity
              },
              {
                item_id: answer.item
              }],
              function (err, results) {
                if (err) throw err;
                console.log("Your transaction was completed successfully!");
                console.log("Your total cost came to: "+price + " dollars.")
                // re-prompt the user for if they want to purchase more items or exit
                // console.log(results);
                start();
              }
            );
          }else{
            console.log("Sorry not enough inventory.")
          };
        
        })
//       if (answer.it) {
// //         This means updating the SQL database to reflect the remaining quantity.
// // Once the update goes through, show the customer the total cost of their purchase.

       
      
    });
};