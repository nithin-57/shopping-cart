var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('connected to database..'))
.catch(err => console.log('Refuseto connect..',err));

var products = [
    new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
    title: 'Gothic Video Game',
    description: 'Awesome Game',
    price: 10
}),
new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Dark_Souls_Cover_Art.jpg',
    title: 'Dark Souls Video Game',
    description: 'Awesome Game',
    price: 15
}),
new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Maxpaynebox.jpg',
    title: 'Max Payne Video Game',
    description: 'Awesome Game',
    price: 20
}),
new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/a/a7/God_of_War_4_cover.jpg',
    title: 'God of War Video Game',
    description: 'Awesome Game',
    price: 25
}),
new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/b/b0/The_Witcher_EU_box.jpg',
    title: 'The Withcher Video Game',
    description: 'Awesome Game',
    price: 30
}),
new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Vice-city-cover.jpg',
    title: 'GTA Vice City Game',
    description: 'Awesome Game',
    price: 30
})
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
            exit(); 
        }
    });
}

function exit() {
    mongoose.disconnect();
}