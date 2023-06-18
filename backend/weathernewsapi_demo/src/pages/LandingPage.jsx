import {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
    const [show, setShow] = useState('PLACEHOLDER');
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
                setShow(JSON.stringify(data, null, 2));
            }).catch((error) => {
                console.log("Unsuccessful POST signatureRequest.",error);
            });
    }
    return (
    <div>
        <h1>
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
        </h1>
        <p>{show}</p>
    </div>
    );
}