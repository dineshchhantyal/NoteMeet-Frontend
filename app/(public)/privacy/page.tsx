import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | NoteMeet',
  description: 'Learn about how NoteMeet collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        
        <div className="rounded-lg shadow-sm p-8">
          <p className="text-gray-600 mb-8">Last updated: June 20, 2023</p>
          
          <section className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                NoteMeet (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="text-gray-700 mb-3">We collect information that you provide directly to us, such as:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Account information (e.g., name, email address, password)</li>
                <li>Profile information (e.g., job title, company name)</li>
                <li>Meeting data (e.g., meeting titles, participants, transcripts, summaries)</li>
                <li>Communication data (e.g., when you contact our support team)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Develop new products and services</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational measures to protect the security of your personal information. 
                However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed">
                Depending on your location, you may have certain rights regarding your personal information, 
                such as the right to access, correct, or delete your data. To exercise these rights, 
                please contact us using the information provided at the end of this policy.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">6. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 text-gray-700">
                <p>Email: <a href="mailto:myagdichhantyal@gmail.com" className="text-blue-600 hover:underline">myagdichhantyal@gmail.com</a></p>
                <p>Address: 900 University Ave, Monroe, LA 71209</p>
              </div>
            </div>
          </section>
        </div>
     
    </main>
  )
}


