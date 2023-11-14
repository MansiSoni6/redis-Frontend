// Function to fetch data from backend
async function fetchData() {
    try {
        const response = await fetch('http://127.0.0.1:5000/tournaments');  //get tournament records using fetch
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem fetching the data:', error);
        return null; // Return null or handle the error as required
    }
}


// plot the bar chart to show how many times host country wins/loses in game
function createBarChart(data) {
    const HostCountries = {};

    data.forEach(tournament => {
        const country = tournament.host_country;
        const CWon = tournament.host_won === 1;

        if (HostCountries[country]) {
            if (CWon) {
                HostCountries[country].won++;
            } else {
                HostCountries[country].lost++;
            }
        } else {
            HostCountries[country] = {
                won: CWon ? 1 : 0,
                lost: CWon ? 0 : 1
            };
        }
    });

    const countries = Object.keys(HostCountries);
    data = countries.map(country => {
        return {
            country,
            won: HostCountries[country].won,
            lost: HostCountries[country].lost
        };
    });

    const ctx = document.getElementById('barChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.country),
            datasets: [
                {
                    label: 'Winner Country',
                    data: data.map(item => item.won),
                    barPercentage: 1,
                    barThickness: 30,
                    backgroundColor: 'rgba(255, 159, 64, 0.2)', 
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Losses Of Country',
                    data: data.map(item => item.lost),
                    barPercentage: 1,
                    barThickness: 30,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)', 
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            indexAxis: 'x',
            plugins: {
                title: {
                    display: true,
                    text: 'Host Country Wins/Losses in Tournaments'
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    });
}

 //when data is available call function to create Barchart
fetchData().then(data => createBarChart(data.tournaments));


//for Updating winner country
async function updateWinner() {
try{

        const winner = document.getElementById('winner').value;
        const tournament_id = document.getElementById('tournament_id').value;
    
    //console.log("data:",data);
    
    // Send the winner team and tournament id to the backend to update record
    const response = await fetch('http://127.0.0.1:5000/tournaments/update/winner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({winner, tournament_id})
    });
    if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    const result = await response.json();
    return result;
}
catch(error ) {
        console.error('There was a problem with the fetch operation:', error);
    };
}

//To perform DELETE tournament operation
async function deleteTournament() {
    try{
        
    //give tournament_id
            const tournament_id = document.getElementById('tournament_id').value;

    // Send the tournament ID to the backend for deletion
    const response = await fetch('http://127.0.0.1:5000/tournaments/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tournament_id)
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const result = await response.json();
    return result;
}
catch(error ) {
    console.error('There was a problem with the fetch operation:', error);
    };
}





