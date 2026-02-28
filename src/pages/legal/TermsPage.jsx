import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'

const TermsOfService = () => {
  const lastUpdated = 'January 15, 2024'

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: `By accessing and using CodeQuest ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
    },
    {
      id: 'description',
      title: '2. Description of Service',
      content: `CodeQuest is an educational platform that provides interactive coding challenges, projects, and competitive programming features. We reserve the right to modify or discontinue the Service at any time without notice.`,
    },
    {
      id: 'registration',
      title: '3. User Registration',
      content: `To access certain features of the Service, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.`,
    },
    {
      id: 'conduct',
      title: '4. User Conduct',
      content: `You agree not to use the Service to:
      
• Violate any applicable laws or regulations
• Impersonate any person or entity
• Transmit any viruses, malware, or harmful code
• Attempt to gain unauthorized access to the Service
• Harass, abuse, or harm other users
• Submit false or misleading information
• Use automated scripts or bots without permission
• Share solutions or answers in a way that violates academic integrity`,
    },
    {
      id: 'content',
      title: '5. User Content',
      content: `You retain ownership of any code, comments, or other content you submit to the Service. By submitting content, you grant CodeQuest a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content in connection with operating and providing the Service.`,
    },
    {
      id: 'intellectual',
      title: '6. Intellectual Property',
      content: `The Service and its original content, features, and functionality are owned by CodeQuest and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. All challenges, problems, and educational content remain the property of CodeQuest.`,
    },
    {
      id: 'termination',
      title: '7. Termination',
      content: `We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.`,
    },
    {
      id: 'disclaimer',
      title: '8. Disclaimer of Warranties',
      content: `The Service is provided on an "AS IS" and "AS AVAILABLE" basis. CodeQuest makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.`,
    },
    {
      id: 'limitation',
      title: '9. Limitation of Liability',
      content: `In no event shall CodeQuest, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.`,
    },
    {
      id: 'changes',
      title: '10. Changes to Terms',
      content: `We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.`,
    },
    {
      id: 'contact',
      title: '11. Contact Us',
      content: `If you have any questions about these Terms, please contact us at:

Email: legal@codequest.com
Address: 123 Code Street, San Francisco, CA 94105, USA`,
    },
  ]

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12 px-4">
      <div className="max-w-[900px] mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-3 text-slate-900 dark:text-white mb-6 hover:opacity-80 transition-opacity">
            <div className="flex size-10 items-center justify-center">
              <img src="/logo.png" alt="CodeQuest" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            </div>
            <h2 className="text-2xl font-bold">CodeQuest</h2>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-text-secondary">
            <span className="material-symbols-outlined">update</span>
            <p>Last Updated: {lastUpdated}</p>
          </div>
        </div>

        {/* Quick Links */}
        <Card variant="elevated" className="p-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm text-primary hover:underline"
              >
                {section.title}
              </a>
            ))}
          </div>
        </Card>

        {/* Introduction */}
        <Card variant="elevated" className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-blue-500 text-2xl">
                description
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome to CodeQuest
              </h2>
              <p className="text-slate-600 dark:text-text-secondary">
                Please read these Terms of Service carefully before using our platform. By using CodeQuest, you agree to be bound by these terms.
              </p>
            </div>
          </div>
        </Card>

        {/* Terms Sections */}
        {sections.map((section) => (
          <Card key={section.id} id={section.id} variant="elevated" className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {section.title}
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {section.content}
              </p>
            </div>
          </Card>
        ))}

        {/* Footer Actions */}
        <Card variant="elevated" className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="success" icon="check_circle">
                Effective {lastUpdated}
              </Badge>
              <Link to="/legal/privacy">
                <Badge variant="info" className="cursor-pointer hover:opacity-80">
                  Privacy Policy →
                </Badge>
              </Link>
            </div>
            <div className="flex gap-3">
              <Link to="/app/support">
                <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-[#282839] hover:bg-slate-200 dark:hover:bg-[#323267] text-slate-900 dark:text-white font-medium text-sm transition-all">
                  Contact Support
                </button>
              </Link>
              <Link to="/app/dashboard">
                <button className="px-4 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white font-medium text-sm transition-all">
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Acknowledgment */}
        <Card variant="elevated" className="p-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">
              info
            </span>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Need Help Understanding?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                If you have any questions about these Terms of Service, please don't hesitate to contact our legal team.
              </p>
              <Link to="/app/support">
                <button className="text-sm font-medium text-primary hover:underline">
                  Contact Legal Team →
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TermsOfService
