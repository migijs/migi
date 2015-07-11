var vd = migi.render(
  <div>1</div>
);

vd.$inTo('#test');
vd.$appendTo('#test1');


vd = migi.render(
  <div>2</div>
);
vd.$inTo('#test2');


vd = migi.render(
  <div>3</div>
);
vd.$appendTo('#test3');


vd = migi.render(
  <div>4</div>
);
vd.$appendTo('#test4');


vd = migi.render(
  <div>5</div>
);
vd.$prependTo('#test5');


vd = migi.render(
  <div>6</div>
);
vd.$prependTo('#test6');


vd = migi.render(
  <div>7</div>
);
vd.$before('#test7 span');


vd = migi.render(
  <div>8</div>
);
vd.$after('#test8 span');


vd = migi.render(
  <div>9</div>
);
vd.$replace('#test9 span');