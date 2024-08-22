import prisma from '@/lib/prismadb';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import DetailForm from '@/app/(root)/(routes)/components/detail-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DetailsTable from '@/app/(root)/(routes)/components/details-table';

export const revalidate = 3600;

const RootPage = async () => {
	const brands = await prisma.brand.findMany();
	const types = await prisma.type.findMany();
	const materials = await prisma.material.findMany();
	const details = await prisma.detail.findMany({
		include: {
			brand: true,
			type: true,
		},
	});

	// const newg = await prisma.material.createMany({
	// 	data: [
	// 		{ description: 'АМГ6' },
	// 		{ description: 'Ti' },
	// 		{ description: '6061' },
	// 		{ description: 'сталь' },
	// 		{ description: 'Сталь 40Х' },
	// 		{ description: '6082-T6' },
	// 		{ description: '6061-T6' },
	// 	],
	// });

	return (
		<main className="px-24 py-12 flex flex-col gap-5 max-lg:px-6 max-lg:py-3">
			<Tabs defaultValue={'newPartNumber'}>
				<TabsList className="bg-black text-white">
					<TabsTrigger value={'newPartNumber'}>Новый артикул</TabsTrigger>
					<TabsTrigger value={'partNumbersList'}>Список артикулов</TabsTrigger>
				</TabsList>
				<TabsContent className="flex flex-col gap-5 m-0" value={'newPartNumber'}>
					<Heading
						title={'Новая деталь'}
						description={'Сгенерировать артикул для новой детали'}
					/>
					<Separator />
					<div className="w-full flex justify-center items-center">
						<DetailForm brands={brands} types={types} materials={materials} />
					</div>
				</TabsContent>
				<TabsContent className="flex flex-col gap-5 m-0" value={'partNumbersList'}>
					<Heading
						title={'Список артикулов'}
						description={'Посмотреть созданные артикулы'}
					/>
					<Separator />
					<DetailsTable details={details} />
				</TabsContent>
			</Tabs>
		</main>
	);
};

export default RootPage;
