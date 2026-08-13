import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profession, sector, field, category } = body;

    const categoryStr = (category || `${sector || ''} - ${field || ''}`).toLowerCase();
    const isAcademic = categoryStr.includes('academic');
    const categoryType = isAcademic ? 'academic' : 'clinical';

    const profLower = (profession || '').toLowerCase();
    let profKey = 'physiotherapy';
    if (profLower.includes('speech')) {
      profKey = 'speech-therapy';
    } else if (profLower.includes('audio')) {
      profKey = 'audiology';
    } else if (profLower.includes('occupational')) {
      profKey = 'occupational-therapy';
    } else if (profLower.includes('prosthetic') || profLower.includes('orthotic')) {
      profKey = 'prosthetics-and-orthotics';
    } else if (profLower.includes('physio')) {
      profKey = 'physiotherapy';
    }

    const ext = (profKey === 'physiotherapy') ? 'pdf' : 'docx';
    const fileName = `${profKey}-${categoryType}.${ext}`;
    const filePath = path.join(process.cwd(), 'public', 'forms', fileName);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Form guideline file not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const contentType = ext === 'pdf' 
      ? 'application/pdf' 
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="MRTB_Guideline_${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error serving guideline download:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profession = searchParams.get('profession') || '';
  const category = searchParams.get('category') || '';
  
  return POST(new Request(request.url, {
    method: 'POST',
    body: JSON.stringify({ profession, category }),
  }));
}
