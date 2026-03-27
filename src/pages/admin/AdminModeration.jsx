import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReports } from '../../hooks/useReports'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import { useCommunity } from '../../hooks/useCommunity'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import LoadingScreen from '../../components/common/LoadingScreen'
import Card from '../../components/common/Card'

const AdminModeration = () => {
    const { reports, isLoading: reportsLoading, resolveReport } = useReports()
    const { posts, isLoading: communityLoading, deletePost, deleteReply, toggleFlag } = useCommunity()
    const [tab, setTab] = useState('pending')
    const [search, setSearch] = useState('')
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, data: null })

    const openModal = (type, data = null) => {
        setModalConfig({ isOpen: true, type, data })
    }

    const closeModal = () => {
        setModalConfig({ isOpen: false, type: null, data: null })
    }

    const handleDeletePost = async (postId) => {
        try {
            await deletePost(postId)
            closeModal()
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteReply = async (postId, replyId) => {
        try {
            await deleteReply(postId, replyId)
            closeModal()
        } catch (error) {
            console.error(error)
        }
    }

    const handleUnflag = async (reportId, isPost = false) => {
        try {
            await resolveReport(reportId, 'unflag', isPost)
            closeModal()
        } catch (error) {
            console.error(error)
        }
    }

    const handleKeep = async (reportId, isPost = false) => {
        try {
            await resolveReport(reportId, 'keep', isPost)
            closeModal()
        } catch (error) {
            console.error(error)
        }
    }

    const isLoading = reportsLoading || communityLoading

    const filteredReports = reports.filter(r => 
        r.status === tab && 
        (r.content?.toLowerCase().includes(search.toLowerCase()) || 
         r.reason?.toLowerCase().includes(search.toLowerCase()))
    )

    const filteredPosts = posts.filter(p => 
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.author?.toLowerCase().includes(search.toLowerCase())
    )

    if (isLoading && (reports.length === 0 || posts.length === 0)) return <LoadingScreen />

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Community Moderation</h1>
                    <p className="text-slate-400">Monitor reports and manage community content</p>
                </div>
                
                <div className="flex bg-[#161632] p-1 rounded-xl border border-white/5 self-start">
                    <button 
                        onClick={() => setTab('pending')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'pending' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
                    >
                        Pending Reports ({reports.filter(r => r.status === 'pending').length})
                    </button>
                    <button 
                        onClick={() => setTab('all_posts')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'all_posts' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
                    >
                        All Posts
                    </button>
                    <button 
                        onClick={() => setTab('resolved')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'resolved' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
                    >
                        Archive
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                <input 
                    type="text" 
                    placeholder={tab === 'all_posts' ? "Search posts by title or author..." : "Search reports..."}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#161632] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all shadow-xl"
                />
            </div>

            {/* Content Tabs */}
            <div className="space-y-4">
                {tab === 'all_posts' ? (
                    <Card className="overflow-hidden border-white/5">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-white/5">
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Post Title</th>
                                        <th className="px-6 py-4">Author</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredPosts.map((post) => (
                                        <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {post.flagged ? (
                                                    <Badge variant="warning" size="sm" icon="flag">Flagged</Badge>
                                                ) : (
                                                    <Badge variant="success" size="sm" icon="check_circle">Active</Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link to={`/admin/moderation/post/${post.id}`} className="text-sm font-bold text-white hover:text-blue-400 transition-colors block max-w-xs truncate">
                                                    {post.title}
                                                </Link>
                                                <span className="text-[10px] text-slate-500 uppercase tracking-tight">{post.category}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Avatar src={post.avatar} name={post.author} size="xs" />
                                                    <span className="text-sm text-slate-300">{post.author}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {post.createdAt?.seconds ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link 
                                                        to={`/admin/moderation/post/${post.id}`}
                                                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                                                        title="View Thread"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">forum</span>
                                                    </Link>
                                                    <button 
                                                        onClick={() => toggleFlag(post.id, !post.flagged)}
                                                        className={`p-2 rounded-lg transition-all ${post.flagged ? 'text-orange-400 hover:bg-orange-400/10' : 'text-slate-500 hover:bg-white/5'}`}
                                                        title={post.flagged ? "Unflag Post" : "Flag Post"}
                                                    >
                                                        <span className="material-symbols-outlined text-lg">{post.flagged ? 'check_circle' : 'flag'}</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => openModal('deletePost', post.id)}
                                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                        title="Delete Post"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {filteredReports.map((report) => (
                            <Card key={report.id} className="p-6 border-white/5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${report.isPost ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                            <span className="material-symbols-outlined">{report.isPost ? 'article' : 'reply'}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{report.isPost ? 'Post Report' : 'Reply Report'}</p>
                                            <p className="text-sm text-slate-300">Reason: <span className="text-red-400 font-medium">{report.reason}</span></p>
                                        </div>
                                    </div>
                                    <Badge variant={report.status === 'pending' ? 'warning' : 'success'} size="sm">
                                        {report.status.toUpperCase()}
                                    </Badge>
                                </div>

                                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-tight">Reported Content Snippet:</p>
                                    <p className="text-sm text-slate-300 italic leading-relaxed">"{report.content}"</p>
                                    
                                    {report.isPost && (
                                        <Link 
                                            to={`/admin/moderation/post/${report.id}`} 
                                            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline mt-3"
                                        >
                                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                                            View Full Thread with Replies
                                        </Link>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <Avatar src={report.authorAvatar} name={report.authorName} size="xs" />
                                        <div className="text-[10px]">
                                            <p className="text-slate-300 font-bold leading-none">{report.authorName}</p>
                                            <p className="text-slate-500">{report.timeAgo}</p>
                                        </div>
                                    </div>
                                    
                                    {report.status === 'pending' && (
                                        <div className="flex gap-2 shrink-0">
                                            <button 
                                                onClick={() => openModal('unflag', { id: report.id, isPost: report.isPost })}
                                                className="flex-1 py-2 px-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl text-xs font-bold border border-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                                Unflag
                                            </button>
                                            <button 
                                                onClick={() => openModal('keep', { id: report.id, isPost: report.isPost })}
                                                className="flex-1 py-2 px-3 bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 rounded-xl text-xs font-bold border border-slate-500/20 transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <span className="material-symbols-outlined text-sm">visibility</span>
                                                Keep
                                            </button>
                                            <button 
                                                onClick={() => openModal(report.isPost ? 'deletePost' : 'deleteReply', report.isPost ? report.id : { postId: report.postId, replyId: report.id })}
                                                className="flex-1 py-2 px-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-bold border border-red-500/20 transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}

                        {filteredReports.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-500">
                                No {tab} reports found.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Confirmation Modals */}
            <ConfirmationModal
                isOpen={modalConfig.isOpen && modalConfig.type === 'deletePost'}
                onClose={closeModal}
                onConfirm={() => handleDeletePost(modalConfig.data)}
                title="Delete Post?"
                message="This will permanently remove the entire thread and all replies. This action cannot be undone."
                confirmText="Delete Post"
                variant="danger"
            />

            <ConfirmationModal
                isOpen={modalConfig.isOpen && modalConfig.type === 'deleteReply'}
                onClose={closeModal}
                onConfirm={() => handleDeleteReply(modalConfig.data.postId, modalConfig.data.replyId)}
                title="Delete Reply?"
                message="Are you sure you want to remove this response from the thread?"
                confirmText="Delete Reply"
                variant="danger"
            />

            <ConfirmationModal
                isOpen={modalConfig.isOpen && modalConfig.type === 'unflag'}
                onClose={closeModal}
                onConfirm={() => handleUnflag(modalConfig.data.id, modalConfig.data.isPost)}
                title="Unflag Content?"
                message="This will remove the safety flag and mark the content as reviewed and safe."
                confirmText="Unflag Content"
                variant="info"
            />

            <ConfirmationModal
                isOpen={modalConfig.isOpen && modalConfig.type === 'keep'}
                onClose={closeModal}
                onConfirm={() => handleKeep(modalConfig.data.id, modalConfig.data.isPost)}
                title="Dismiss Report?"
                message="This will mark the report as handled without taking any action on the content."
                confirmText="Dismiss Report"
                variant="info"
            />
        </div>
    )
}

export default AdminModeration
