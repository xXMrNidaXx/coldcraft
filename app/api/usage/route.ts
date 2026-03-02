import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const FREE_DAILY_LIMIT = 3;

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({
        count: 0,
        limit: FREE_DAILY_LIMIT,
        plan: 'free',
        remaining: FREE_DAILY_LIMIT
      });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        count: 0,
        limit: FREE_DAILY_LIMIT,
        plan: 'free',
        remaining: FREE_DAILY_LIMIT
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: profile } = await supabase
      .schema('coldcraft')
      .from('profiles')
      .select('plan')
      .eq('id', userId)
      .single();

    const plan = profile?.plan || 'free';
    const limit = plan === 'pro' ? Infinity : FREE_DAILY_LIMIT;

    const today = new Date().toISOString().split('T')[0];
    const { data: usage } = await supabase
      .schema('coldcraft')
      .from('usage')
      .select('count')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    const count = usage?.count || 0;

    return NextResponse.json({
      count,
      limit,
      plan,
      remaining: plan === 'pro' ? 'unlimited' : Math.max(0, limit - count)
    });
  } catch (error) {
    console.error('Usage API error:', error);
    return NextResponse.json({
      count: 0,
      limit: FREE_DAILY_LIMIT,
      plan: 'free',
      remaining: FREE_DAILY_LIMIT
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ success: true, tracked: false });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: true, tracked: false });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const today = new Date().toISOString().split('T')[0];

    const { data: existing } = await supabase
      .schema('coldcraft')
      .from('usage')
      .select('count')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (existing) {
      await supabase
        .schema('coldcraft')
        .from('usage')
        .update({ count: existing.count + 1 })
        .eq('user_id', userId)
        .eq('date', today);
    } else {
      await supabase
        .schema('coldcraft')
        .from('usage')
        .insert({ user_id: userId, date: today, count: 1 });
    }

    return NextResponse.json({ success: true, tracked: true });
  } catch (error) {
    console.error('Usage tracking error:', error);
    return NextResponse.json({ success: true, tracked: false });
  }
}
