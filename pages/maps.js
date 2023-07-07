const contentful = require('contentful')

import Head from 'next/head'
import Header from 'components/Header'
import Footer from 'components/Footer'
import Map from 'components/map'

const client = contentful.createClient({
    space: 'xfoauilnv892',
    accessToken: '9rpve-TD0YjA9AD_Jv8Nu-vdQvMW8bEDg4GxWwE6cdc'
})


let maps = {}

export default function Maps() {
    client.getEntries({
        content_type: 'content'
    }).then((response) => {
        maps = response.items;
    }).catch((error) => {
        console.error(error)
    })

    let cards = maps.map(map => 
        <Map map={map}></Map>
        );

    return (
        <div>{cards}</div>
    )
}