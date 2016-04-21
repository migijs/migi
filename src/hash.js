var hash = {};

export default {
  get: function(k) {
    return hash[k];
  },
  set: function(elem) {
    hash[elem.uid] = elem;
    return elem;
  }
};
