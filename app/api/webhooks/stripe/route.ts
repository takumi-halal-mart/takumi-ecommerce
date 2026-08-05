import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Initialize Stripe SDK
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-07-29.dahlia', // match the installed TS type
});

export async function POST(req: Request) {
  // Stripe requires the raw body to verify the webhook signature securely
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('Webhook Error: Missing stripe-signature header');
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Securely verify the event using our webhook secret
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the specific events we care about
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        // Initialize Supabase Admin Client using Service Role Key to bypass RLS
        const supabaseAdmin = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Fetch line items directly from Stripe to avoid metadata 500-char limits
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ['data.price.product'],
        });

        // Safely extract the metadata we passed from the frontend
        const customerName = session.metadata?.customerName;
        const customerPhone = session.metadata?.customerPhone;
        const deliveryAddress = session.metadata?.deliveryAddress;
        const couponId = session.metadata?.couponId;

        if (!customerName || !customerPhone || !deliveryAddress) {
          console.error('Webhook Error: Missing critical metadata for order creation.');
          return NextResponse.json({ error: 'Missing critical metadata' }, { status: 400 });
        }

        const formattedItemsArray = lineItems.data
          .map((item) => {
            const product = item.price?.product as Stripe.Product;
            return {
              product_id: product?.metadata?.productId,
              quantity: item.quantity,
              price_at_purchase: item.price?.unit_amount || 0,
            };
          })
          .filter(item => item.product_id); // Safely filter out things like delivery fees with no product_id

        // Execute atomic database insert via Postgres RPC
        const { data: orderId, error: rpcError } = await supabaseAdmin.rpc('process_stripe_order', {
          p_customer_name: customerName,
          p_customer_phone: customerPhone,
          p_delivery_address: deliveryAddress,
          p_total_amount: session.amount_total || 0,
          p_payment_intent_id: (session.payment_intent as string) || session.id,
          p_coupon_id: couponId && couponId.trim() !== '' ? couponId : null,
          p_items: formattedItemsArray,
        });

        if (rpcError) {
          console.error('RPC Error:', rpcError);
          return NextResponse.json({ error: 'Database operations failed' }, { status: 500 });
        }

        console.log(`Successfully created order ${orderId} via RPC`);

      } catch (err: any) {
        console.error('Operation Failed in Webhook:', err);
        return NextResponse.json({ error: 'Operations failed' }, { status: 500 });
      }
      
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 });
}
