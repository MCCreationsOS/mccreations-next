'use client'
import { Link } from "@/app/api/navigation";
import { toast } from 'sonner';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { useUser } from '@/app/api/hooks/users';
import { UserTypes } from '@/app/api/types';
import CodeEditor from '@/components/RichText/CodeEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

type Language = {[key: string]: string}

export default function LanguageEditor({englishLanguage, editingLanguage, langKey}: {englishLanguage: string, editingLanguage: string, langKey: string}) {
    const {user} = useUser();
    const form = useForm({
        defaultValues: {
            language: editingLanguage
        },
        onSubmit: ({value}) => {
            saveLanguage(value.language)
        }
    })
    
    const getKeys = (lang: any) => {
        delete lang._id
        const formattedLanguage: Language = {}
        Object.keys(lang).forEach((key) => {
            if(typeof lang[key] === 'string') {
                formattedLanguage[key] = lang[key]
            } else {
                for (const k in getKeys(lang[key])) {
                    formattedLanguage[key + "." + k] = getKeys(lang[key])[k]
                }
            }
        })
        return formattedLanguage
    }
    const formattedEnglishLanguage = getKeys(JSON.parse(englishLanguage))
    const formattedEditingLanguage = getKeys(JSON.parse(editingLanguage))
    
    const saveLanguage = (language: string) => {
        fetch(`${process.env.DATA_URL}/translation/${langKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: language
        }).then(() => {
            //PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, "Translation successfully sent"))
            toast.success("Translation successfully sent")
        })
    }

    const approveLanguage = () => {
        fetch(`${process.env.DATA_URL}/translation/approve/${langKey}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            toast.success("Translation approved")
        })
    }

    return (
        <>
        <Tabs defaultValue="code">
            <TabsList className="w-full justify-around">
                <TabsTrigger value="code" className="w-full">Code</TabsTrigger>
                <TabsTrigger value="visual" className="w-full">Visual</TabsTrigger>
            </TabsList>
            <TabsContent value="code">
                <form onSubmit={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}>
                    <form.Field name="language" children={(field) => (
                        <div className="flex flex-row gap-2">
                            <CodeEditor
                                sendOnChange={field.handleChange}
                                initialValue={englishLanguage}
                                className="w-full h-[80vh] overflow-y-auto"
                                editable={false}
                            />
                            <CodeEditor
                                sendOnChange={field.handleChange}
                                initialValue={field.state.value ?? ""}
                                className="w-full h-[80vh] overflow-y-auto"
                                diff={englishLanguage}
                            />
                        </div>
                    )}/>
                    <div className="flex flex-row gap-2 my-4 justify-center">
                        <Button type="submit">Save</Button>
                        <Button type="button" variant="secondary" onClick={() => {
                            form.reset()
                        }}>Cancel</Button>
                        <Link href={`/translate`}><Button type="button" variant="secondary">Back</Button></Link>
                        {user?.type === UserTypes.Admin && (
                            <Button type="button" variant="secondary" onClick={() => {
                                saveLanguage(form.state.values.language)
                            }}>Approve</Button>
                        )}
                    </div>
                </form>
            </TabsContent>
            <TabsContent value="visual">
                <div className="w-full max-h-[80vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Key</TableHead>
                                <TableHead>English</TableHead>
                                <TableHead>Translation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                                {Object.keys(formattedEnglishLanguage).map((key: string) => (
                                    <TableRow key={key}>
                                        <TableCell className="w-[200px] overflow-x-auto">{key}</TableCell>
                                        <TableCell className="max-w-[200px] overflow-x-auto">{formattedEnglishLanguage[key]}</TableCell>
                                        <TableCell className={formattedEditingLanguage[key] === formattedEnglishLanguage[key] ? "bg-[#ffee0033]" : ""}><Input type="text" className="w-full" defaultValue={formattedEditingLanguage[key]} onChange={(e) => {
                                            const newEditingLanguage = {...formattedEditingLanguage}
                                            newEditingLanguage[key] = e.target.value
                                            form.setFieldValue("language", JSON.stringify(newEditingLanguage))
                                        }}/></TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex flex-row gap-2 my-4 justify-center">
                        <Button type="submit" onClick={() => {
                            form.handleSubmit()
                        }}>Save</Button>
                        <Button type="button" variant="secondary" onClick={() => {
                            form.reset()
                        }}>Cancel</Button>
                        <Link href={`/translate`}><Button type="button" variant="secondary">Back</Button></Link>
                        {user?.type === UserTypes.Admin && (
                            <Button type="button" variant="secondary" onClick={() => {
                                saveLanguage(form.state.values.language)
                            }}>Approve</Button>
                        )}
                    </div>
            </TabsContent>
        </Tabs>
        </>
    )
}