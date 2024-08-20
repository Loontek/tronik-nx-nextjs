'use client';

import { Brand, Detail, Type } from '@prisma/client';
import { FC, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/table-core';
import DataTable from '@/components/ui/data-table';

interface DetailsListProps {
	details: {
		partNumber: string;
		brand: Brand;
		type: Type;
		code: string;
	}[];
}

const DetailsTable: FC<DetailsListProps> = ({ details }) => {
	const router = useRouter();
	const columns: ColumnDef<Detail>[] = [
		{
			accessorKey: 'partNumber',
			header: 'Part number',
			filterFn: 'includesString',
		},
		{
			accessorKey: 'description',
			header: 'Description',
		},
		{
			accessorKey: 'brand.description',
			header: 'Brand',
			filterFn: 'equalsString',
		},
		{
			accessorKey: 'type.description',
			header: 'Type',
			filterFn: 'equalsString',
		},
		{
			accessorKey: 'code',
			header: 'Code',
		},
	];

	useEffect(() => {
		router.refresh();
	}, []);

	return <DataTable columns={columns} data={details} />;
};

export default DetailsTable;
