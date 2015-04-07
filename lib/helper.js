exports.assign = function (dest, src) {
  for (var k in src) {
    dest[k] = src[k];
  }
  return dest;
};

