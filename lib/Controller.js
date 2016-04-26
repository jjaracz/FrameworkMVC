var swig = require('swig');

module.exports = {
  render: function(args, view){
    if(typeof view == 'undefined') view = this.VIEW;
    else view = view + this.EXTENSION;
    return swig.renderFile(this.ROOT + '/app/views/' + view, args);
  }
};
