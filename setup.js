var r = require('rethinkdb');
var connection = null;



r.connect({host: 'localhost', port: 28015, db: 'bs'}, function(err, conn){
  if(err) throw err;
  connection = conn;

  console.log("Creating database ...");

  r.dbList().contains('bs')
  .do(function(databaseExists) {
    return r.branch(
      databaseExists,
      { created: 0 },
      r.dbCreate('bs')
    );
  }).run(connection, function(err){
    if(err) throw err;
    console.log("Created");
    console.log("\nCreating tables ...");


    r.tableCreate('groups').run(connection, function(err){
      r.tableCreate('lists').run(connection, function(err){
        r.tableCreate('songs').run(connection, function(err){
          console.log("Created");
          console.log("\nInsert into tables ...");

          var result = [];
          result[0] = {};
          result[0].title = "Beczka";
          result[0].img_url = "http://dominikanie.pl/wp-content/uploads/2015/11/beczka_avatar_1446632767-203x203.jpg";
          result[0].creationDate = new Date().toJSON().slice(0,10);
          result[1] = {};
          result[1].title = "Przystań";
          result[1].img_url = "http://krakow.dominikanie.pl/wp-content/uploads/sites/4/2014/07/przystan_logotyp.jpg";
          result[1].creationDate = new Date().toJSON().slice(0,10);
          result[2] = {};
          result[2].title = "ŚDM";
          result[2].img_url = "http://www.swszczepan.pl/wp-content/uploads/2016/03/k16_pl_rgb_WWW.png";
          result[2].creationDate = new Date().toJSON().slice(0,10);

          r.table('groups').insert(result).run(connection, function(err){
            r.table('groups').run(connection, function(err, cur){
              if(err) throw err;

              cur.toArray(function(err, raw){
                var len = raw.length - 2;
                var index = rand(0, len);

                result = [];
                result[0] = {};
                result[0].title = "Adwentowe";
                result[0].img_url = "http://swietarodzina.pila.pl/wp-content/uploads/2012/12/Adwent-to-czas-przygotowania-do-BO%C5%BBEGO-narodzenia.jpg";
                result[0].group_id = raw[index].id;
                index = rand(0, len);
                result[1] = {};
                result[1].title = "Wielkanocne";
                result[1].img_url = "http://bi.gazeta.pl/im/52/1f/d0/z13639506V,Jajka.jpg";
                result[1].group_id = raw[index].id;
                index = rand(0, len);
                result[2] = {};
                result[2].title = "Bożonarodzeniowe";
                result[2].img_url = "http://salon-kamila.pl/wp-content/uploads/2014/12/148526_boze_narodzenie_stroik_swiece.jpg";
                result[2].group_id = raw[index].id;
                index = rand(0, len);
                result[3] = {};
                result[3].title = "Pielgrzymkowe";
                result[3].img_url = "http://www.jerychomlodych.pl/sites/default/files/pielgrzymka-Jasna_Gora.jpg";
                result[3].group_id = raw[index].id;
                result[4] = {};
                result[4].title = "Przystanowe";
                result[4].img_url = "http://www.przystan.krakow.dominikanie.pl/assets/images/411_1A.jpg";
                result[4].group_id = raw[1].id;
                result[5] = {};
                result[5].title = "Uwielbieniowe";
                result[5].img_url = "http://static1.squarespace.com/static/55f916d4e4b00391a7fad9cc/56050297e4b00a1e0455759d/56c1b9c140261d17781c267b/1455536720832/?format=1500w";
                result[5].group_id = raw[2].id;
                r.table('lists').insert(result).run(connection);
              });
            });
          });


          console.log("Inserted");

        });
      });
    });
  });


});

function rand( min, max ){
    min = parseInt( min, 10 );
    max = parseInt( max, 10 );

    if ( min > max ){
        var tmp = min;
        min = max;
        max = tmp;
    }

    return Math.floor( Math.random() * ( max - min + 1 ) + min );
}
