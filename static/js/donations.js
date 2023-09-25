console.log("Weit KotK Donations");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function roundFive(x) {
    return Math.ceil(x / 5) * 5;
}

async function initializeDonationForm() {

    // "Knobhead"
    const knob = $("#amount-knob")[0];
    const amountPreview = $("#amount-preview");
    const amountFormHidden = $("#amount");
    
    const initValue = roundFive(Number.parseFloat(knob.value));
    amountPreview.text(initValue);
    amountFormHidden.val(initValue);

    function logKnobChange(evt) {
        const curValue = roundFive(Number.parseFloat(knob.value));
        amountPreview.text(curValue);
        amountFormHidden.val(curValue);
    }
    document.addEventListener("knob-move-change", logKnobChange);

    // We also actively set the value of the knob to the nearest five when it's released, so that is exactly the input captured in the form
    function logKnobRelesae(evt) {
        const finalValue = roundFive(Number.parseFloat(knob.value));
        console.log(`Fixing knob and input value to: ${finalValue}`);
        knob.value = finalValue;
    }
    document.addEventListener("knob-move-end", logKnobRelesae);

    console.log("Waiting 3 seconds before clearing Django messages.");
    await sleep(3000);
    console.log("Clearing Django messages.");
    $(".messages").hide("slow");

}

async function initializeDonationsDisplay() {

    console.log("Donations display. Checking whether there is a new donation every 1000 ms, refreshing if it's the case. Let's gooo!");

    const audio = $("#audio")[0];
    console.log(`Found ${ audioSamples.length } audio samples to use.`);

    const totalDonationsLabel = $("#total-donations");
    const totalDonationsLabelFull = $("#total-donations-full");

    let previousDonationsTotal = 0;

    let requestDonationsTotal = $.ajax({
        url: "/donations/getCurrentTotal",
        method: "GET"
    });

    requestDonationsTotal.done(function( response ) {
        console.log(response);
        previousDonationsTotal = response.total_amount;
    });

    requestDonationsTotal.fail(function( jqXHR, textStatus ) {
        console.log( "Request failed: " + textStatus );
    });

    while (true) {
        
        await sleep(1000);
        console.log("Checking whether donation increased.");

        let requestDonationsTotal = $.ajax({
            url: "/donations/getCurrentTotal",
            method: "GET"
        });
    
        requestDonationsTotal.done(async function( response ) {
            console.log(response);
            if (response.total_amount > previousDonationsTotal) {
                console.log(`Donations have increased to ${ response.total_amount }! Playing a few effects.`);

                // Make some noise, we have a donation!
                randomAudioSample = audioSamples[Math.floor(Math.random()*audioSamples.length)];
                audio.src = randomAudioSample;
                audio.load();
                console.log(`Playing audio for ${ audio.duration } seconds: ${ randomAudioSample }.`);
                audio.play();
                totalDonationsLabel.text(response.total_amount);
                totalDonationsLabelFull.removeClass("animate__animated animate__tada");
                await sleep(300);
                totalDonationsLabelFull.addClass("animate__animated animate__tada");
                
                previousDonationsTotal = response.total_amount;
                await sleep((audio.duration * 1000) - 500);
                console.log(`Pausing audio.`);
                audio.pause();
                audio.currentTime = 0;

            }
        });
    
        requestDonationsTotal.fail(function( jqXHR, textStatus ) {
            console.log("Request failed: " + textStatus);
        });
    }

}

// This function is used when we "forward" the user to the KotK form, as it fills in previously obtained information: first name, last name, donation amount
async function initializeDonationFormKotK() {

    // The variables used below are define in an inline <script> tag in the template, hence passing variables from Django.
    console.log(`Pre-populating KotK donation form for ${ firstName } ${ lastName } who is donating EUR ${ amount }.`);

    // Note that to enable loading this page cross-domain, we are using x-frame-bypass.js, which can be seen in the template file.
    // Normally we might miss out on the onLoad event listener being triggered if the iframe loads too fast, but in this case this is _always_ slow due to how x-frame-bypass skims proxies to find a working one.

    kotkForm = $("#kotkForm");
    kotkForm.height(570); // Set an initial height so the loading widget is visible.

    kotkForm.on("load", async function() {
        
        console.log("KotK form iframe loaded, populating fields and resizing.")
        $(this).height( $(this).contents().find("body").height() ); // Spread the iframe over the parent, like a single page.
        // $(this).height(570); // Preserve viewport.
        $(this).contents().find("#edit-donation-custom-amount").val(amount);
        $(this).contents().find("#edit-donor-first-name").val(firstName);
        $(this).contents().find("#edit-donor-last-name").val(lastName);

        // Ensure the form submits to a new tab, otherwise we have trouble with the iframe reloading, going through its proxy methods, and overall not passing the data.
        $(this).contents().find("#kotk-donation-100kmrun-form").attr("target", "_top");
        await sleep(1000);
        scroll(0,0); // Necessary for Safari on iOS.

    });

}

// Determine which initiatization/logic to load and apply based on location

if (window.location.href.endsWith("donate/") && (typeof firstName == "object")) {
    document.addEventListener("DOMContentLoaded", initializeDonationForm);
} else if (window.location.href.endsWith("donate/")) {
    document.addEventListener("DOMContentLoaded", initializeDonationFormKotK);
} else if (window.location.href.endsWith("view/")) {
    document.addEventListener("DOMContentLoaded", initializeDonationsDisplay);
}