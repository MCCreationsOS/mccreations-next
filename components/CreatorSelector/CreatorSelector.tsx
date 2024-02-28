import { getCreators } from "@/app/api/auth"
import { IUser } from "@/app/types"
import { useEffect, useState } from "react"
import styles from './CreatorSelector.module.css'

export default function CreatorSelector({onChange}: {onChange: (handle: string, nonAccount: boolean) => void}) {
    const [selected, setSelected] = useState(0)
    const [creators, setCreators] = useState<IUser[]>([])

    useEffect(() => {
        const getData = async () => {
            let token = sessionStorage.getItem('jwt')
            if(token) {
                let c = await getCreators(token)
                setCreators(c);
            }
        }
        getData();
    }, [])

    if(creators && creators.length > 0) {
        return (
            <div className='field'>
                <h3 className='label'>Creators</h3>
                <div className={styles.options}>
                    {creators.map((creator, idx) => {return (
                        <div key={idx} className={(creator.handle === creators[selected].handle) ? styles.option_selected : styles.option} onClick={() => {setSelected(idx); onChange(creator.handle!, false)}}>{creator.username}</div>
                    )})}
                </div>
            </div>
        )
    } else {
        return (
            <div className='field'>
                <h3 className='label'>Creators</h3>
                <div className={styles.options}>
                    <div className={styles.option_selected}>
                        <div className='text'>
                            <h3 className='label'>Username</h3>
                            <input className='input wide' type='text' name='data' placeholder="Username" onChange={(e) => {onChange(e.currentTarget.value, true)}}></input>
                        </div> 
                    </div>
                </div>
            </div>
        )
    }
}