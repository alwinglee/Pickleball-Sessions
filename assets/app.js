// Other
const addSession = document.getElementById("add-session")
const validatedMatchDisplayList = document.getElementById("validated-match-display-list")
let validatedMatch =[];
let editMatchID =null;

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
const matchYourTeamName1 = document.getElementById("your-team-name1")
const matchYourTeamName2 = document.getElementById("your-team-name2")
const matchOpponentName1 = document.getElementById("opponent-team-name1")
const matchOpponentName2 = document.getElementById("opponent-team-name2")
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

function confirmMatchID(id){
     let indexPosition=-1;
        for (let x=0; x<validatedMatch.length;x++){
            if (id === validatedMatch[x].id){
                indexPosition=x;
                break;
            }
        }
    return indexPosition;
}

async function deleteMatch(id){
    let userOutcome = await activiateConfirmationDialog("Do you wish to delete this?");
    if (userOutcome){
       let matchPosition = confirmMatchID(id)
       if (matchPosition !==-1){
            validatedMatch.splice(matchPosition,1);
             validatedMatchDisplayList.children[matchPosition].remove();
       }
    }
}

function editExistingMatch(id){
    let matchPosition = confirmMatchID(id)
    if (matchPosition !==-1){
        let foundMatch = validatedMatch[matchPosition]
        matchDate.value= foundMatch.date
        matchFormat.value= foundMatch.format
        matchYourTeamName1.value= foundMatch.yourTeamName1
        matchYourTeamName2.value = foundMatch.yourTeamName2
        matchOpponentName1.value = foundMatch.opponentTeamName1
        matchOpponentName2.value = foundMatch.opponentTeamName2
        matchResult.value = foundMatch.result
        matchYourScore.value = foundMatch.yourScore
        matchOpponentScore.value = foundMatch.opponentScore
        matchDuration.value = foundMatch.duration
        matchCourt.value = foundMatch.court
        matchCity.value = foundMatch.city
        matchProvince.value= foundMatch.province
        matchPaddle.value = foundMatch.paddle
        editMatchID = id;
        matchLogDialog.showModal()
        toggleFormPages("one")
    }  
}

function handlePreviousClick(){
    toggleFormPages("one")
}

async function handleExitLogClick(){
    let userOutcome = await activiateConfirmationDialog("All progress will be lost. Continue?")
    if (userOutcome){
        editMatchID=null;
        matchLogDialog.close();
    }
}

async function handleResetLogClick(){
    let userOutcome = await activiateConfirmationDialog("Reset form and begin again?")
    if (userOutcome){
        editMatchID=null;
        resetLogDialog();
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
    confirmationMessage.textContent =`${message}`;
    
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
        },
    }
    let currentPageSettings = formPages[currentPage]
    currentPageSettings["activePage"].hidden=false
    currentPageSettings["hidePage"].hidden=true
    matchPreviousButton.disabled = currentPage==="one"
    matchProgressButton.textContent=currentPageSettings["buttonText"]
}

function capitalizeString(word){
    let splitWord = word.split(" ");
    for (let x=0; x<splitWord.length;x++){
        splitWord[x]= splitWord[x].charAt(0).toUpperCase()+splitWord[x].slice(1)
    }
    return splitWord.join(" ");
}

async function displayValidatedMatchOnPage(){
    
    const pickleballMatch ={
        "id": editMatchID || new Date().getTime(),
        "date": matchDate.value,
        "format": matchFormat.value,
        "yourTeamName1": capitalizeString(matchYourTeamName1.value.trim()),
        "yourTeamName2": capitalizeString(matchYourTeamName2.value.trim()),
        "opponentTeamName1": capitalizeString(matchOpponentName1.value.trim()),
        "opponentTeamName2": capitalizeString(matchOpponentName2.value.trim()),
        "result": matchResult.value,
        "yourScore": matchYourScore.value,
        "opponentScore": matchOpponentScore.value,
        "duration": matchDuration.value,
        "court": capitalizeString(matchCourt.value.trim()),
        "city":capitalizeString(matchCity.value.trim()),
        "province": capitalizeString(matchProvince.value.trim()),
        "paddle": capitalizeString(matchPaddle.value.trim()),
    }

    const match = document.createElement("li");
    match.className = "matchCard"
    match.innerHTML = `
    <div class="matchCard-column1 background-colour-${pickleballMatch.result}">
        <h3>${pickleballMatch.result}<br>${pickleballMatch.yourScore} - ${pickleballMatch.opponentScore}</h3>
    </div>
    <div class="matchCard-column2 matchCard-details">
        <p>${pickleballMatch.format}</p>
        <p>${pickleballMatch.date}</p>
        <p>${pickleballMatch.duration} min.</p>
        <p>${pickleballMatch.court}</p>
        <p>${pickleballMatch.city}, ${pickleballMatch.province}</p>
    </div>
    <div class="matchCard-column3">
        <div class="matchCard-teams">
            <p>${pickleballMatch.yourTeamName1}</p>
            <p>${pickleballMatch.yourTeamName2}</p>
        </div>
        <div>
            <p>VS</p>
        </div>
        <div class="matchCard-teams">
            <p>${pickleballMatch.opponentTeamName1}</p>
            <p>${pickleballMatch.opponentTeamName2}</p>
        </div>
    </div>
    <div class="matchCard-button">
        <button type=button id="edit-btn">📝</button>
        <button type=button id="delete-btn">❌</button>
    </div>
    `;
    
    if (!editMatchID){
        validatedMatch.push(pickleballMatch)
        validatedMatchDisplayList.appendChild(match)
        const existingMatchDeleteButton = match.querySelector("#delete-btn");
        const existingMatchEditButton = match.querySelector("#edit-btn");
        existingMatchDeleteButton.addEventListener("click", deleteMatch.bind(null,pickleballMatch.id));
        existingMatchEditButton.addEventListener("click", () => editExistingMatch(pickleballMatch.id));    
         matchLogDialog.close();
    } else{
        let userOutcome = await activiateConfirmationDialog("Confirm Changes?")
        if (userOutcome){
            let matchPosition = confirmMatchID(editMatchID);
            validatedMatch.splice(matchPosition,1,pickleballMatch)
            validatedMatchDisplayList.replaceChild(match,validatedMatchDisplayList.children[matchPosition]);
            editMatchID = null;
            const existingMatchDeleteButton = match.querySelector("#delete-btn");
            const existingMatchEditButton = match.querySelector("#edit-btn");
            existingMatchDeleteButton.addEventListener("click", deleteMatch.bind(null,pickleballMatch.id));
            existingMatchEditButton.addEventListener("click", () => editExistingMatch(pickleballMatch.id));    
             matchLogDialog.close();
        }
    }
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




