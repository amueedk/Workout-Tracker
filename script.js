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
    if (weight < 0) {
        alert("Weight cannot be negative.");
        return;
    }

    let workout = { exercise, sets, reps, weight };
    saveWorkout(workout);
    displayWorkout(workout);
    clearInputs();
}

function saveWorkout(workout) {
    let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
}

function loadWorkouts() {
    let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    workouts.forEach(displayWorkout);
}

function displayWorkout(workout) {
    let table = document.getElementById("workout-list");
    let row = table.insertRow();

    row.innerHTML = `
        <td>${workout.exercise}</td>
        <td>${workout.sets}</td>
        <td>${workout.reps}</td>
        <td>${workout.weight}</td>
        <td><button class="delete-btn" onclick="deleteWorkout(this)">🗑️ Delete</button></td>
    `;
}

function deleteWorkout(btn) {
    let row = btn.parentNode.parentNode;
    let exercise = row.cells[0].textContent;

    let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    workouts = workouts.filter(w => w.exercise !== exercise);
    localStorage.setItem("workouts", JSON.stringify(workouts));

    row.remove();
}

function clearInputs() {
    document.getElementById("exercise").value = "";
    document.getElementById("sets").value = "";
    document.getElementById("reps").value = "";
    document.getElementById("weight").value = "";
}
