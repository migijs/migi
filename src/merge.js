export default function(range){
  //合并相邻更新的文本节点
  for(var i = 0, len = range.length; i < len; i++){
    var now = range[i];
    var next = range[i + 1];
    if(next && now.start == next.start){
      range.splice(i, 1);
      i--;
    }
  }
};