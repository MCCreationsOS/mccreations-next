// const contentful = require('contentful')
const fetch = require('node-fetch')

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
    let response = await fetch(`${process.env.DATA_URL}/maps`)
    let data = await response.json();
    return data
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