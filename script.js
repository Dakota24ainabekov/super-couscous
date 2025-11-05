[СКОПИРОВАТЬ]

let currentUser = null;
const AI_ENDPOINT = "/api/ai";

function openScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

document.getElementById("btn-login").onclick = ()=>{
  const name = login-name.value.trim();
  if(!name) return;

  currentUser = name;
  if(!localStorage.getItem("user_"+name))
     localStorage.setItem("user_"+name, JSON.stringify({notes:[], affirm:[]}));

  loadUser();
  openScreen("screen-main");
};

function loadUser(){
  const u = JSON.parse(localStorage.getItem("user_"+currentUser));
  user-title.innerText = "Hello, "+currentUser+" 💗";
  renderNotes();
  renderAffirms();
}

function logout(){ currentUser=null; openScreen("screen-login"); }

// NOTES
btn-add-local.onclick = ()=>{
  const t = notes-input.value.trim();
  if(!t) return;
  const u = JSON.parse(localStorage.getItem("user_"+currentUser));
  u.notes.unshift({text:t, fromAI:false});
  localStorage.setItem("user_"+currentUser, JSON.stringify(u));
  notes-input.value="";
  renderNotes();
};

btn-add-note.onclick = async ()=>{
  const t = notes-input.value.trim();
  if(!t) return;

  const u = JSON.parse(localStorage.getItem("user_"+currentUser));
  u.notes.unshift({text:t, fromAI:false});
  localStorage.setItem("user_"+currentUser, JSON.stringify(u));
  notes-input.value="";
  renderNotes();

  ai-container.classList.remove("hidden");
  ai-loading.style.display="block";

  try{
     const r = await fetch(AI_ENDPOINT,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ user: currentUser, text: t })
     });
     const data = await r.json();
     ai-loading.style.display="none";
     ai-response.innerText=data.reply;

     btn-save-ai.onclick = ()=>{
        const u2 = JSON.parse(localStorage.getItem("user_"+currentUser));
        u2.notes.unshift({text:"AI: "+data.reply, fromAI:true});
        localStorage.setItem("user_"+currentUser, JSON.stringify(u2));
        renderNotes();
     };

  }catch(e){
     ai-loading.style.display="none";
     ai-response.innerText="AI error";
  }
};

function renderNotes(){
  const list = notes-list;
  list.innerHTML="";
  const u = JSON.parse(localStorage.getItem("user_"+currentUser));
  u.notes.forEach(n=>{
     const li=document.createElement("li");
     li.innerText=(n.fromAI?"[AI] ":"")+n.text;
     list.appendChild(li);
  });
}

// AFFIRM
btn-new-affirm.onclick = ()=>{
  const arr=[
    "I am calm ✨","I choose peace 🌸","My energy is beautiful 💗",
    "I am becoming stronger 💞","Good things are coming 🔮"
  ];
  affirm-text.innerText=arr[Math.floor(Math.random()*arr.length)];
};

btn-save-affirm.onclick = ()=>{
  const t = affirm-text.innerText;
  if(!t || t.includes("Tap")) return;
  const u = JSON.parse(localStorage.getItem("user_"+currentUser));
  u.affirm.unshift({text:t});
  localStorage.setItem("user_"+currentUser, JSON.stringify(u));
  renderAffirms();
};

function renderAffirms(){
  affirm-list.innerHTML="";
  const u = JSON.parse(localStorage.getItem("user_"+currentUser));
  u.affirm.forEach(a=>{
    const li=document.createElement("li");
    li.innerText=a.text;
    affirm-list.appendChild(li);
  });
}

[КОНЕЦ]
