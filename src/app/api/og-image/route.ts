import { NextResponse } from 'next/server';

// Fetches the og:image (social media preview image) from any webpage URL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
    }

    // If URL already looks like a direct image, return as-is
    if (/\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)(\?.*)?$/i.test(url)) {
      return NextResponse.json({ imageUrl: url });
    }

    // Fetch the webpage
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 400 });
    }

    const html = await res.text();

    // Try to extract og:image
    let imageUrl = '';

    // og:image
    const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (ogMatch) {
      imageUrl = ogMatch[1];
    }

    // twitter:image fallback
    if (!imageUrl) {
      const twMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
      if (twMatch) {
        imageUrl = twMatch[1];
      }
    }

    // itemprop image fallback
    if (!imageUrl) {
      const itemMatch = html.match(/<meta[^>]*itemprop=["']image["'][^>]*content=["']([^"']+)["']/i);
      if (itemMatch) {
        imageUrl = itemMatch[1];
      }
    }

    // First large <img> as last resort
    if (!imageUrl) {
      const imgMatch = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*(width|height)=["'](\d+)/i);
      if (imgMatch && parseInt(imgMatch[3]) >= 200) {
        imageUrl = imgMatch[1];
      }
    }

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image found on this page' }, { status: 404 });
    }

    // Make relative URLs absolute
    if (imageUrl.startsWith('//')) {
      imageUrl = 'https:' + imageUrl;
    } else if (imageUrl.startsWith('/')) {
      const urlObj = new URL(url);
      imageUrl = urlObj.origin + imageUrl;
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('OG image fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
