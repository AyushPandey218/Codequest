import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'
import { useCommunity } from '../../hooks/useCommunity'
import { useAuth } from '../../context/AuthContext'

const CommunityForum = () => {
  const { user } = useAuth()
  const { posts, trendingTopics, stats, isLoading, createPost } = useCommunity()

  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // New Post Form State
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'discussion', tags: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePostSubmit = async (e) => {
    e.preventDefault()
    if (!user) return alert('Must be logged in to post!')
    setIsSubmitting(true)
    try {
      await createPost({
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        author: user.displayName || user.username || 'Anonymous',
        tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean),
      })
      setIsModalOpen(false)
      setNewPost({ title: '', content: '', category: 'discussion', tags: '' })
    } catch (error) {
      console.error(error)
      alert("Failed to create post")
    }
    setIsSubmitting(false)
  }

  // Calculate dynamic category counts
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return posts.length
    return posts.filter(p => p.category === categoryId).length
  }

  const categories = [
    { id: 'all', label: 'All Topics', icon: 'forum', count: getCategoryCount('all') },
    { id: 'help', label: 'Help & Support', icon: 'help', count: getCategoryCount('help') },
    { id: 'discussion', label: 'General Discussion', icon: 'chat', count: getCategoryCount('discussion') },
    { id: 'showcase', label: 'Showcase', icon: 'stars', count: getCategoryCount('showcase') },
    { id: 'tips', label: 'Tips & Tricks', icon: 'lightbulb', count: getCategoryCount('tips') },
  ]

  const filteredPosts = posts.filter(post =>
    (activeCategory === 'all' || post.category === activeCategory) &&
    (searchQuery === '' || post.title.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Community Forum 💬
          </h1>
          <p className="text-slate-600 dark:text-text-secondary mt-1">
            Ask questions, share knowledge, and connect with fellow coders
          </p>
        </div>
        <Button variant="primary" icon="add" onClick={() => setIsModalOpen(true)}>
          New Post
        </Button>
      </div>

      {/* Search & Categories */}
      <Card variant="elevated" className="p-6">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#282839] border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-[#282839] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#323267]'
                  }`}
              >
                <span className="material-symbols-outlined text-lg">{category.icon}</span>
                {category.label}
                <Badge variant={activeCategory === category.id ? 'default' : 'default'} size="sm">
                  {category.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <Card variant="elevated" className="p-12 text-center text-slate-500 animate-pulse">Loading posts...</Card>
          ) : (
            <>
              {filteredPosts.map(post => (
                <Card key={post.id} variant="elevated" hover className="p-6">
                  <div className="flex gap-4">
                    <Avatar src={post.avatar} name={post.author} size="lg" />

                    <div className="flex-1 min-w-0">
                      {/* Post Header */}
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <Link to={`/app/community/post/${post.id}`}>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-primary transition-colors cursor-pointer mb-1">
                              {post.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-text-secondary">
                            <span className="font-medium">{post.author}</span>
                            <span>•</span>
                            <span>{post.timeAgo}</span>
                          </div>
                        </div>
                        {post.hasAnswer && (
                          <Badge variant="success" size="sm" icon="check_circle">
                            Answered
                          </Badge>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-md bg-slate-100 dark:bg-[#282839] text-slate-600 dark:text-slate-300 text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats & Actions */}
                      <div className="flex items-center justify-between mt-1 border-t border-slate-100 dark:border-[#323267] pt-3">
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-text-secondary">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-lg">chat</span>
                            <span>{post.replies} replies</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-lg">visibility</span>
                            <span>{post.views} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-lg">favorite</span>
                            <span>{post.likes} likes</span>
                          </div>
                        </div>
                        <Link to={`/app/community/post/${post.id}`}>
                          <Button variant="outline" size="sm">View Thread</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {filteredPosts.length === 0 && (
                <Card variant="elevated" className="p-12 text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4 block">
                    search_off
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    No posts found
                  </h3>
                  <p className="text-slate-600 dark:text-text-secondary">
                    Try adjusting your search or filters
                  </p>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <Card variant="elevated" className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500">trending_up</span>
              Trending Topics
            </h3>
            <div className="space-y-2">
              {!isLoading && trendingTopics.length === 0 && (
                <p className="text-sm text-slate-500">No trending topics yet.</p>
              )}
              {trendingTopics.map((topic, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#282839] transition-all text-left"
                >
                  <span className="font-medium text-slate-900 dark:text-white">
                    #{topic.tag}
                  </span>
                  <Badge variant="default" size="sm">
                    {topic.count}
                  </Badge>
                </button>
              ))}
            </div>
          </Card>

          {/* Forum Stats */}
          <Card variant="elevated" className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Forum Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-text-secondary">
                  Total Posts
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {stats.totalPosts}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-text-secondary">
                  Active Users
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {stats.activeUsers}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-text-secondary">
                  Today's Posts
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {stats.todaysPosts}
                </span>
              </div>
            </div>
          </Card>

          {/* Guidelines */}
          <Card variant="elevated" className="p-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500">info</span>
              Community Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>• Be respectful and constructive</li>
              <li>• Search before posting</li>
              <li>• Use clear, descriptive titles</li>
              <li>• Add relevant tags</li>
              <li>• Mark solved topics</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* New Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card variant="elevated" className="w-full max-w-lg p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Create New Post</h2>

            {!user ? (
              <div className="text-center py-6">
                <p className="text-slate-400 mb-4">You must be logged in to create a post.</p>
                <Link to="/auth/login">
                  <Button variant="primary">Go to Login</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    required
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-[#282839] border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. Need help with dynamic programming"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-[#282839] border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="discussion">General Discussion</option>
                    <option value="help">Help & Support</option>
                    <option value="showcase">Showcase</option>
                    <option value="tips">Tips & Tricks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-[#282839] border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. react, algorithm, bug"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content</label>
                  <textarea
                    required
                    rows={4}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-[#282839] border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Describe your issue or share your thoughts here..."
                  />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Posting...' : 'Create Post'}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}

export default CommunityForum
