const os                      = require('os');
const path                    = require('path');
const fs                      = require('fs');
const klass                   = require('klass');
const crypto                  = require('crypto');
const _                       = require('underscore');

var Storage                   = klass(function(options) {

  _.extend(this, options.mock);

}).methods({

  stream: function(data, key, next) {
    this.data = data;
    this.key = key;
    if (next) {
      next();
    }
  },

  generateKey: function(fieldname, filename, next) {
    var now = new Date().getTime().toString();
    var extension            = filename.split('.').pop();
    const hash               = crypto.createHmac('sha256', fieldname+now)
      .update(filename)
      .digest('hex');

    var key                  = fieldname + "-" + hash + "." + extension;
    key                      = path.join(os.tmpdir(), key);
    

    return key;
  },

  put: function(key, body, next) {
    this.key  = key;
    this.body = body;
    if (next) {
      next(err, {});
    }
  },

  get: function(key, next) {
    this.key = key;
    if (next) {
      next(null, {});
    }
  },

  delete: function(key, next) {
    this.key = key;
    if (next) {
      next(null, key);
    }
  },

  move: function(oldkey, key, next) {
    this.oldkey = oldkey;
    this.key = key;
    if (next) {
      next(null);
    }
  }
})

module.exports          = Storage;

