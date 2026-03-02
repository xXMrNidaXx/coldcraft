import { NextRequest, NextResponse } from 'next/server';

// Increase function timeout for Ollama generation
export const maxDuration = 60;

const OLLAMA_URL = process.env.OLLAMA_URL || 'https://ollama2.revolutionai.io';

export async function POST(request: NextRequest) {
  try {
    const { company, role, offering, senderName, senderCompany } = await request.json();

    if (!company || !role || !offering) {
      return NextResponse.json(
        { error: 'Missing required fields: company, role, offering' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert cold email copywriter. Generate 3 personalized cold emails.

Target:
- Company: ${company}
- Role: ${role}

Sender:
- Name: ${senderName || 'Alex'}
- Company: ${senderCompany || 'Our Company'}
- Offering: ${offering}

Generate 3 variants:
1. Professional/formal tone
2. Casual/friendly tone  
3. Direct/concise tone

Each email should:
- Be under 150 words
- Have a compelling subject line
- Personalize to the company/role
- End with a clear CTA
- Sound human, not AI-generated

Also generate a follow-up email for if they don't respond.

Return ONLY valid JSON in this exact format:
{
  "emails": [
    {"subject": "...", "body": "...", "tone": "professional"},
    {"subject": "...", "body": "...", "tone": "casual"},
    {"subject": "...", "body": "...", "tone": "direct"}
  ],
  "followUp": {"subject": "...", "body": "..."}
}`;

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3:4b', // Fast model for quick responses
        prompt,
        stream: false,
        format: 'json',
      }),
    });

    if (!response.ok) {
      throw new Error('Ollama API error');
    }

    const data = await response.json();
    let result;
    
    try {
      // Try to parse the response as JSON
      const responseText = data.response || '';
      // Find JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // Fallback: return raw response
      return NextResponse.json({
        emails: [
          { subject: 'Quick question about ' + company, body: data.response || 'Error generating email', tone: 'professional' }
        ],
        followUp: { subject: 'Following up', body: 'Just wanted to follow up on my previous email.' }
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'Failed to generate emails' },
      { status: 500 }
    );
  }
}
