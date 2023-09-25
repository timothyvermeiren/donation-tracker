console.log("Weit KotK Running");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getParticipantIdFromDiv (participantDiv) {
    const regexParticipantId = /.*?(\d+)$/g;
    participantIdMatchesIt = participantDiv.id.matchAll(regexParticipantId);
    participantIdMatches = Array.from(participantIdMatchesIt, m => m[1])
    // console.log(participantIdMatches);
    if (participantIdMatches.length > 0) {
        return participantIdMatches[0];
    } else {
        return null;
    }
}

async function addLapAsync (participantId, event) {

    // console.log(event);
    event.srcElement

    let requestAddLapAsync = $.ajax({
        url: "/running/addLapAsync/",
        headers: {'X-CSRFToken': csrf_token },
        method: "POST",
        mode: 'same-origin',
        data: JSON.stringify({
            "participantId": participantId
        }),
        contentType: "application/json"
    });

    requestAddLapAsync.done(async function( response ) {
        console.log(response);
        // Update what's shown?
        participantLapsSpan = $(`#participant-id-${participantId}`).children(".participant-laps").text(response.participant_total_laps);
        $(`#participant-id-${participantId}`).removeClass("animate__animated animate__flash");
        await sleep(300);
        $(`#participant-id-${participantId}`).addClass("animate__animated animate__flash");
    });

    requestAddLapAsync.fail(function( jqXHR, textStatus ) {
        console.log( "Request failed: " + textStatus );
    });

}

async function initializeRunningInterface() {

    console.log("Adding listeners for each participant, so we can log laps.");

    let participantDivs = $(".participant");
    
    for (let participantDiv of participantDivs) {
        let participantDivId = getParticipantIdFromDiv(participantDiv);
        console.log(`Handling participant ID: ${participantDivId}`);
        // participantDiv.on("click", { participantId: participantDivId }, addLapAsync);
        // The jQuery "on" above didn't work, so we'll use JS? Why? Is jQuery loaded at another time? God, who knows.
        participantDiv.parentElement.addEventListener("click", function(event) { addLapAsync(participantDivId, event); });
    }

    console.log("Waiting 3 seconds before clearing Django messages.");
    await sleep(3000);
    console.log("Clearing Django messages.");
    $(".messages").hide("slow");

}

// Determine which initiatization/logic to load and apply based on location. But in this case there's only one option, really.

if (window.location.href.endsWith("running/")) {
    document.addEventListener("DOMContentLoaded", initializeRunningInterface);
}