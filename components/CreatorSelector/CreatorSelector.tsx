import { getCreators } from "@/app/api/auth"
import { ICreator, IUser, UserTypes } from "@/app/types"
import { useEffect, useRef, useState } from "react"
import styles from './CreatorSelector.module.css'
import { Plus } from "react-feather"
import { Popup } from "../Popup/Popup"
import FormComponent, { IFormInput } from "../Form/Form"

interface CreatorSelection extends IUser {
    selected?: boolean
}

export default function CreatorSelector({value, onChange}: {value?: IUser[], onChange: (creators: IUser[]) => void}) {
    const [creators, setCreators] = useState<CreatorSelection[]>()
    const loggedIn = useRef(false)

    useEffect(() => {
        const getData = async () => {
            let token = sessionStorage.getItem('jwt')
            if(token) {
                loggedIn.current = true;
                let users = await getCreators(token)
                if(users && creators) {
                    setCreators([...creators, ...users]);
                } else if(users) {
                    setCreators(users)
                }
            } else {
                setCreators([{username: "Guest", handle: "", type: UserTypes.Creator, email: ""}])
            }
        }
        getData();

        if(value)
            setCreators(value);
    }, [])

    const selectCreator = (idx: number) => {
        let newCreators: CreatorSelection[] = []
        if(creators)
            newCreators = [...creators]
        newCreators[idx].selected = !newCreators[idx].selected
        setCreators(newCreators)
        if(onChange) {
            onChange(newCreators)
        }
    }

    const saveNewCreator = (inputs: IFormInput[]) => {
        let newCreators: CreatorSelection[] = []
        if(creators)
            newCreators = [...creators]
        newCreators.push({username: inputs[0].value!, handle: (inputs[1]) ? inputs[1].value: "", type: UserTypes.Creator, email: "", iconURL: "", selected: true})
        setCreators(newCreators)
        if(onChange) {
            onChange(newCreators)
        }
    }

    return (
        <div className='field'>
            <h3 className='label'>Creators</h3>
            <div className={styles.options}>
                {creators && creators.map((creator, idx) => {return (
                    <div key={idx} className={(creator.selected) ? styles.option_selected : styles.option} onClick={() => {selectCreator(idx)}}>{creator.username}</div>
                )})}
                <div className={styles.option} onClick={() => (loggedIn.current) ? Popup.createPopup(<FormComponent inputs={[{name: 'Username', type: 'text', placeholder: 'CrazyCowMM'}, {name: 'Handle', type: 'text', placeholder: 'crazycowmm'}, {name: "Icon", type: 'image'}]} onSave={saveNewCreator}/>, "Add Creator") : Popup.createPopup(<FormComponent inputs={[{name: 'Username', type: 'text', placeholder: 'crazycowmm'}]} onSave={saveNewCreator}/>, "Add Creator")}>
                    <Plus />
                </div>
            </div>
        </div>
    )

    // if(creators && creators.length > 0) {
    //     return (
    //         <div className='field'>
    //             <h3 className='label'>Creators</h3>
    //             <div className={styles.options}>
    //                 {creators.map((creator, idx) => {return (
    //                     <div key={idx} className={(creator.handle === creators[selected].handle) ? styles.option_selected : styles.option} onClick={() => {setSelected(idx); onChange(creator.handle!)}}>{creator.username}</div>
    //                 )})}
    //             </div>
    //         </div>
    //     )
    // } else {
    //     return (
    //         <div className='field'>
    //             <h3 className='label'>Creators</h3>
    //             <div className={styles.options}>
    //                 <div className={styles.option_selected}>
    //                     <div className='text'>
    //                         <h3 className='label'>Username</h3>
    //                         <input className='input wide' type='text' name='data' placeholder="Username" onChange={(e) => {onChange("", e.currentTarget.value)}}></input>
    //                     </div> 
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }
}