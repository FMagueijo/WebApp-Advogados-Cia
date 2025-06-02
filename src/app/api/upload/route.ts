import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_URL?.split('@')[1],
  api_key: process.env.CLOUDINARY_URL?.split(':')[1].replace('//', ''),
  api_secret: process.env.CLOUDINARY_URL?.split(':')[2].split('@')[0],
});

async function parseForm(req: any): Promise<{ file: formidable.File }> {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ file: files.file[0] });
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const { file } = await parseForm(req);
    const upload = await cloudinary.uploader.upload(file.filepath);

    // Save to DB via Prisma
    const saved = await prisma.image.create({
      data: {
        url: upload.secure_url,
      },
    });

    return NextResponse.json({ id: saved.id, url: saved.url });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
