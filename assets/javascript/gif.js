
//@ts-check

let rivers = ["Zambezi River", "Colorado River", "Angel Falls", "Yellowstone River"];
let gifdRivers = [];
let searchParam;
let apiKey = "a6Xd0NCgmNJHxMbKQdk1XP5N0YZkHBrv";

function displayGifs(gifObject) {
    let gifArray = gifObject.data;
    let gifRiver = searchParam.split(" ");
    let rowNo;
    gifRiver = gifRiver.join("-");
    $("#river-gifs-container").append("<h3 style='color:white'>" + searchParam + "</h3>");
    
    //create a new row for each river
    $.each(gifArray, function(i, gif){
        let gifID = gifRiver + i;
        if ((i) % 3 === 0) {
            rowNo = Math.floor(i / 3);
            $("#river-gifs-container").append("<div class='row justify-content-start' id='row-" + rowNo + "'></div>");
        }
        $("#row-" + rowNo).append("<div class='col-md-4 pl-1 mt-1' id=" + gifID +"></div>");
        let gifStill = gif.images.downsized_still.url.substring(0, gif.images.downsized_still.url.indexOf("?"));
        let gifURL = gif.images.downsized_large.url;
        $("#" + gifID).append("<img id='" + gifID + "' src='" + gifStill + 
            "' data-still='" + gifStill + "' data-animate='" + gifURL + 
            "' data-state='still' class='gif'>");
    })
}

function getGifs() {
    if (!gifdRivers.includes(searchParam)) {
        gifdRivers.push(searchParam);
        let queryURL = "https://api.giphy.com/v1/gifs/search?q=" + 
            searchParam + "&api_key=" + apiKey + "&limit=10";
        $("#button, .button").prop("disabled", true);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            console.log(response);
            displayGifs(response);
            $("#button, .button").prop("disabled", false);

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
        getGifs();
    }   
})   

//display the original buttons from the rivers array
createButtons();