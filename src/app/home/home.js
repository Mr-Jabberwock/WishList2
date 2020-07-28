const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({extended: false});

app.post("/sendmail", urlencodedParser, (req, res) => {
  console.log("request came");
  console.log(req.body)
  let user = req.body;
  var wishlist = "Her er ønskelisten for " + user.wishmaker + "\n"

  for(var i= 0; i < user.wishlist.length; i++){
     wishlist += user.wishlist[i] + "\n";
  } 
  console.log("this far 1")

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "wishlistinfomail@gmail.com",
      pass: 'Daniel33'
    }
  });
  
  var mailOptions = {
    from: "Wishlistinfomail@gmail.com",
    to: user.email,
    subject: user.wishmaker + "s ønskeliste",
    text: wishlist
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send(info);
    }
  });
  console.log("this far 4")
})

app.post("/welcome", (req, res )=>{
  console.log("A user was created")
  var user = req.body;

  var welcome = "Du har modtaget denne email fordi du er blevet oprettet som bruger på Wishlist. \n"
  + "Dette betyder at du nu kan logge ind på din online ønskeliste og oprette ønsker, samt fortælle dine gæster om dine interesser \n"
  + "Dit brugernavn er: " + user.wishmaker + "\n" 
  + "Dit kodeord er: " + user.password

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "djohnsenspam@gmail.com",
      pass: 'daniel33'
    }
  });
  
  var mailOptions = {
    from: "djohnsenspam@gmail.com",
    to: user.email,
    subject: "Velkommen til Wishlist, " + user.wishmaker,
    text: welcome
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send(info);
    }
  });

})

app.listen(3000, () => {
  console.log("The server started on port 3000");
});
