import React,{ useState,useEffect} from 'react';
import './loading.css'
import './App.css'

const useFetch = (url) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {

    const FetchData = async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();
        setResponse(json);
      } catch (error) {
        setError(error);
      }
    }
      FetchData();
    },[url]);
    return {response, error};
};


function App() {

  const [city, setCity] = useState({
    latitude : 0,
    longitude : 0,
    city:'Pinjore'
  });
  var lon;
  var lat;
  

  window.addEventListener("load", async () => {
    
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition( pos => {
        console.log("pos : " + pos["coords"]["latitude"])
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        setCity({
          latitude:pos.coords.latitude,
          longitude:lon,
          ...city
        })
      },(error)=>{console.log(error)},()=>{console.log(lat,lon)},() => {console.log(lat)})
      console.log(lat,lon)
      
      const resp = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${city.latitude}&lon=${city.longitude}&APPID=26ae62eaa1fa6eb008de6c3fbd30a5ce`)
      const respjson = await resp.json();
      setCity({
        ...city,
        city : respjson.name
      })
    }
  })

  const handleChange = e => {
    e.preventDefault()
    setCity({
        city : document.getElementById("city").value
    })
  }

  let res = useFetch(`http://api.openweathermap.org/data/2.5/weather?q=${city.city}&APPID=26ae62eaa1fa6eb008de6c3fbd30a5ce`)
  
  // console.log(res.response)
  if(!res.response){
    return (
      <div className="loading">
        <span className="back">
	      <span>L</span>
	      <span>o</span>
	      <span>a</span>
	      <span>d</span>
	      <span>i</span>
	      <span>n</span>
      	<span>g</span>
        </span>
      </div>
    )
  }
  return (
    <div className="main">
      <div className="search">
        <div className="arrow"></div>
        <form method="post" onSubmit={handleChange}>
        <input type="text" name ="city" id="city" placeholder="Enter City"/>
        </form>
      </div>
      <div className="city">
      <h1>City : {(res) ? res.response.name + ", " + res.response.sys.country: (res.response.message)} <img src={`http://openweathermap.org/img/wn/${res.response.weather[0].icon}@2x.png`} alt="It was supposed to be weather icon" className="weather-icon"/></h1>
      <h2 className="timezone">{(res.response.weather[0].description).toUpperCase()} </h2>
      <h2 className="temp">{"Temperature : " + (res.response.main.temp - 273.15).toFixed(2) + " " +  String.fromCharCode(176) + " C " }</h2>
      <h2 className="temp">{"Max Temperature : " + (res.response.main.temp_max - 273.15).toFixed(2) + " " +  String.fromCharCode(176) + " C " }</h2>
      <h2 className="temp">{"Min Temperature : " + (res.response.main.temp_min - 273.15).toFixed(2) + " " +  String.fromCharCode(176) + " C " }</h2>
      <h2 className="humidity">{"Humidity " + res.response.main.humidity + "%" }</h2>
      </div>

    </div>
  );
}

export default App;
