const mongoose=require('mongoose');
const Campground=require('../models/campground')
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(()=>{
    console.log("CONNECTION OPEN")
})
.catch(err=>{
    console.log("OH NO ERROR!!!!!")
    console.log(err);
})


const sample=array=>array[Math.floor(Math.random()*array.length)];

const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++)
    {
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251',
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste quos similique praesentium ratione dolor voluptates repellendus ipsum laboriosam amet error, aliquid culpa excepturi modi nisi laudantium sapiente. Itaque, quas hic?',
            price:price
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close()
})