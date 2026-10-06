let pick = document.querySelector("#pick");
let result = document.querySelector("#result");
let reset = document.querySelector("#reset");
let choices = document.querySelectorAll("#choices a");

const options = ["Rock", "Paper", "Scissors"];

choices.forEach(function(choiceLink) {

    choiceLink.addEventListener("click", function(a) {

        a.preventDefault();

        // Show reset button
        reset.style.display = "block";

        // Disable all choices
        choices.forEach(function(link) {
            link.style.pointerEvents = "none";
        });

        // Computer chooses 1, 2, or 3
        let ComputerChoice = Math.floor(Math.random() * 3) + 1;

        // Player choice
        let choice = Number(a.currentTarget.dataset.choice);

        console.log("Player chose:", choice);
        console.log("Computer chose:", ComputerChoice);

        // Tie
        if (choice == ComputerChoice) {

            pick.innerText =
                `Computer also chose ${options[ComputerChoice - 1]}`;

            result.innerText = "It's a Tie!";
            result.style.backgroundColor = "lightblue";
        }

        // Player wins
        else if (
            (choice == 1 && ComputerChoice == 3) ||
            (choice == 2 && ComputerChoice == 1) ||
            (choice == 3 && ComputerChoice == 2)
        ) {

            pick.innerText =
                `Computer chose ${options[ComputerChoice - 1]}`;

            result.innerText = "You Win!";
            result.style.backgroundColor = "yellow";
        }

        // Computer wins
        else {

            pick.innerText =
                `Computer chose ${options[ComputerChoice - 1]}`;

            result.innerText = "You Lose!";
            result.style.backgroundColor = "red";
        }

    });

});


// Reset
reset.addEventListener("click", function() {
    location.reload();
});