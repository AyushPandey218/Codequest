import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'

const PrivacyPolicy = () => {
  const lastUpdated = 'January 15, 2024'

  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: `CodeQuest ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational platform. Please read this privacy policy carefully.`,
    },
    {
      id: 'collection',
      title: '2. Information We Collect',
      content: `We collect information that you provide directly to us:

• Account Information: Username, email address, password (encrypted)
• Profile Information: Display name, avatar, bio, location
• Usage Data: Quiz scores, completed challenges, coding activity, time spent
• User Content: Code submissions, comments, forum posts
• Communication: Messages sent through our platform or to our support team

We also automatically collect certain information:

• Device Information: Browser type, operating system, IP address
• Analytics: Page views, clicks, feature usage, session duration
• Cookies: We use cookies and similar tracking technologies to track activity`,
    },
    {
      id: 'usage',
      title: '3. How We Use Your Information',
      content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process your transactions and send related information
• Send you technical notices, updates, and security alerts
• Respond to your comments, questions, and provide customer service
• Monitor and analyze trends, usage, and activities
• Personalize your experience and deliver targeted content
• Detect, prevent, and address technical issues and fraudulent activity
• Generate leaderboards and statistics (with anonymization options)
• Facilitate competitions and award achievements`,
    },
    {
      id: 'sharing',
      title: '4. Information Sharing and Disclosure',
      content: `We may share your information in the following circumstances:

• With your consent or at your direction
• With service providers who perform services on our behalf
• To comply with legal obligations or respond to legal requests
• To protect the rights, property, and safety of CodeQuest and users
• In connection with a merger, sale, or acquisition
• With other users when you post publicly (forums, leaderboards)

We do NOT sell your personal information to third parties.`,
    },
    {
      id: 'security',
      title: '5. Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal information:

• Encryption of sensitive data in transit and at rest
• Regular security assessments and penetration testing
• Access controls and authentication requirements
• Employee training on data protection
• Incident response procedures

However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.`,
    },
    {
      id: 'retention',
      title: '6. Data Retention',
      content: `We retain your information for as long as your account is active or as needed to provide you services. We will retain and use your information as necessary to:

• Comply with legal obligations
• Resolve disputes
• Enforce our agreements
• Maintain security and prevent fraud

You can request deletion of your account at any time through your account settings.`,
    },
    {
      id: 'rights',
      title: '7. Your Privacy Rights',
      content: `Depending on your location, you may have certain rights regarding your personal information:

• Access: Request a copy of your personal data
• Correction: Update or correct inaccurate information
• Deletion: Request deletion of your personal data
• Portability: Receive your data in a structured format
• Opt-out: Unsubscribe from marketing communications
• Restriction: Limit how we process your data

To exercise these rights, contact us at privacy@codequest.com`,
    },
    {
      id: 'cookies',
      title: '8. Cookies and Tracking',
      content: `We use cookies and similar tracking technologies to:

• Keep you logged in
• Remember your preferences
• Analyze site traffic and usage patterns
• Deliver personalized content

You can control cookies through your browser settings. Note that disabling cookies may affect functionality.`,
    },
    {
      id: 'children',
      title: '9. Children\'s Privacy',
      content: `Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete it.`,
    },
    {
      id: 'international',
      title: '10. International Data Transfers',
      content: `Your information may be transferred to and maintained on servers located outside of your state, province, country, or other governmental jurisdiction. By using CodeQuest, you consent to the transfer of your information to facilities located in the United States and other countries.`,
    },
    {
      id: 'changes',
      title: '11. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of any changes by:

• Posting the new policy on this page
• Updating the "Last Updated" date
• Sending you an email notification (for material changes)

We encourage you to review this Privacy Policy periodically.`,
    },
    {
      id: 'contact',
      title: '12. Contact Us',
      content: `If you have questions or concerns about this Privacy Policy, please contact us:

Email: privacy@codequest.com
Address: 123 Code Street, San Francisco, CA 94105, USA
Data Protection Officer: dpo@codequest.com`,
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
            Privacy Policy
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
            <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-green-500 text-2xl">
                shield
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Your Privacy Matters
              </h2>
              <p className="text-slate-600 dark:text-text-secondary">
                We are committed to protecting your personal information and your right to privacy. This policy explains what information we collect, how we use it, and your rights regarding your data.
              </p>
            </div>
          </div>
        </Card>

        {/* Privacy Sections */}
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

        {/* GDPR/CCPA Notice */}
        <Card variant="elevated" className="p-6 bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-2xl">
              gavel
            </span>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                GDPR & CCPA Compliance
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                We comply with GDPR (for EU users) and CCPA (for California residents). You have the right to access, correct, delete, or port your data. To exercise your rights, contact privacy@codequest.com
              </p>
            </div>
          </div>
        </Card>

        {/* Footer Actions */}
        <Card variant="elevated" className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="success" icon="check_circle">
                Effective {lastUpdated}
              </Badge>
              <Link to="/legal/terms">
                <Badge variant="info" className="cursor-pointer hover:opacity-80">
                  Terms of Service →
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

        {/* Data Request */}
        <Card variant="elevated" className="p-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">
              download
            </span>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Download Your Data
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                You can request a copy of all your personal data stored on CodeQuest at any time.
              </p>
              <Link to="/app/settings/account">
                <button className="text-sm font-medium text-primary hover:underline">
                  Request Data Export →
                </button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default PrivacyPolicy
