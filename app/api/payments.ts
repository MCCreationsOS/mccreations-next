export async function createDonation(amount: number) {
    try {
        const res = await fetch(`${process.env.DATA_URL}/payments/donate`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount
            })
        })
        try {
            let json = await res.json()
            return json;
        } catch(e) {
            console.error(e)
        }
    }
    catch(e) {
        console.error(e);
    }
}