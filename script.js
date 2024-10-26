const addButton=document.querySelector(".add");
const model=document.querySelector(".model");
const priorityColors=document.querySelectorAll(".priority");
const content=document.querySelector(".textarea");
const pendingContainer=document.querySelector(".pending_container");
const filterColors=document.querySelectorAll(".priority_color");
const removeTicket=document.querySelector(".delete");
const deleteIcon=document.querySelector(".fa-trash");
// let isDeleteButtonActivated=false;

loadExcistingTickets();

function loadExcistingTickets(){
    const excistingTicket=fetchExcistingTicket();
    display(excistingTicket);
}
function display(tickets){
    for(let i=0;i<tickets.length;i++){
        const ticket=tickets[i];
        
        const {id,color,content}=ticket;
        createTicket(id,content,color,false);
    }
    
}

removeTicket.addEventListener("click",(e)=>{
    let isActive=e.target.classList.contains("red");
    if(isActive){
        e.target.classList.remove("red");
    }
    else{
        e.target.classList.add("red");
    }
    // isDeleteButtonActivated=!isDeleteButtonActivated;
})
addButton.addEventListener("click",(e)=>{
    model.style.display="flex";
    
})
function removeActive(){
    for(let i=0;i<priorityColors.length;i++){
        const priorityElement=priorityColors[i];
        priorityElement.classList.remove("active");
    }
}
for(let i=0;i<priorityColors.length;i++){
    const priorityElement=priorityColors[i];
    priorityElement.addEventListener("click",()=>{
      removeActive();
      priorityElement.classList.add("active");
    })
}
function fetchActiveColor(){
    for(let i=0;i<priorityColors.length;i++){
        const priorityElement=priorityColors[i];
       if(priorityElement.classList.contains("active")){
            return priorityElement.classList[1];
        
       }
    }
}
model.addEventListener("keypress",(e)=>{
    
     if(e.key!="Enter"){
         return;
     }
    // FETCH THE TASK VALUE
    const task=content.value;
    
    // FETCH THE PRIORITY COLOR
    const color=fetchActiveColor();
    
    // textarea should be cleared
    content.value="";

    // model to be closed
    model.style.display="none";

    let ticketId=randomId();
    
    createTicket(ticketId,task,color,true);
    
})

let colors=["pink","blue","green","purple"];

function createTicket(ticketId,content,cardColor,addToLocalStorage){
    const ticketElement=document.createElement("div");
    ticketElement.setAttribute("class","card");
   
    ticketElement.innerHTML=`
        <div class="cardColor ${cardColor}"></div>
        <div class="card_id">#${ticketId}</div>
        <div class="task">${content}</div>
        <div class="lock">
             <i class="fa-solid fa-lock"></i>
        </div>
    `;

    const colorPriority=ticketElement.querySelector(".cardColor");
    const lockButton=ticketElement.querySelector(".lock");
    const taskEdit=ticketElement.querySelector(".task");
    lockButton.addEventListener("click",(e)=>handleLockUnlock(e,taskEdit));
    colorPriority.addEventListener("click",(e)=>{
       
        const colorClicked=e.target.classList[1];
        
        const clickedColorIndex=colors.indexOf(colorClicked);
        
        const colorChange=(clickedColorIndex+1)%colors.length;
       
        const newColor=colors[colorChange];
       
        e.target.classList.remove(colorClicked);
        e.target.classList.add(newColor);
    })
    ticketElement.addEventListener("click",(e)=>handleTicketElement(e));
    pendingContainer.appendChild(ticketElement);
   
    if(addToLocalStorage){
        const newTicket={
            color:cardColor,
            id:ticketId,
            content:content
        }
        addNewTicketToLocalStorage(newTicket);
  }

}
function addNewTicketToLocalStorage(newTicket){
    // fetch the excisting ticket data from the local storage
    const excistingTicket=fetchExcistingTicket();

    // push the new ticket data into the fetched json array
    excistingTicket.push(newTicket);

    // save the data into the local storage
    saveNewTicket(excistingTicket);
}
function fetchExcistingTicket(){
    // fetch the data from the local storage
    const excistingTicket=localStorage.getItem("TaskCard");
    // data which is fetched is in the form of json 
    // convert it into javascript data
    const excistingTicketjs=JSON.parse(excistingTicket);

    // check for null for the first time
    if(excistingTicketjs==null){
        return [];
    }
    return excistingTicketjs;

}
function saveNewTicket(newTicket){
    const excistingTicketJSON=JSON.stringify(newTicket);
    localStorage.setItem("TaskCard",excistingTicketJSON);
}
function randomId(){
    const uid = new ShortUniqueId({ length: 8 });
    let newId=uid.rnd();
    return newId;
}
function handleTicketElement(e){
    let deletedBtnActivated=deleteIcon.classList.contains("red");
    if(deletedBtnActivated){
        e.currentTarget.remove();
    }
}
function handleLockUnlock(e,taskEdit){
    const isLocked=e.target.classList.contains("fa-Lock");

    if(isLocked){
        e.target.classList.remove("fa-Lock");
        e.target.classList.add("fa-lock-open");
        taskEdit.setAttribute("contentEditable","true");
    }
    else{
        e.target.classList.remove("fa-lock-open");
        e.target.classList.add("fa-Lock");
        taskEdit.setAttribute("contentEditable","false");
    }
}


for(let i=0;i<filterColors.length;i++){
        const filterColor=filterColors[i];
        filterColor.addEventListener("click",(e)=>{
            const selectedColor=e.target.classList[1];
            const allTickets=document.querySelectorAll(".card");
            
            for(let i=0;i<allTickets.length;i++){
                const ticket=allTickets[i];
                const colorElement=ticket.querySelector(".cardColor");
                const ticketColor=colorElement.classList[1];
                if(ticketColor!==selectedColor){
                    ticket.style.display="none";
                }
                else{
                    ticket.style.display="block";
                }
            }
        })
        filterColor.addEventListener("dblclick",()=>{
            const allTickets=document.querySelectorAll(".card");
            for(let i=0;i<allTickets.length;i++){
                const ticket=allTickets[i];
                
                ticket.style.display="block";
            }
        })
}

