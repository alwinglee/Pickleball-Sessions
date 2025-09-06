// Other
const addSession = document.getElementById("add-session")
const validatedMatchDisplayList = document.getElementById("validated-match-display-list")
let validatedMatch =[];

// Log Dialog 
const matchLogDialog = document.getElementById("match-log-dialog")
const matchLogForm = document.getElementById("match-log-form")
const matchExitButton = document.getElementById("match-exit-btn")
const matchResetButton=document.getElementById("match-reset-btn")
const matchDate = document.getElementById("match-date")
const matchProgressButton = document.getElementById("match-progress-btn")
const matchCoreSection = document.getElementById("match-core-section")
const matchMetaSection =  document.getElementById("match-meta-section")
const matchPreviousButton = document.getElementById("match-previous-btn")
const matchFormat = document.getElementById("match-format")
const matchResult = document.getElementById("match-result")
const matchYourScore=document.getElementById("match-your-score")
const matchOpponentScore=document.getElementById("match-opponent-score")
const matchDuration = document.getElementById("match-duration")
const matchCourt= document.getElementById("match-court")
const matchCity= document.getElementById("match-city")
const matchProvince = document.getElementById("match-province")
const matchPaddle = document.getElementById("match-paddle")

// Confirmation Dialog
const confirmationDialog=document.getElementById("confirmation-dialog")
const confirmationDialogYesButton= document.getElementById("confirmation-yes-btn")
const confirmationDialogNoButton=document.getElementById("confirmation-no-btn")
const confirmationMessage = document.getElementById("confirmation-message")

// Error Dialog
const errorDialog=document.getElementById("error-dialog")
const errorDialogOkayButton= document.getElementById("error-okay-btn")
const errorMessage=document.getElementById("error-message")

// Button Event Listeners
addSession.addEventListener("click",launchMatchLogDialog)
matchExitButton.addEventListener("click",handleExitLogClick);
matchResetButton.addEventListener("click",handleResetLogClick);
matchProgressButton.addEventListener("click",validateFormContent);
matchFormat.addEventListener("change", handleMatchFormatChange);
matchPreviousButton.addEventListener("click", handlePreviousClick);

function launchMatchLogDialog(){
    toggleFormPages("one")
    matchLogDialog.showModal();
    resetLogDialog()
    matchDate.valueAsDate=new Date();
}

async function deleteMatch(id){
    let userOutcome = await activiateConfirmationDialog("Do you wish to delete this?");
    if (userOutcome){
        let indexPosition=0;
        for (let x=0; x<validatedMatch.length;x++){
            if (id === validatedMatch[x].id){
                indexPosition=x;
                break;
            } else{
                indexPosition++;
            }
        }
        validatedMatch.splice(indexPosition,1);
        validatedMatchDisplayList.children[indexPosition].remove();
    }
}

function handlePreviousClick(){
    toggleFormPages("one")
}

async function handleExitLogClick(){
    let userOutcome = await activiateConfirmationDialog("All progress will be lost. Continue?")
    if (userOutcome){
        matchLogDialog.close()
    }
}

async function handleResetLogClick(){
    let userOutcome = await activiateConfirmationDialog("Reset form and begin again?")
    if (userOutcome){
        resetLogDialog()
    }
}

function handleMatchFormatChange(e){
    const matchFormatConfiguration = {
        Singles: {
            enableClass:".singles",
            disableClass:".doubles"
        },
        Doubles:{
            enableClass:[".singles",".doubles"],
        } 
    }
    let userInputMatchFormat=e.target.value;
    let format=matchFormatConfiguration[userInputMatchFormat]
    document.querySelectorAll(`${format.enableClass}`).forEach((enabledInput)=>{
        enabledInput.disabled=false;
        enabledInput.required=true;
    })
    if (format.disableClass){
        document.querySelectorAll(`${format.disableClass}`).forEach((disabledInput)=>{
            disabledInput.value=""
            disabledInput.disabled=true;
            disabledInput.required=false;
        })
    }
}

function activiateConfirmationDialog(message) {
    confirmationDialog.showModal();
    confirmationMessage.textContent = `${message}`;
    
    return new Promise((resolve) => {
        function yes(){
             confirmationDialog.close();
             resolve(true)
        }
        function no(){
            confirmationDialog.close();
            resolve(false)
        }
    confirmationDialogYesButton.addEventListener("click",yes)
    confirmationDialogNoButton.addEventListener("click",no)
    });
}

function resetLogDialog(){
    matchLogForm.reset()
    toggleFormPages("one")
    document.querySelectorAll([".singles", ".doubles"]).forEach((input)=>{
        input.value=""
        input.disabled=true
        input.required=false
    })  
}

function toggleFormPages(currentPage){
    let formPages = {
    "one":{
        "activePage": matchCoreSection,
        "hidePage":matchMetaSection,
        "buttonText": "Next",
    },
    "two":{
        "activePage": matchMetaSection,
        "hidePage": matchCoreSection,
        "buttonText": "Submit",
        }
    }
    let currentPageSettings = formPages[currentPage]
    currentPageSettings["activePage"].hidden=false
    currentPageSettings["hidePage"].hidden=true
    matchPreviousButton.disabled = currentPage==="one"
    matchProgressButton.textContent=currentPageSettings["buttonText"]
}

function displayValidatedMatchOnPage(){
    const pickleballMatch ={
        "id": new Date().getTime(),
        "date": matchDate.value,
        "format": matchFormat.value,
        "result": matchResult.value,
        "yourScore": matchYourScore.value,
        "opponentScore": matchOpponentScore.value,
        "duration": matchDuration.value,
        "court": matchCourt.value.trim(),
        "city":matchCity.value.trim(),
        "province": matchProvince.value.trim(),
        "paddle": matchPaddle.value.trim(),
    }

    const match = document.createElement("li");
    match.className = "matchFormat"
    match.innerHTML = `
    <div class="section background-colour-${pickleballMatch.result}">
        <h3>${pickleballMatch.result}<br>${pickleballMatch.yourScore} - ${pickleballMatch.opponentScore}</h3>
    </div>
    <div class="section">
       <p>${pickleballMatch.format}</p>
        <p>${pickleballMatch.date}</p>
        <p>${pickleballMatch.city}, ${pickleballMatch.province}</p>
        <p>${pickleballMatch.duration} min.</p>
    </div>
    <div class="section-button">
        <button type=button id="edit-btn">📝</button>
        <button type=button id="delete-btn">❌</button>
    </div>
    `;
    const existingMatchDeleteButton = match.querySelector("#delete-btn");
    const existingMatchEditButton = match.querySelector("#edit-btn");
    validatedMatch.push(pickleballMatch)
    validatedMatchDisplayList.appendChild(match)
    existingMatchDeleteButton.addEventListener("click", deleteMatch.bind(null,pickleballMatch.id));
    // existingMatchEditButton.addEventListener("click",editExistingMatch);
    matchLogDialog.close()
}

// VALIDATION 
function activateErrorDialog(message){
    errorMessage.textContent=`${message}`
    errorDialog.showModal()
    errorDialogOkayButton.addEventListener("click",()=>{errorDialog.close()})
}

async function validateFormContent(){
    try{
        await validateEachInputField()
        if (matchProgressButton.textContent==="Submit"){
            displayValidatedMatchOnPage()
        } else{
             toggleFormPages("two")
        }
    } catch (error){
        activateErrorDialog(error)
    }
}

function validateEachInputField(){
    return new Promise ((resolve,reject)=>{
        let requiredInputFields = document.querySelectorAll("[required]");
        for (let x=0; x<requiredInputFields.length;x++){
        if (!requiredInputFields[x].offsetParent) continue;
            if(!requiredInputFields[x].value.trim()){
                reject(`Please complete the "${requiredInputFields[x].closest("label").firstChild.textContent}" field.`);
                return
            }
            if ( requiredInputFields[x].type==="number" && parseInt(requiredInputFields[x].value)<0){
                reject(`Enter a number 0 or higher for "${requiredInputFields[x].closest("label").firstChild.textContent}" field.`);
                return;
            }
        }
        if (matchCoreSection.offsetParent && matchOpponentScore.offsetParent){
            let userScore = parseInt(matchYourScore.value)
            let competitorScore = parseInt(matchOpponentScore.value)

            if (matchResult.value==="Win"){
                if (userScore<=competitorScore ){
                    reject("Score must exceed opponent's to win."); 
                    return
                }
            } else{
                if((userScore>=competitorScore)){
                    reject("Score must be lower to lose.");  
                    return
                }
            }
               if (userScore>21 || competitorScore>21 ){
                reject("Score cannot exceed 21."); 
                return
            }
        }
        if (matchDuration.offsetParent && parseInt(matchDuration.value) <=0){
            reject ("Match Duration must be at least 1 minute.");
            return;
        }
    resolve(true);
    })

}




