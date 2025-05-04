import RichText from '@/components/old/FormInputs/RichText/RichText'
import { Button } from '@/components/ui/button'
import {useForm} from '@tanstack/react-form'

export default function Comments() {
    const form = useForm({
        defaultValues: {
            username: '',
            comment: '',
        },
        onSubmit: (data) => {
            console.log(data)
        },
    })

    return (
        <div>
            <h2 className="text-2xl font-bold">Leave a comment</h2>
            <form onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}>
                <form.Field name="username" children={(field) => (
                    <>
                        <input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}}/>
                    </>
                )} validators={{
                    onChange: ({value}) => {
                        (!value) ?
                        'Username is required' :
                        value.length < 3 ?
                        'Username must be at least 3 characters long' :
                        undefined
                    }
                }}/>
                <form.Field name="comment" children={(field) => (
                    <>
                        {/* RT causing issues */}
                        {/* <RichText sendOnChange={(v) => {field.handleChange(v)}} initialValue={field.state.value}/> */}
                    </>
                )} validators={{
                    onChange: ({value}) => {
                        (!value) ?
                        'Comment is required' :
                        value.length < 10 ?
                        'Comment must be at least 10 characters long' :
                        undefined
                    }
                }}/>
                <Button type="submit">Submit</Button>
            </form>
        </div>
    )
}