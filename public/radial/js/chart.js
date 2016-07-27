var calories = new RadialProgressChart('.calories', {
  diameter: 200,
  max: 200,
  round: true,
  series: [{
    labelStart: '\uF105',
    value: 0,
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
    }, 'Max Speed'],
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
    return d.toFixed(2) + 'N'
  }
});

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

(function loop() {
  calories.update(100);
  gpa.update(20);
  setTimeout(loop, 3000);
})();