import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Avatar from '../../components/common/Avatar'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { useCommunity } from '../../hooks/useCommunity'
import { useAuth } from '../../context/AuthContext'

const PostView = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const { fetchPost, incrementView, toggleLike, addReply } = useCommunity()

    const [post, setPost] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Reply Form
    const [replyContent, setReplyContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const loadPost = async () => {
        setIsLoading(true)
        const data = await fetchPost(id)
        if (data) {
            setPost(data)
            await incrementView(id)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        loadPost()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const handleLikeToggle = async () => {
        if (!user) return alert("Must be logged in to like posts.")
        const isCurrentlyLiked = post.likedBy.includes(user.uid)

        // Optimistic UI Update
        setPost(prev => ({
            ...prev,
            likes: isCurrentlyLiked ? prev.likes - 1 : prev.likes + 1,
            likedBy: isCurrentlyLiked
                ? prev.likedBy.filter(uId => uId !== user.uid)
                : [...prev.likedBy, user.uid]
        }))

        await toggleLike(id, user.uid, !isCurrentlyLiked)
    }

    const handleReplySubmit = async (e) => {
        e.preventDefault()
        if (!user) return alert("Must be logged in to reply.")

        setIsSubmitting(true)
        try {
            await addReply(id, {
                content: replyContent,
                author: user.displayName || user.username || 'Anonymous',
                avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`
            })
            setReplyContent('')
            await loadPost() // Refresh thread to show new reply
        } catch (error) {
            console.error(error)
            alert("Failed to submit reply")
        }
        setIsSubmitting(false)
    }

    if (isLoading) {
        return (
            <div className="max-w-[1000px] mx-auto p-12 text-center text-slate-500 animate-pulse">
                Loading post discussion...
            </div>
        )
    }

    if (!post) {
        return (
            <div className="max-w-[1000px] mx-auto p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-600 mb-4 block">sentiment_dissatisfied</span>
                <h2 className="text-2xl font-bold text-white mb-2">Post Not Found</h2>
                <Link to="/app/community" className="text-blue-400 hover:underline">Return to Forum</Link>
            </div>
        )
    }

    const hasLiked = user && post.likedBy.includes(user.uid)

    return (
        <div className="max-w-[1000px] mx-auto space-y-6">
            <Link to="/app/community" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Discussions
            </Link>

            {/* Original Post */}
            <Card variant="elevated" className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="shrink-0 hidden sm:block">
                        <Avatar src={post.avatar} name={post.author} size="xl" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge variant="primary" size="sm" className="capitalize">{post.category}</Badge>
                            {post.tags.map(t => (
                                <span key={t} className="px-2 py-0.5 rounded text-xs bg-white/5 text-slate-400 border border-white/10">#{t}</span>
                            ))}
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-3 text-sm text-slate-400 mb-6 border-b border-white/5 pb-6">
                            <Avatar src={post.avatar} name={post.author} size="sm" className="sm:hidden" />
                            <span className="font-medium text-slate-300">{post.author}</span>
                            <span>•</span>
                            <span>{post.timeAgo}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">visibility</span>{post.views}</span>
                        </div>

                        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed mb-8 whitespace-pre-wrap">
                            {post.content}
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                            <button
                                onClick={handleLikeToggle}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${hasLiked ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                                    }`}
                            >
                                <span className={hasLiked ? "material-symbols-outlined fill-current" : "material-symbols-outlined"}>favorite</span>
                                {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
                            </button>
                            <div className="flex items-center gap-2 text-sm text-slate-500 px-4 py-2 border border-transparent">
                                <span className="material-symbols-outlined">chat</span>
                                {post.repliesCount} {post.repliesCount === 1 ? 'Reply' : 'Replies'}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Replies Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white px-2">Responses ({post.repliesCount})</h3>

                {post.replyList.length === 0 ? (
                    <Card className="p-12 text-center border-dashed border-white/10 bg-transparent">
                        <p className="text-slate-500">No replies yet. Be the first to share your thoughts!</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {post.replyList.map(reply => (
                            <Card key={reply.id} className="p-5 sm:p-6 bg-[#161632]">
                                <div className="flex gap-4">
                                    <Avatar src={reply.avatar} name={reply.author} size="md" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-sm mb-2">
                                            <span className="font-bold text-slate-200">{reply.author}</span>
                                            <span className="text-slate-500">•</span>
                                            <span className="text-slate-500 text-xs">{reply.timeAgo}</span>
                                        </div>
                                        <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                            {reply.content}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Reply Form */}
            <Card variant="elevated" className="p-6 border-blue-500/20 bg-blue-500/[0.02]">
                {user ? (
                    <form onSubmit={handleReplySubmit} className="flex gap-4">
                        <div className="hidden sm:block shrink-0">
                            <Avatar src={user.photoURL} name={user.displayName || 'You'} size="md" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <textarea
                                required
                                rows={3}
                                value={replyContent}
                                onChange={e => setReplyContent(e.target.value)}
                                placeholder="Add to the discussion..."
                                className="w-full px-4 py-3 rounded-xl bg-[#12122a] border border-white/10 text-white focus:outline-none focus:border-blue-500/50 resize-none"
                            />
                            <div className="flex justify-end">
                                <Button type="submit" variant="primary" disabled={isSubmitting || !replyContent.trim()}>
                                    {isSubmitting ? 'Posting...' : 'Post Reply'}
                                </Button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-slate-400 mb-3">Join the discussion to share your insights.</p>
                        <Link to="/auth/login"><Button variant="outline">Log in to Reply</Button></Link>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default PostView
