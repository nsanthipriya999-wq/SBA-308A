import { API_KEY } from "./keys.js";

const APOD_URL="https://api.nasa.gov/planetary/apod";     //API URL
/**
 * @Param {string} date 
 */


//-----------------------------Fetch APOD data using axios---------------------------------
export async function getApod(date="")                    //defaults to today's date                     
{
    if( date && !/^\d{4}-\d{2}-\d{2}$/.test(date))    //Regex for date validation
    {
        throw new Error("Invalid date,Please select a valid date in YYYY-MM-DD format");
    }
    try{
        const params={api_key:API_KEY};
        if(date){params.date=date;}                  
         const response= await axios.get(APOD_URL,{params});   
         return response.data;
    
    }catch(error)
    {
     console.error("No response from NASA API",error.response?.status||error.message);
     throw error;
    }
}