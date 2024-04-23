// Node JS application using Express

const express = require('express');
var cors = require('cors');
const app = express();

const port = 3000;
// Stringified JSON menu
let menu =   '[{ "numBites": "3"}, ' +
                // Bites
             '[{ "title": "Thick-cut Fries", ' +
                '"image": "../Image/steakfries.jpg", ' +
                '"sdesc": "Large steak fries", ' +
                '"ldesc": "These large, fluffy french fries will rocket you into the sky and leave you craving more. NOTE: A small order contains 5 fries while a large order contains 12. An order can be unsalted on request.", ' +
                '"price": "3"},' +

                '{ "title": "Voyager Calzone", ' +
                '"image": "../Image/calzone.jpg", ' +
                '"sdesc": "Travel-sized calzone", ' +
                '"ldesc": "Our Voyager Calzone consists of crispy bread on the outside and pepperoni, tomato sauce, and mozzarella cheese on the inside. NOTE: As with most calzones, the insides tend to be very hot. Be careful taking that first bite!", ' +
                '"price": "5"},' +

                '{ "title": "Palm Sliders", ' +
                '"image": "../Image/sliders.jpg", ' +
                '"sdesc": "Two burgers that fit in your hand", ' +
                '"ldesc": "Two sliders, one for each hand (or to share). The Voyager classic style includes American cheese and a slice of jalapeño, though these can be removed if desired.", ' +
                '"price": "4"},' +
                // Meals
                '{ "title": "Grilled Chicken Salad", ' +
                '"image": "../Image/salad.jpg", ' +
                '"sdesc": "Romaine lettuce, vegetables, and grilled chicken", ' +
                '"ldesc": "Counting calories? This salad will make you feel healthier without sacrificing taste. Salad includes romaine lettuce, chopped spinach, chopped arugula, shredded feta cheese, avocado, and diced grilled chicken. Optionally comes with dijon-lemon, cilantro, or tangy vinaigrette dressings.", ' +
                '"price": "10"}, ' +

                '{ "title": "Hearty Burger & Fries", ' +
                '"image": "../Image/burger.jpg", ' +
                '"sdesc": "Burger with 1/2lbs patty and classic french fries", ' +
                '"ldesc": "Our hearty burger is the epitome of pleasure food. A 1/2lbs beef patty sizzled to perfection with melty American cheese on top is enough to make anyone\'s mouth water. Add some lettuce, pickles, and crisp tomatoes, and we promise you\'ll be coming back for more. The fries are crispy and easy to eat, giving you a break between chowing on meaty perfection. NOTE: All toppings can be removed on request.", ' +
                '"price": "14"}, ' +

                '{ "title": "Spicy Meatball Sub", ' +
                '"image": "../Image/meatballsub.jpg", ' +
                '"sdesc": "Meatball and mozzarella sandwich with a kick.", ' +
                '"ldesc": "For those desiring some heat, our meatball sub packs a punch. Five meatballs in a hoagie bun with chopped green onions, melty mozzarella cheese and a drizzle of our special spicy sauce will satiate that appetite and get you crying tears of joy (and spiciness). NOTE: A less spicy and no spice option is available for those opposed to mouth fires.", ' +
                '"price": "12"}]]';

let menuObj = JSON.parse(menu);

// Loading plugins
app.use(cors());
app.use(express.json());

// Send client current menu
app.get('/api/menu', (request, response) => {
    response.status(200).send(menu);
    console.log('Voyager Menu requested.');
});

// Calculate final order total
app.post('/api/checkout', (request, response) => {

    
    const order = request.body;

    let price = 0;
    for (let i = 0; i < order.length; i++) {
        if (order[i] >= 0 && order[i] <= 10) {
            price += order[i] * menuObj[1][i].price;
        } else {
            price = -1;
            break;
        }
    }
    let priceTax = price * 0.0825; // sales tax in Houston

    if (price < 0) {
        response.send("FATAL: Invalid price calculation");
    }

    let priceTotal = {
        cost: price.toFixed(2),
        tax: priceTax.toFixed(2),
    }

    response.send(JSON.stringify(priceTotal));
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});