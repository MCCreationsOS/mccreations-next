import s3 from 'aws-sdk/clients/s3';

const bucket = new s3({
    region: 'us-west-1',
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY
});

export default async function upload(file: File) {
    console.log(file);
    let name = file.name.substring(0, file.name.lastIndexOf('.')) + Date.now() + file.name.substring(file.name.lastIndexOf('.'))
    name = name.replaceAll(" ", "-")
    console.log("Uploading file " + name);
    const params = {
        Bucket: 'mccreations',
        Key: name,
        Body: file
    }
    try {
        const u = bucket.upload(params);
        u.promise().catch(error => {
            console.error(error)
        });
        return "https://mccreations.s3.us-west-1.amazonaws.com/" + name
    } catch (error) {
        console.log(error)
        return undefined;
    }
}