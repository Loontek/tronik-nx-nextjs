import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
	const path = req.nextUrl.searchParams.get('path');

	if (path) {
		revalidatePath(path, 'page');

		return NextResponse.json({ revalidated: true, now: Date.now() });
	}

	return NextResponse.json({ revalidated: false, now: Date.now(), message: 'Missing path' });
}
