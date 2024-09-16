import { getCreators } from "@/app/api/auth"
import { ICreator, IUser, UserTypes } from "@/app/api/types"
import { useEffect, useRef, useState } from "react"
import styles from './CreatorSelector.module.css'
import { Plus } from "react-feather"
import { Popup } from "../../Popup/Popup"
import FormComponent from "../../Form/Form"
import Text from "../Text"
import ImageInput from "../ImageDropzone"
import {useTranslations} from 'next-intl';
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import { FormInput } from ".."

/**
 * A selector for creators. Also allows adding new creators
 * @param value The creators that are selected
 * @param onChange The function to call when the selected creators change
 */
export default function CreatorSelector({value, onChange}: {value?: ICreator[], onChange?: (creators: ICreator[]) => void}) {
    const [creators, setCreators] = useState<ICreator[]>([])
    const [confirmRemove, setConfirmRemove] = useState(false)
    const input = useRef<FormInput<ICreator[]> | null>(null)
    const loggedIn = useRef(false)
    const t = useTranslations()

    useEffect(() => {
        const getData = async () => {
            let token = localStorage.getItem('jwt')
            if(token) {
                loggedIn.current = true;
                let users = await getCreators(token)
                if(users && creators.length > 0) {
                    setCreators([...creators, ...users]);
                } else if(users && !value) {
                    setCreators(users)
                } else if (value) {
                    setCreators(value)
                }
            } else if(!value) {
                setCreators([{username: t('Account.Shared.username_placeholder'), handle: t('Account.Shared.handle_placeholder')}])
            } else {
                setCreators(value)
            }
        }
        getData();
        if(!input.current) {
            input.current = new FormInput<ICreator[]>("creators", creators, onChange).onSubmit((value) => {
                setCreators(value)
            })
            FormInput.registerFormInput(input.current)
        }

        return () => {
            FormInput.unregisterFormInput(input.current!)
        }
    }, [])

    useEffect(() => {
        if(!input.current) {
            input.current = new FormInput<ICreator[]>("creators", creators, onChange).onSubmit((value) => {
                setCreators(value)
            })
            FormInput.registerFormInput(input.current)
        } else {
            input.current.setValue(creators)
        }
    }, [creators])

    const saveNewCreator = (inputs: string[]) => {
        let newCreators: ICreator[] = []
        if(creators)
            newCreators = [...creators]
        newCreators.push({username: inputs[0]!, handle: (inputs[1]) ? inputs[1]: ""})
        input.current?.setValue(newCreators)
        console.log(input.current?.value)
        setCreators(newCreators)
        if(onChange) {
            onChange(newCreators)
        }
        Popup.close()
    }

    const removeCreator = (idx: number) => {
        if(confirmRemove){
            let newCreators = [...creators!]
            newCreators.splice(idx, 1)
            setCreators(newCreators)
            input.current?.setValue(newCreators)
            if(onChange) {
                onChange(newCreators)
            }
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Form.CreatorSelector.confirm_remove')))
            setConfirmRemove(true)
            setTimeout(() => {
                setConfirmRemove(false)
            }, 5000)
        }
    }

    return (
        <div className='field'>
            <h3 className='label'>{t('Form.CreatorSelector.title')}</h3>
            <div className={styles.options}>
                {creators && creators.map((creator, idx) => {return (
                    <div key={idx} className={(confirmRemove) ? styles.option_removing : styles.option} onClick={() => {removeCreator(idx)}}>{creator.username}</div>
                )})}
                <div className={styles.option} onClick={() => Popup.createPopup({content: <FormComponent id="newCreator" onSave={saveNewCreator}>
                        <Text name={t('Account.Shared.username')} placeholder={t('Account.Shared.username_placeholder')} description={t('Form.CreatorSelector.username_description')}/>
                        <Text name={t('Account.Shared.handle')} placeholder={t('Account.Shared.handle_placeholder')} description={t('Form.CreatorSelector.handle_description')} />
                     </FormComponent>, title: t('Form.CreatorSelector.add_creator')})}>
                    <Plus />
                </div>
            </div>
        </div>
    )
}