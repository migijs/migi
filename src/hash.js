var hash = {};

export default {
  get: function(k) {
    return hash[k];
  },
  set: function(elem) {
    hash[elem.__uid] = elem;
    return elem;
  }
};
