import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.log('Supabase not configured, skipping DB update');
      return NextResponse.json({ received: true, dbUpdate: false });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.text();
    const event = JSON.parse(body);

    console.log('Stripe webhook received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerEmail = session.customer_email || session.customer_details?.email;
        const customerId = session.customer;

        if (customerEmail) {
          const { error } = await supabase
            .schema('coldcraft')
            .from('profiles')
            .update({ 
              plan: 'pro',
              stripe_customer_id: customerId 
            })
            .eq('email', customerEmail);

          if (error) {
            console.error('Error updating user plan:', error);
          } else {
            console.log(`User ${customerEmail} upgraded to Pro!`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const { error } = await supabase
          .schema('coldcraft')
          .from('profiles')
          .update({ plan: 'free' })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error downgrading user:', error);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const status = subscription.status;
        const plan = status === 'active' ? 'pro' : 'free';
        
        const { error } = await supabase
          .schema('coldcraft')
          .from('profiles')
          .update({ plan })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('Error updating subscription:', error);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
