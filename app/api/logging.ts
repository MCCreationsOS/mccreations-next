export function sendLog(from: string, e: any) {
    try {
        // fetch(`${process.env.LOGGING_URL}/send-log`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: `Encountered error in ${from} \n${new Error().stack} \nError: ${e}`
        // })
    } catch(e) {
        console.error(e)
    }
}