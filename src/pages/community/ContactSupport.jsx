import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

/**
 * Contact Support Page - Premium Revamp
 * Features Quick Channels and ticket submission functionality
 */
const ContactSupport = () => {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.displayName || user?.username || 'Alex Dev',
    studentId: 'STD-88392',
    issueType: '',
    description: '',
    attachments: []
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'description' && value.length > 500) return
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1200))
    setIsSubmitting(false)
    alert('Support request deployed! 🚀 Check your inbox for updates.')
  }

  const quickChannels = [
    {
      title: 'Knowledge Base',
      desc: 'Browse common bugs, syntax errors & fixes in our documentation.',
      icon: 'menu_book',
      link: '#',
      external: true
    },
    {
      title: 'Community Discord',
      desc: 'Ask fellow students and mentors in the #help channel.',
      icon: 'chat_bubble',
      link: '#',
      external: true
    },
    {
      title: 'Live Chat',
      desc: 'Chat with a support agent. Available 9am-5pm PST.',
      icon: 'smart_toy',
      online: true
    }
  ]

  return (
    <div className="max-w-[1280px] mx-auto p-4 lg:p-12 min-h-screen bg-background-dark text-white selection:bg-primary/30">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-8 uppercase tracking-widest animate-fade-in">
        <Link to="/app/dashboard" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <Link to="/app/support" className="hover:text-primary transition-colors">Support</Link>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <span className="text-slate-300">Contact</span>
      </div>

      {/* Hero Header */}
      <div className="mb-14 animate-slide-in-top">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">Stuck on a Quest? We’re here to help.</h1>
        <p className="text-slate-400 text-lg">Choose a quick support method or fill out the form to summon an admin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* --- QUICK CHANNELS (Left Sidebar) --- */}
        <div className="lg:col-span-4 space-y-4 animate-slide-in-left">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 ml-1 mb-6">Quick Channels</h3>

          {quickChannels.map((channel, i) => (
            <Card
              key={i}
              className="bg-panel-dark border-white/5 p-8 group hover:bg-card-dark transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start gap-4 h-full relative z-10">
                <span className={`material-symbols-outlined text-primary text-2xl ${channel.online ? 'relative' : ''}`}>
                  {channel.icon}
                  {channel.online && (
                    <span className="absolute -top-1 -right-1 block size-2 bg-green-500 rounded-full border-2 border-panel-dark"></span>
                  )}
                </span>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{channel.title}</h4>
                    {channel.external && (
                      <span className="material-symbols-outlined text-slate-600 text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">north_east</span>
                    )}
                    {channel.online && (
                      <div className="flex items-center gap-1.5 ml-2">
                        <div className="size-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Online</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">{channel.desc}</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-primary">arrow_forward</span>
              </div>
            </Card>
          ))}
        </div>

        {/* --- SUPPORT FORM (Main Area) --- */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 animate-slide-in-right">
          <Card className="bg-panel-dark border-white/5 p-10 lg:p-14 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Submit a Ticket</h2>
              <p className="text-slate-500 mb-12 font-medium">Detailed inquiries usually receive a response within 24 hours.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-lg">person</span>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-14 bg-input-dark border border-white/5 rounded-xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-inner transition-all"
                      placeholder="Your Name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Student ID</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-lg">badge</span>
                    <input
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      className="w-full h-14 bg-input-dark border border-white/5 rounded-xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-inner transition-all"
                      placeholder="E.g. STD-00000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Issue Type</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-lg">account_tree</span>
                  <select
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleChange}
                    className="w-full h-14 bg-input-dark border border-white/5 rounded-xl pl-12 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-inner transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select the type of issue...</option>
                    <option value="technical">Technical Bug</option>
                    <option value="account">Account Access</option>
                    <option value="quest">Quest Clarification</option>
                    <option value="billing">Subscription/Billing</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                </div>
              </div>

              <div className="space-y-2 mb-10">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    className="w-full bg-input-dark border border-white/5 rounded-xl p-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none shadow-inner leading-relaxed"
                    placeholder="Describe the issue in detail. What happened? What did you expect to happen?"
                  />
                  <div className="text-[10px] font-bold text-slate-600 text-right mt-1 uppercase tracking-widest">
                    {formData.description.length} / 500 characters
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-12">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Attachments</label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-primary/50 transition-colors bg-input-dark group cursor-pointer">
                  <div className="size-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
                  </div>
                  <h4 className="text-sm font-bold mb-1">Click to upload or drag and drop</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SVG, PNG, JPG or GIF (max. 5MB)</p>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-16 text-lg font-bold flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all"
                isLoading={isSubmitting}
              >
                Deploy Request
                <span className="material-symbols-outlined rotate-45 text-2xl">send</span>
              </Button>
            </div>

            {/* Background subtle glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          </Card>
        </form>
      </div>

      {/* Footer Copy */}
      <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
        <p>&copy; 2026 CodeQuest Inc. All rights reserved.</p>
        <div className="flex items-center gap-8">
          <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link to="#" className="hover:text-primary transition-colors">Code of Conduct</Link>
        </div>
      </div>

      {/* Floating Support Assistant */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <button className="size-16 bg-primary rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-90 hover:-translate-y-1 transition-all group overflow-hidden">
          <span className="material-symbols-outlined text-white text-3xl group-hover:animate-bounce">support_agent</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>
    </div>
  )
}

export default ContactSupport
