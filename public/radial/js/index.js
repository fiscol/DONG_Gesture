var calories = new RadialProgressChart('.calories', {
  diameter: 200,
  max: 800,
  round: true,
  series: [{
    labelStart: '\uF105',
    value: 500,
    color: {
      linearGradient: {
        x1: '0%',
        y1: '100%',
        x2: '50%',
        y2: '0%',
        spreadMethod: 'pad'
      },
      stops: [{
        offset: '0%',
        'stop-color': '#fe08b5',
        'stop-opacity': 1
      }, {
        offset: '100%',
        'stop-color': '#ff1410',
        'stop-opacity': 1
      }]
    }
  }],
  center: {
    content: [function(value) {
      return value
    }, ' OF 800 CALS'],
    y: 25
  }
});

var gpa = new RadialProgressChart('.gpa', {
  diameter: 200,
  max: 4,
  round: false,
  series: [{
    value: 3.75,
    color: ['red', '#7CFC00']
  }],
  center: function(d) {
    return d.toFixed(2) + ' GPA'
  }
});

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

(function loop() {
  calories.update(Math.round(getRandom(50, 800)));
  gpa.update(getRandom(0.5, 3.8));
  setTimeout(loop, 3000);
})();