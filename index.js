const os                      = require('os');
const path                    = require('path');
const fs                      = require('fs');
const klass                   = require('klass');
const crypto                  = require('crypto');
const _                       = require('underscore');

var Storage                   = klass(function(options) {
  
  _.extend(this, options.mock);
  this.data = {};

}).methods({

  stream: function(data, key, next) {
    this.data[key] = data;
    
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
    this.data[key] = body;
    if (next) {
      next(err, {});
    }
  },

  get: function(key, next) {
    if (next) {
      next(null, this.data[key]);
    }
  },

  delete: function(key, next) {
    delete this.data[key];
    if (next) {
      next(null, key);
    }
  },

  move: function(oldkey, key, next) {
    this.data[key] = this.data[oldkey];
    delete this.data[oldkey]

    if (next) {
      next(null);
    }
  }
  
  clear: function() {
    this.data = {};
  }

})



module.exports          = Storage;

