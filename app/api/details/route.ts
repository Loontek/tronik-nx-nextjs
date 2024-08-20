import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function GET(req: Request, res: Response) {
	const { searchParams } = new URL(req.url);

	if (Boolean(searchParams.get('getCode'))) {
		const brandCode = searchParams.get('brandCode');
		const typeCode = searchParams.get('typeCode');
		const brand = await prisma.brand.findUnique({
			where: { code: brandCode || '' },
		});
		const type = await prisma.type.findUnique({
			where: { code: typeCode || '' },
		});

		if (!brand || !type) {
			return new NextResponse('Brand is required', { status: 400 });
		}

		const details = await prisma.detail.findMany({
			where: { brandId: brand.id, typeId: type.id },
		});

		let code = '';

		switch ((details.length + 1).toString().length) {
			case 1:
				code += '00' + (details.length + 1);
				break;
			case 2:
				code += '0' + (details.length + 1);
				break;
			case 3:
				code += details.length + 1;
				break;
		}

		return NextResponse.json(code);
	}

	const details = await prisma.detail.findMany({
		distinct: 'brandId',
		include: {
			brand: true,
			type: true,
		},
	});

	console.log(details);

	return NextResponse.json(details);
}

export async function POST(req: Request, res: Response) {
	try {
		const { brandCode, typeCode, code, description, partNumber } = await req.json();
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
			},
		});
		return NextResponse.json(newDetail);
	} catch (e) {
		console.log('[DETAILS_POST]', e);
		return new NextResponse(JSON.stringify(e), { status: 500 });
	}
}
