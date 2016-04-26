var OpenNI = require('openni');
var context = OpenNI();
[
    "head", "left_hand", "right_hand"
].forEach(function(joint) {
    context.on(joint, function(userId, x, y, z) {
          console.log('joint %s of user %d moved to (%d, %d, %d).',
                              joint, userId, x, y, z);
            });
});
