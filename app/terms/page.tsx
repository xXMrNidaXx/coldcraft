export default function Terms() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-blue-400 hover:text-blue-300 mb-8 block">← Back to ColdCraft</a>
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <div className="prose prose-invert">
          <p className="text-gray-300 mb-6"><strong className="text-white">Last updated:</strong> March 2026</p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Service</h2>
          <p className="text-gray-300 mb-6">ColdCraft generates cold email copy using AI. Free users get 3 generations/day. Pro users get unlimited.</p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Acceptable Use</h2>
          <p className="text-gray-300 mb-6">Don't use ColdCraft for spam, illegal activities, or harassment. Follow CAN-SPAM and GDPR guidelines.</p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Subscriptions</h2>
          <p className="text-gray-300 mb-6">Pro is $9/month via Stripe. Cancel anytime. Refunds on a case-by-case basis.</p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Limitations</h2>
          <p className="text-gray-300 mb-6">AI-generated content may not always be perfect. Review before sending. We're not liable for email outcomes.</p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact</h2>
          <p className="text-gray-300">Questions? Email <a href="mailto:legal@revolutionai.io" className="text-blue-400 hover:underline">legal@revolutionai.io</a></p>
        </div>
      </div>
    </main>
  );
}
