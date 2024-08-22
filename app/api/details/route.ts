import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function GET() {
	try {
		const details = await prisma.detail.findMany({
			include: {
				brand: true,
				type: true,
			},
		});

		return NextResponse.json(details);
	} catch (e) {
		console.log('[DETAILS_GET]', e);
		return new NextResponse(JSON.stringify(e), { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const { brandCode, typeCode, code, description, partNumber, material, carModels } =
			await req.json();
		const brand = await prisma.brand.findFirst({ where: { code: brandCode } });
		const type = await prisma.type.findFirst({ where: { code: typeCode } });

		if (!brand) {
			return new NextResponse('Brand is required', { status: 400 });
		}
		if (!type) {
			return new NextResponse('Type is required', { status: 400 });
		}

		const newDetail = await prisma.detail.create({
			data: {
				brandId: brand.id,
				typeId: type.id,
				code,
				description,
				partNumber,
				materialId: material,
				carModels,
			},
		});

		return NextResponse.json(newDetail);
	} catch (e) {
		console.log('[DETAILS_POST]', e);
		return new NextResponse(JSON.stringify(e), { status: 500 });
	}
}
