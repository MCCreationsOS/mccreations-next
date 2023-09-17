import Menu from '@components/Menu';

// const contentful = require('contentful')

// const client = contentful.createClient({
//     space: 'xfoauilnv892',
//     accessToken: process.env.CONTENTFUL_ACCESS_KEY
// })

async function getMap(slug) {
    const res = await client.getEntries({
        content_type: 'content',
        'fields.slug': slug
    })

    return res.items[0];
}

export default async function Page({params}) {
    const map = await getMap(params.slug)

    if(map) {
        return (
            <>
            <Menu></Menu>
            <div>
                <h1>{map.fields.title}</h1>
            </div>
            </>
        )
    } else {
        return (
            <div>
                <h1>Map Not Found</h1>
            </div>
        )
    }

}