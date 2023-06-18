import {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
    const [current, setCurrent] = useState('CURRENT WEATHER DATA GOES HERE');
    const [forecast, setForecast] = useState('7-DAY FORECAST WEATHER DATA GOES HERE');
    const [show, setShow] = useState('NEWS ARTICLES GO HERE');
    const [exist, setExist] = useState('???');
    const [text, setText] = useState('');
    const handleChange = (event) => {
        setText(event.target.value);
    };
    function submitData() {
        fetch("http://localhost:4000/", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // format: "(latitude, longitude) {location_name}"
                location_info: text
            })
            }).then(res => res.json())
            .then(data => {
                console.log("Successful POST signatureRequest!",data);
                setShow(JSON.stringify(data.news_response.data, null, 2));
                setCurrent(JSON.stringify(data.weather_response.current, null, 2));
                setForecast(JSON.stringify(data.weather_response.forecast, null, 2));
                if(data.news_response.news_in_location===true)
                    setExist("Yes");
                else
                    setExist("No");
            }).catch((error) => {
                console.log("Unsuccessful POST signatureRequest.",error);
            });
    }
    return (
    <div>
        <h3>
        <p>format: (latitude, longitude) &#123;location_name&#125;</p>
        <input
            type="text"
            value={text}
            onChange={handleChange}
        />
        <button
            type="submit"
            onClick={() => {
                submitData();
                /*console.log("Redirecting to /results");
                navigate("/results");*/
            }}
            style={{ borderRadius: "8px" }}
        >
            Submit
        </button>
        </h3>
        <p>{current}</p>
        <p>{forecast}</p>
        <p>DOES THE LOCATION EXIST? {exist}</p>
        <p>{show}</p>
    </div>
    );
}