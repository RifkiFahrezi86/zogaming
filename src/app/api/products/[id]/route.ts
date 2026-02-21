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
      UPDATE products SET
        name = ${body.name},
        slug = ${body.slug},
        category = ${body.category},
        price = ${body.price},
        sale_price = ${body.salePrice || null},
        image = ${body.image},
        description = ${body.description || ''},
        tags = ${body.tags || []},
        featured = ${body.featured || false},
        trending = ${body.trending || false},
        most_played = ${body.mostPlayed || false},
        badge = ${body.badge || null},
        rating = ${body.rating || 5},
        platform = ${body.platform || []},
        downloads = ${body.downloads || 0}
      WHERE id = ${id}
    `;

    return NextResponse.json({ message: 'Product updated' });
  } catch (error) {
    console.error('PUT product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
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
    await sql`DELETE FROM products WHERE id = ${id}`;

    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('DELETE product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
