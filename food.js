// ===================== Import package ======================
const fs = require('fs');
const path = require('path');
const util = require('util');

// On va import toutes nos fonctions avec un argument directory qui correspondra au chemin d'accès du répertoire qui contient ou contiendra nos aliments.
module.exports = function(directory) {
  /*
    Dans ce module on aura 4 fonctions :
      - les fonctions synchrones :
        -> toFileSync => prend en arg un object Json et le transforme en fichier Json
        -> fromFileSync => prend en arg un fichier json et le transforme en objet json
      - les fonction asynchrones :
        -> toFile
        -> fromFile
        -> allFromFile ==> transformer tous les fichiers json dans le répertoire et les transformers en object
  */

  // les fonctions synchrones
  function toFileSync (objectAlmt) {
    const outputFile = path.join(directory, objectAlmt.name + ".json");
    fs.writeFileSync(outputFile, JSON.stringify(objectAlmt));
  };

  function fromFileSync (file) {
    const inFile = path.join(directory, file + "json");
    return JSON.parse(fs.readFileSync(inFile, 'utf8'));
  };

  // Les fonctions asynchrones
  function toFile(objectAlmt, cb) {
    const outputFile = path.join(directory, objectAlmt.name + ".json");
    fs.writeFile(outputFile, JSON.stringify(objectAlmt), cb);
  }

  function fromFile(name,cb){
    const inFile = path.join(directory, name.replace(' ','_') + '.json')
    console.log('fromFile:',inFile)
    fs.readFile(inFile, 'utf8', (err, data) => {
      if (err) return cb(err);
      try {
        const food = JSON.parse(data)
        return cb(null, food)
      } catch (e){ // JSON.parse failed
        cb(new Error(inFile, ' wrong format, json parse error: ',e))
      }
    })
  }

  function allFromFile(cb) {
    fs.readdir(directory, (err, files) => {
      if (err) return cb(err)
      // On va  filtrer nos fichiers : on recupere les fichiers ".json", ensuite on remplace ".json" par "" ==> dans la variable allName on aura uniquement le nom des fichiers du repertoire.
      const allNames = files.filter(f => f.match(/.json$/)).map(f => f.replace(/\.json$/,''))
      // On va lire chaque fichier de manière asunchrone
      let foods = []; // list pour stocker tous nos objets crées après lectures de celles-ci
      allNames.forEach(f => fromFile(f, (err, res) =>{
        if (err) {
          foods = null
          return cb(err)
        }
        if (foods){
          foods.push(res)
          if (foods.length === allNames.length)
          return cb(null,foods)
        }
      }))
    })
  }
  return {toFile, fromFile, toFileSync, fromFileSync, allFromFile}
}
