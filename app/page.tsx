'use client';

import { useState } from 'react';

export default function Home() {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [offering, setOffering] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderCompany, setSenderCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [usage, setUsage] = useState({ count: 0, limit: 3 });

  const generate = async () => {
    if (!company || !role || !offering) {
      alert('Please fill in all required fields');
      return;
    }
    if (usage.count >= usage.limit) {
      alert('Daily limit reached! Upgrade to Pro for unlimited.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role, offering, senderName, senderCompany }),
      });
      const data = await res.json();
      setResult(data);
      setUsage(prev => ({ ...prev, count: prev.count + 1 }));
    } catch (error) {
      console.error('Generate error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <span className="text-2xl font-bold text-white">✉️ ColdCraft</span>
        <a href="https://buy.stripe.com/cNicMY5u14xSehKgg0eQM03" className="text-blue-400 hover:text-blue-300 text-sm">
          Upgrade to Pro →
        </a>
      </div>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="inline-block bg-blue-500/20 border border-blue-500/50 rounded-full px-4 py-1 mb-6">
          <span className="text-blue-400 text-sm font-medium">✉️ AI Cold Email Generator</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Cold emails that <span className="text-blue-400">get replies</span>
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
          Generate 3 personalized cold email variants in seconds. Professional, casual, and direct tones.
        </p>
      </div>

      {/* Generator Form */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Generate Cold Emails</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Target Company *</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Acme Corp"
                className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-1">Target Role *</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., VP of Sales"
                className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-1">What you're offering *</label>
              <textarea
                value={offering}
                onChange={(e) => setOffering(e.target.value)}
                placeholder="e.g., Our CRM helps sales teams close 30% more deals"
                rows={3}
                className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Your Name</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Alex"
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Your Company</label>
                <input
                  type="text"
                  value={senderCompany}
                  onChange={(e) => setSenderCompany(e.target.value)}
                  placeholder="SalesTech"
                  className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? '⏳ Generating (may take 30-60s on first run)...' : '✨ Generate 3 Email Variants'}
            </button>

            <p className="text-center text-gray-400 text-sm">
              {usage.count}/{usage.limit} generations today • 
              <a href="https://buy.stripe.com/cNicMY5u14xSehKgg0eQM03" className="text-blue-400 hover:underline ml-1">
                Go unlimited for $9/mo
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && result.emails && (
        <div className="max-w-2xl mx-auto px-4 pb-12">
          <h2 className="text-xl font-bold text-white mb-4">Your Cold Emails</h2>
          <div className="space-y-4">
            {result.emails.map((email: any, i: number) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-blue-400 text-sm font-medium capitalize">{email.tone}</span>
                  <button
                    onClick={() => copyToClipboard(`Subject: ${email.subject}\n\n${email.body}`)}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    📋 Copy
                  </button>
                </div>
                <p className="text-white font-semibold mb-2">Subject: {email.subject}</p>
                <p className="text-gray-300 whitespace-pre-wrap text-sm">{email.body}</p>
              </div>
            ))}
            
            {result.followUp && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-yellow-400 text-sm font-medium">Follow-up Email</span>
                  <button
                    onClick={() => copyToClipboard(`Subject: ${result.followUp.subject}\n\n${result.followUp.body}`)}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    📋 Copy
                  </button>
                </div>
                <p className="text-white font-semibold mb-2">Subject: {result.followUp.subject}</p>
                <p className="text-gray-300 whitespace-pre-wrap text-sm">{result.followUp.body}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Simple Pricing</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Free</h3>
            <p className="text-3xl font-bold text-white mb-4">$0</p>
            <ul className="text-gray-300 space-y-2 mb-6 text-sm">
              <li>3 generations/day</li>
              <li>3 email variants</li>
              <li>Follow-up email</li>
            </ul>
          </div>
          <div className="bg-blue-600/20 border border-blue-500/50 rounded-xl p-6 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">UNLIMITED</div>
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <p className="text-3xl font-bold text-white mb-4">$9<span className="text-lg text-gray-400">/mo</span></p>
            <ul className="text-gray-300 space-y-2 mb-6 text-sm">
              <li><strong className="text-white">Unlimited</strong> generations</li>
              <li>All features</li>
              <li>Priority support</li>
            </ul>
            <a href="https://buy.stripe.com/cNicMY5u14xSehKgg0eQM03" className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">
              Go Unlimited
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8 text-gray-500 text-sm border-t border-white/10 pt-8">
        <p className="mb-2">Built with ❤️ by <a href="https://revolutionai.io" className="hover:text-blue-400">RevolutionAI</a></p>
        <div className="flex justify-center gap-4">
          <a href="/privacy" className="hover:text-blue-400">Privacy</a>
          <a href="/terms" className="hover:text-blue-400">Terms</a>
          <a href="https://twitter.com/MyBossisAI" className="hover:text-blue-400">@MyBossisAI</a>
        </div>
      </div>
    </main>
  );
}
