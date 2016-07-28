var MaxSpeed = new RadialProgressChart('.MaxSpeed', {
  diameter: 150,
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
    y: 10
  }
});
var MaxPower = new RadialProgressChart('.MaxPower', {
  diameter: 150,
  max: 400,
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
    }, 'Max Power'],
    y: 10
  }
});

var Similarity = new RadialProgressChart('.Similarity', {
  diameter: 150,
  max: 100,
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
    }, 'Similarity'],
    y: 10
  }
});

