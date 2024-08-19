'use client';

import { Brand, Type } from '@prisma/client';
import { FC, useEffect } from 'react';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';

interface DetailsListProps {
	details: {
		partNumber: string;
		brand: Brand;
		type: Type;
		code: string;
	}[];
}

const DetailsList: FC<DetailsListProps> = ({ details }) => {
	const router = useRouter();

	useEffect(() => {
		router.refresh();
	}, []);

	return (
		<Table>
			<TableCaption>Part numbers list.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">Part number</TableHead>
					<TableHead>Brand</TableHead>
					<TableHead>Type</TableHead>
					<TableHead className="text-right">Code</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{details.map((detail, index) => (
					<TableRow
						className={`${index % 2 == 0 ? 'bg-gray-400 text-white hover:bg-gray-300' : 'hover:bg-gray-300'}`}
					>
						<TableCell className="font-medium">{detail.partNumber}</TableCell>
						<TableCell>{detail.brand.description}</TableCell>
						<TableCell>{detail.type.description}</TableCell>
						<TableCell className="text-right">{detail.code}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default DetailsList;
