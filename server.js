// eslint-disable-next-line

const express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const https= require("https");
const _ = require("lodash");
const path=require("path");

const PORT = process.env.PORT || 5000;

const app=express();
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.resolve(__dirname,'build')));

app.get('/',(req,res)=>{
  res.sendFile(path.resolve(__dirname,'build','index.html'));
});


//allowing all request from all server


app.post('/contact',function(req,res,err){

  var firstName=req.body.firstname;
  var lastName=req.body.lastname;
  var email=req.body.emailid;
  var queryTitle=req.body.title;
  var subject=req.body.subject;

var data={
  members:[{
    email_address: email,
    status: "subscribed",
    merge_fields:{
      FNAME: firstName,
      LNAME: lastName,
      TITLE:queryTitle,
      SUBJECT:subject
    }
  }]
};


const jsonData= JSON.stringify(data);
const url="https://us10.api.mailchimp.com/3.0/lists/1433d5c4af";

const options={
  method:"POST",
  auth:"Earnopedia:682cca46aed3de368c33a1e88f2464f1-us10"
}
const request=https.request(url,options,function(response){

//39f4e3381094f56b4a7c5413ee6ddf0d-us10  authentication key
//1433d5c4af  listid

  response.on("data",function(data){
    console.log(JSON.parse(data));
  })
})

request.write(jsonData);
request.end();

});

app.listen(PORT, function() {
  console.log("Server started on port 5000");
});
