var express = require("express");
var router = express.Router();

var ctrlUsers = require("../controllers/user.controller.js");

console.log("users route");

//router.get("/", function(req, res, next) {
//  res.render("list_certs", { title: "BPDTS Certs" });
//});

router.route("/").get(ctrlUsers.admin);
router.route("/add").get(ctrlUsers.add);
router.route("/postuser").post(ctrlUsers.postUser);

module.exports = router;