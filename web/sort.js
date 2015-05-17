define(function(require, exports, module){function quickSort(arr, begin, end, compare) {
  if(begin >= end) {
    return;
  }
  var i = begin, j = end, p = i, n = arr[p], seq = true;
  outer:
  while(i < j) {
    if(seq) {
      for(; i < j; j--) {
        if((compare && compare.call(arr, n, arr[j])) || (!compare && n > arr[j])) {
          swap(arr, p, j);
          p = j;
          seq = !seq;
          continue outer;
        }
      }
    }
    else {
      for(; i < j; i++) {
        if((compare && compare.call(arr, arr[i], n)) || (!compare && n < arr[i])) {
          swap(arr, p, i);
          p = i;
          seq = !seq;
          continue outer;
        }
      }
    }
  }
  quickSort(arr, begin, p, compare);
  quickSort(arr, p + 1, end, compare);
}
function swap(arr, a, b) {
  var temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}
function getM(arr, a, b) {
  var max = min = arr[a];
  var i = j = a;
  for(; a < b; a++) {
    if(arr[a] > max) {
      max = arr[a];
      i = a;
    }
    else if(arr[a] < min) {
      min = arr[a];
      j = a;
    }
  }
  return {
    max: max,
    min: min,
    i: i,
    j: j
  };
}
module.exports =  function(arr, compare) {
  if(!Array.isArray(arr)) {
    throw new Error('quick sort need an array');
  }
  if(arr.length < 2) {
    return arr;
  }
  quickSort(arr, 0, arr.length - 1, compare);
  return arr;
};});