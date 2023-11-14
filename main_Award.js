// Function to fetch data from backend
async function fetchAwardsForTournament(tournament_id) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/award_winners?tournament_id=${tournament_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers as needed
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        console.log('Full Data:', data);
        return data;
        //console.log('Full Data:', data);
    } catch (error) {
        console.error('There was a problem fetching the data:', error);
        return null; 
    }
}

//use tournament ids to show chart for awards won during tournament
function createPieChart(data) {
    const award_Category = data.award_winners.map(award => award.award_name);
    //console.log('List of all Awards:', award_Category);
    // Count number of each award_name
    const awardCounts = {};
    award_Category.forEach(award => {
        const categories = award; //count category of award
        awardCounts[categories] = (awardCounts[categories] || 0) + 1;
    });

    const labels = Object.keys(awardCounts);
    const values = Object.values(awardCounts);

    const ctx = document.getElementById('PieChart').getContext('2d');
    const PieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: ['rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',   
                'rgb(165, 42, 42)', 
                ], 
            }],
        },
    });
}

document.getElementById('SelectTournamentID').addEventListener('change', async function() {
    const selectedTournament = this.value;
    const data = await fetchAwardsForTournament(selectedTournament);

    if (data) {
        createPieChart(data);   //if data is available, create chart
    }
});

//Insert new record for award winner dataset
document.getElementById("insertAwardWinner").addEventListener("click", function() {
    // Get all the elemnts for form 
    var form = document.getElementById("submit_form");

    form.style.display = (form.style.display === "none") ? "block" : "none";


//const form = document.getElementById("submit_form");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Collect data of form
  const formData = new FormData(form);

  // Convert formData to a JSON object using key value pair
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  try {
    const response = await fetch('http://127.0.0.1:5000/award_winners/new', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataObject),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result); 
    } else {
      console.error("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
});
});





















    






   

