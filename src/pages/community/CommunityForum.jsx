import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'

const CommunityForum = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', label: 'All Topics', icon: 'forum', count: 234 },
    { id: 'help', label: 'Help & Support', icon: 'help', count: 56 },
    { id: 'discussion', label: 'General Discussion', icon: 'chat', count: 89 },
    { id: 'showcase', label: 'Showcase', icon: 'stars', count: 45 },
    { id: 'tips', label: 'Tips & Tricks', icon: 'lightbulb', count: 44 },
  ]

  const posts = [
    {
      id: 1,
      title: 'How to approach dynamic programming problems?',
      author: 'CodeSeeker',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seeker',
      category: 'help',
      replies: 23,
      views: 342,
      likes: 45,
      timeAgo: '2 hours ago',
      tags: ['algorithms', 'dynamic-programming'],
      hasAnswer: true,
    },
    {
      id: 2,
      title: 'My first completed project! 🎉',
      author: 'DevNewbie',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=newbie',
      category: 'showcase',
      replies: 15,
      views: 189,
      likes: 67,
      timeAgo: '5 hours ago',
      tags: ['javascript', 'react', 'project'],
      hasAnswer: false,
    },
    {
      id: 3,
      title: 'Best practices for code optimization',
      author: 'PerformanceGuru',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guru',
      category: 'tips',
      replies: 31,
      views: 567,
      likes: 89,
      timeAgo: '1 day ago',
      tags: ['optimization', 'best-practices'],
      hasAnswer: true,
    },
    {
      id: 4,
      title: 'Error handling in Python: try-except vs assertions',
      author: 'PyDeveloper',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pydev',
      category: 'discussion',
      replies: 18,
      views: 234,
      likes: 34,
      timeAgo: '2 days ago',
      tags: ['python', 'error-handling'],
      hasAnswer: true,
    },
    {
      id: 5,
      title: 'Need help with binary search tree implementation',
      author: 'AlgoStudent',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
      category: 'help',
      replies: 12,
      views: 156,
      likes: 23,
      timeAgo: '3 days ago',
      tags: ['data-structures', 'trees'],
      hasAnswer: false,
    },
  ]

  const trendingTopics = [
    { tag: 'algorithms', count: 156 },
    { tag: 'python', count: 134 },
    { tag: 'javascript', count: 123 },
    { tag: 'react', count: 98 },
    { tag: 'dynamic-programming', count: 87 },
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
        <Button variant="primary" icon="add">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category.id
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
          {filteredPosts.map(post => (
            <Card key={post.id} variant="elevated" hover className="p-6">
              <div className="flex gap-4">
                <Avatar src={post.avatar} name={post.author} size="lg" />
                
                <div className="flex-1 min-w-0">
                  {/* Post Header */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-primary transition-colors cursor-pointer mb-1">
                        {post.title}
                      </h3>
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

                  {/* Stats */}
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
                  1,234
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-text-secondary">
                  Active Users
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  567
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-text-secondary">
                  Today's Posts
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  23
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
    </div>
  )
}

export default CommunityForum
