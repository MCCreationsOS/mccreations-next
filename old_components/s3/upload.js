import s3 from 'aws-sdk/clients/s3';
import axios from 'axios'

const bucket = new s3({
    region: 'us-west-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

export default async function upload(file) {
    console.log(file)
    const params = {
        Bucket: 'mccreations',
        Key: file.name,
        Body: file
    }
    try {
        const u = bucket.upload(params);
        await u.promise().catch(error => {
            console.error(error)
        });
        console.log("Yay!")
    } catch (error) {
        return error;
    }
}