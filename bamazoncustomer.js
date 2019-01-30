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
    // for (var i = 0; i < results.length; i++) {
    //   console.log(results[i].item_id)
    // };
    // console.table(connection.query("select * from products"));
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
      // based on their answer, either call the different functions
      console.log(answer)
      switch (answer.action) {
        case "Order Something":
          orderSomething();
          break;

        case "EXIT":
          connection.end();
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

// function to handle posting new items up for auction
var orderSomething = function () {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([{
        name: "item",
        type: "input",
        message: "What is the ID number of the item that you would like to order?"
      },
      {
        name: "category",
        type: "input",
        message: "How many units of this item would you like to buy?"
      },
      {
        type: "confirm",
        message: "Are you sure that you would like to place this order?",
        name: "confirm",
        default: true
      }

      // {
      //   name: "startingBid",
      //   type: "input",
      //   message: "What would you like your starting bid to be?",
      //   validate: function (value) {
      //     if (isNaN(value) === false) {
      //       return true;
      //     }
      //     return false;
      //   }
      // }
    ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      if (inquireResponse) {
        connection.query(
          "INSERT INTO auctions SET ?", {
            item_name: answer.item,
            category: answer.category,
            starting_bid: answer.startingBid || 0,
            highest_bid: answer.startingBid || 0
          },
          function (err) {
            if (err) throw err;
            console.log("Your auction was created successfully!");
            // re-prompt the user for if they want to bid or post
            start();
          }
        );
      }
    });
};