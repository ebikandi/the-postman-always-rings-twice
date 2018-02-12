/**
 * A carrier who gets data from the standard input. Also, it performs a simulation if told so.
 */
import PostWoman from '../PostWoman/PostWoman';

const readline = require('readline');

/**
 * It generates a regular or premium parcel and will give it to the PostWoman.
 *
 * @param verboseMode Flag to check if it has to print the generated parcel data
 * @param id The Id to compone the parcel-code
 */
const generateRandomParcel = (verboseMode: boolean, id: number) => {
  const code = `SHIP${id}`;
  const employee = `employee${id}`;
  const premium = Math.random() <= 0.35; // The rate of the premium parcels will be %35
  const premiumToString = premium ? 'Premium' : 'Regular';
  if (verboseMode === true) {
    console.log(`${code},${employee}, ${premiumToString}`);
  }
  PostWoman.getParcelFromCarrier(code, employee, premium);
};

let stopper: any = null;

const getSimMsg = (isVerBose: boolean) =>
  isVerBose ? '** starting sim -verbose **' : '** starting sim **';

/**
 * Starts a simulation setting a 1s timeout to trigger a parcel generation. It will call itself afer
 * that second to set another timeout to crate another parcel, and so on.
 * It saves the listener to remove it whennever we want and stop setting timeouts
 * (and consequently stop creating parcels).
 *
 * If is another simulation running, it does not create it and prompts a message.
 *
 * @param verboseMode Flag to check if it has to print the generated parcel data
 * @param id The Id to compone the parcel-code
 */
const simulation = (isVerbose = false, id = 0) => {
  if (stopper === null) {
    stopper = setTimeout(() => {
      id++;
      stopper = null;
      generateRandomParcel(isVerbose, id);
      simulation(isVerbose, id);
    }, 1000);
  } else {
    console.log('** A simulation is already running **');
  }
};

/**
 * Creates the object to read from the standard input.
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

/**
 * Function to initialize the carrier and listen to the stdin.
 */
export default () => {
  console.log('****************************');
  console.log('** STANDARD INPUT CARRIER **');
  console.log('****************************');

  rl.on('line', (line: string) => {
    let msg = '';
    if (line === 'sim') {
      msg = getSimMsg(false);
      console.log(msg);
      simulation(false);
    } else if (line === 'sim --v') {
      msg = getSimMsg(true);
      console.log(msg);
      simulation(true);
    } else if (line === 'stop') {
      console.log('** stoping sim **');
      clearTimeout(stopper);
      stopper = null;
    } else if (line === 'exit') {
      console.log('** exiting **');
      process.exit();
    } else {
      /**
       * @todo check the line with regex
       */
      const [code, employee, premium] = line.split(',');
      PostWoman.getParcelFromCarrier(
        code,
        employee,
        !!Number.parseInt(premium)
      );
    }
  });
};
