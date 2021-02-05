let opts = {
  radius: 72,
 // d: 200,
  d:100,
  dtr: Math.PI / 180,
  mcList: [],
  lasta: 1,
  lastb: 1,
  distr: true,
  tspeed: 13,
//  size: 200,
  size: 100,
  mouseX: 0,
  mouseY: 10,
  howElliptical: 1,
  aA: null,
  oDiv: null,
  sa: 0,
  ca: 0,
  sb: 0,
  cb: 0,
  sc: 0,
  cc: 0
}
const sineCosine = function (a, b, c) {
  opts.sa = Math.sin(a * opts.dtr);
  opts.ca = Math.cos(a * opts.dtr);
  opts.sb = Math.sin(b * opts.dtr);
  opts.cb = Math.cos(b * opts.dtr);
  opts.ssc = Math.sin(c * opts.dtr);
  opts.cc = Math.cos(c * opts.dtr);
}
const doPosition = function () {
  let l = opts.oDiv.offsetWidth / 2;
  let t = opts.oDiv.offsetHeight / 2;
  for (let i = 0; i < opts.mcList.length; i++) {
    if (opts.mcList[i].on) {
      continue;
    }
    let aAs = opts.aA[i].style;
    if (opts.mcList[i].alpha > 0.1) {
      if (aAs.display != '')
        aAs.display = '';
    } else {
      if (aAs.display != 'none')
        aAs.display = 'none';
      continue;
    }
    // aAs.left = opts.mcList[i].cx + l - opts.mcList[i].offsetWidth / 2 + 'px';
    if(opts.mcList[i].cx + l - opts.mcList[i].offsetWidth / 2 - 30 < 0){
      aAs.left = "0px";
    }else{
      aAs.left = opts.mcList[i].cx + l - opts.mcList[i].offsetWidth / 2 -30 + 'px';
    }
    aAs.top = opts.mcList[i].cy + t - opts.mcList[i].offsetHeight / 2 + 'px';
    aAs.filter = "alpha(opacity=" + 100 * opts.mcList[i].alpha + ")";
    aAs.zIndex = opts.mcList[i].zIndex;
    aAs.opacity = opts.mcList[i].alpha;
  }
}
const positionAll = function () {
  let phi = 0;
  let theta = 0;
  let max = opts.mcList.length;
  for (let i = 0; i < max; i++) {
    if (opts.distr) {
      phi = Math.acos(-1 + (2 * (i + 1) - 1) / max);
      theta = Math.sqrt(max * Math.PI) * phi;
    } else {
      phi = Math.random() * (Math.PI);
      theta = Math.random() * (2 * Math.PI);
    }
    //坐标变换
    // opts.mcList[i].cx = opts.radius * Math.cos(theta) * Math.sin(phi);
    opts.mcList[i].cx = opts.radius * Math.cos(theta) * Math.sin(phi)*1.8;
    // opts.mcList[i].cy = opts.radius * Math.sin(theta) * Math.sin(phi);
    opts.mcList[i].cy = opts.radius * Math.sin(theta) * Math.sin(phi)*1.2;
    opts.mcList[i].cz = opts.radius * Math.cos(phi);
    //opts.aA[i].style.left = opts.mcList[i].cx + opts.oDiv.offsetWidth / 2 - opts.mcList[i].offsetWidth / 2 + 'px';
    if(opts.mcList[i].cx + opts.oDiv.offsetWidth / 2 - opts.mcList[i].offsetWidth / 2 < 0){
      opts.aA[i].style.left = "0px";
    }else{
      opts.aA[i].style.left = opts.mcList[i].cx + opts.oDiv.offsetWidth / 2 - opts.mcList[i].offsetWidth / 2 + 'px';
    }
    opts.aA[i].style.top = opts.mcList[i].cy + opts.oDiv.offsetHeight / 2 - opts.mcList[i].offsetHeight / 2 + 'px';
  }
}
export const update = function () {
  let a, b, c = 0;
  a = (Math.min(Math.max(-opts.mouseY, -opts.size), opts.size) / opts.radius) * opts.tspeed;
  b = (-Math.min(Math.max(-opts.mouseX, -opts.size), opts.size) / opts.radius) * opts.tspeed;
  opts.lasta = a;
  opts.lastb = b;
  if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
    return;
  }
  sineCosine(a, b, c);
  for (let i = 0; i < opts.mcList.length; i++) {
    if (opts.mcList[i].on) {
      continue;
    }
    let rx1 = opts.mcList[i].cx;
    let ry1 = opts.mcList[i].cy * opts.ca + opts.mcList[i].cz * (-opts.sa);
    let rz1 = opts.mcList[i].cy * opts.sa + opts.mcList[i].cz * opts.ca;

    let rx2 = rx1 * opts.cb + rz1 * opts.sb;
    let ry2 = ry1;
    let rz2 = rx1 * (-opts.sb) + rz1 * opts.cb;

    let rx3 = rx2 * opts.cc + ry2 * (-opts.sc);
    let ry3 = rx2 * opts.sc + ry2 * opts.cc;
    let rz3 = rz2;

    opts.mcList[i].cx = rx3;
    opts.mcList[i].cy = ry3;
    opts.mcList[i].cz = rz3;

    let per = opts.d / (opts.d + rz3);

    opts.mcList[i].x = (opts.howElliptical * rx3 * per) - (opts.howElliptical * 2);
    opts.mcList[i].y = ry3 * per;
    opts.mcList[i].scale = per;
    let alpha = per;
    alpha = (alpha - 0.6) * (10 / 6);
    opts.mcList[i].alpha = alpha * alpha * alpha - 0.2;
    opts.mcList[i].zIndex = Math.ceil(100 - Math.floor(opts.mcList[i].cz));
  }
  doPosition();
}
export const tagsCloud = function (oTarget) {
  opts.mcList = []
  opts.oDiv= oTarget;
  opts.aA= opts.oDiv.getElementsByTagName('li');
  for(let i = 0; i < opts.aA.length; i++) {
    opts.mcList.push({
      offsetWidth: opts.aA[i].offsetWidth,
      offsetHeight: opts.aA[i].offsetHeight,
      on: false,
    });
    opts.aA[i].onmouseover = function () {
      opts.mcList[i].on = true;
      this.style.zIndex = 9999;
      this.style.filter = "alpha(opacity=100)";
      this.style.opacity = 1;
    }
    opts.aA[i].onmouseout = function () {
      opts.mcList[i].on = false;
      this.style.zIndex = opts.mcList[i].zIndex;
      this.style.filter = "alpha(opacity=" + 100 * opts.mcList[i].alpha + ")";
      this.style.opacity = opts.mcList[i].alpha;
    }
  }
  sineCosine(0,0,0);
  positionAll();
}
