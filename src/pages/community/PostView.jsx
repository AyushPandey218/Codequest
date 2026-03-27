import { useState, useEffect } from 'react'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Card from '../../components/common/Card'
import Avatar from '../../components/common/Avatar'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { useCommunity } from '../../hooks/useCommunity'
import { useAuth } from '../../context/AuthContext'

const PostView = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { fetchPost, incrementView, toggleLike, addReply, deletePost, deleteReply, toggleFlag, markAsResolved } = useCommunity()

    const [post, setPost] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, data: null })

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

    const openModal = (type, data = null) => {
        setModalConfig({ isOpen: true, type, data })
    }

    const closeModal = () => {
        setModalConfig({ isOpen: false, type: null, data: null })
    }

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

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deletePost(id)
            navigate('/app/community')
        } catch (err) {
            console.error(err)
            alert('Failed to delete post')
        } finally {
            setIsDeleting(false)
            closeModal()
        }
    }

    const handleFlag = async () => {
        try {
            await toggleFlag(id, !post.flagged)
            await loadPost() // Refresh to show flagged badge
        } catch (err) {
            console.error(err)
            alert('Failed to flag post')
        } finally {
            closeModal()
        }
    }

    const handleMarkResolved = async (replyId, replierUid) => {
        if (window.confirm('Accept this reply as the final solution? This will reward the author with 50 XP.')) {
            try {
                await markAsResolved(id, replyId, replierUid)
                await loadPost() // Refresh to show solution badge
            } catch (error) {
                console.error(error)
                alert('Failed to mark as resolved')
            }
        }
    }

    const handleDeleteReply = async (replyId) => {
        try {
            await deleteReply(id, replyId)
            await loadPost() // Refresh thread
        } catch (err) {
            console.error(err)
            alert('Failed to delete reply')
        } finally {
            closeModal()
        }
    }

    const handleReplySubmit = async (e) => {
        e.preventDefault()
        if (!user) return alert("Must be logged in to reply.")

        setIsSubmitting(true)
        try {
            await addReply(id, {
                content: replyContent,
                author: user.displayName || user.username || 'Anonymous',
                authorUid: user.uid,
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
            {user?.role === 'admin' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-red-400">shield_person</span>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Moderation Mode</h2>
                            <p className="text-xs text-red-400/70">Reviewing post context as Administrator</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs">
                        <span className="px-2 py-1 rounded bg-black/30 text-slate-400 border border-white/5 uppercase font-mono">ID: {id}</span>
                        {post?.flags > 0 && <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold uppercase">FLAGGED</span>}
                    </div>
                </div>
            )}

            <Link to={user?.role === 'admin' ? "/admin/moderation" : "/app/community"} className={`inline-flex items-center gap-2 text-sm transition-colors ${user?.role === 'admin' ? 'text-red-400 hover:text-red-300' : 'text-slate-400 hover:text-white'}`}>
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                {user?.role === 'admin' ? "Back to Moderation" : "Back to Discussions"}
            </Link>

            {/* Original Post */}
            <Card variant="elevated" className={`p-6 sm:p-8 ${user?.role === 'admin' ? 'border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]' : ''}`}>
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
                            {post.flagged && <Badge variant="warning" size="sm" icon="flag">Flagged</Badge>}
                        </div>

                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight flex-1">
                                {post.title}
                            </h1>
                            {user?.role === 'admin' && (
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => openModal('flag')}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors border border-orange-500/20"
                                        title="Flag Post"
                                    >
                                        <span className="material-symbols-outlined text-sm">flag</span>
                                        {post.flagged ? 'Flagged' : 'Flag Post'}
                                    </button>
                                    <button
                                        onClick={() => openModal('deletePost')}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
                                        title="Delete Post"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 mb-6 border-b border-white/5 pb-6">
                            <Avatar src={post.avatar} name={post.author} size="sm" className="sm:hidden" />
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-300">{post.author}</span>
                                {user?.role === 'admin' && (
                                    <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 font-mono text-slate-500">
                                        UID: {post.authorUid?.slice(0, 8)}...
                                    </span>
                                )}
                            </div>
                            <span>•</span>
                            <span>{post.timeAgo}</span>
                            {user?.role === 'admin' && <span className="text-[10px] text-slate-600">({new Date(post.createdAt?.seconds * 1000).toLocaleString()})</span>}
                            <span>•</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">visibility</span>{post.views}</span>
                        </div>

                        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed mb-8 whitespace-pre-wrap">
                            {post.content}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/5">
                            <button
                                onClick={handleLikeToggle}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${hasLiked
                                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <span className={hasLiked ? "material-symbols-outlined fill-current" : "material-symbols-outlined"}>favorite</span>
                                <span>{post.likes} {post.likes === 1 ? 'Like' : 'Likes'}</span>
                            </button>
                            <div className="flex items-center gap-2 text-sm text-slate-500 px-3 py-2">
                                <span className="material-symbols-outlined">chat</span>
                                <span>{post.repliesCount} {post.repliesCount === 1 ? 'Reply' : 'Replies'}</span>
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
                        {post.replyList.map(reply => {
                            const isAccepted = post.acceptedReplyId === reply.id
                            return (
                                <Card
                                    key={reply.id}
                                    className={`p-5 sm:p-6 transition-all duration-300 ${isAccepted
                                        ? 'bg-green-500/5 ring-1 ring-green-500/30'
                                        : 'bg-[#161632]'
                                        } ${user?.role === 'admin' ? 'border-red-500/10 hover:border-red-500/20' : ''}`}
                                >
                                    <div className="flex gap-4">
                                        <Avatar src={reply.avatar} name={reply.author} size="md" />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="font-bold text-slate-200">{reply.author}</span>
                                                    <span className="text-slate-500">•</span>
                                                    <span className="text-slate-500 text-xs">{reply.timeAgo}</span>
                                                    {isAccepted && (
                                                        <Badge variant="success" size="sm" icon="check_circle" className="ml-2">
                                                            Solution
                                                        </Badge>
                                                    )}
                                                </div>

                                                 <div className="flex items-center gap-2">
                                                    {user?.uid === post.authorUid && !post.acceptedReplyId && (
                                                        <button
                                                            onClick={() => handleMarkResolved(reply.id, reply.authorUid)}
                                                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-green-400 border border-green-500/20 hover:bg-green-500/10 transition-colors"
                                                            title="Mark as Solution"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">task_alt</span>
                                                            Accept Solution
                                                        </button>
                                                    )}
                                                    {user?.role === 'admin' && (
                                                        <button
                                                            onClick={() => openModal('deleteReply', reply.id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
                                                            title="Delete Reply"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">delete</span>
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                {reply.content}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
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

            {/* Confirmation Modals */}
            <ConfirmationModal
                isOpen={modalConfig.isOpen && modalConfig.type === 'deletePost'}
                onClose={closeModal}
                onConfirm={handleDelete}
                title="Delete Post?"
                message="This will permanently remove the entire thread and all replies. This action cannot be undone."
                confirmText="Delete Post"
                variant="danger"
            />

            <ConfirmationModal
                isOpen={modalConfig.isOpen && modalConfig.type === 'deleteReply'}
                onClose={closeModal}
                onConfirm={() => handleDeleteReply(modalConfig.data)}
                title="Delete Reply?"
                message="Are you sure you want to remove this response from the thread?"
                confirmText="Delete Reply"
                variant="danger"
            />

            <ConfirmationModal
                isOpen={modalConfig.isOpen && modalConfig.type === 'flag'}
                onClose={closeModal}
                onConfirm={handleFlag}
                title={post?.flagged ? "Unflag Post?" : "Flag Post?"}
                message={post?.flagged
                    ? "This will remove the safety flag and mark the content as reviewed."
                    : "This will flag the post for moderator review and mark it as potentially problematic."
                }
                confirmText={post?.flagged ? "Unflag Content" : "Flag Content"}
                variant={post?.flagged ? "info" : "warning"}
            />
        </div>
    )
}

export default PostView
