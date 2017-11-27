const os                      = require('os');
const path                    = require('path');
const fs                      = require('fs');
const klass                   = require('klass');
const crypto                  = require('crypto');
const _                       = require('underscore');

var Storage                   = klass(function(options) {
  
  _.extend(this, options.mock);
  global.mock_file_system = {};

}).methods({

  stream: function(data, key, next) {
    global.mock_file_system[key] = data;
    
    if (next) {
      next();
    }
  },

  generateKey: function(fieldname, filename, next) {
    var now = new Date().getTime().toString();
    var extension            = path.extname(filename);
    const hash               = crypto.createHmac('sha256', fieldname+now)
      .update(filename)
      .digest('hex');

    var key                  = fieldname + "-" + hash + "." + extension;
    key                      = path.join(os.tmpdir(), key);
    

    return key;
  },

  put: function(key, body, next) {
    global.mock_file_system[key] = body;

    if (next) {
      next(null, {});
    }
  },

  get: function(key, next) {
    if (next) {
      next(null, global.mock_file_system[key]);
    }
  },

  delete: function(key, next) {
    delete global.mock_file_system[key];
    if (next) {
      next(null, key);
    }
  },

  move: function(oldkey, key, next) {
    global.mock_file_system[key] = global.mock_file_system[oldkey];
    delete global.mock_file_system[oldkey]

    if (next) {
      next(null);
    }
  },
  
  clear: function() {
    global.mock_file_system = {};
  }

})



module.exports          = Storage;

