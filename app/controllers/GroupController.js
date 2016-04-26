module.exports = {
  index: function(cb){
    if(typeof this.POST != "undefined"){
      this.addGroup(cb);
      return;
    }
    r.table('groups').run(this.conn, function(err, cur){
      if(err) throw err;
      cur.toArray(function(err, raw){
        if(err) throw err;
        var result = {};
        result.len = raw.length;
        result.groups = raw;
        cb(JSON.stringify(result));
      });
    });
  },
  getIntID: function(cb){
    this.index(function(data){
      var result = JSON.parse(data);
      if(typeof result.groups[this.ARG] != "undefined"){
        cb(result.groups[this.ARG]);
      }else{
        cb("ERROR")
      }
    });
  },
  addGroup: function(cb){
    console.log(this.POST);
    var result = {};
    result.title = this.POST.title;
    result.img_url = this.POST.img_url;
    result.creationDate = new Date().toJSON().slice(0,10);
    r.table('groups').insert(result).run(this.conn, function(err){
      if(err) throw err;
      console.log("Create group: " + result.title);
      cb("GoooD MooorninG");
    });
  }
}
