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

    // Validate input lengths
    if (company.length < 2 || role.length < 2 || offering.length < 10) {
      return NextResponse.json(
        { error: 'Please provide more detail. Company and role need 2+ chars, offering needs 10+ chars.' },
        { status: 400 }
      );
    }

    if (offering.length > 500) {
      return NextResponse.json(
        { error: 'Offering too long. Keep it under 500 characters.' },
        { status: 400 }
      );
    }

    const prompt = `Generate 3 cold email variants for reaching out to ${role} at ${company}.

Offering: ${offering}
Sender: ${senderName || 'Alex'} from ${senderCompany || 'Our Company'}

Write 3 short emails (under 100 words each):
1. Professional tone
2. Casual/friendly tone
3. Direct/concise tone

Include subject lines. End each with a clear call-to-action.

Return JSON:
{"emails":[{"subject":"...","body":"...","tone":"professional"},{"subject":"...","body":"...","tone":"casual"},{"subject":"...","body":"...","tone":"direct"}],"followUp":{"subject":"...","body":"..."}}`;

    console.log('Calling Ollama with prompt length:', prompt.length);

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3:4b',
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error('Ollama response not ok:', response.status);
      throw new Error('Ollama API error: ' + response.status);
    }

    const data = await response.json();
    console.log('Ollama response received, length:', data.response?.length || 0);
    
    const responseText = data.response || '';
    
    // Try to extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const result = JSON.parse(jsonMatch[0]);
        if (result.emails && result.emails.length > 0) {
          return NextResponse.json(result);
        }
      } catch (e) {
        console.log('JSON parse failed, using fallback');
      }
    }

    // Fallback: create a simple response from raw text
    return NextResponse.json({
      emails: [
        { 
          subject: `Quick question about ${company}`, 
          body: responseText.slice(0, 500) || 'Hello! I wanted to reach out about our offering. Would you be open to a quick chat?', 
          tone: 'professional' 
        },
        { 
          subject: `Hey from ${senderCompany || 'us'}`, 
          body: 'Hi there! Saw your work and thought you might be interested in what we\'re building. Mind if I share more?', 
          tone: 'casual' 
        },
        { 
          subject: `${offering?.split(' ').slice(0, 3).join(' ') || 'Quick question'}`, 
          body: 'Interested in improving your workflow? Let\'s chat. 5 min of your time.', 
          tone: 'direct' 
        }
      ],
      followUp: { 
        subject: 'Following up', 
        body: 'Hi! Just wanted to follow up on my previous email. Would love to connect if you have a moment.' 
      }
    });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({
      emails: [
        { subject: 'Connection request', body: 'Hi! I\'d love to connect and share how we might help. Do you have 5 minutes?', tone: 'professional' }
      ],
      followUp: { subject: 'Following up', body: 'Just following up on my previous note.' },
      error: 'Generation had issues, showing fallback'
    });
  }
}
