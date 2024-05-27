import {prisma} from "@/app/api";
import {NextResponse} from "next/server";

export async function GET(
    req: Request,
    res: Response
) {
    const brands = await prisma.brand.findMany()

    return NextResponse.json(brands)
}

export async function POST(
    req: Request,
    res: Response
) {
    const { searchParams } = new URL(req.url)
    const body = await req.json()

    if(Boolean(searchParams.get('many'))) {
        const newBrands = await prisma.brand.createMany({
            data: body
        })

        return NextResponse.json(newBrands)
    }

    if(!Boolean(searchParams.get('many'))) {
        const newBrand = await prisma.brand.create({
            data: body
        })

        return NextResponse.json(newBrand)
    }
}
