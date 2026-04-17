import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  
  if (!name) return new NextResponse('Missing name', { status: 400 });
  
  const basePath = 'C:\\Users\\Adhil M\\.gemini\\antigravity\\brain\\b23a43ee-6392-4423-8215-ee0d02dc08d4';
  const filePath = path.join(basePath, name);
  
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    return new NextResponse('Not found', { status: 404 });
  }
}
