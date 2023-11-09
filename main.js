// Function to fetch data from the Flask backend
async function fetchData() {
    try {
        const response = await fetch('http://127.0.0.1:5000/tournaments');
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem fetching the data:', error);
    }
}

// Function to create the bar chart using Chart.js
async function createBarChart() {
    const data = await fetchData();

    if (data) {
        const tournamentIDs = data.map(tournament => tournament_id);
        const hostCountrys = data.map(tournament => host_country);
        const hostCountryWins = data.map(tournament => tournament.host_won);
        console.log("host Countrys:", hostCountrys); // Log tournament IDs
        console.log("Host Country Wins:", hostCountryWins);

        const barChartData = {
            labels: hostCountrys,
            datasets: [
                {
                    label: 'Host Country Wins',
                    data: hostCountryWins,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                }
            ]
        };

        const ctx = document.getElementById('barChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Call the function to create the bar chart when the page loads
window.onload = createBarChart;
