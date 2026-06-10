import { API_KEY } from "./keys.js";  
import { getApod } from "./Nasa.js";


//------------------HTML Elements------------------------------------------
const display = document.getElementById("display");
const progressBar = document.getElementById("progressBar");
const dateInput=document.getElementById("inputDate");
const btn=document.getElementById("btn");
console.log("Progress bar element:", progressBar);
//-----------------------Safety Check---------
if(!display||!progressBar||!btn)
  console.error("Elements not found");


//------------------Event Listeners------------
btn.addEventListener("click",loadApod);
window.addEventListener("DOMContentLoaded",loadApod);

let progressInterval;
//--------Progress Bar---start----------------
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
//-----------Progress Bar finish------------
function finishProgress()
{
  clearInterval(progressInterval);
  progressBar.style.width = "100%";
  setTimeout(() => {
      progressBar.style.width = "0%";
      document.body.style.cursor = "default";
    },500);
    
}
//get request for nasa images
// fetching NASA API Example
/*const response = await fetch('https://api.nasa.gov', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
});*/
/*fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
const data = await response.json();
    data.forEach((d) => {
      const option = document.createElement("option");
      option.value = d.id;
      option.textContent = d.name;
      //breedSelect.appendChild(option);
    });

//const data = await response.json();
console.log(data);
//retrieve data from the API*/


//------------Main Function to fetch APODS--------
async function loadApod()
{

try{
    const selectedDate=dateInput.value;
    //let url=`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
    startProgress();
    const data=await getApod(selectedDate);
   /* if(selectedDate){

      url+=`&date=${selectedDate}`;
    }
    console.log("Request URL:",url);

    const response= await axios.get(url,
    {
      onDownloadProgress:updateProgress
    });
    const data=response.data;




        /*const title = data['title'];
        const imageUrl = data['url'];
        const media_type=data['media_type'];
        console.log(`Title: ${title}`);
        console.log(`Image URL: ${imageUrl}`);*/

/*-----------------APOD media check----------------------------------------*/
        if(data.media_type === "image") {           //If display is image
          display.innerHTML = `
            <h2>${data.title || "Astronomy Picture of the Day"}</h2>
            <p><strong>Date:</strong> ${data.date}</p>
            <img src="${data.url}" alt="${data.title}" 
            width="600" class="img-fluid rounded shadow" />
            <p>${data.explanation || ""}</p>
          `;
        } else {
/*------------------------Video display--------------------------------------*/          
          display.innerHTML = `                       
            <h2>${data.title || "Astronomy Picture of the Day"}</h2>
            <p><strong>Date:</strong> ${data.date}</p>
            <p>This APOD is a video:</p>
            <iframe src="${data.url}" 
            width="100%", height="500" 
            allowfullscreen></iframe>
            <p>${data.explanation || ""}</p>
          `;
        }
        finishProgress();
       }catch(error)
         {
          console.error(error);
          finishProgress();
          display.innerHTML=`<p class="errText">NASA API is currently unavailable.Please try again later`;
      
        }

  }
//MARS Rover Photos
/*fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=latest&api_key=${API_KEY}&page=1`)
    .then(response => response.json())
    .then(data => {
        const images = data['photos'];
        images.slice(0, 10).forEach(image => {
            console.log(image['img_src']);
        });
    })
    .catch(error => console.error(error));

    //Earth Observation Images
    fetch(`https://api.nasa.gov/planetary/earth/assets?lon=-149.99078798245626&lat=61.21887894558012&api_key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        const latestImage = data['date'];
        console.log(`Latest Image: ${latestImage}`);
    })
    .catch(error => console.error(error));*/

//-------------Progress Bar---------------------------
    function updateProgress(e) {
  /* const loaded=e.loaded;
   const total=e.total;*/
  const { loaded, total } = e;
  if (total) {
    console.log("Total is:", total)
    const percent = Math.round(loaded * 100 / total);
    progressBar.style.width = percent + "%";
    console.log("progress bar:", percent + "%");
  }
  else {

    console.log("No total Value,progress loading");    //If no total value ,set the progress bar width at 40%
    progressBar.style.width = "40%";
  }
}


//-----Axios Interceptors---------------progress bar------------------
axios.interceptors.request.use((config) => {
  console.log("Request started");
  config.metadata = {
    startTime: new Date()
  }
  console.log("Request started at:", config.metadata.startTime);
  progressBar.style.width = "0%";
  document.body.style.cursor = "progress";
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
    progressBar.style.width = "100%";
    setTimeout(() => {
      progressBar.style.width = "0%";
    },500);
    document.body.style.cursor = "default";
    return response;


  },

  (error) => {
    console.log("Request failed",error)
    progressBar.style.width = "100%";
    setTimeout(()=>{
      progressBar.style.width="0%";
    },500);
    document.body.style.cursor = "default";
    return Promise.reject(error);
  }
);