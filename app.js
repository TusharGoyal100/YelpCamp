const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError');
const methodOverride=require('method-override');


const campgrounds=require('./routes/campgrounds')
const reviews=require('./routes/review')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>{
    console.log("CONNECTION OPEN")
})
.catch(err=>{
    console.log("OH NO ERROR!!!!!")
    console.log(err);
})



const app=express();


app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));

const validateCampground=(req,res,next)=>{
    
    const {error}=campgroundSchema.validate(req.body);
    if(error)
    {   const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}

const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error)
    {   const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}

app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message)err.message='Oh No,Something Went Wrong';
    res.status(statusCode).render('error',{err})
   
})

app.listen(3000,()=>{
    console.log('Serving on port 3000');
})