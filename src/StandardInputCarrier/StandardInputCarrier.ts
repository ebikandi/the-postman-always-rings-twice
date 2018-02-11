import PostWoman from '../PostWoman/PostWoman';

const readline = require('readline');

const generateRandomParcel = (id: number) => {
  const code = `SHIP${id}`;
  const employee = `employee${id}`;
  const premium = Math.random() <= 0.35;
  const premiumToString = premium ? 'Premium' : 'Regular';
  console.log(`${code},${employee}, ${premiumToString}`);
  PostWoman.getParcelFromCarrier(code, employee, premium);
};

let stopper: any;

const simulation = (id = 0) => {
  stopper = setTimeout(() => {
    id++;
    generateRandomParcel(id);
    simulation(id);
  }, 1000);
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
    } else if (line === 'exit') {
      console.log('** exiting **');
      process.exit();
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
