import { likeComment, postComment, postRating, postReply } from '@/app/api/community'
import { useComments } from '@/app/api/hooks/comments'
import { useCreator, useUser } from '@/app/api/hooks/users'
import { CollectionNames, IComment, IContentDoc, SortOptions } from '@/app/api/types'
import RichText from '@/components/RichText/RichText'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import {useForm} from '@tanstack/react-form'
import DOMPurify from 'isomorphic-dompurify'
import { ChevronDown, ChevronDownIcon, ChevronUp, ThumbsUpIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Rating from './Rating'
import { setCookie } from '@/app/setCookies'
import { getCookie } from '@/app/setCookies'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useTranslations } from 'next-intl'

export default function Comments({creation, collection}: {creation: IContentDoc, collection: CollectionNames}) {
    const [sort, setSort] = useState(SortOptions.Newest)
    const {comments} = useComments(creation.slug, collection, sort, 20);
    const t = useTranslations();

    return (
        <div>
            <h2 className="text-2xl font-bold my-2">Leave a comment</h2>
            <CommentForm content_type={collection} creation={creation} />
            <div>
                <div className='flex flex-row gap-2 w-full'>
                    <h2 className="text-2xl font-bold my-2">Comments</h2>
                    <div className='flex-1 flex flex-row gap-2 justify-end'>    
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="ghost" className='text-muted-foreground'>
                                    <span>{t(`SearchAndFilter.Sort.${sort}`)}</span>
                                    <ChevronDown className='w-4 h-4' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setSort(SortOptions.Newest)}>{t('SearchAndFilter.Sort.newest')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSort(SortOptions.Oldest)}>{t('SearchAndFilter.Sort.oldest')}</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>                
                <div className='flex flex-col gap-2 mb-5'>
                    {comments?.map((comment) => (
                        <Comment key={comment._id} comment={comment} />
                    ))}
                </div>
            </div>
        </div>
    )
}

interface CommentProps {
    content_type: CollectionNames
    creation: IContentDoc
}

interface ReplyProps {
    comment_id: string
}
function CommentForm(props: CommentProps | ReplyProps) {
    const {user} = useUser()
    const form = useForm({
        defaultValues: {
            username: user?.username || '',
            comment: '',
            rating: 0
        },
        onSubmit: async (data) => {
            if ('content_type' in props) {
                postComment(props.creation.slug, props.content_type, data.value.username, data.value.comment, user?.handle || '', data.value.rating)
                let cookie = await getCookie("RATED_" + props.creation._id)
                if(!cookie) {
                    await postRating(data.value.rating, props.creation);
                    setCookie("RATED_" + props.creation._id, "true")
                }
            }
            else {
                postReply(props.comment_id, data.value.username, data.value.comment, user?.handle || '')
            }
        },
    })

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
        }} className='flex flex-col gap-2'>
            <form.Field name="username" children={(field) => (
                <>
                    <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}} placeholder="Username" />
                    {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                </>
            )} validators={{
                onChange: ({value}) => {
                    (!value) ?
                    'Username is required' :
                    value.length < 3 ?
                    'Username must be at least 3 characters long' :
                    undefined
                },
                onSubmit: ({value}) => {
                    if(value.length < 3) {
                        return 'Username must be at least 3 characters long'
                    }
                }
            }}/>
            <form.Field name="rating" children={(field) => (
                <>
                    <Rating value={field.state.value} currentRating={field.state.value} ratings={[field.state.value]} onRate={field.handleChange}/>
                    {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                </>
            )} validators={{
                onChange: ({value}) => {
                    if(value < 0 || value > 5) {
                        return 'Rating must be between 0 and 5'
                    }
                },
                onSubmit: ({value}) => {
                    if(value < 0 || value > 5) {
                        return 'Rating must be between 0 and 5'
                    }
                }
            }}/>
            <form.Field name="comment" children={(field) => (
                <>
                    <RichText sendOnChange={(v) => {field.handleChange(v)}} initialValue={field.state.value} />
                    {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                </>
            )} validators={{
                onChange: ({value}) => {
                    (!value) ?
                    'Comment is required' :
                    value.length < 10 ?
                    'Comment must be at least 10 characters long' :
                    undefined
                },
                onSubmit: ({value}) => {
                    if(value.length < 10) {
                        return 'Comment must be at least 10 characters long'
                    }
                }
            }}/>
            <Button type="submit" className='mt-2 w-fit'><span>Submit</span></Button>
        </form>
    )
}

export function Comment({comment}: {comment: IComment}) {
    const {creator} = useCreator(comment.handle)
    const [replying, setReplying] = useState(false)
    const [showReplies, setShowReplies] = useState(false)
    const [canShowMore, setCanShowMore] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const text = useRef<HTMLDivElement>(null)
    const rating = comment.rating ? comment.rating : 0

    useEffect(() => {
        if (text.current) {
            setCanShowMore(text.current.scrollHeight > 100)
        }
    }, [text])

    return (
        <div key={comment._id} className='relative'>
            <div className='border-white/15 border-1 p-2'>
                <div className='flex flex-row gap-4'>
                    <Image src={creator?.iconURL ?? "/mcc_no_scaffold.png"} alt={comment.username} width={32} height={32} className='rounded-full w-9 h-9 object-cover mt-1'/>
                    <div>
                        <h3 className='font-bold'>{comment.username}</h3>
                        {rating > 0 && (<Rating className='my-1' value={rating} currentRating={rating} ratings={[rating]} onRate={() => {}}/>)}
                        <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(comment.comment)}} className={`max-w-xl mb-2 ${showMore ? 'line-clamp-4' : ''}`} ref={text}></div>
                        {canShowMore && <div className='text-sm text-muted-foreground cursor-pointer' onClick={() => setShowMore(!showMore)}>Show {showMore ? 'more' : 'less'}</div>}
                        <div className='flex flex-row gap-2'>
                            <Button variant="ghost" size="icon" className='w-8 h-8 text-muted-foreground' onClick={() => {likeComment(comment._id!)}}>
                                <ThumbsUpIcon className='w-4 h-4' />
                            </Button>
                            <Button variant="ghost" size="icon" className='w-8 h-8 text-muted-foreground' onClick={() => setReplying(!replying)}>
                                <span className='text-sm'>Reply</span>
                            </Button>
                        </div>
                        {replying && <CommentForm comment_id={comment._id!} />}
                        {comment.replies && comment.replies.length > 0 && <Collapsible className='' onOpenChange={() => {setReplying(false); setShowReplies(!showReplies)}}>
                            <CollapsibleTrigger className='text-sm text-primary flex flex-row gap-2 items-center p-2 cursor-pointer'>{showReplies ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}{comment.replies?.length} replies</CollapsibleTrigger>
                            <CollapsibleContent className='flex flex-col gap-2'>
                                {comment.replies.map((reply) => (
                                    <Reply key={reply._id} reply={reply} />
                                ))}
                            </CollapsibleContent>
                        </Collapsible>}
                    </div>
                </div>
            </div>
        </div>
    )
}

function Reply({reply}: {reply: IComment}) {
    const {creator} = useCreator(reply.handle)
    return (
        <div key={reply._id} className='ml-4'>
            <div className='flex flex-row gap-4'>
                <Image src={creator?.iconURL ?? "/mcc_no_scaffold.png"} alt={reply.username} width={32} height={32} className='rounded-full w-9 h-9 object-cover mt-1'/>
                <div>
                    <h3 className='font-bold'>{reply.username}</h3>
                    <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(reply.comment)}} className="max-w-xl mb-2"></div>
                </div>
            </div>
        </div>
    )
}
