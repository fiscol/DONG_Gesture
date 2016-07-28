var MaxSpeed = new RadialProgressChart('.MaxSpeed', {
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
var MaxPower = new RadialProgressChart('.MaxPower', {
  diameter: 200,
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
    }, 'MaxPower'],
    y: 25
  }
});
var Similarity = new RadialProgressChart('.Similarity', {
  diameter: 200,
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
    y: 25
  }
});

