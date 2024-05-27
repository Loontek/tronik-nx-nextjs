import {prisma} from "@/app/api";
import {NextResponse} from "next/server";

export async function GET(
    req: Request,
    res: Response
) {
    const types = await prisma.type.findMany()

    return NextResponse.json(types)
}

export async function POST(
    req: Request,
    res: Response
) {
    const { searchParams } = new URL(req.url)
    const body = await req.json()

    if(Boolean(searchParams.get('many'))) {
        const newTypes = await prisma.type.createMany({
            data: body
        })

        return NextResponse.json(newTypes)
    }

    if(!Boolean(searchParams.get('many'))) {
        const newType = await prisma.type.create({
            data: body
        })

        return NextResponse.json(newType)
    }
}
