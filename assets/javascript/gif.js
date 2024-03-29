
//@ts-check

let rivers = ["Zambezi River", "Colorado River", "Victoria Falls", "Yellowstone River"];
let gifdRivers = [];
let gifdNo = 0;
let searchParam;
let apiKey = "a6Xd0NCgmNJHxMbKQdk1XP5N0YZkHBrv";



function displayGifs(gifObject) {
    let gifArray = gifObject.data; //first level of the object used to access all other information about the object
    let gifRiver = searchParam.split(" ");
    let rowNo;
    gifdNo += 1;
    gifRiver = gifRiver.join("-");
    //add a heading for the new river clicked on to display its gifs
    $("#river-gifs-container").append("<h3 style='color: green;'>" + searchParam + "</h3>");
    
    //create a new row for each river
    $.each(gifArray, function(i, gif){
        let gifID = gifRiver + i;
        //create a new row every third gif
        if ((i) % 5 === 0) {
            rowNo = Math.floor(i / 5);
            $("#river-gifs-container").append("<div class='row justify-content-start ml-1' id='row-" + gifdNo + rowNo + "'></div>");
        }

        $("#row-" + gifdNo + rowNo).append("<div class='card border-0 text-warning' " +
             "style='background-color: transparent;' id=" + gifID +"></div>");
        //only get the portion of the url attribute up to the "?" in the string
        let gifStill = gif.images.downsized_still.url.substring(0, gif.images.downsized_still.url.indexOf("?"));
        let gifURL = gif.images.downsized_large.url;
        let gifrating = gif.rating;
        //create a string which includes the html for the image and text
        let appendImg = "<img id='" + gifID + "' src='" + gifStill + 
            "' data-still='" + gifStill + "' data-animate='" + gifURL +
            "' data-state='still' class='gif card-img-bottom'" +
            " style='height: 150px; width: auto;'>"
        let appendText = "<p class='card-text'>Rating: " + gifrating + "</p>"
        //add the image and text to the bootstrap card
        $("#" + gifID).append("<div class='card-body'>" + appendText + appendImg +"</div>");
    })
}

function getGifs() {
    if (!gifdRivers.includes(searchParam)) {  //check if the specific river's button has been pushed previously
        gifdRivers.push(searchParam);
        let queryURL = "https://api.giphy.com/v1/gifs/search?q='" + 
            searchParam + "'&api_key=" + apiKey + "&limit=10";
        $("#button, .button").prop("disabled", true); //disable all buttons while the api is returning information
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            displayGifs(response);
            $("#button, .button").prop("disabled", false); //re-enable all buttons now that the api has returned its output
        })
    }
}

function createButtons() {
    $("#water-buttons").empty(); //remove all the existing buttons to repopoulate again from scratch
    $.each(rivers, function(i, river) {  //loop through all the items in the rivers array and create a button for each
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
    let stringToTitle = string.toLowerCase().split(" "); //create an array of the lower case version of every word
    for (let i=0; i<stringToTitle.length; i++) {  //loop through the array
        stringToTitle[i] = stringToTitle[i][0].toUpperCase() + 
            stringToTitle[i].slice(1); //for words 0 to arr.length-1 change the first letter to upper case
    }
    return stringToTitle.join(" "); //return the array of capitalised words as a single string
}

//must use a document listen event because it listens for dynamically created buttons
//where $(".button").on("click", function(event){}) only listens for buttons that were 
//available prior to any code running
$(document).on("click", ".button, #button", function(event) {
    event.preventDefault();  //stops the default event from running when a button is pushed (particularly for the submit button)
    if ($(this).attr("id") === "submit-button") { //button pushed was the submit button
        let river = $("#water-input").val().trim();
        $("#water-input").val(""); //clear the input box ready for the next entry
        if (river !== "") {  //enter a new river if it had not previously been entered and if there is a non-empty entry
            let riverTitle = convertTitleCase(river); //capitalise the first letter of each word
            if (rivers.includes(riverTitle)) {  //check to see if the river entered already exists
                $("#modal-validate").modal("show"); //show the modal to request the user enters a different river
            }
            else { //add the new river to the global array rivers and call procedure to create a button
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
    //if the button pushed was not to close the modal or the submit button then it was to retrieve gifs
    //clicking on the river buttons is handled below at $("#river-gifs-container").on("click"....)
    else {
        searchParam = $(this).attr("river-name");
        console.log(searchParam);
        getGifs();
    }   
})   

//change gifs between still and animated
$("#river-gifs-container").on("click", ".gif", function() {
    if ($(this).attr("data-state") === "animate") {
        $(this).attr("data-state", "still"); //turn the data-state property for gifs to still
        $(this).attr("src", $(this).attr("data-still"))
    }
    else {
        $(".gif").each(function() {
            $(this).attr("data-state", "still");
            $(this).attr("src", $(this).attr("data-still")); //turn the src property for all gifs to the inanimate gif
        })
        $(this).attr("data-state", "animate"); //turn the data-state property for the clicked element to animate
        $(this).attr("src", $(this).attr("data-animate"));
    }
})

//display the original buttons from the rivers array
createButtons();