import {prisma} from "@/app/api";
import {NextResponse} from "next/server";

export async function GET(
    req: Request,
    res: Response
) {
    const { searchParams } = new URL(req.url)

    if(Boolean(searchParams.get('getCode'))) {
        const brandId = Number(searchParams.get('brandId'))
        const typeId = Number(searchParams.get('typeId'))
        const details = await prisma.detail.findMany()

        let code = ''

        switch (details.length.toString().length) {
            case 1:
                code += '00' + (details.length + 1)
                break
            case 2:
                code += '0' + (details.length + 1)
                break
            case 3:
                code += details.length + 1
                break
        }

        return NextResponse.json(code)
    }

    const details = await prisma.detail.findMany({
        include: {
            brand: true,
            type: true
        }
    })

    return NextResponse.json(details)
}

export async function POST(
    req: Request,
    res: Response
) {
    const body = await req.json()
    // const {brandId, typeId} = body

    // const details = await prisma.detail.findMany({
    //     where: {
    //         brandId,
    //         typeId
    //     }
    // })

    const newDetail = await prisma.detail.create({
        data: {
            ...body,
            description: 'Desc'
        }
    })

    return NextResponse.json(newDetail)
}
