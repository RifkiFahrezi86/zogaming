import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const sql = getDb();

    await sql`
      UPDATE orders SET status = ${body.status}, notes = COALESCE(${body.notes || null}, notes), updated_at = NOW()
      WHERE id = ${parseInt(id)}
    `;

    // If status changed to complete, send WhatsApp to customer
    if (body.status === 'complete') {
      try {
        const orderData = await sql`SELECT * FROM orders WHERE id = ${parseInt(id)}`;
        const fonnteToken = process.env.FONNTE_TOKEN;
        
        if (orderData.length > 0 && fonnteToken && orderData[0].customer_phone) {
          const message = `✅ *PESANAN #${id} SELESAI!*\n\n` +
            `Hai ${orderData[0].customer_name}! 👋\n\n` +
            `Pesanan kamu sudah *COMPLETE* ✅\n` +
            `Akun dan password sudah dikirim via WhatsApp.\n\n` +
            `Terima kasih sudah belanja di ZOGAMING! 🎮`;

          await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: { 'Authorization': fonnteToken },
            body: new URLSearchParams({
              target: orderData[0].customer_phone,
              message: message,
            }),
          });
        }
      } catch (waError) {
        console.error('WhatsApp notification error:', waError);
      }
    }

    return NextResponse.json({ message: 'Order updated' });
  } catch (error) {
    console.error('PUT order error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const sql = getDb();
    await sql`DELETE FROM orders WHERE id = ${parseInt(id)}`;

    return NextResponse.json({ message: 'Order deleted' });
  } catch (error) {
    console.error('DELETE order error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
