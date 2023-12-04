const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

let N = 1;
if (localStorage.getItem("trainModel")) {
  N = 150;
}
const cars = generateCars(N);
let bestCar = cars[0];
// if (localStorage.getItem("bestBrain")) {
//   for (let i = 0; i < cars.length; i++) {
//     cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
//     if (i != 0) {
//       NeuralNetwork.mutate(cars[i].brain, 0.1);
//     }
//   }
//   console.log(cars[0]);
// } else if(localStorage.getItem("loadSampleBrain")) {
//   for (let i = 0; i < cars.length; i++) {
//     cars[i].brain = getSampleBrain();
//     if (i != 0) {
//       NeuralNetwork.mutate(cars[i].brain, 0.1);
//     }
//   }
//   console.log(cars[0]);
// }
// else{

// }
for (let i = 0; i < cars.length; i++) {
  if (localStorage.getItem("bestBrain")) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
  } else if (localStorage.getItem("loadSampleBrain")) {
    cars[i].brain = getSampleBrain();
  }
  if (i != 0) {
    NeuralNetwork.mutate(cars[i].brain, 0.2);
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -900, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -980, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1050, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -1550, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1550, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1850, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -2000, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -2130, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -2250, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -2400, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -2600, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -2800, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -2800, 30, 50, "DUMMY", 2, getRandomColor()),
];

animate();

function save() {
  localStorage.removeItem("loadSampleBrain");
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
  location.reload();
}

function discard() {
  localStorage.setItem("trainModel", "true");
  localStorage.removeItem("loadSampleBrain");
  localStorage.removeItem("bestBrain");
  location.reload();
}

function loadPreTrainedBrain() {
  localStorage.removeItem("trainModel");
  localStorage.removeItem("bestBrain");
  localStorage.setItem("loadSampleBrain", "true");
  location.reload();
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx);
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx);
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
