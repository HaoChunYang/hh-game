import style from './style/style.css'
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
const targetLayer = new Konva.Layer();

const bigTriangle1 = new Konva.Line({
  x: 200,
  y: 150,
  points: [-100, -50, 100, -50, 0, 50],
  fill: 'red',
  stroke: 'black',
  strokeWidth: 1,
  closed: true,
  draggable: true,
  name: 'bigTriangle1',
});

const bigTriangle2 = new Konva.Line({
  x: 150,
  y: 200,
  points: [-50, -100, 50, 0, -50, 100],
  fill: 'yellow',
  stroke: 'black',
  strokeWidth: 1,
  closed: true,
  draggable: true,
  name: 'bigTriangle2',
});

const square = new Konva.Line({
  x: 200,
  y: 250,
  points: [0, -50, 50, 0, 0, 50, -50, 0],
  fill: 'green',
  stroke: 'black',
  strokeWidth: 1,
  closed: true,
  draggable: true,
  name: 'square',
});

const smallTriangle1 = new Konva.Line({
  x: 150,
  y: 275,
  points: [0, -25, 50, 25, -50, 25],
  fill: 'pink',
  stroke: 'black',
  strokeWidth: 1,
  closed: true,
  draggable: true,
  name: 'square',
})

const smallTriangle2 = new Konva.Line({
  x: 225,
  y: 200,
  points: [25, -50, 25, 50, -25, 0],
  fill: 'lightblue',
  stroke: 'black',
  strokeWidth: 1,
  closed: true,
  draggable: true,
  name: 'square',
})

const middleTriangle = new Konva.Line({
  x: 275,
  y: 275,
  points: [25, -75, 25, 25, -75, 25],
  fill: 'purple',
  stroke: 'black',
  strokeWidth: 1,
  closed: true,
  draggable: true,
  name: 'square',
})

const parallelogram = new Konva.Line({
  x: 275,
  y: 175,
  points: [25, -75, 25, 25, -25, 75, -25, -25],
  fill: 'orange',
  stroke: 'black',
  strokeWidth: 1,
  closed: true,
  draggable: true,
  name: 'square',
})

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
  x: 0,
  y: 0,
  radius: 141,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 1,
  draggable: true,
  name: 'circle',
});

stage.on('tap', function (evt) {
  // set active shape
  const shape = evt.target;
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
    console.log(touch1, touch2)

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

const shapes = [bigTriangle1, bigTriangle2, square, smallTriangle1, smallTriangle2, middleTriangle, parallelogram]
shapes.forEach(shape => {
  shape.on('click', function () {
    this.rotate(45)
  })
  shape.on('dragstart', function () {
    this.moveToTop();
  });
  shape.on('dragend', function () {
    console.log('dragend:', this.position())
  })
  shape.on('mouseover', function () {
    this.moveToTop()
    shape.setAttrs({
      stroke: 'black',
      strokeWidth: 3,
    })
    document.body.style.cursor = 'pointer';
  });
  shape.on('mouseout', function () {
    shape.setAttrs({
      strokeWidth: 1
    })
    document.body.style.cursor = 'default';
  });
  layer.add(shape)
})

/**
 * target layer
 */

const targetShaps = {
  bigTriangle1: {
    x: 25,
    y: 75,
    rotation: 45 * 3,
    points: [-100, -50, 100, -50, 0, 50],
  },
  bigTriangle2: {
    x: 75,
    y: 25,
    rotation: 45 * 5,
    points: [-50, -100, 50, 0, -50, 100],
  },
  square: {
    x: 125,
    y: 75,
    rotation: 45, // 其实有 4 种
    points: [0, -50, 50, 0, 0, 50, -50, 0],
  },
  smallTriangle1: {
    x: 125,
    y: 25,
    rotation: 45 * 7,
    points: [0, -25, 50, 25, -50, 25],
  },
  smallTriangle2: {
    x: 175,
    y: 75,
    rotation: 45 * 7,
    points: [25, -50, 25, 50, -25, 0],
  },
  middleTriangle: {
    x: 175,
    y: 50,
    rotation: 45 * 3,
    points: [25, -75, 25, 25, -75, 25],
  },
  parallelogram: {
    x: 150,
    y: 50,
    rotation: 45, // || 45 * 5 两种
    points: [25, -75, 25, 25, -25, 75, -25, -25],
  }
}


stage.add(layer);
