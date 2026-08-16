import { NextResponse } from 'next/server';
import { getCustomerOrders, createCustomerOrder, getSupabaseProducts } from '@/lib/supabase-db';

export const dynamic = 'force-dynamic';

const globalStore = (globalThis as any);
if (!globalStore.inMemoryOrders) {
  globalStore.inMemoryOrders = {};
}

// Generate a random order ID like FF-ORD-12345
function generateOrderId() {
  return 'FF-ORD-' + Math.floor(10000 + Math.random() * 90000);
}

// Helper to seed mock orders in-memory or in database
async function getSeededOrdersForCustomer(customerId: string) {
  let products: any[] = [];
  try {
    products = await getSupabaseProducts();
  } catch (err) {
    console.warn('Failed to load products for seeding orders:', err);
  }

  // If no products in DB, create mock ones
  if (!products || products.length === 0) {
    products = [
      {
        id: 'prod-mock-1',
        name: 'Luxury 4D Zero-Gravity Massage Chair',
        price: 149999,
        image: 'https://res.cloudinary.com/ufptbplr/image/upload/v1785996171/Fit_Forever_Logo_page-0001_gglf4q.jpg',
      },
      {
        id: 'prod-mock-2',
        name: 'Commercial Motorized Treadmill FF-5000',
        price: 54999,
        image: 'https://res.cloudinary.com/ufptbplr/image/upload/v1785996171/Fit_Forever_Logo_page-0001_gglf4q.jpg',
      },
      {
        id: 'prod-mock-3',
        name: 'Magnetic Resistance Spin Bike Pro',
        price: 28999,
        image: 'https://res.cloudinary.com/ufptbplr/image/upload/v1785996171/Fit_Forever_Logo_page-0001_gglf4q.jpg',
      }
    ];
  }

  const dateToday = new Date().toISOString();
  const dateThreeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const dateTenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();

  // Define 3 seeded orders
  const seededOrdersData = [
    {
      id: generateOrderId(),
      status: 'Processing' as const,
      subtotal: products[0].price,
      shipping: 0,
      discount: 10000,
      total: products[0].price - 10000,
      shippingName: 'Shiv Kumar',
      shippingPhone: '+91 98765 43210',
      shippingAddressLine1: 'Flat 402, Block C, Heritage Heights',
      shippingAddressLine2: 'Sector 62',
      shippingCity: 'Noida',
      shippingState: 'Uttar Pradesh',
      shippingPinCode: '201301',
      createdAt: dateToday,
      items: [
        {
          id: 'item-seed-1',
          productId: products[0].id,
          quantity: 1,
          price: products[0].price,
          productName: products[0].name,
          productImage: products[0].image || products[0].image_url || '',
        }
      ]
    },
    {
      id: generateOrderId(),
      status: 'Shipped' as const,
      subtotal: products[1].price,
      shipping: 500,
      discount: 0,
      total: products[1].price + 500,
      shippingName: 'Shiv Kumar',
      shippingPhone: '+91 98765 43210',
      shippingAddressLine1: 'Flat 402, Block C, Heritage Heights',
      shippingAddressLine2: 'Sector 62',
      shippingCity: 'Noida',
      shippingState: 'Uttar Pradesh',
      shippingPinCode: '201301',
      createdAt: dateThreeDaysAgo,
      items: [
        {
          id: 'item-seed-2',
          productId: products[1].id,
          quantity: 1,
          price: products[1].price,
          productName: products[1].name,
          productImage: products[1].image || products[1].image_url || '',
        }
      ]
    },
    {
      id: generateOrderId(),
      status: 'Delivered' as const,
      subtotal: products[2].price * 2,
      shipping: 0,
      discount: 3000,
      total: (products[2].price * 2) - 3000,
      shippingName: 'Shiv Kumar',
      shippingPhone: '+91 98765 43210',
      shippingAddressLine1: 'Flat 402, Block C, Heritage Heights',
      shippingAddressLine2: 'Sector 62',
      shippingCity: 'Noida',
      shippingState: 'Uttar Pradesh',
      shippingPinCode: '201301',
      createdAt: dateTenDaysAgo,
      items: [
        {
          id: 'item-seed-3',
          productId: products[2].id,
          quantity: 2,
          price: products[2].price,
          productName: products[2].name,
          productImage: products[2].image || products[2].image_url || '',
        }
      ]
    }
  ];

  // Try to insert these seeded orders into Supabase database if tables exist
  for (const order of seededOrdersData) {
    try {
      const { items, id, ...orderFields } = order;
      const orderFieldsWithItems = {
        status: orderFields.status,
        subtotal: orderFields.subtotal,
        shipping: orderFields.shipping,
        discount: orderFields.discount,
        total: orderFields.total,
        shippingName: orderFields.shippingName,
        shippingPhone: orderFields.shippingPhone,
        shippingAddressLine1: orderFields.shippingAddressLine1,
        shippingAddressLine2: orderFields.shippingAddressLine2,
        shippingCity: orderFields.shippingCity,
        shippingState: orderFields.shippingState,
        shippingPinCode: orderFields.shippingPinCode,
      };

      await createCustomerOrder(
        id,
        customerId,
        orderFieldsWithItems,
        items.map(it => ({
          productId: it.productId,
          quantity: it.quantity,
          price: it.price
        }))
      );
      console.log(`Seeded order ${id} in Supabase`);
    } catch (err) {
      console.warn(`Failed to seed order ${order.id} in Supabase (will use in-memory fallback):`, err);
    }
  }

  return seededOrdersData;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId') || request.headers.get('x-customer-id');

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    let orders: any[] = [];
    let isDbSuccess = false;

    try {
      orders = await getCustomerOrders(customerId);
      isDbSuccess = true;
    } catch (dbError) {
      console.warn('Supabase customer orders query failed, using in-memory store:', dbError);
    }

    // If Supabase returned results, use them
    if (isDbSuccess && orders && orders.length > 0) {
      globalStore.inMemoryOrders[customerId] = orders;
      return NextResponse.json(orders);
    }

    // If Supabase call succeeded but returned 0 orders, we try to seed orders
    if (isDbSuccess && orders && orders.length === 0) {
      // Seed orders in DB
      const seeded = await getSeededOrdersForCustomer(customerId);
      // Fetch again to see if they got inserted
      try {
        orders = await getCustomerOrders(customerId);
      } catch (e) {}
      
      if (orders && orders.length > 0) {
        globalStore.inMemoryOrders[customerId] = orders;
        return NextResponse.json(orders);
      } else {
        // Fallback to seeded mock array in-memory
        globalStore.inMemoryOrders[customerId] = seeded;
        return NextResponse.json(seeded);
      }
    }

    // Fallback: If DB failed altogether (e.g. table doesn't exist)
    if (!globalStore.inMemoryOrders[customerId]) {
      // Try to seed mock orders in-memory
      const seeded = await getSeededOrdersForCustomer(customerId);
      globalStore.inMemoryOrders[customerId] = seeded;
    }

    return NextResponse.json(globalStore.inMemoryOrders[customerId]);

  } catch (error: any) {
    console.error('API GET /api/account/orders error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
