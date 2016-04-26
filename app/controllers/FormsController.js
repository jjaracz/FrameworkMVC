module.exports = {
  addGroup: function(cb){
    console.log(this.GET);
    var result = {};
    result.title = this.GET.title;
    result.img_url = this.GET.img_url;
    result.creationDate = new Date().toJSON().slice(0,10);
    r.table('groups').insert(result).run(this.conn, function(err){
      if(err) throw err;
      console.log("Create group: " + result.title);
      cb("<h1 style=\"width: 100%; text-align: 'center'; font: small-caps 300% Arial;\">Grupa została stworzona</h1><a href=\"/\" style=\"text-align: center\">Idź na stronę główną</a>");
    });
  },
  addList: function(cb){
    console.log("asd");
  },
  addSongs: function(cb){
    console.log("bfc");
  }

};
