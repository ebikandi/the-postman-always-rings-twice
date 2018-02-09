export default class PostWoman {
  private inbox: any;
  private premiumRetryQueue: any[];
  private premiumNewQueue: any[];
  private regularRetryQueue: any[];
  private regularNewQueue: any[];
  private isBusy: boolean;
  private successRate: number;

  constructor() {
    this.initializeProps();
    setInterval(() => this.setSuccessRate(), 1000);
  }

  // public receivePackage() {}

  private initializeProps() {
    this.inbox = {};
    this.premiumRetryQueue = [];
    this.premiumNewQueue = [];
    this.regularRetryQueue = [];
    this.regularNewQueue = [];
    this.isBusy = false;
    this.setSuccessRate();
  }

  private setSuccessRate() {
    const failRate = Math.random() * (0.21 - 0.05) + 0.05;
    this.successRate = 1 - failRate;
    // console.log(`Rate: ${this.successRate}`);
  }
}
