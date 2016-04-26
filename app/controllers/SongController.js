module.exports = {
  index: function(cb){
    if(this.POST){
      this.addSongPOST(cb);
      return;
    }
    r.table("songs").run(this.conn, function(err, cursor){
      if(err) throw err;
      cursor.toArray(function(err, raw){
        if(err) throw err;

        var result = {};
        result.len = raw.length ;
        result.songs = raw;
        cb(JSON.stringify(result));
      });
    });
  },
  addSongPOST: function(cb){
    this.uploadSong(this.POST, function(){
      cb("GoooD MooorninG");
    });
  },
  addSong: function(cb){
    this.uploadSong(this.GET, function(){
      cb("GoooD MoorningG");
    });
  },
  uploadSong: function(data, cb){
    var that = this;
    this.packageData(data, function(result){
      r.table("songs").insert(result).run(that.conn, function(err){
        if(err) throw err;
        console.log("Created song: " + result.title);
        cb();
      });
    });
  },
  packageData: function(data, cb){
    var result = {};
    result.title = data.title;
    result.author = data.author;
    result.category = data.category;
    result.chords = data.chords;
    result.list_id = data.list_id;
    result.content = data.content;
    result.chords_img_url = data.chords_img_url;
    result.creationDate = new Date().toJSON().slice(0,10);
    cb(result);
  }
}
