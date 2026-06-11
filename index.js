
import { getApod } from "./Nasa.js";


//------------------HTML Elements------------------------------------------
const display = document.getElementById("display");
const progressBar = document.getElementById("progressBar");
const dateInput=document.getElementById("inputDate");
const btn=document.getElementById("btn");
console.log("Progress bar element:", progressBar);

//-----------------------Safety Check------------------------------------
if(!display||!progressBar||!btn||!dateInput)
  console.error("Elements not found");


//------------------Event Listeners-----------------------------------------------
btn.addEventListener("click",loadApod);
window.addEventListener("DOMContentLoaded",() => {
  const today=new Date().toLocaleDateString("en-CA");
  dateInput.min="1995-06-16";
  dateInput.max=today;
  dateInput.value=today;
  loadApod();
});
let progressInterval;

//--------Progress Bar---start------------------------------------------------------------
function startProgress(){
  let width=0;
  progressBar.style.width = "0%";
  document.body.style.cursor = "progress";
  progressInterval=setInterval(()=>
 {
 if (width<85){

  width+=Math.random()*8;
  progressBar.style.width=width+"%";
 }
},120);
}
//---------------------------------Progress Bar finish------------
function finishProgress()
{
  clearInterval(progressInterval);
  progressBar.style.width = "100%";
  setTimeout(() => {
      progressBar.style.width = "0%";
      document.body.style.cursor = "default";
    },500);
    
}

//----------------------retrieve data from the API-------------------------------------------
//------------Main Function to fetch APODS----------------------------------------------------
async function loadApod()
{
  btn.disabled=true;                            //disable button
try{
    const selectedDate=dateInput.value;
    startProgress();
    display.innerHTML=`<div class="card"><p> Loading space Data....🚀</p></div>`;
    const data=await getApod(selectedDate);
    if(!data)
    {
      throw new Error ("No data received from NASA API");
    }
/*-----------------APOD media check----------------------------------------*/
        if(data?.media_type === "image") {           //If display is image
          display.innerHTML = `<div class="card">
            <h2>${data.title || "Astronomy Picture of the Day"}</h2>
            <p><strong>Date:</strong> ${data.date}</p>
            <img src="${data.url}" alt="${data.title}" 
            width="600" class="img-fluid rounded shadow" />
            <p>${data.explanation || ""}</p></div>
          `;
        } else {
/*------------------------Video display--------------------------------------*/          
          display.innerHTML = `<div class="card">                    
            <h2>${data.title || "Astronomy Picture of the Day"}</h2>
            <p><strong>Date:</strong> ${data.date}</p>
            <p>This APOD is a video:</p>
            <iframe src="${data.url}" 
            width="100%"  height="500" 
            allowfullscreen></iframe>
            <p>${data.explanation || ""}</p></div>
          `;
        }
        
    }catch(error)
         {
          console.error(error);
          
          display.innerHTML=`<p class="errText">NASA API is currently unavailable.Please try again later</p>`;
      
        }finally{
          finishProgress();
          btn.disabled=false;
        }

  }




//-----Axios Interceptors--for request duration calculation-----------------
axios.interceptors.request.use((config) => {
  console.log("Request started");
  config.metadata = {
    startTime: new Date()
  }
  console.log("Request started at:", config.metadata.startTime);
  return config;
});

axios.interceptors.response.use(
  (response) => {
    const endTime = new Date();
    console.log("request ended at :", endTime);
    if (response.config.metadata.startTime) {
      const duration = endTime - response.config.metadata.startTime;
      console.log("Request Duration is:", duration);
    }
    return response;
  },

  (error) => {
    console.log("Request failed",error)
   
    return Promise.reject(error);
  }
);