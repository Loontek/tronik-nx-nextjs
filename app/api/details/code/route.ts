import prisma from '@/lib/prismadb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;

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

		if (!details.length) {
			code += '1';
		} else {
			code += +details.slice(-1)[0].code + 1;
		}

		switch ((details.length + 1).toString().length) {
			case 1:
				code = '00' + code;
				break;
			case 2:
				code = '0' + code;
				break;
		}

		return NextResponse.json(code);
	} catch (e) {
		console.log('[DETAILS/CODE_GET]', e);
		return new NextResponse(JSON.stringify(e), { status: 500 });
	}
}
