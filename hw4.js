/*
Name: Mohanad Abouserie
ID: 900213567
Assignment: 4
*/

/*
Importnat Note:
Please ensure that my code runs correctly during the evaluation of my assignment by following these steps to configure the XAMPP PHPMyAdmin server:
1- Set the 'id' field as the primary key with an auto-increment feature. This field should not be included in the hw4.js file since its value will be generated automatically.
2- The 'ts' field should be configured as a TIMESTAMP type with a default value of CURRENT_TIME. This field will automatically capture the timestamp when a record is inserted. Therefore, it doesn't need to be included in the hw4.js file.
3- Configure the 'sent' field as a TINYINT type with a default value of 0. This field represents the sent status of a message. Since it has a default value, there is no need to explicitly include it in the hw4.js file.
By following these guidelines, my code will function properly, ensuring the accurate evaluation of my assignment. Thank you for your attention to these configuration details.

For the modules I used:
npm install mysql
npm install express
*/

/*
Testing API 1 - sendSMS (phone, message)
http://localhost:3000/sendSMS
{
  "phone": "01122334455",
  "msg": "Hello World"
}
*/

/*
Testing API 2 - getSMS()
http://localhost:3000/getSMS
*/

/*
Testing API 3 - smsSent(id)
http://localhost:3000/smsSent?id=1
*/

var express = require("express");
var mysql = require("mysql");
var srv = express();
var mysqlcon = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: ""
});

mysqlcon.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

srv.use(express.json());

srv.post("/sendSMS", function(req, res) {
    var phone = req.body.phone;
    var message = req.body.msg;

    var sms = {
        phone: phone,
        message: message
    };

    var sql = "INSERT INTO smsq (phone, body) VALUES ('" + sms.phone + "', '" + sms.message + "')";

    mysqlcon.query(sql, function(err, result) {
        if (err) {
            console.error(err);
            res.end("0");
        } else {
            console.log("1 record inserted");
            res.end("1");
        }
    });
});


srv.get("/getSMS", function(req, res) 
{
    var sql = "SELECT * FROM smsq WHERE sent = 0 ORDER BY ts LIMIT 1";

    mysqlcon.query(sql, function(err, result) {
        if (err) {
            console.error(err);
            res.json({ error: "Internal server error" });
        } else {
            if (result.length > 0) {
                var sms = {
                    id: result[0].id,
                    phone: result[0].phone,
                    msg: result[0].body,
                };
                res.json(sms);
            } else {
                res.json({ error: "No unsent messages found" });
            }
        }
    });
});

srv.get("/smsSent", function(req, res) {
    var id = req.query.id;

    var sql = "UPDATE smsQ SET sent = 1 WHERE id = " + id;
    mysqlcon.query(sql, function(err, result) {
        if (err) {
            console.error(err);
            res.json({ error: "Internal server error" });
        } else {
            if (result.affectedRows > 0) {
                res.end("1");
            } else {
                res.json({ error: "Message not found" });
            }
        }
    });
});

srv.listen(3000, function() {
    console.log("Server is listening on port 3000.");
});