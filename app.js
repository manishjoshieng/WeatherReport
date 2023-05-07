const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine","ejs");

var indexFile = "/index.html";
app.listen(2000,()=>{
    console.log("Server started...");
})

app.get("/",function(req,res){
    res.sendFile(__dirname+"/form.html");
});

app.post("/",function(req,res){
    const cityName = req.body.cityName;
    sendWeatherData(cityName,res);
});

function sendWeatherData(cityName, res){
    const url = "https://api.openweathermap.org/data/2.5/weather";
    const appid = "2dc419a6d6712a974dff1efa130f0a81";
    const units = "metric";
    var query = url+"?"+"q="+cityName+"&appid="+appid+"&units="+units;
    https.get(query,function(responce){
        console.log(responce.statusCode);
        const status = Number(responce.statusCode);
        if (status == 404){
            res.send("Invalid city name. Try again");
        } else {
            responce.on("data",function(data){
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const cityName = weatherData.name;
                const imgUrl = "https://openweathermap.org/img/wn/"+icon+"@2x.png";
                let city_data = {
                    city_name        : cityName,
                    temp_value       : temp,
                    img_url          : imgUrl,
                    describe         : description 
                }

                res.render("weather_report",city_data);

                // res.write("<h1>The temperature in "+cityName+" is "+temp+"<span>&#8451;</span></h1>");
                // res.write("<p>The weather is "+description+"</p>");
                // res.write("<img src="+imgUrl+">");
                // res.send();
            });
        }
    });
}


