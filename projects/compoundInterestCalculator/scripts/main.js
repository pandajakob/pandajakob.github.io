// all html elements defined as const
const resultsTableElem = document.getElementById("resultsTable"),
  timeHorizonInput = document.getElementById("timeHorizon"),
  initInvInput = document.getElementById("initInv"),
  monthlyContributionInput = document.getElementById("monthlyContribution"),
  yieldInput = document.getElementById("yield"),
  annualTaxCheckbox = document.getElementById("annualTax"),
  taxRateInput = document.getElementById("taxRate");

// collects data from from inputs and converts some of them
let invInputs = {};

const setInvInputs = () => {
  invInputs = {
    timeHorizon: parseInt(timeHorizonInput.value),
    initInv: parseInt(initInvInput.value),
    yield: parseFloat(yieldInput.value) / 100 + 1,
    yearlyContribution: parseFloat(monthlyContributionInput.value),
    taxRate: parseFloat(taxRateInput.value) / 100,
    isAnnualTaxChecked: annualTaxCheckbox.checked,
  };
};
let invResults; // Empty array for datapoints

/* */
const calcTax = (growth) => {
  return invInputs.taxRate === 1 ? 0 : growth * invInputs.taxRate;
};

/* */
const calcGrowth = (investment) => {
  return investment * invInputs.yield - investment;
};

// populates the dataPoints with calculated data for each year
const calcInvestment = () => {
  invResults = []; // Resets investment results.

  /* total value of inv. Starting from the initial 
   investment plus yearly contribution as no matter the time
   horizon and yield, this will always be calculated */
  let totalInvValue = invInputs.initInv + invInputs.yearlyContribution;
  let totalInterest = 0; // holds total amount of interest gained.
  let totalTax = 0; // holds total amount of tax paid.

  /* Loop through each year in timeHorizon. Calculates growth 
  and tax and adds as datapoint in dataPoints array */
  for (let i = 1; i <= invInputs.timeHorizon; i++) {
    let growth = calcGrowth(totalInvValue + totalInterest);

    // sets tax to zero if annual tax is not checked
    if (invInputs.isAnnualTaxChecked) {
      growth -= calcTax(growth);
      totalTax += calcTax(growth);
    }

    totalInterest += growth;
    totalInvValue += invInputs.yearlyContribution;

    const dataPoint = {
      dataYear: `${i}`,
      dataValue: totalInvValue,
      dataInterest: totalInterest,
      dataTax: totalTax,
    };
    invResults.push(dataPoint);
  }

  if (!invInputs.isAnnualTaxChecked) {
    const tax = calcTax(totalInterest);
    totalInterest -= tax;
    invResults[invResults.length - 1].dataTax = tax;
    invResults[invResults.length - 1].dataInterest = totalInterest;
  } else {
    totalTax = parseFloat(invResults[invResults.length - 1].dataTax);
  }
};

function runProgram() {
  setInvInputs();
  calcInvestment();
}

document.addEventListener("keypress", runProgram);

export { invResults };

/*


*/
