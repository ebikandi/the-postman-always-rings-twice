import PostWoman from '../PostWoman/PostWoman';

const readline = require('readline');

const generateRandomParcel = (id: number) => {
  const code = `SHIP${id}`;
  const employee = `employee${id}`;
  const premium = Math.random() <= 0.2;
  if (premium) {
    console.log('PREMIUM', id);
  }
  PostWoman.getParcelFromCarrier(code, employee, premium);
};

let stopper: any;

const simulation = (id = 0) => {
  const rand = Math.round(Math.random() * (2000 - 1000)) + 1000;
  stopper = setTimeout(() => {
    id++;
    generateRandomParcel(id);
    simulation(id);
  }, rand);
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
export default () => {
  console.log('****************************');
  console.log('** STANDARD INPUT CARRIER **');
  console.log('****************************');

  rl.on('line', (line: string) => {
    if (line === 'sim') {
      console.log('** starting sim **');
      simulation();
    } else if (line === 'stop') {
      console.log('** stoping sim **');
      clearTimeout(stopper);
    } else {
      const [code, employee, premium] = line.split(',');
      PostWoman.getParcelFromCarrier(
        code,
        employee,
        !!Number.parseInt(premium)
      );
    }
  });
};
