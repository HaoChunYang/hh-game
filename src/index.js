import Konva from 'konva'

Konva.hitOnDragEnabled = true;

var width = window.innerWidth;
var height = window.innerHeight;

var lastDist = 0;
var startScale = 1;
var activeShape = null;

function getDistance (p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height,
  draggable: true,
  x: width / 2,
  y: height / 2,
  offset: {
    x: width / 2,
    y: height / 2,
  },
});

var layer = new Konva.Layer();

var bigTriangle1 = new Konva.Line({
  points: [100, 100, 300, 100, 200, 200],
  fill: 'red',
  stroke: 'black',
  strokeWidth: 1,
  closed: true,
  draggable: true,
  name: 'bigTriangle1',
});

var bigTriangle2 = new Konva.Line({
  points: [100, 100, 100, 300, 200, 200],
  fill: 'yellow',
  stroke: 'black',
  strokeWidth: 1,
  closed: true,
  draggable: true,
  name: 'bigTriangle2',
});

bigTriangle2.on('click', function () {
  var matrix = this.getAbsoluteTransform().getMatrix();
  var attrs = decompose(matrix);

  console.log(matrix, attrs)
  // this.setAbsolutePosition(this.getTranslation())
  this.rotate(45)
  this.getTransform().translate(200, 0)
});


function decompose (mat) {
  var a = mat[0];
  var b = mat[1];
  var c = mat[2];
  var d = mat[3];
  var e = mat[4];
  var f = mat[5];

  var delta = a * d - b * c;

  let result = {
    x: e,
    y: f,
    rotation: 0,
    scaleX: 0,
    scaleY: 0,
    skewX: 0,
    skewY: 0,
  };

  // Apply the QR-like decomposition.
  if (a != 0 || b != 0) {
    var r = Math.sqrt(a * a + b * b);
    result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
    result.scaleX = r;
    result.scaleY = delta / r;
    result.skewX = Math.atan((a * c + b * d) / (r * r));
    result.scleY = 0;
  } else if (c != 0 || d != 0) {
    var s = Math.sqrt(c * c + d * d);
    result.rotation =
      Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
    result.scaleX = delta / s
    result.scaleY = s;
    result.skewX = 0
    result.skewY = Math.atan((a * c + b * d) / (s * s));
  } else {
    // a = b = c = d = 0
  }

  result.rotation *= 180 / Math.PI;
  return result;
}

var square = new Konva.Line({
  points: [200, 200, 250, 250, 200, 300, 150, 250],
  fill: 'green',
  stroke: 'black',
  strokeWidth: 1,
  closed: true,
  draggable: true,
  name: 'square',
});

var smallTriangle1 = new Konva.Line({
  points: [100, 300, 150, 250, 200, 300],
  fill: 'pink',
  stroke: 'black',
  strokeWidth: 1,
  closed: true,
  draggable: true,
  name: 'square',
})

var smallTriangle2 = new Konva.Line({
  points: [200, 200, 250, 150, 250, 250],
  fill: 'lightblue',
  stroke: 'black',
  strokeWidth: 1,
  closed: true,
  draggable: true,
  name: 'square',
})

var middleTriangle = new Konva.Line({
  points: [200, 300, 300, 300, 300, 200],
  fill: 'purple',
  stroke: 'black',
  strokeWidth: 1,
  closed: true,
  draggable: true,
  name: 'square',
})

var parallelogram = new Konva.Line({
  points: [300, 100, 250, 150, 250, 250, 300, 200],
  fill: 'orange',
  stroke: 'black',
  strokeWidth: 1,
  closed: true,
  draggable: true,
  name: 'square',
})
parallelogram.on('click', function () {
  console.log(this.points())
  var fill = this.fill() == 'yellow' ? '#00D2FF' : 'yellow';
  this.fill(fill);
});

var triangle = new Konva.RegularPolygon({
  x: 190,
  y: stage.height() / 2,
  sides: 3,
  radius: 100,
  fill: 'green',
  stroke: 'black',
  strokeWidth: 1,
  draggable: true,
  name: 'triangle',
});

var circle = new Konva.Circle({
  x: 380,
  y: stage.height() / 2,
  radius: 70,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 1,
  draggable: true,
  name: 'circle',
});

stage.on('tap', function (evt) {
  // set active shape
  var shape = evt.target;
  activeShape =
    activeShape && activeShape.getName() === shape.getName()
      ? null
      : shape;

  // sync scene graph
  triangle.setAttrs({
    fill:
      activeShape && activeShape.getName() === triangle.getName()
        ? '#78E7FF'
        : 'green',
    stroke:
      activeShape && activeShape.getName() === triangle.getName()
        ? 'blue'
        : 'black',
  });

  circle.setAttrs({
    fill:
      activeShape && activeShape.getName() === circle.getName()
        ? '#78E7FF'
        : 'red',
    stroke:
      activeShape && activeShape.getName() === circle.getName()
        ? 'blue'
        : 'black',
  });
});

stage.getContent().addEventListener(
  'touchmove',
  function (evt) {
    var touch1 = evt.touches[0];
    var touch2 = evt.touches[1];

    if (touch1 && touch2 && activeShape) {
      var dist = getDistance(
        {
          x: touch1.clientX,
          y: touch1.clientY,
        },
        {
          x: touch2.clientX,
          y: touch2.clientY,
        }
      );

      if (!lastDist) {
        lastDist = dist;
      }

      var scale = (activeShape.scaleX() * dist) / lastDist;

      activeShape.scaleX(scale);
      activeShape.scaleY(scale);
      lastDist = dist;
    }
  },
  false
);

stage.getContent().addEventListener(
  'touchend',
  function () {
    lastDist = 0;
  },
  false
);

layer.add(triangle);
layer.add(circle);
layer.add(bigTriangle1)
layer.add(bigTriangle2)
layer.add(square);
layer.add(smallTriangle1)
layer.add(smallTriangle2)
layer.add(middleTriangle)
layer.add(parallelogram)
stage.add(layer);
