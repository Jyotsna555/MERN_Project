require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltrounds = 3;
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");

const path = require("path");


const request = require("request");
const https = require("https");

const app = express();
// app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookie());
app.use(express.json());

mongoose.connect("mongodb+srv://admin_jyotsna:"+process.env.MONGOPASSWORD+"@cluster0.bqhnk.mongodb.net/MERNProject", {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify:false});
//mongoose.connect("mongodb://localhost:27017/MERNProject", {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify:false});

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
});

const User = mongoose.model("user", userSchema);

const myobj = {
    title:String,
    newslink:String,
    date:String
};

const pinSchema = new mongoose.Schema({
    username: String,
    news:[]
});

const Pinned = mongoose.model("pin", pinSchema);

//variables
let alert = "";

// MIDDLEWARE

function routeAuth(req, res, next){
    const accesstoken = req.cookies.myjwt;
    if(accesstoken){
        console.log(accesstoken);

        jwt.verify(accesstoken, process.env.ACCESSTOKEN, function(err, decoded){
            if (err) {
              console.log(err);
              res.send("Incorrect token, please sign in!");
            } else {
              console.log("  User sending request is: ");
              console.log(decoded);
              next();
            }
        });
    }
    else{
        console.log("not logged in");
        res.send({status: 404, "user": null});
    }
}

async function loggingIn(req, res, next){
    const username = req.body.username;
    const password = req.body.password;
    console.log("1check");

    const founduser = await User.findOne({username:username}).then(data => {
        if(data){
            console.log("founduser");
            bcrypt.compare(password, data.password, function (error, result) {
                if (!error) {
                    console.log("2check");
                  if (result === true) {
                    console.log("3check");
                    next();
                    } else {
                    //throw new Error("Password doesn't match");
                    console.log("Password doesn't match");
                    res.send({status:422});
                  }
                }
              });
        }
        else{
            throw new Error("Username doesn't exist");

        }
    }).catch(err => {
        console.log(err);
        res.send({status:422});
    });
}

//ROUTES
app.use(express.static(path.join(__dirname, "/client/build")));

app.get('/page/*', function(req,res) {
    console.log("   CATCH ALLL");
	res.sendFile(path.join(__dirname, "/client/build/"));
});

app.post("/postlogin",loggingIn, (req, res)=>{

    const username = req.body.username;
    const password = req.body.password;
    
    console.log("loggged in");

    const newobject = {
        username: username,
      };
      const accesstoken = jwt.sign(newobject, process.env.ACCESSTOKEN);

      res.cookie("myjwt", accesstoken, {sameSite: "lax"});
      console.log("TOKEN GIVEN  " + accesstoken);

    res.json({status: 200, accesstoken});
    
});

async function check(u, p){
    let ans = [];
    let found1 = await User.findOne({username: u});
    let found2 = await User.findOne({password: p});

    console.log(found1, found2);
    ans.push(found1);
    ans.push(found2);

    return ans;

}

app.post("/postsignup", (req, res)=>{
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    check(username, password).then((ans)=>{
        if(!name || !username ){
            console.log("Sufficient details not given");
            throw new Error("Sufficient details not given");
        }
        else if(ans[0]){
            alert+="Username exists ";
            console.log("Username exists");
            throw new Error("Username exists");
        }
        else if(ans[1]){
            alert+="Password exists ";
            console.log("password exists");
            res.status(422).send({status:422});
        }
        else{
            console.log("continue");
            //bcrypt
            bcrypt.hash(password, saltrounds, function(err, hashed){
                console.log("2continue");

                if(!err){
                    console.log("3continue");

                    const newuser = new User({
                        name: name,
                        username: username,
                        password: hashed,
                    });

                    newuser.save((err, saved) => {
                        if(err){
                            console.log("error in signing");
                            throw new Error("Could not sign up");
                        }else{
                            res.status(200).send({status:200});
                        }
                    })
                    // res.status(200).send({status:200});
                }
                else{
                    throw new Error("Error in creating password");
                }
            })


        }
    }).catch(err => {
        res.status(422).send({error: err});
    });

});

app.get("/getwelcome", routeAuth, (req, res) => {

    const accesstoken = req.cookies.myjwt;
    let user = null;

    jwt.verify(accesstoken, process.env.ACCESSTOKEN, function(err, decoded){
        if(!err){
            console.log("finding user", decoded.username);
            User.findOne({username: decoded.username}, (err, found)=>{
                if(!err){
                    if(found){
                    console.log("user",found);
                    user = found;
                    }


                    if(user){
                        res.send({status: 200, "user": user});
                            // res.status(200).send(user);
                    }
                    else{
                        res.send({status: 404, "user": null});
                    }
                }
            });
        }
    });

});

app.get("/getheadlines", routeAuth, (req, res)=>{

    const url = process.env.NEWSAPI;

    let data = "";
    let parsedResponseData;

  https
    .get(url, (response) => {
        response.on("data", function(chunk){
        data+=chunk;
    });

      // The whole response has been received. Print out the result.
    response.on("end", () => {
        if (!response.complete){
            console.error('The connection was terminated while the message was still being sent');
        }    
        parsedResponseData = JSON.parse(data);
        //console.log(parsedResponseData);
        res.status(200).send(parsedResponseData);
    });

    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    //   res.send("error");
    res.status(404).send(null);
    });

});

app.post("/savepin", routeAuth, (req, res) => {
    const title = req.body.title;
    const newslink = req.body.newslink;
    const date = req.body.date;

    const obj = {
        title: title,
        newslink: newslink, 
        date: date,
    };

    let username;
    const myjwt = req.cookies.myjwt;

    jwt.verify(myjwt, process.env.ACCESSTOKEN, (err, decoded)=>{
        if(!err){
            username = decoded.username;
        }
    });

    console.log("Username: "+username);
    //find

    Pinned.findOne({username: username}, (err, found) => {
        if(err){
            res.status(406).send({status:406});
        }
        else if(!err){
            if(found){

                    console.log("obj", obj);
                    //check if the same article doesn't already exist...
                    console.log("User's pin document exists");
                    console.log(found);

                    let index = -1;
                    for(let i=0; i<found.news.length; i++){
                        if(found.news[i].title===obj.title){
                            index=i;
                            break;
                        }
                    };

                    console.log("index", index);
                    if(index>=0){
                        console.log("Pin has already been saved!!");
                        res.status(208).send({status:208});
                    }else if(index==-1){
                        found.news.push(obj);
                        found.save();
                        console.log("updated doc and saved pin");
                        console.log(found);
                        res.status(200).send({status:200});
                    }

            }
            else if(!found){
                //create new!!
                console.log(" CREATING NEW PIN document for user");

                const pin = new Pinned({
                    username: username,
                    // news:[obj]
                    news:[{
                        title: title,
                        newslink: newslink, 
                        date: date,
                    }]
                });
                pin.save();
                console.log("saved new pin in NEW DOCUMENT", pin);
                res.status(200).send({status:200});
            }
            
        }
    });

});

app.get("/getpins", routeAuth, (req, res) => {
    let username;
    const myjwt = req.cookies.myjwt;

    jwt.verify(myjwt, process.env.ACCESSTOKEN, (err, decoded)=>{
        if(!err){
            username = decoded.username;
        }
    });

    Pinned.findOne({username: username}, (err, found) => {
        if(!err){
            if(!found){
                console.log("not found");
                res.status(404).send({status:404});
            }
            else if(found){
                if(found.news.length!=0){
                    console.log("Found the saved pins!", found.news);
                    res.status(200).send(found.news.reverse());
                }else{
                    console.log("Served but no pins yet");
                    // res.status(204).send({error: "empty"});
                    res.status(404).send({status:204});
                }
            }
        }
    });
});

app.post("/deletepins", routeAuth, (req,res) => {
    const title =  req.body.title;

    let username;
    const myjwt = req.cookies.myjwt;

    jwt.verify(myjwt, process.env.ACCESSTOKEN, (err, decoded)=>{
        if(!err){
            username = decoded.username;
        }
    });

    Pinned.findOne({username: username}, (err, found)=> {
        if(!err){
            if(found){
                let index = -1;
                    for(let i=0; i<found.news.length; i++){
                        if(found.news[i].title===title){
                            index=i;
                            break;
                        }
                    };
                    found.news.splice(index, 1);
                    found.save();
                    console.log("deleted");
                    res.status(200).send({status: 200});
            }
        }else{
            res.status(400).send({status: 400});
        }
    })
});

app.post("/deleteallpins", routeAuth, (req,res) => {
    let username;
    const myjwt = req.cookies.myjwt;

    jwt.verify(myjwt, process.env.ACCESSTOKEN, (err, decoded)=>{
        if(!err){
            username = decoded.username;
        }
    });

    Pinned.findOne({username: username}, (err, found)=> {
        if(!err){
            if(found){
                
                found.news=[];
                found.save();
                console.log("Everything deleted!");
                res.status(200).send({status: 200});
            }
        }else{
            res.status(400).send({status: 400});
        }
    })
})

app.post("/logout", (req, res)=>{
    res.clearCookie("myjwt", {path:"/"});
    console.log("existing cookies were deleted");

    res.status(200).send({message: "logged out"});
});

if(process.env.NODE_ENV == "production"){
    app.use(express.static("client/build"));
}

app.listen(process.env.PORT||5000, ()=>{
    console.log("Server is up and running!");
})