import { useState } from 'react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    priority: 'normal',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setSubmitted(true)
  }

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'Go to Settings > Account > Change Password to update your password.',
      category: 'account',
    },
    {
      question: 'How does the XP system work?',
      answer: 'You earn XP by completing quests, winning clashes, and unlocking achievements. Each level requires more XP than the previous one.',
      category: 'general',
    },
    {
      question: 'Can I change my username?',
      answer: 'Yes, go to Profile > Edit Profile to change your username. You can only change it once every 30 days.',
      category: 'account',
    },
    {
      question: 'How do I report a bug?',
      answer: 'Use the contact form below with category "Bug Report" or email us directly at bugs@codequest.com',
      category: 'technical',
    },
  ]

  const supportChannels = [
    {
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: 'mail',
      contact: 'support@codequest.com',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Live Chat',
      description: 'Chat with us during business hours',
      icon: 'chat',
      contact: 'Available 9 AM - 6 PM EST',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Community Forum',
      description: 'Ask the community for help',
      icon: 'forum',
      contact: 'forum.codequest.com',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Help Center',
      description: 'Browse our knowledge base',
      icon: 'help',
      contact: 'help.codequest.com',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ]

  if (submitted) {
    return (
      <div className="max-w-[800px] mx-auto">
        <Card variant="elevated" className="p-12 text-center">
          <div className="inline-flex items-center justify-center size-20 rounded-full bg-green-500/10 mb-6">
            <span className="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Message Sent! 🎉
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">
            Thank you for contacting us. We've received your message and will get back to you within 24 hours.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" onClick={() => setSubmitted(false)}>
              Send Another Message
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/app/dashboard'}>
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          Contact Support 💬
        </h1>
        <p className="text-slate-600 dark:text-text-secondary">
          We're here to help! Choose how you'd like to reach us.
        </p>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {supportChannels.map((channel, index) => (
          <Card key={index} variant="elevated" hover className="p-6 text-center cursor-pointer">
            <div className={`size-16 rounded-xl ${channel.bgColor} flex items-center justify-center mx-auto mb-4`}>
              <span className={`material-symbols-outlined text-3xl ${channel.color}`}>
                {channel.icon}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              {channel.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-text-secondary mb-3">
              {channel.description}
            </p>
            <p className="text-xs font-mono text-primary">
              {channel.contact}
            </p>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card variant="elevated" className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  icon="person"
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon="mail"
                  required
                />
              </div>

              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                icon="subject"
                placeholder="Brief description of your issue"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1c1c27] border border-slate-300 dark:border-[#3b3b54] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Issue</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="account">Account Issue</option>
                    <option value="billing">Billing</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1c1c27] border border-slate-300 dark:border-[#3b3b54] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full rounded-xl border border-slate-300 dark:border-[#3b3b54] bg-white dark:bg-[#1c1c27] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9d9db9] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  placeholder="Please provide as much detail as possible..."
                  required
                />
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  {formData.message.length}/1000 characters
                </p>
              </div>

              <div className="flex items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                  info
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  We typically respond within 24 hours on business days.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                icon="send"
                className="w-full"
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>

        {/* FAQ Sidebar */}
        <div className="space-y-6">
          <Card variant="elevated" className="p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="pb-4 border-b border-slate-200 dark:border-border-dark last:border-0 last:pb-0">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">
                    {faq.question}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-text-secondary">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              View All FAQs
            </Button>
          </Card>

          <Card variant="elevated" className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border-purple-200 dark:border-purple-800">
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl text-purple-500 mb-3 block">
                school
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Need Quick Help?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                Check out our Help Center for instant answers and tutorials.
              </p>
              <Button variant="primary" size="sm" icon="arrow_forward" className="w-full">
                Visit Help Center
              </Button>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Response Times
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-text-secondary">
                  Urgent Issues
                </span>
                <Badge variant="danger" size="sm">
                  2-4 hours
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-text-secondary">
                  High Priority
                </span>
                <Badge variant="warning" size="sm">
                  4-8 hours
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-text-secondary">
                  Normal
                </span>
                <Badge variant="info" size="sm">
                  24 hours
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-text-secondary">
                  Low Priority
                </span>
                <Badge variant="default" size="sm">
                  48 hours
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ContactSupport
