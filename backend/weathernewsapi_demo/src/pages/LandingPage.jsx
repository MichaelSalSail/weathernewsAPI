import {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const handleChange = (event) => {
        setText(event.target.value);
    };
    return (
    <div>
        <h1>
        <input
            type="text"
            value={text}
            onChange={handleChange}
        />
        <button
            onClick={() => {
            console.log("Redirecting to /results");
            navigate("/results");
            }}
            style={{ borderRadius: "8px" }}
        >
            Submit
        </button>
        </h1>
    </div>
    );
}