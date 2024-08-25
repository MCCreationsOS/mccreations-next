import { PutObjectCommand, PutObjectCommandInput, S3 } from '@aws-sdk/client-s3'

// const bucket = new S3({
//     region: 'us-east-va',
//     credentials: {
//         accessKeyId: process.env.NEXT_PUBLIC_OVH_ACCESS + "",
//         secretAccessKey: process.env.NEXT_PUBLIC_OVH_SECRET + ""
//     },
//     endpoint: 'https://s3.us-east-va.io.cloud.ovh.us'
// });

// export default async function upload(file: File, location: string) {
//     let name = file.name.substring(0, file.name.lastIndexOf('.')) + Date.now() + file.name.substring(file.name.lastIndexOf('.'))
//     name = name.replaceAll(" ", "-")
//     const params: PutObjectCommandInput = {
//         Bucket: 'mccreations-s3',
//         Key: `${location}/${name}`,
//         Body: file,
//         ACL: "public-read"
//     }
//     try {
//         const command = new PutObjectCommand(params)
//         const response = await bucket.send(command)
//         console.log(response)
//         if(response.$metadata.httpStatusCode === 200) {
//             return `https://mccreations-s3.s3.us-east-va.io.cloud.ovh.us/${location}/${name}`
//         } else {
//             return
//         }
//     } catch (error) {
//         console.error(error)
//         return undefined;
//     }
// }

const bucket = new S3({
    region: 'us-west-1',
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY + "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY + ""
    }
});

export default async function upload(file: File, location: string) {
    let name = file.name.substring(0, file.name.lastIndexOf('.')) + Date.now() + file.name.substring(file.name.lastIndexOf('.'))
    name = name.replaceAll(" ", "-")
    const params = {
        Bucket: 'mccreations',
        Key: `${location}/${name}`,
        Body: file
    }
    try {
        const command = new PutObjectCommand(params)
        const response = await bucket.send(command)
        console.log(response)
        if(response.$metadata.httpStatusCode === 200) {
            return `https://mccreations.s3.us-west-1.amazonaws.com//${location}/${name}`
        } else {
            console.error(response)
            return
        }
    } catch (error) {
        console.error(error)
        return undefined;
    }
}