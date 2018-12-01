// ========================== Install package ============================
let express = require("express");
const app = express();
path = require('path');
const foodStorageDirectory = path.join(__dirname, 'foods')
const food = require('./food')(foodStorageDirectory)
/*
  fichier de routage qui fait référence à la détermination de la méthodes dont une application répond à une demande client addréssé au serveur. Càd un URI et une méthode de demande Http (GET, POST, ect.)

  Chaque route peut avoir une ou plusieurs fonctions de gestionnaire, qui sont exécutées lorsque la route est mise en correspondance.
*/

// Template location
app.set('view engine', 'hbs');
app.set('view', path.join(__dirname, 'views'));
// Route de correspondance lors du demande http de type GET : /


app.get('/', (request, response) => {
  response.send("salut")
});

// Route de correspondance lors du demande http de type GET : /foods/:name
app.get('/foods/:name', (request, response) => {
  food.fromFile(request.params.name, (err, nunum) => {
    // Cas si d'erreur
    if (err) {
      return response.status(404).send(`${request.params.name} not found`);
    }
    // Si pas d'erreur => j'envoie une view => /views/views_aliment.hbs
    //response.send(nunum)
    console.log(nunum);
    response.render("viewsAliment", {obj : nunum});
  });
});

// Route de correspondance lors du demande http de type GET : /foods/:name
app.get('/foods', (req, res) => {
  food.allFromFile((err, foodList) => {

    // cas d'erreur
    if (err) {
      return res.status(404).send(`Not Found`);
    }
    //response.send(`err=${err} foodList = ${foodList.map(x => x.name)}`);
    //response.send(foodList);
    foodList.forEach(e => {console.log(e)})
    response.render("viewsListAliments", {list: foodList.map(o => o.name)})

  });
});


app.listen(3000, () => console.log('server listens at http://localhost:3000'));
