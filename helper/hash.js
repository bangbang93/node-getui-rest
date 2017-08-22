/**
 * Created by bangbang93 on 2017/8/22.
 */
'use strict';
const crypto = require('crypto');

exports.sha256 = function (str) {
  const sha = crypto.createHash('sha256');
  return sha.update(str).digest('hex');
}
