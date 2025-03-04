document.addEventListener("DOMContentLoaded", loadWorkouts);

function addWorkout() {
    let exercise = document.getElementById("exercise").value.trim();
    let sets = document.getElementById("sets").value;
    let reps = document.getElementById("reps").value;
    let weight = document.getElementById("weight").value;

    if (exercise === "" || sets === "" || reps === "" || weight === "") {
        alert("Please fill all fields.");
        return;
    }

    let workout = { exercise, sets, reps, weight };

    fetch("https://ubhlj9lky5.execute-api.us-east-1.amazonaws.com/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workout)
    })
    .then(response => response.json())
    .then(data => console.log("Workout added:", data))
    .catch(error => console.error("Error:", error));
}


function saveWorkout(workout) {
    let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
}

function loadWorkouts() {
    fetch("https://ubhlj9lky5.execute-api.us-east-1.amazonaws.com/workouts")
    .then(response => response.json())
    .then(data => {
        console.log("API Response:", data);  // ✅ Log the response
        if (!Array.isArray(data)) {  // ✅ Prevent crashing
            console.error("Error: API did not return an array", data);
            return;
        }
        document.getElementById("workout-list").innerHTML = "";
        data.forEach(displayWorkout);
    })
    .catch(error => console.error("Error:", error));
}


function displayWorkout(workout) {
    let table = document.getElementById("workout-list");
    let row = table.insertRow();

    row.innerHTML = `
        <td>${workout.exercise}</td>
        <td>${workout.sets}</td>
        <td>${workout.reps}</td>
        <td>${workout.weight}</td>
        <td><button class="delete-btn" onclick="deleteWorkout(this)">Delete</button></td>
    `;
}

function deleteWorkout(btn) {
    let row = btn.parentNode.parentNode;
    let workoutId = row.getAttribute("data-id");

    fetch("https://ubhlj9lky5.execute-api.us-east-1.amazonaws.com/workouts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workout_id: workoutId })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Workout deleted:", data);
        row.remove();
    })
    .catch(error => console.error("Error:", error));
}

function clearInputs() {
    document.getElementById("exercise").value = "";
    document.getElementById("sets").value = "";
    document.getElementById("reps").value = "";
    document.getElementById("weight").value = "";
}
