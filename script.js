function buildElement(element, attribute) {
  let elm = document.createElement(element);
  for (key in attribute) {
    elm.setAttribute(key, attribute[key]);
  }
  return elm;
}
function pushElement(parent, child) {
  parent.insertBefore(child, parent.firstChild);
}
function isColor(color) {
  let elm = document.createElement('div');
  elm.style.backgroundColor = color;
  return elm.style.backgroundColor !== '';
}
function noScroll(e) {
  if (e.touches.length === 1) e.preventDefault();
}

let s = Math.min(window.innerHeight, window.innerWidth);
if (s === window.innerHeight) {
  document.getElementById('a').style.display = 'flex';
  console.log((document.getElementById('a').style.display = 'flex'));
  s = (s * 2) / 3;
} else {
  console.log('else');
  s = (s * 4) / 5;
}
let canvas = document.getElementById('canvas');
let colorCanvas = document.getElementById('colors');
let colorsctx = colorCanvas.getContext('2d');
canvas.width = s;
canvas.height = s;
colorCanvas.width = s;
document.getElementById('ct').width = s / 3;
class dotCanvas {
  /**
   * @param {HTMLCanvasElement} canvas ドット絵を表示・作成するcanvasを指定
   * @param {number} size ドット絵の解像度を指定します
   */
  constructor(canvas, size) {
    this.backgroundColor = 'white';
    this.canvas = canvas;
    this.size = size;
    this.display = Array(size)
      .fill(0)
      .map(() => Array(size).fill(0));
    this.pixcel = this.canvas.width / this.size;
    this.colors = [
      'erase',
      'white',
      'grey',
      'black',
      'red',
      'orange',
      'yellow',
      'lime',
      'green',
      'darkgreen',
      'blue',
      'midnightblue',
      'purple',
    ];
    this.color = 5;
    this.click = false;
    this.grid = 0;
    this.ctx = this.canvas.getContext('2d');
    this.canvasMousemoveEvent = (e) => {
      this.mouseX = Math.floor(e.offsetX / this.pixcel);
      this.mouseY = Math.floor(e.offsetY / this.pixcel);
      if (this.click) {
        this.display[this.mouseX][this.mouseY] = this.color;
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.height, this.canvas.width);
        this.drowAllPixcel();
      }
    };
    this.canvasTouchmoveEvent = (e) => {
      let tgt = e.touches[0].target.getBoundingClientRect();
      this.mouseX = Math.floor((e.touches[0].pageX - tgt.top) / this.pixcel);
      this.mouseY = Math.floor((e.touches[0].pageY - tgt.left) / this.pixcel);
      if (
        this.mouseX < 0 ||
        this.mouseY < 0 ||
        this.size - 1 < this.mouseX ||
        this.size - 1 < this.mouseY
      )
        return;
      this.display[this.mouseX][this.mouseY] = this.color;
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, this.canvas.height, this.canvas.width);
      this.drowAllPixcel();
    };

    this.canvasClickEvent = () => {
      this.display[this.mouseX][this.mouseY] = this.color;
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, this.canvas.height, this.canvas.width);
      this.drowAllPixcel();
    };
    this.canvasMousedownEvent = () => {
      this.click = true;
    };
    this.canvasMouseupEvent = () => {
      this.click = false;
    };
    this.canvas.addEventListener('mousemove', this.canvasMousemoveEvent);
    this.canvas.addEventListener('touchmove', this.canvasTouchmoveEvent);
    this.canvas.addEventListener('click', this.canvasClickEvent);
    this.canvas.addEventListener('mousedown', this.canvasMousedownEvent);
    this.canvas.addEventListener('mouseup', this.canvasMouseupEvent);
  }
  set setBackGroundColor(num) {
    this.backgroundColor = `rgb(${num},${num},${num})`;
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.height, this.canvas.width);
    this.drowAllPixcel();
  }
  gridPlus() {
    this.grid++;
    if (this.grid === 3) {
      this.grid = 0;
    }
    switch (this.grid) {
      case 0:
        this.drowGrid();
        break;
      case 1:
        this.disableGild();
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(0, 0, this.canvas.height, this.canvas.width);
        break;
      case 2:
        this.disableGild();
    }
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.height, this.canvas.width);
    this.drowAllPixcel();
  }
  toReadOnly() {
    this.canvas.removeEventListener('mousemove', this.canvasMousemoveEvent);
    this.canvas.removeEventListener('touchmove', this.canvasTouchmoveEvent);
    this.canvas.removeEventListener('click', this.canvasClickEvent);
    this.canvas.removeEventListener('mousedown', this.canvasMousedownEvent);
    this.canvas.removeEventListener('mouseup', this.canvasMouseupEvent);
    this.grid = 2;
    this.disableGild();
    return this;
  }
  drowGrid() {
    let cs = this.canvas.width;
    let pixcel = cs / this.size;
    this.ctx.strokeStyle = 'black';
    for (let i = 0; i <= this.size; i++) {
      let y = pixcel * i;
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(cs, y);
    }
    for (let i = 0; i <= this.size; i++) {
      let x = pixcel * i;
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, cs);
    }
    this.ctx.stroke();
    return this;
  }
  disableGild() {
    this.drowAllPixcel();
    return this;
  }
  drowAllPixcel(offsetX = 0, offsetY = 0) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.fillDot(i, j, this.display[i][j], offsetX, offsetY);
      }
    }
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.strokeStyle = 'black';
    if (this.grid === 0) {
      this.drowGrid();
    } else if (this.grid === 1) {
      this.ctx.strokeRect(0, 0, this.canvas.height, this.canvas.width);
    }
  }
  fillDot(x, y, color, offsetX, offsetY) {
    if (this.colors[color] === 'erase') return;
    this.ctx.fillStyle = this.colors[color];
    this.ctx.strokeStyle = this.colors[color];
    this.ctx.fillRect(
      x * this.pixcel + offsetX,
      y * this.pixcel + offsetY,
      this.pixcel,
      this.pixcel
    );
    this.ctx.strokeRect(
      x * this.pixcel + offsetX,
      y * this.pixcel + offsetY,
      this.pixcel,
      this.pixcel
    );
  }
  export() {
    return JSON.stringify({
      size: this.size,
      colors: this.colors,
      display: this.display,
    });
  }
  /**
   * @param {string} data dotCanvasクラスでexportされたJSON文字列
   * @param {number} offsetX x軸方向の描画の起点の座標
   * @param {number} offsetY y軸方向の描画の起点の座標
   * @param {number} pixcelSize 一つのピクセルの大きさ
   */
  import(data, offsetX = 0, offsetY = 0, pixcelSize) {
    let d = JSON.parse(data);
    if (
      d.display
        .map((a) => a.length)
        .map((n) => n === d.size)
        .includes(false) ||
      d.display.length !== d.size
    ) {
      console.log('missmatch');
      return this;
    }
    this.colors = d.colors;
    this.display = d.display;
    this.size = d.size;
    this.pixcel =
      pixcelSize === undefined ? this.canvas.width / this.size : pixcelSize;
    this.drowAllPixcel(offsetX, offsetY);
    return this;
  }
  getAllImgData() {
    let s = this.size;
    let oldData = this.export();
    let elm = buildElement('canvas', {
      height: s,
      width: s,
    });
    let d = new dotCanvas(elm).import(oldData, 1).toReadOnly();
    return elm.getContext('2d').getImageData(0, 0, s, s);
  }
}
document.getElementById('setSize').addEventListener('click', () => {
  let num = Number(document.getElementById('size').value);
  if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
    alert('解像度は0以上の整数で入力してください');
    return;
  }
  canvas.addEventListener('touchmove', noScroll, { passive: false });
  var c = new dotCanvas(canvas, document.getElementById('size').value - 0);
  c.drowGrid();
  document.getElementById('setSize').remove();
  document.getElementById('size').remove();
  colorsctx.strokeRect(0, 10, 2000, 20);
  for (let i = 0; i < c.colors.length; i++) {
    colorsctx.fillStyle = c.colors[i];
    if (c.colors[i] === 'erase') {
      colorsctx.beginPath();
      colorsctx.moveTo(i * 20 + 20, 10);
      colorsctx.lineTo(i * 20, 30);
      colorsctx.strokeStyle = 'red';
      colorsctx.stroke();
      colorsctx.closePath();
      colorsctx.strokeRect(i * 20, 10, 20, 20);
    } else {
      colorsctx.fillRect(i * 20, 10, 20, 20);
    }
  }
  new dotCanvas(colorCanvas)
    .toReadOnly()
    .import(
      '{"size":17,"colors":["erase","white","grey","black","red","orange","yellow","lime","green","darkgreen","blue","midnightblue","purple"],"display":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}',
      c.color * 20 + 5,
      0,
      0.7
    );
  window.addEventListener('keydown', (e) => {
    if (e.key === 'g') c.gridPlus();
  });
  document.getElementById('grid').addEventListener('click', () => {
    c.gridPlus();
  });
  document.getElementById('left').addEventListener('click', () => {
    c.color--;
    c.color += c.colors.length;
    c.color = c.color % c.colors.length;
    colorsctx.fillStyle = 'white';
    colorsctx.fillRect(0, 0, 2000, 10);
    new dotCanvas(colorCanvas)
      .toReadOnly()
      .import(
        '{"size":17,"colors":["erase","white","grey","black","red","orange","yellow","lime","green","darkgreen","blue","midnightblue","purple"],"display":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}',
        c.color * 20 + 5,
        0,
        0.7
      );
  });
  document.getElementById('right').addEventListener('click', () => {
    c.color++;
    c.color += c.colors.length;
    c.color = c.color % c.colors.length;
    colorsctx.fillStyle = 'white';
    colorsctx.fillRect(0, 0, 2000, 10);
    new dotCanvas(colorCanvas)
      .toReadOnly()
      .import(
        '{"size":17,"colors":["erase","white","grey","black","red","orange","yellow","lime","green","darkgreen","blue","midnightblue","purple"],"display":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}',
        c.color * 20 + 5,
        0,
        0.7
      );
  });
  document.getElementById('bgc').addEventListener('mousemove', () => {
    c.setBackGroundColor = 255 - document.getElementById('bgc').value;
  });
  document.getElementById('bgc').addEventListener('touchmove', () => {
    c.setBackGroundColor = 255 - document.getElementById('bgc').value;
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'd') c.color++;
    if (e.key === 'a') c.color--;
    c.color += c.colors.length;
    c.color = c.color % c.colors.length;
    colorsctx.fillStyle = 'white';
    colorsctx.fillRect(0, 0, 2000, 10);
    new dotCanvas(colorCanvas)
      .toReadOnly()
      .import(
        '{"size":17,"colors":["erase","white","grey","black","red","orange","yellow","lime","green","darkgreen","blue","midnightblue","purple"],"display":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0],[0,0,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}',
        c.color * 20 + 5,
        0,
        0.7
      );
  });
  document.getElementById('export').addEventListener('click', () => {
    let data = c.export();
    document.getElementById('ex').value = data;
  });
  document.getElementById('import').addEventListener('click', () => {
    c.import(document.getElementById('in').value, 0, 0);
  });
  document.getElementById('colorSubmit').addEventListener('click', () => {
    let color = document.getElementById('color').value;
    if (!isColor(color)) return;
    document.getElementById('color').value = '';
    c.colors.push(color);
    colorsctx.strokeStyle = 'black';
    colorsctx.strokeRect(0, 10, 2000, 20);
    for (let i = 0; i < c.colors.length; i++) {
      colorsctx.fillStyle = c.colors[i];
      if (c.colors[i] === 'erase') {
        colorsctx.beginPath();
        colorsctx.moveTo(i * 20 + 20, 10);
        colorsctx.lineTo(i * 20, 30);
        colorsctx.strokeStyle = 'red';
        colorsctx.stroke();
        colorsctx.closePath();
        colorsctx.strokeRect(i * 20, 10, 20, 20);
      } else {
        colorsctx.fillRect(i * 20, 10, 20, 20);
      }
    }
    colorsctx.fillStyle = 'black';
    colorsctx.beginPath();
    colorsctx.fillRect(c.color * 20 + 7, 0, 7, 7);
    colorsctx.moveTo(c.color * 20 + 3.5, 7);
    colorsctx.lineTo(c.color * 20 + 11.5, 10);
    colorsctx.lineTo(c.color * 20 + 17, 7);
    colorsctx.lineTo(c.color * 20, 7);
    colorsctx.fill();
  });
});

let d = new dotCanvas(document.getElementById('test'))
  .toReadOnly()
  .import(
    '{"size":32,"colors":["erase","white","grey","black","red","orange","yellow","lime","green","darkgreen","blue","midnightblue","purple"],"display":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,3,3,3,3,3,0,0,0,0,0,0,0,0,0,3,3,3,0,0,3,3,3,3,3,0,3,3,3,3,3],[0,0,3,0,3,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,3,0,0,0,3,0,3,0,0,0,3],[0,0,3,3,3,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,3,0,0,0,3,0,3,0,0,0,3],[0,0,0,0,0,0,0,0,0,0,3,3,3,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,3,3,3,3,3,0,0,3,3,0,0,0,3,0,0,0,0,0,0,3,3,3,3,3,0,3,3,3,3,3],[0,0,3,0,3,3,0,0,0,3,3,3,3,0,3,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,3],[0,0,3,3,3,0,3,0,0,0,0,0,0,3,3,3,0,0,0,0,0,3,3,3,3,3,0,3,3,3,3,3],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,3,3,3,3,3],[0,0,3,0,3,0,3,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,0,0,0,0,3],[0,0,3,0,3,0,3,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,3,3,0,0,0,0,0,0,3],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0],[0,0,3,3,3,0,3,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3],[0,0,3,0,3,0,3,0,0,0,3,3,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,3,0,0,0,3],[0,0,3,0,3,3,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,3,3,3,3,3],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,3,3,3,0,0,0,0,0,0],[0,0,3,3,3,0,3,0,0,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,3,3,0,3,3,3,3,3],[0,0,3,0,3,0,3,0,0,3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,3,0,3,3,0],[0,0,3,0,3,3,3,0,0,3,0,0,0,0,0,0,0,0,3,0,0,3,3,3,3,3,0,3,3,3,0,3],[0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,3,0,0,3,0,3,0,3,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3,3,0,0,3,0,3,0,3,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}',
    0,
    0,
    3
  )
  .import(
    '{"size":32,"colors":["erase","white","grey","black","red","orange","yellow","lime","green","darkgreen","blue","midnightblue","purple"],"display":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,3,3,3,3,3],[0,0,3,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,3,0,0,0,3],[0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,3,0,3,3,3],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3],[0,0,3,3,3,3,3,0,0,0,0,3,3,3,3,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0],[0,0,3,0,3,3,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,0,0,3,0,0,0,3,3,3,3,3],[0,0,3,3,3,0,3,0,3,0,0,0,0,0,0,0,0,3,3,0,0,3,3,3,3,3,0,3,0,3,3,0],[0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,3,3,3,0,3],[0,0,3,3,3,3,3,0,3,0,0,0,0,0,0,0,0,0,3,0,0,3,3,3,3,3,0,0,0,0,0,0],[0,0,3,0,3,0,3,0,3,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,0,3,0,0,0,3],[0,0,3,0,3,0,3,0,0,3,0,0,0,0,0,0,0,0,0,3,0,0,0,3,3,0,0,3,3,3,3,3],[0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,3,0,3,3,3,3,3,0,3,0,0,0,3],[0,0,3,3,3,0,3,0,0,3,3,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,3,0,3,0,3,0,0,0,3,3,0,0,0,3,3,3,0,0,0,3,3,3,3,3,0,3,3,3,3,3],[0,0,3,0,3,3,3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,3,0,3,0,0,0,3],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,3,0,3,3,3,0,0,3,3,3,0],[0,0,3,3,3,0,3,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,3,3,0,0,0,0,0,0],[0,0,3,0,3,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,3,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,3,0,3,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,3,0,3,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}',
    0,
    120,
    3
  );

let tc = document.getElementById('testest');
let testest = new dotCanvas(tc).toReadOnly();
tc.addEventListener('mousemove', (e) => {
  tc.getContext('2d').fillStyle = 'aqua';
  tc.getContext('2d').fillRect(0, 0, 300, 300);
  tc.getContext('2d').strokeRect(0, 0, 300, 300);
  testest.import(
    '{"size":32,"colors":["erase","white","grey","black","red","orange","yellow","lime","green","darkgreen","blue","midnightblue","purple","#4169e1","skyblue"],"display":[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,13,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,3,13,3,13,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,3,13,3,13,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,3,3,13,3,13,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,3,3,3,13,13,3,13,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,3,3,13,13,13,3,13,13,3,13,13,3,3,3,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,3,13,13,13,13,13,13,13,13,3,11,13,13,13,13,3,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,3,13,13,13,13,13,13,13,13,1,3,11,13,13,13,3,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,3,13,13,13,3,13,13,13,13,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,3,13,13,13,13,13,13,13,13,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,3,13,13,13,13,13,0,13,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,3,13,13,13,13,13,13,13,13,3,13,3,3,3,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,3,13,13,13,13,13,13,13,13,3,13,13,13,3,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,3,13,13,13,13,13,13,13,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,3,3,13,13,13,13,13,3,3,13,1,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,3,3,3,3,13,13,13,13,13,13,13,13,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,3,13,13,13,3,13,13,13,13,13,13,13,13,1,1,3,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,3,3,13,13,13,13,3,13,13,13,13,13,13,13,13,1,3,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,3,14,13,13,13,13,3,3,13,13,13,13,13,13,13,13,1,3,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,3,14,13,13,13,13,13,3,3,13,13,13,13,13,13,13,1,1,3,3,3,0,0,0,0,0,0,0,3],[0,0,3,14,13,13,13,13,3,3,0,3,3,13,13,13,13,13,13,13,13,1,13,3,3,3,0,3,3,3,3,3],[0,0,3,13,13,13,13,3,0,0,0,0,3,3,13,13,13,13,13,13,13,13,13,13,13,3,3,3,13,13,3,0],[0,0,3,13,13,13,3,3,0,0,0,0,0,3,3,3,13,13,13,13,13,13,13,13,13,13,13,13,13,3,0,0],[0,0,3,13,3,3,0,0,0,0,0,0,0,0,0,3,3,13,13,13,13,13,13,13,13,13,13,13,3,0,0,0],[0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,13,13,13,13,13,13,13,13,13,3,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,13,13,13,13,13,13,13,13,3,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,13,13,13,13,13,3,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,13,13,13,3,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]}',
    e.offsetX - 50,
    e.offsetY - 50,
    3
  );
});
