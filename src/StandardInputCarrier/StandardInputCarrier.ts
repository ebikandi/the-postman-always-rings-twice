import PostWoman from '../PostWoman/PostWoman';

const readline = require('readline');

const generateRandomParcel = (verboseMode: boolean, id: number) => {
  const code = `SHIP${id}`;
  const employee = `employee${id}`;
  const premium = Math.random() <= 0.35;
  const premiumToString = premium ? 'Premium' : 'Regular';
  if (verboseMode === true) {
    console.log(`${code},${employee}, ${premiumToString}`);
  }
  PostWoman.getParcelFromCarrier(code, employee, premium);
};

let stopper: any = null;

const getSimMsg = (isVerBose: boolean) =>
  isVerBose ? '** starting sim -verbose **' : '** starting sim **';

const simulation = (isVerbose = false, id = 0) => {
  if (stopper === null) {
    const msg = getSimMsg(isVerbose);
    console.log(msg);
    stopper = setTimeout(() => {
      id++;
      generateRandomParcel(isVerbose, id);
      simulation(isVerbose, id);
    }, 1000);
  } else {
    console.log('** A simulation is already running **');
  }
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
      simulation(false);
    } else if (line === 'sim --v') {
      simulation(true);
    } else if (line === 'stop') {
      console.log('** stoping sim **');
      clearTimeout(stopper);
      stopper = null;
    } else if (line === 'exit') {
      console.log('** exiting **');
      process.exit();
    } else {
      // TODO check the line with regex
      const [code, employee, premium] = line.split(',');
      PostWoman.getParcelFromCarrier(
        code,
        employee,
        !!Number.parseInt(premium)
      );
    }
  });
};
