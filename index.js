const Benchmark = require('benchmark');
const stampit = require('stampit');

const suite = new Benchmark.Suite;

const COUNT = 5000;
const DELTA = 16;


const Entity = stampit({
  init() {
    this.components = {};
  },
  methods: { a() {} }
});

const Position = stampit({
  init() {
    this.x = 10;
    this.y = 10;
  },
  methods: { a() {} }
});


const Velocity = stampit({
  init() {
    this.vx = 10;
    this.vy = 10;
  },
  methods: { a() {} }
});

const stampitEntities = ((count) => {
  const arr = [];

  for (let i = 0; i < count; i++) {
    const e = Entity();

    e.components.position = Position();
    e.components.velocity = Velocity();

    arr.push(e);
  }

  return arr;
})(COUNT);

const normalEntities = ((count) => {
  const arr = [];

  for (let i = 0; i < count; i++) {
    arr.push({
      components: {
        position: {
          x: 10,
          y: 10,
        },
        velocity: {
          vy: 10,
          vx: 10,
        },
      },
    });
  }

  return arr;
})(COUNT);

console.log('Running benchmark...');

suite.add('Stampit', () => {
  for (let i = 0; i < COUNT; i++) {
    const entity = stampitEntities[i].components;

    entity.position.x += DELTA / 1000 * entity.velocity.vx;
    entity.position.y += DELTA / 1000 * entity.velocity.vy;
  }
})
.add('Plain object', () => {
  for (let i = 0; i < COUNT; i++) {
    const entity = normalEntities[i].components;

    entity.position.x += DELTA / 1000 * entity.velocity.vx;
    entity.position.y += DELTA / 1000 * entity.velocity.vy;
  }
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });
