const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

class Bank {
  constructor(loanAmount, interestRate) {
    this.loanAmount = loanAmount;
    this.interestRate = interestRate;
  }

  getMonthlyInstallment(loanTerm) {
    return (
      (this.loanAmount * this.interestRate * loanTerm + this.loanAmount) /
      loanTerm
    );
  }
}

class Metrobank extends Bank {
  constructor(loanAmount) {
    super(loanAmount, 0.015);
  }
}

class BPI extends Bank {
  constructor(loanAmount) {
    super(loanAmount, 0.012);
  }
}

class BDO extends Bank {
  constructor(loanAmount) {
    super(loanAmount, 0.017);
  }
}

class LoanCalculator {
  constructor(bankName, loanAmount, loanTerm) {
    this.bankName = bankName;
    this.loanAmount = loanAmount;
    this.loanTerm = loanTerm;
  }

  getBank() {
    switch (this.bankName) {
      case 'metrobank':
        return new Metrobank(this.loanAmount);
      case 'bpi':
        return new BPI(this.loanAmount);
      case 'bdo':
        return new BDO(this.loanAmount);
    }
  }

  getMonthlyInstallment() {
    const bank = this.getBank();
    console.log(bank);
    return bank.getMonthlyInstallment(this.loanTerm);
  }
}

const { bankName, loanAmount, loanTerm } = argv;
const loanCalc = new LoanCalculator(bankName, loanAmount, loanTerm);

console.log(`Monthly Installment: ${loanCalc.getMonthlyInstallment()}`);
