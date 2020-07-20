const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const date=require(__dirname+"/date.js");
const PORT = process.env.PORT || 3000;


const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


//Data base of mangoose
mongoose.connect('mongodb+srv://uttambala:Uttam@123@cluster0.vjswn.mongodb.net/todolistDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const doListScema={
    name:String
};

const DoList=mongoose.model("DoList",doListScema);


const list1=new DoList({
    name:"Lunch"
});
const list2=new DoList({
    name:"home work"
});
const list3=new DoList({
    name:"movie watch"
});

const listArray=[list1,list2,list3];



const newScema={
    name:String,
    items:[doListScema]
};

const NewList=mongoose.model("NewList",newScema);




// server side Script
app.get("/",function(req,res){
    let day=date();
    // find item in database
   DoList.find({},function(err,result){
       if(result.length===0){
        // Insert Intial Item In List
        DoList.insertMany(listArray,function(err){
            if(err){
                console.log(err);
            }else{
                console.log("adding dolist item");
            }
        });
        res.redirect("/");

       }else{
        res.render("list",{kind:day,newLinesItem:result});

       }
    
   });
});

app.post("/",function(req,res){
    let itemName=req.body.addList;
    let lastName=req.body.list;

    const listName=new DoList({
              name:itemName
     });

    if(lastName===date()){
        listName.save();
        res.redirect("/");
    }else{
        NewList.findOne({name:lastName},function(err,result){
            result.items.push(listName);
            result.save();
            res.redirect("/"+lastName);
        });
    }

  
});


app.post("/delete",function(req,res){
    const idList=req.body.check;
    const lastName=req.body.hidenList;

    if(lastName===date()){
        DoList.findByIdAndRemove(idList,function(err){
            if(!err){
                console.log("sucess");
                res.redirect("/");
            }
    
        });

    }else{
        NewList.findOneAndUpdate({name:lastName},{$pull:{items:{_id:idList}}},function(err,result){
            if(!err){
                res.redirect("/"+lastName);
            }
        })
    }
   

});




app.get("/:customName",function(req,res){
    
    let customName=req.params.customName;

    NewList.findOne({name:customName},function(err,result){
        if(!err){
            if(!result){
                const list=new NewList(
                    {
                        name:customName,
                        items:listArray
                    }
                );
                list.save();
                res.redirect("/"+customName);
            }else{
                res.render("list",{kind:result.name,newLinesItem:result.items});

            }

        }
    });

    
   

   
});
// app.post("/:work",function(req,res){
    
//     let itemName=req.body.addList;
//     const listName=new DoList({
//               name:itemName
//      });

//     listName.save();
//     res.redirect("/");
//     res.redirect("/:work");
    
// });

app.listen(PORT,function(){
    console.log("this is set on 3000 port in local servr");
})