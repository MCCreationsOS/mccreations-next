'use client'

import { useState } from "react";

export default function Rating(props) {
    let [value, setValue] = useState(props.value);
    let contentId = props.contentId;

    const sendRating = (value) => {
        console.log("sent rating " + value)
    }

    let ratingHover = (event) => {
        let value = Math.floor(((event.pageX - event.currentTarget.offsetLeft) / 12.0) + 2)
        value = (Math.floor(value/2))/5
        setValue(value)
    }

    return (
        <div>
            <ul className="rating" onMouseMove={(e) => {ratingHover(e)}} onMouseLeave={() => {setValue(props.value)}}>
                <li className="currentRating" style={{width: value*100 + '%'}}></li>
                <li><a id="one" href="#" title="1 out of 5 stars" onClick={() => {sendRating(1)}}></a></li>
                <li><a id="two" href="#" title="2 out of 5 stars" onClick={() => {sendRating(2)}}></a></li>
                <li><a id="three" href="#" title="3 out of 5 stars" onClick={() => {sendRating(3)}}></a></li>
                <li><a id="four" href="#" title="4 out of 5 stars" onClick={() => {sendRating(4)}}></a></li>
                <li><a id="five" href="#" title="5 out of 5 stars" onClick={() => {sendRating(5)}}></a></li>
            </ul>
        </div>
    )
}