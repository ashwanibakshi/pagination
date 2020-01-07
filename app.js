var mongoose = require('mongoose');
var express  = require('express');
var bodyParser = require('body-parser');
var userModel = require('./models/data');

//connect to db
mongoose.connect('mongodb://localhost:27017/usersDemo',{useNewUrlParser:true})
.then(()=>console.log('connected to db'))
.catch((err)=>console.log('error',err))

//init app
var app  = express();

//set view engine 
app.set('view engine','ejs');

//fetch data from request
app.use(bodyParser.urlencoded({extended:false}));

//default page
app.get('/',(req,res)=>{
    try {
         var query= {} ;
         var page=1;
         var perpage=3;
         if(req.query.page!=null){
             page= req.query.page
         }
         query.skip=(perpage * page)-perpage;
         query.limit=perpage;

         userModel.find({},{},query,(err,data)=>{
             if(err){
                 console.log(err);
             }
             userModel.count((err,count)=>{ 
                  if(err){
                      console.log(err)
                  }
                  res.render('pages/home',{
                      data:data,
                      current:page,
                      pages:Math.ceil(count/perpage)
                  })
             });
         });
    } catch (error) {
         console.log(error);
    }
});

app.post('/',(req,res)=>{
    try {
            var user = new userModel({
                name:req.body.name,
                phno:req.body.phno
            });
            user.save((err,data)=>{
               if(err){
                   console.log(err)
               }
               res.redirect('/');
            });
    } catch (error) {
         console.log(error);
    }
});

var port  = process.env.PORT || 3000;
app.listen(port,()=>console.log('server run at '+port));