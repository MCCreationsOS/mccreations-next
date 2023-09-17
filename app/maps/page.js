// const contentful = require('contentful')
const fetch = require('node-fetch')

import Head from 'next/head'
import Header from 'components/Header'
import Footer from 'components/Footer'
import ContentGrid from "@components/ContentGrid"
import ContentCard from "@components/ContentCard"
import Menu from "@components/Menu"

// const client = contentful.createClient({
//     space: 'xfoauilnv892',
//     accessToken:  process.env.CONTENTFUL_ACCESS_KEY
// })

// async function getMaps() {
//     const res = await client.getEntries({
//         content_type: 'content',
//         'fields.state': 1
//     })

//     return res.items;
// }

async function getMaps() {
    let response = await fetch('http://localhost:3001/maps')
    let data = await response.json();
    return data.maps
}

export default async function Maps() {
    const maps = await getMaps();
    return (
        <div>
            <Menu selectedPage='maps'></Menu>
                <div>
                    <ContentGrid content={maps.map(map => <ContentCard key={map.mapId} content={map}></ContentCard>)}>
                    
                    </ContentGrid>
                </div>
        </div>
    )
}