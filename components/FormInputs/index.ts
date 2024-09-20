export type FormValues = string | number | boolean | object | string[] | number[] | boolean[]

export class FormInput<FormValues> {
    static formInputs: FormInput<any>[] = []

    static registerFormInput(formInput: FormInput<any>) {
        this.formInputs.push(formInput)
    }

    static unregisterFormInput(formInput: FormInput<any>) {
        this.formInputs = this.formInputs.filter(r => r !== formInput)
    }

    static getFormInputs() {
        return this.formInputs
    }

    static getFormInput<FormValues>(id: string) {
        return this.formInputs.find(r => r.id === id) as FormInput<FormValues>
    }

    id: string
    value: FormValues | undefined
    onChange: ((value?: FormValues) => void) | undefined
    onSubmits: ((value?: FormValues) => void)[] = []
    onClears: (() => void)[] = []

    constructor(id: string, value: FormValues, onChange?: (value?: FormValues) => void) {

        this.id = id
        this.value = value
        this.onChange = onChange ?? undefined
    }

    setValue(value?: FormValues) {
        this.value = value
        if(this.onChange) this.onChange(value)
    }

    getValue() {
        return this.value
    }

    onSubmit(callback: (value?: FormValues) => void) {
        this.onSubmits.push(callback)
        return this
    }

    onClear(callback: () => void) {
        this.onClears.push(callback)
        return this
    }


    submit() {

        this.onSubmits.forEach(cb => cb(this.value))
        return this.getValue();
    }

    clear() {
        this.setValue(undefined)
        this.onClears.forEach(cb => cb())
    }

}