module.exports = {
  index: function(cb){
    var b = {"b": 1, "a": 2};

    console.log(this.GET);
    cb(this.render({title: "Beczka Śpiewu", variable: "asdasdasd"}));
  },
  addGroup: function(cb){
    var that = this;
    r.table('groups').run(this.conn, function(err, cur){
      if(err) throw err;
      cur.toArray(function(err, raw){
        if(err) throw err;

        cb(that.render({title: "Dodaj Grupę", groups: raw}, "addGroup"));
      });
    });
  },
  addList: function(cb){
    var that = this;
    r.table('lists').eqJoin("group_id", r.table("groups")).run(this.conn, function(err, cur){
      if(err) throw err;
      cur.toArray(function(err, raw){
        if(err) throw err;

        cb(that.render({title: "Dodaj Liste", lists: raw}, "addList"));
      });
    });
  },
  addSong: function(cb){
    cb(this.render({title: "Dodaj Piosenkę"}, "addSong"));
  }
};
