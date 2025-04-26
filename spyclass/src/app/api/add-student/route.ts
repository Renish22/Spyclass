import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { name, address, enrollment, image } = data;

  const tempImagePath = path.join(process.cwd(), 'public', 'students', `${enrollment}.jpg`);
  const imagePath = path.join('students', `${enrollment}.jpg`);

  // Save the image temporarily
  try {
    const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    fs.writeFileSync(tempImagePath, imageBuffer);
  } catch (err) {
    console.error('Error saving image:', err);
    return NextResponse.json({ error: 'Image saving failed' }, { status: 500 });
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(tempImagePath));
  form.append('enrollment_id', enrollment);
  form.append('student_name', name);
  form.append('student_address', address);
  form.append('image_path', imagePath);

  try {
    const response = await axios.post('http://localhost:8000/add-student', form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return NextResponse.json({ success: true, message: 'Student added successfully' });
  } catch (error: any) {
    console.error('FRS request error:', error?.response?.data || error.message);
    return NextResponse.json({ success: false, message: error?.response?.data.message || error.message });
    // return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
