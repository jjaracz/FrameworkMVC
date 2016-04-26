module.exports = {
  index: function(cb){
    r.table('lists').run(this.conn, function(err, cur){
      if(err) throw err;
      cur.toArray(function(err, raw){
        if(err) throw err;
        var result = {};
        result.len = raw.length;
        result.lists = raw;
        cb(JSON.stringify(result));
      });
    });
  },
  getList: function(cb){
    r.table('lists').filter(r.row('id').eq(this.ARG)).run(this.conn, function(err, cur){
      if(err) throw err;
      cur.toArray(function(err, raw){
        if(err) throw err;

        var result = {};
        result.len = raw.length;
        result.lists = raw;
        cb(JSON.stringify(result));
      });
    });
  },
  getByGroup: function(cb){

    r.table('lists').filter(r.row('group_id').eq(this.ARG)).run(this.conn, function(err, cur){
      if(err) throw err;
      cur.toArray(function(err, raw){
        if(err) throw err;

        var result = {};
        result.len = raw.length;
        result.lists = raw;
        cb(JSON.stringify(result));
      });
    });
  },
  addList: function(cb){
    this.uploadList(this.GET, function(){
      cb("GoooD MooorninG");
    });
  },
  addListPOST: function(cb){
    this.uploadList(this.POST, function(){
      cb("GoooD MoorninG");
    });
  },
  uploadList: function(data, cb){
    var that = this;
    this.packageData(data, function(result){
      r.table('lists').insert(result).run(that.conn, function(err){
        if(err) throw err;
        console.log("Create List: " + result.title);
        cb();
      });
    });
  },
  packageData: function(data, cb){
    var result = {};
    result.title = data.title;
    result.img_url = data.img_url;
    result.group_id = data.group_id;
    cb(result);
  }
};
