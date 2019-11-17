//@ts-check

//get new button and label
function createButton() {
    
}



//deal with all page button clicks to either create a new topic or display existing topics
$(".btn").on("click", function() {  //this function monitors all button clicks for
    //the program: start, answers selected
console.log($(this).attr("class"));    
if ($(this).attr("id") === "start") {  //if the start button was clicked 
$(this).css("display", "none");    //hide the start button
getQuestionData(0);                //initiate the program
}
else if ($(this).attr("class").includes("answer")) {  //if an answer button was clicked
let userAnswer = $(this).text();
assessAnswer(userAnswer);
}
else if ($(this).attr("id") === "again") {  //if the user opted to replay the game again
questionsAsked = 0;
correctAnswers = 0;
incorrectAnswers = 0;
$("#results").css("display", "none");
$("#again").css("display", "none"); //hide the buttons
$("#quit").css("display", "none");
location.reload(true); //reload the window from the server
}
else if ($(this).attr("id") === "quit") {  //if the user opted to quit the game
window.close();
}
})





let queryURL = "https://opentdb.com/api.php?amount=" + numQuestions;

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    ajaxResponse = response;
    startGame();
})
