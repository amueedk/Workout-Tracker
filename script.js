const API_URL = "https://vmaojg7rqf.execute-api.us-east-1.amazonaws.com/workouts";

document.addEventListener("DOMContentLoaded", loadWorkouts);

function addWorkout() {
    let exercise = document.getElementById("exercise").value.trim();
    let sets = document.getElementById("sets").value;
    let reps = document.getElementById("reps").value;
    let weight = document.getElementById("weight").value;

    if (!exercise || !sets || !reps || !weight) {
        alert("Please fill all fields.");
        return;
    }

    let workout = { exercise, sets, reps, weight };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workout)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Workout added:", data);
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            alert("Workout added!");
            clearInputs();
            loadWorkouts();
        }
    })
    .catch(error => console.error("Error:", error));
}

function loadWorkouts() {
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        console.log("API Response:", data);
        if (!Array.isArray(data)) {
            console.error("Error: API did not return an array", data);
            return;
        }
        document.getElementById("workout-list").innerHTML = "";
        data.forEach(displayWorkout);
    })
    .catch(error => console.error("Error:", error));
}

function displayWorkout(workout) {
    if (!workout.workout_id) {
        console.error("Missing workout ID:", workout);
        return;
    }

    let table = document.getElementById("workout-list");
    let row = table.insertRow();
    row.setAttribute("data-id", workout.workout_id);

    row.innerHTML = `
        <td>${workout.exercise}</td>
        <td>${workout.sets}</td>
        <td>${workout.reps}</td>
        <td>${workout.weight}</td>
        <td><button class="delete-btn" onclick="deleteWorkout('${workout.workout_id}', this)">Delete</button></td>
    `;
}

function deleteWorkout(workoutId, btn) {
    if (!workoutId) {
        console.error("Workout ID is missing for deletion");
        return;
    }

    fetch(API_URL, {  
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workout_id: workoutId }) // Send body
    })
    .then(response => response.json())
    .then(data => {
        console.log("Workout deleted:", data);
        if (data.message === "Workout deleted") {
            btn.parentNode.parentNode.remove(); 
        } else {
            console.error("Error:", data);
        }
    })
    .catch(error => console.error("Error:", error));
}

function clearInputs() {
    document.getElementById("exercise").value = "";
    document.getElementById("sets").value = "";
    document.getElementById("reps").value = "";
    document.getElementById("weight").value = "";
}
