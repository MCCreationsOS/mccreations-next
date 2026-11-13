import { deleteComment, postComment, postReply } from '@/app/api/community'
import { useComments } from '@/app/api/hooks/comments'
import { useCreator, useToken, useUser } from '@/app/api/hooks/users'
import { CollectionNames, IComment, IContentDoc, SortOptions, UserTypes } from '@/app/api/types'
import RichText from '@/components/RichText/RichText'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import {useForm} from '@tanstack/react-form'
import { ChevronDown, ChevronUp, MoreHorizontalIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Rating, { submitRating } from './Rating'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { CreatorAvatar } from '@/app/[locale]/create/formElements'

export default function Comments({creation, collection}: {creation: IContentDoc, collection: CollectionNames}) {
    const [sort, setSort] = useState(SortOptions.Newest)
    const {comments, setComments, hasMore, loadMore, isLoadingMore} = useComments(creation.slug, collection, sort);
    const t = useTranslations();

    return (
        <div>
            <h2 className="text-2xl font-bold my-2">{t('Components.Creations.Page.Comments.title')}</h2>
            <CommentForm content_type={collection} creation={creation} setComments={setComments} comments={comments} sort={sort} />
            <div>
                <div className='flex flex-row gap-2 w-full'>
                    <h2 className="text-2xl font-bold my-2">{t('comment', {count: 2})}</h2>
                    <div className='flex-1 flex flex-row gap-2 justify-end'>    
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className='text-muted-foreground'>
                                    <span>{t(`Components.Creations.Search.Sort.${sort}`)}</span>
                                    <ChevronDown className='w-4 h-4' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                                    <DropdownMenuItem onClick={() => setSort(SortOptions.Newest)}>{t('Components.Creations.Search.Sort.newest')}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSort(SortOptions.Oldest)}>{t('Components.Creations.Search.Sort.oldest')}</DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>                
                <div className='flex flex-col gap-2 mb-5'>
                    {comments?.map((comment) => (
                        <Comment key={comment._id} comment={comment} setComments={setComments} comments={comments} sort={sort} />
                    ))}
                    {hasMore && <Button type="button" variant="secondary" className='w-fit' disabled={isLoadingMore} onClick={() => loadMore()}>
                        {t('Components.Creations.Page.Comments.load_more')}
                    </Button>}
                </div>
            </div>
        </div>
    )
}

interface CommentProps {
    content_type: CollectionNames
    creation: IContentDoc
    setComments: (comments: IComment[]) => void
    comments: IComment[] | undefined
    sort: SortOptions
}

interface ReplyProps {
    comment_id: string
    setComments?: (comments: IComment[]) => void
    comments?: IComment[] | undefined
    sort?: SortOptions
}
function CommentForm(props: CommentProps | ReplyProps) {
    const t = useTranslations()
    const {user} = useUser()
    const {token} = useToken()
    const richTextResetRef = useRef<{ reset: () => void }>(null)
    // Signed-in users always post under their own name
    const signedIn = !!user?.username

    const form = useForm({
        defaultValues: {
            username: user?.username || '',
            comment: '',
            rating: 0
        },
        onSubmit: async (data) => {
            const username = signedIn ? user!.username : data.value.username
            if ('content_type' in props) {
                const newComment = await postComment(props.creation.slug, props.content_type, username, data.value.comment, user?.handle || '', data.value.rating, token)
                if (!newComment) {
                    toast.error(t('Components.Creations.Page.Comments.post_error'))
                    return
                }
                toast.success(t('Components.Creations.Page.Comments.posted'))

                // Add the new comment to the list immediately
                if (props.comments && props.setComments) {
                    props.setComments([newComment, ...props.comments]);
                }

                // Only submit a rating if the commenter actually picked stars (0 means "no rating")
                if (data.value.rating > 0) {
                    await submitRating(data.value.rating, props.creation)
                }
            }
            else {
                const newReply = await postReply(props.comment_id, username, data.value.comment, user?.handle || '', token)
                if (!newReply) {
                    toast.error(t('Components.Creations.Page.Comments.post_error'))
                    return
                }

                // Add the new reply to the appropriate comment
                if (props.comments && props.setComments) {
                    const updatedComments = props.comments.map(comment => {
                        if (comment._id === props.comment_id) {
                            return {
                                ...comment,
                                replies: [...(comment.replies || []), newReply]
                            };
                        }
                        return comment;
                    });
                    props.setComments(updatedComments);
                }
            }
            form.reset({ username: user?.username || data.value.username, comment: '', rating: 0 });
            // Reset the RichText editor
            richTextResetRef.current?.reset();
        },
    })

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
        }} className='flex flex-col gap-2'>
            {signedIn && <p className='text-sm text-muted-foreground'>{t('Components.Creations.Page.Comments.posting_as', {username: user!.username})}</p>}
            {!signedIn && <form.Field name="username" children={(field) => (
                <>
                    <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}} placeholder={t('Components.Creations.Page.Comments.username_placeholder')} />
                    {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                </>
            )} validators={{
                onChange: ({value}) => {
                    if(!value) {
                        return t('Components.Creations.Page.Comments.username_required')
                    }
                    if(value.length < 3) {
                        return t('Components.Creations.Page.Comments.username_too_short')
                    }
                    return undefined
                },
                onSubmit: ({value}) => {
                    if(value.length < 3) {
                        return t('Components.Creations.Page.Comments.username_too_short')
                    }
                }
            }}/>}
            {'content_type' in props && <form.Field name="rating" children={(field) => (
                <>
                    <Rating value={field.state.value} currentRating={field.state.value} ratings={[field.state.value]} onRate={field.handleChange}/>
                    {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                </>
            )} validators={{
                onChange: ({value}) => {
                    if(value < 0 || value > 5) {
                        return t('Components.Creations.Page.Comments.rating_out_of_range')
                    }
                },
                onSubmit: ({value}) => {
                    if(value < 0 || value > 5) {
                        return t('Components.Creations.Page.Comments.rating_out_of_range')
                    }
                }
            }}/>}
            <form.Field name="comment" children={(field) => (
                <>
                    <RichText sendOnChange={(v) => {field.handleChange(v)}} resetRef={richTextResetRef}/>
                    {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                </>
            )} validators={{
                onChange: ({value}) => {
                    if(!value) {
                        return t('Components.Creations.Page.Comments.comment_required')
                    }
                    if(value.length < 10) {
                        return t('Components.Creations.Page.Comments.comment_too_short')
                    }
                    return undefined
                },
                onSubmit: ({value}) => {
                    if(value.length < 10) {
                        return t('Components.Creations.Page.Comments.comment_too_short')
                    }
                }
            }}/>
            <form.Subscribe selector={(state) => state.isSubmitting} children={(isSubmitting) => (
                <Button type="submit" className='mt-2 w-fit' disabled={isSubmitting}><span>{t('Components.Creations.Page.Comments.send')}</span></Button>
            )}/>
        </form>
    )
}

export function Comment({comment, setComments, comments, sort}: {
    comment: IComment
    setComments?: (comments: IComment[]) => void
    comments?: IComment[]
    sort?: SortOptions
}) {
    const {creator} = useCreator(comment.handle)
    const {user} = useUser()
    const {token} = useToken()
    const [replying, setReplying] = useState(false)
    const [showReplies, setShowReplies] = useState(false)
    const [canShowMore, setCanShowMore] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const text = useRef<HTMLDivElement>(null)
    const rating = comment.rating ? comment.rating : 0
    const t = useTranslations()

    useEffect(() => {
        if (text.current) {
            // line-clamp hides the overflow, so compare the full height with the visible height
            setCanShowMore(text.current.scrollHeight > text.current.clientHeight + 1)
        }
    }, [comment.comment])

    const handleCopy = () => {
        navigator.clipboard.writeText(`${window.location.origin}/comments/${comment._id}`)
        toast.success(t('Components.Creations.Page.Comments.permalink_copied'))
    }

    const handleDelete = () => {
        deleteComment(comment._id!, token).then(() => {
            toast.success(t('Components.Creations.Page.Comments.deleted'))
            setComments?.(comments?.filter((c) => c._id !== comment._id) ?? [])
        }).catch((error) => {
            console.error(error)
            toast.error(t('Components.Creations.Page.Comments.delete_error'))
        })
    }

    return (
        <div key={comment._id} className='relative'>
            <div className='border-white/15 border-1 p-2'>
                <div className='flex flex-row gap-4 items-start'>
                    <CreatorAvatar creator={creator ?? {username: comment.username, handle: comment.handle}} size={10} />
                    <div>
                        <h3 className='font-bold'>{comment.username}</h3>
                        {rating > 0 && (<Rating className='my-1' value={rating} currentRating={rating} ratings={[rating]} onRate={() => {}} canChange={false}/>)}
                        <div dangerouslySetInnerHTML={{__html: comment.comment}} className={`max-w-xl mb-2 ${showMore ? '' : 'line-clamp-4'}`} ref={text}></div>
                        {canShowMore && <div className='text-sm text-muted-foreground cursor-pointer' onClick={() => setShowMore(!showMore)}>{showMore ? t('Components.Creations.Page.Comments.collapse') : t('Components.Creations.Page.Comments.expand')}</div>}
                        <div className='flex flex-row gap-2'>
                            {/* <Button variant="ghost" size="icon" className='w-8 h-8 text-muted-foreground' onClick={() => {likeComment(comment._id!)}}>
                                <ThumbsUpIcon className='w-4 h-4' />
                            </Button> */}
                            <Button variant="ghost" size="icon" className='w-8 h-8 text-muted-foreground' onClick={() => setReplying(!replying)}>
                                <span className='text-sm'>{t('Components.Creations.Page.Comments.reply')}</span>
                            </Button>
                        </div>
                        {replying && setComments && comments && sort && <CommentForm comment_id={comment._id!} setComments={setComments} comments={comments} sort={sort} />}
                        {comment.replies && comment.replies.length > 0 && <Collapsible className='' onOpenChange={() => {setReplying(false); setShowReplies(!showReplies)}}>
                            <CollapsibleTrigger className='text-sm text-primary flex flex-row gap-2 items-center p-2 cursor-pointer'>{showReplies ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}{t('Components.Creations.Page.Comments.replies', {count: comment.replies?.length})}</CollapsibleTrigger>
                            <CollapsibleContent className='flex flex-col gap-2'>
                                {comment.replies.map((reply) => (
                                    <Reply key={reply._id} reply={reply} />
                                ))}
                            </CollapsibleContent>
                        </Collapsible>}
                    </div>
                    <div className='flex-1 flex flex-row gap-2 justify-end items-center'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontalIcon className='w-4 h-4' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <div className="flex flex-col gap-2 border-2 border-white/15 p-1">
                                <DropdownMenuItem onClick={handleCopy}>{t('Components.Creations.Page.Comments.permalink')}</DropdownMenuItem>
                                {user && ((!!comment.handle && user.handle === comment.handle) || user.type === UserTypes.Admin) && (
                                    <DropdownMenuItem onClick={handleDelete}>{t('Components.Creations.Page.Comments.delete')}</DropdownMenuItem>
                                )}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                <CreatorAvatar creator={creator ?? {username: reply.username, handle: reply.handle}} size={10} />
                <div>
                    <h3 className='font-bold'>{reply.username}</h3>
                    <div dangerouslySetInnerHTML={{__html: reply.comment}} className="max-w-xl mb-2"></div>
                </div>
            </div>
        </div>
    )
}
