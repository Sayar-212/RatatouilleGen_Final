import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const countFilePath = path.join(process.cwd(), 'data', 'global-count.json');

export async function GET() {
  try {
    const data = fs.readFileSync(countFilePath, 'utf8');
    const { count } = JSON.parse(data);
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0 });
  }
}

export async function POST() {
  try {
    let count = 0;
    try {
      const data = fs.readFileSync(countFilePath, 'utf8');
      count = JSON.parse(data).count;
    } catch (error) {
      // File doesn't exist, start with 0
    }
    
    count += 1;
    fs.writeFileSync(countFilePath, JSON.stringify({ count }));
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update count' }, { status: 500 });
  }
}