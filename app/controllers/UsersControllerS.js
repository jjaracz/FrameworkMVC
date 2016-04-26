module.exports = {
  index: function(){
    this.IO.emit("index", {user: "BOB", age: 11});
  },
  onCreate: function(){
    console.log('onCreate');
  },
  onClick: function(){
    console.log('onClick');
  }
}
