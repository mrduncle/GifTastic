
//@ts-check
//get new button and label
// function createButton() {
    
// }



//deal with all page button clicks to either create a new topic or display existing topics
// $(".btn").on("click", function() {  //this function monitors all button clicks for
    //the program: start, answers selected
// console.log($(this).attr("class"));    
// if ($(this).attr("id") === "start") {  //if the start button was clicked 
// $(this).css("display", "none");    //hide the start button
// getQuestionData(0);                //initiate the program
// }
// else if ($(this).attr("class").includes("answer")) {  //if an answer button was clicked
// let userAnswer = $(this).text();
// assessAnswer(userAnswer);
// }
// else if ($(this).attr("id") === "again") {  //if the user opted to replay the game again
// questionsAsked = 0;
// correctAnswers = 0;
// incorrectAnswers = 0;
// $("#results").css("display", "none");
// $("#again").css("display", "none"); //hide the buttons
// $("#quit").css("display", "none");
// location.reload(true); //reload the window from the server
// }
// else if ($(this).attr("id") === "quit") {  //if the user opted to quit the game
// window.close();
// }
// })



let rivers = ["Upper Blackwater River", "Colorado River", "Arkansas River", "Stikine River"];
let gifdRivers = [];
let searchParam;
let apiKey = "a6Xd0NCgmNJHxMbKQdk1XP5N0YZkHBrv";



function displayGifs() {
    if (!gifdRivers.includes(searchParam)) {

        let queryURL = "https://api.giphy.com/v1/gifs/search?q=" + 
            searchParam + "&api_key=" + apiKey + "&limit=10";
        $("#button, .button").prop("disabled", true);
        
        // $(".button").prop("disabled", true);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            // ajaxResponse = response;
            // startGame();
        })
    }
}

function createButtons() {
    $("#water-buttons").empty(); //remove all the existing buttons to repopoulate again from scratch
    $.each(rivers, function(i, river) {
        let btn = $("<button>");
        btn.addClass("btn btn-success btn-sm ml-1 mt-1");
        btn.attr("river-name", river);
        btn.attr("id", "button")
        btn.text(river);
        $("#water-buttons").append(btn)
    })
}

function convertTitleCase(string) {
    //converts sentences to title case 
    let stringToTitle = string.toLowerCase().split(" ");
    for (let i=0; i<stringToTitle.length; i++) {
        stringToTitle[i] = stringToTitle[i][0].toUpperCase() + 
            stringToTitle[i].slice(1);
    }
    return stringToTitle.join(" ");
}

//must use a document listen event because it listens for dynamically created buttons
//where $(".button").on("click", function(event){}) only listens for buttons that were 
//available prior to any code running
$(document).on("click", ".button, #button", function(event) {
    event.preventDefault();
    if ($(this).attr("id") === "submit-button") {
        let river = $("#water-input").val().trim();
        $("#water-input").val(""); //clear the input box ready for the next entry
        if (river !== "") {
            let riverTitle = convertTitleCase(river);
            if (rivers.includes(riverTitle)) {
                $("#modal-validate").modal("show");
            }
            else {
                rivers.push(riverTitle);
                createButtons();
            }
        }
        else {
            $("#modal-validate").modal("show");
        }
    }
    else if ($(this).attr(".close-modal")) {
        //pass
    }
    else {
        searchParam = $(this).attr("river-name");
        console.log(searchParam);
        displayGifs();
    }   
})   

//must use a document listen event because it listens for dynamically created buttons
//$(".button").on("click", function(event){}) only listens for buttons that were available prior to any code running
// $(document).on("click", "#button", function(event) {
//     searchParam = $(this).attr("river-name");
//     console.log(searchParam);
//     displayGifs();
// })


//display the original buttons from the rivers array
createButtons();

// Giphy key a6Xd0NCgmNJHxMbKQdk1XP5N0YZkHBrv