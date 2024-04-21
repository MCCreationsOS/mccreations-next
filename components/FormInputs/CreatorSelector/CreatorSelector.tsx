import { getCreators } from "@/app/api/auth"
import { ICreator, IUser, UserTypes } from "@/app/types"
import { useEffect, useRef, useState } from "react"
import styles from './CreatorSelector.module.css'
import { Plus } from "react-feather"
import { Popup } from "../../Popup/Popup"
import FormComponent from "../../Form/Form"
import Text from "../Text"
import ImageInput from "../ImageDropzone"

/**
 * Extends the ICreator interface to include a selected property
 */
interface CreatorSelection extends ICreator {
    selected?: boolean
}

/**
 * A selector for creators. Also allows adding new creators
 * @param value The creators that are selected
 * @param onChange The function to call when the selected creators change
 */
export default function CreatorSelector({value, onChange}: {value?: ICreator[], onChange?: (creators: ICreator[]) => void}) {
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
                setCreators([{username: "Guest", handle: ""}])
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

    const saveNewCreator = (inputs: string[]) => {
        let newCreators: CreatorSelection[] = []
        if(creators)
            newCreators = [...creators]
        newCreators.push({username: inputs[0]!, handle: (inputs[1]) ? inputs[1]: "", selected: true})
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
                <div className={styles.option} onClick={() => Popup.createPopup({content: <FormComponent id="newCreator" onSave={saveNewCreator}>
                        <Text name="Username" placeholder="CrazyCowMM" />
                        <Text name="Handle" placeholder="crazycowmm" />
                     </FormComponent>, title: "Add Creator"})}>
                    <Plus />
                </div>
            </div>
            <input type='hidden' name='creators' value={JSON.stringify(creators)}></input>
        </div>
    )
}