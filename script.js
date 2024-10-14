document.getElementById('calculator-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get input values
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value);
    const years = parseFloat(document.getElementById('years').value);

    // Growth rates
    const lowGrowthRate = 0.06;    // 6% per year
    const realisticGrowthRate = 0.08; // 8% per year
    const highGrowthRate = 0.10;   // 10% per year

    // Calculate growth and display results for all scenarios
    const lowGrowth = calculateCompoundGrowth(initialInvestment, monthlyInvestment, years, lowGrowthRate);
    const realisticGrowth = calculateCompoundGrowth(initialInvestment, monthlyInvestment, years, realisticGrowthRate);
    const highGrowth = calculateCompoundGrowth(initialInvestment, monthlyInvestment, years, highGrowthRate);

    displayResults('low', lowGrowth, initialInvestment, monthlyInvestment, years);
    displayResults('realistic', realisticGrowth, initialInvestment, monthlyInvestment, years);
    displayResults('high', highGrowth, initialInvestment, monthlyInvestment, years);

    // Update the chart
    updateChart([lowGrowth.yearlyGrowth, realisticGrowth.yearlyGrowth, highGrowth.yearlyGrowth], years);
});

// Compound growth calculator function
function calculateCompoundGrowth(initial, monthly, years, rate) {
    const months = years * 12;
    let futureValue = initial;
    let totalInterest = 0;
    let yearlyGrowth = [];
    let yearTotal = initial;

    for (let i = 0; i < months; i++) {
        futureValue += monthly; // Add monthly contribution
        const interest = futureValue * (rate / 12); // Monthly interest
        totalInterest += interest;
        futureValue += interest; // Compound monthly

        // Record the total value at the end of each year
        if ((i + 1) % 12 === 0) {
            yearTotal = futureValue;
            yearlyGrowth.push(yearTotal);
        }
    }

    return { futureValue, totalInterest, yearlyGrowth };
}

// Display function for each scenario
function displayResults(type, result, initialInvestment, monthlyInvestment, years) {
    const totalContributed = initialInvestment + (monthlyInvestment * years * 12);
    const totalInterest = result.totalInterest;
    const totalValue = result.futureValue;
    const avgMonthlyIncrease = totalInterest / (years * 12);
    const moneyGainedPerYear = totalInterest / years;

    document.getElementById(`${type}Total`).textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById(`${type}Interest`).textContent = `$${totalInterest.toFixed(2)}`;
    document.getElementById(`${type}AvgMonthly`).textContent = `$${avgMonthlyIncrease.toFixed(2)}`;
    document.getElementById(`${type}PerYear`).textContent = `$${moneyGainedPerYear.toFixed(2)}`;
}

// Chart.js initialization
let chart;

function updateChart(yearlyGrowthData, years) {
    const labels = Array.from({ length: years }, (_, i) => `Year ${i + 1}`);
    const lowGrowth = yearlyGrowthData[0];
    const realisticGrowth = yearlyGrowthData[1];
    const highGrowth = yearlyGrowthData[2];

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Low Growth (6%)',
                data: lowGrowth,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: false,
            },
            {
                label: 'Realistic Growth (8%)',
                data: realisticGrowth,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            },
            {
                label: 'High Growth (10%)',
                data: highGrowth,
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                fill: false,
            },
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // If the chart already exists, destroy it before creating a new one
    if (chart) {
        chart.destroy();
    }

    const ctx = document.getElementById('growthChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}
