document.addEventListener("DOMContentLoaded", loadWorkouts);

const API_URL = "https://rz8rnpbdgf.execute-api.us-east-1.amazonaws.com/"; 

async function addWorkout() {
    let exercise = document.getElementById("exercise").value.trim();
    let sets = document.getElementById("sets").value.trim();
    let reps = document.getElementById("reps").value.trim();
    let weight = document.getElementById("weight").value.trim();

    if (exercise === "" || sets === "" || reps === "" || weight === "") {
        alert("Please fill all fields.");
        return;
    }
    if (isNaN(sets) || isNaN(reps) || isNaN(weight) || sets <= 0 || reps <= 0) {
        alert("Sets and reps must be positive numbers.");
        return;
    }
    if (weight < 0) {
        alert("Weight cannot be negative.");
        return;
    }

    let workout = { exercise, sets, reps, weight };

    try {
        let response = await fetch(`${API_URL}/workouts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(workout),
        });

        if (!response.ok) throw new Error("Error adding workout");

        displayWorkout(workout);
        clearInputs();
    } catch (error) {
        alert("Failed to save workout.");
    }
}

async function loadWorkouts() {
    try {
        let response = await fetch(`${API_URL}/workouts`);
        if (!response.ok) throw new Error("Failed to fetch workouts.");

        let workouts = await response.json();
        workouts.forEach(displayWorkout);
    } catch (error) {
        alert("Could not load workouts.");
    }
}

function displayWorkout(workout) {
    let table = document.getElementById("workout-list");
    let row = table.insertRow();

    row.innerHTML = `
        <td>${workout.exercise}</td>
        <td>${workout.sets}</td>
        <td>${workout.reps}</td>
        <td>${workout.weight} kg</td>
        <td><button class="delete-btn" onclick="deleteWorkout('${workout.exercise}', this)">🗑️ Delete</button></td>
    `;
}

async function deleteWorkout(exercise, btn) {
    try {
        let response = await fetch(`${API_URL}/workouts/${exercise}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete workout");

        let row = btn.parentNode.parentNode;
        row.remove();
    } catch (error) {
        alert("Could not delete workout.");
    }
}

function clearInputs() {
    document.getElementById("exercise").value = "";
    document.getElementById("sets").value = "";
    document.getElementById("reps").value = "";
    document.getElementById("weight").value = "";
}
