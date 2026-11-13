'use client'
import { Link } from "@/i18n/navigation";
import { toast } from 'sonner';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { useUser } from '@/app/api/hooks/users';
import { UserTypes } from '@/app/api/types';
import CodeEditor from '@/components/RichText/CodeEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { updateLanguage } from "@/app/api/translation";

export default function LanguageEditor({englishLanguage, editingLanguage, langKey}: {englishLanguage: string, editingLanguage: string, langKey: string}) {
    const t = useTranslations()
    const {user} = useUser();
    const form = useForm({
        defaultValues: {
            language: editingLanguage
        },
        onSubmit: ({value}) => {
            saveLanguage(value.language)
        }
    })
    
    // const getKeys = (lang: any) => {
    //     delete lang._id
    //     const formattedLanguage: Language = {}
    //     Object.keys(lang).forEach((key) => {
    //         if(typeof lang[key] === 'string') {
    //             formattedLanguage[key] = lang[key]
    //         } else {
    //             for (const k in getKeys(lang[key])) {
    //                 formattedLanguage[key + "." + k] = getKeys(lang[key])[k]
    //             }
    //         }
    //     })
    //     return formattedLanguage
    // }
    // const formattedEnglishLanguage = getKeys(JSON.parse(englishLanguage))
    // const formattedEditingLanguage = getKeys(JSON.parse(editingLanguage))
    
    const saveLanguage = async (language: string) => {
        try {
            JSON.parse(language)
        } catch {
            toast.error(t("Pages.Translate.lang.invalid_json"))
            return
        }
        const result = await updateLanguage(langKey, language)
        if (result.error) {
            toast.error(result.error || t("Pages.Translate.lang.save_error"))
        } else {
            toast.success(t("Pages.Translate.lang.saved"))
        }
    }

    return (
        <>
        <Tabs defaultValue="code">
            <TabsList className="w-full justify-around">
                <TabsTrigger value="code" className="w-full">{t("Pages.Translate.lang.code")}</TabsTrigger>
                {/* <TabsTrigger value="visual" className="w-full">{t("Pages.Translate.lang.visual")}</TabsTrigger> */}
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
                        <Button type="submit">{t("Pages.Translate.lang.save")}</Button>
                        <Button type="button" variant="secondary" onClick={() => {
                            form.reset()
                        }}>{t("Pages.Translate.lang.cancel")}</Button>
                        <Button asChild variant="secondary"><Link href={`/translate`}>{t("Pages.Translate.lang.back")}</Link></Button>
                    </div>
                </form>
            </TabsContent>
            {/* <TabsContent value="visual">
                <div className="w-full max-h-[80vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("Pages.Translate.lang.key")}</TableHead>
                                <TableHead>{t("Pages.Translate.lang.english")}</TableHead>
                                <TableHead>{t("Pages.Translate.lang.translation")}</TableHead>
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
                        }}>{t('Pages.Translate.lang.save')}</Button>
                        <Button type="button" variant="secondary" onClick={() => {
                            form.reset()
                        }}>{t('Pages.Translate.lang.cancel')}</Button>
                        <Link href={`/translate`}><Button type="button" variant="secondary">{t('Pages.Translate.lang.back')}</Button></Link>
                        {user?.type === UserTypes.Admin && (
                            <Button type="button" variant="secondary" onClick={() => {
                                saveLanguage(form.state.values.language)
                            }}>{t('Pages.Translate.lang.approve')}</Button>
                        )}
                    </div>
            </TabsContent> */}
        </Tabs>
        </>
    )
}