export default function Privacy() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-blue-400 hover:text-blue-300 mb-8 block">← Back to ColdCraft</a>
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <div className="prose prose-invert">
          <p className="text-gray-300 mb-6"><strong className="text-white">Last updated:</strong> March 2026</p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">What We Collect</h2>
          <ul className="text-gray-300 space-y-2 mb-6">
            <li>• Account info (if signed in): Email for authentication</li>
            <li>• Generation counts: To enforce daily limits</li>
            <li>• Payment info: Handled securely by Stripe</li>
          </ul>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">What We DON'T Store</h2>
          <ul className="text-gray-300 space-y-2 mb-6">
            <li>• Your generated emails (processed and returned, not saved)</li>
            <li>• Your company/prospect details</li>
          </ul>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact</h2>
          <p className="text-gray-300">Questions? Email <a href="mailto:privacy@revolutionai.io" className="text-blue-400 hover:underline">privacy@revolutionai.io</a></p>
        </div>
      </div>
    </main>
  );
}
