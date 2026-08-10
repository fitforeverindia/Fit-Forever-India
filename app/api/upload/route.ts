import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';

// Configure Cloudinary from process.env
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'ufptbplr',
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '288162448358875',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ur_18hXlr6h3pXGWE8Yo6YrnYWs',
  secure: true,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
      return NextResponse.json({ url: image });
    }

    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: 'fit_forever_media',
      resource_type: 'auto',
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error: any) {
    console.error('Cloudinary API upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload image to Cloudinary' },
      { status: 500 }
    );
  }
}
