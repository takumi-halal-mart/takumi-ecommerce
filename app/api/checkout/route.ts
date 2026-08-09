import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// Initialize Stripe SDK
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-07-29.dahlia', // match the installed TS type
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customerName, customerPhone, deliveryAddress, deliveryCity, couponId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Fetch products from database to ensure price integrity
    // We must strip the '_bulk' suffix for wholesale items before querying the UUID column
    const cleanProductIds = items.map((item: any) => item.productId.replace('_bulk', ''));
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', cleanProductIds);

    if (productsError || !products) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    let subtotal = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // 2. Construct Stripe line_items array
    for (const item of items) {
      const isExplicitBulk = item.productId.endsWith('_bulk');
      const cleanId = item.productId.replace('_bulk', '');
      const product = products.find((p) => p.id === cleanId);

      if (!product) continue;

      let priceToUse = product.retail_price;
      let displayName = product.name;
      let finalIsBulk = false;

      if (item.selectedFlavor) {
        displayName = `${displayName} (${item.selectedFlavor})`;
      }

      if (isExplicitBulk) {
        priceToUse = product.wholesale_price;
        displayName = `${displayName} (Wholesale)`;
        finalIsBulk = true;
      } else if (product.is_wholesale && product.wholesale_moq && item.quantity >= product.wholesale_moq) {
        // Smart dynamic wholesale fallback! 
        priceToUse = product.wholesale_price;
        displayName = `${displayName} (Wholesale Auto-Applied)`;
        finalIsBulk = true;
      }

      if (!priceToUse) continue;

      subtotal += priceToUse * item.quantity;

      lineItems.push({
        price_data: {
          currency: 'jpy', // Zero-decimal currency
          product_data: {
            name: displayName,
            images: product.image_url ? [product.image_url] : undefined,
            metadata: {
              productId: cleanId, // Pass actual DB UUID to webhook
              isBulk: finalIsBulk ? 'true' : 'false',
              selectedFlavor: item.selectedFlavor || '',
            },
          },
          unit_amount: priceToUse, // Exact integer amount
        },
        quantity: item.quantity,
      });
    }

    // 3. Coupon Validation
    let discountAmount = 0;
    if (couponId) {
      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', couponId)
        .single();

      if (!couponError && coupon && coupon.is_active && subtotal >= coupon.min_spend) {
        // Verify usage limits
        const underLimit = coupon.usage_limit ? (coupon.times_used || 0) < coupon.usage_limit : true;

        if (underLimit) {
          if (coupon.discount_type === 'percentage') {
            discountAmount = Math.floor(subtotal * (coupon.discount_value / 100));
          } else {
            discountAmount = coupon.discount_value;
          }
        }
      }
    }

    const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);

    // 4. Delivery Fee Calculation (Zones & Fallback)
    let deliveryFee = 0;
    let isSpecificZone = false;

    if (deliveryCity) {
      const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data: zoneData } = await supabaseAdmin
        .from('delivery_zones')
        .select('delivery_fee')
        .ilike('city_name', deliveryCity.trim())
        .eq('is_active', true)
        .maybeSingle();

      if (zoneData) {
        deliveryFee = zoneData.delivery_fee;
        isSpecificZone = true; // Use the zone's specific fee, ignoring the free shipping threshold
      }
    }

    if (!isSpecificZone) {
      const { data: storeSettings, error: settingsError } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (!settingsError && storeSettings) {
        if (subtotalAfterDiscount < storeSettings.free_shipping_threshold) {
          deliveryFee = storeSettings.delivery_fee;
        }
      }
    }

    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'jpy',
          product_data: {
            name: 'Delivery Fee',
          },
          unit_amount: deliveryFee,
        },
        quantity: 1,
      });
    }

    // 5. Handle Discounts in Stripe
    let stripeCouponId: string | undefined = undefined;
    if (discountAmount > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: discountAmount,
        currency: 'jpy',
        duration: 'once',
        name: 'Store Discount',
      });
      stripeCouponId = stripeCoupon.id;
    }

    // 6. Create Checkout Session
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const fullDeliveryAddress = deliveryCity
      ? `${deliveryCity} - ${deliveryAddress}`
      : deliveryAddress;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : undefined,
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        customerName,
        customerPhone,
        deliveryAddress: fullDeliveryAddress,
        couponId: couponId || '',
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
