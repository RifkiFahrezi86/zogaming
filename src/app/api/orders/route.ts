import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let orders;
    if (user.role === 'admin') {
      // Admin sees all orders
      if (status && status !== 'all') {
        orders = await sql`SELECT * FROM orders WHERE status = ${status} ORDER BY created_at DESC`;
      } else {
        orders = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
      }
    } else {
      // Customer sees only their orders
      if (status && status !== 'all') {
        orders = await sql`SELECT * FROM orders WHERE user_id = ${user.userId} AND status = ${status} ORDER BY created_at DESC`;
      } else {
        orders = await sql`SELECT * FROM orders WHERE user_id = ${user.userId} ORDER BY created_at DESC`;
      }
    }

    // Get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order: Record<string, unknown>) => {
        const items = await sql`SELECT * FROM order_items WHERE order_id = ${order.id}`;
        return {
          id: order.id,
          userId: order.user_id,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerPhone: order.customer_phone,
          total: order.total,
          status: order.status,
          notes: order.notes,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          items: items.map((item: Record<string, unknown>) => ({
            id: item.id,
            productId: item.product_id,
            productName: item.product_name,
            productImage: item.product_image,
            quantity: item.quantity,
            price: item.price,
          })),
        };
      })
    );

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('GET orders error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });

    const body = await request.json();
    const { customerName, customerEmail, customerPhone, items, notes } = body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json({ error: 'Data pesanan tidak lengkap' }, { status: 400 });
    }

    const total = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);

    const sql = getDb();

    // Create order
    const orderResult = await sql`
      INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, total, status, notes)
      VALUES (${user.userId}, ${customerName}, ${customerEmail || user.email}, ${customerPhone}, ${total}, 'pending', ${notes || ''})
      RETURNING id
    `;

    const orderId = orderResult[0].id;

    // Create order items
    for (const item of items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price)
        VALUES (${orderId}, ${item.productId}, ${item.productName}, ${item.productImage || ''}, ${item.quantity || 1}, ${item.price})
      `;
    }

    // Send WhatsApp notification to admin
    try {
      const adminPhone = process.env.ADMIN_WHATSAPP;
      const fonnteToken = process.env.FONNTE_TOKEN;
      
      if (adminPhone && fonnteToken) {
        const itemsList = items.map((item: { productName: string; quantity: number; price: number }) => 
          `• ${item.productName} x${item.quantity} = Rp ${item.price.toLocaleString('id-ID')}`
        ).join('\n');

        const message = `*PESANAN BARU #${orderId}*\n\nCustomer: ${customerName}\nEmail: ${customerEmail || user.email}\nWhatsApp: ${customerPhone}\n\nProduk yang dipesan:\n${itemsList}\n\n*Total: Rp ${total.toLocaleString('id-ID')}*\n\nCatatan: ${notes || '-'}\n\nStatus: PENDING`;

        await fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: {
            'Authorization': fonnteToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            target: adminPhone,
            message: message,
          }),
        });
      }
    } catch (waError) {
      console.error('WhatsApp notification error:', waError);
      // Don't fail the order if WhatsApp fails
    }

    return NextResponse.json({ 
      orderId, 
      message: 'Pesanan berhasil dibuat!',
      total,
    });
  } catch (error) {
    console.error('POST orders error:', error);
    return NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 });
  }
}
