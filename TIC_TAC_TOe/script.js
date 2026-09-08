let boxes =document.querySelectorAll(".box");
let newGameBtn = document.querySelector('#new-btn');
let msgContainer = document.querySelector('.msg-container');
let msg = document.querySelector("#msg")

let turnO = true;

let winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

const resetGame = () => {
    turnO = true;
    enableBoxes();
    msgContainer.classList.add("hide");
    boxes.forEach((box) => box.classList.remove("blur-box", "x-mark"));
};

boxes.forEach((box) => {
    box.addEventListener('click',() => {
         if (turnO){
            box.innerText = "O"
            turnO = false;
         }else{
            box.innerText = "X"
                box.classList.add("x-mark");
            turnO = true;
        }
        box.disabled = true;
        checkWinner();
    })    
 });

 const disableBoxes = ()=>{
    for (let box of boxes) {
        box.disabled = true;
    }
 };

 const enableBoxes = ()=>{
    for (const box of boxes) {
        box.disabled = false;
        box.innerText = '';
    }
 };

 const showWinner = (winner) =>{
    msg.innerText = `Congratulations, Winner is ${winner}`
    msgContainer.classList.remove("hide");
    boxes.forEach((box) => box.classList.add("blur-box"));
    disableBoxes()
 }
 const showLost = () => {
     msg.innerText = "Game Lost"
     msgContainer.classList.remove("hide");
    boxes.forEach((box) => box.classList.add("blur-box"));
     disableBoxes()
 }

 const checkWinner = () => {
     for (const pattern of winPatterns) {
        let pos1Val= boxes[pattern[0]].innerText;
        let pos2Val= boxes[pattern[1]].innerText;
        let pos3Val= boxes[pattern[2]].innerText;


        if (pos1Val != '' && pos2Val != '' && pos3Val != ''  ){
            if (pos1Val == pos2Val && pos2Val == pos3Val) {
                showWinner(pos1Val)
                return;
            }
        }
    }

    const boardIsFull = [...boxes].every((box) => box.innerText !== '');
    if (boardIsFull) {
        showLost();
    }
 };

 newGameBtn.addEventListener("click", resetGame);

