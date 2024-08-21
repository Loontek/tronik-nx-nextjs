'use client';

import {
	ColumnDef,
	ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	VisibilityState,
} from '@tanstack/table-core';
import { FC, ReactNode, useEffect, useState } from 'react';
import { flexRender, useReactTable } from '@tanstack/react-table';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import DataTablePagination from '@/components/ui/data-table-pagination';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Detail } from '@prisma/client';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

const DataTable: FC<DataTableProps<any, string>> = ({
	columns,
	data,
}: DataTableProps<any, string>) => {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			columnFilters,
			columnVisibility,
		},
	});
	const [brandFilters, setBrandFilters] = useState([
		...new Set(data.map((item) => item.brand.description)),
	]);
	const [selectedBrand, setSelectedBrand] = useState('');
	const [typeFilters, setTypeFilters] = useState([
		...new Set(data.map((item) => item.type.description)),
	]);
	const [selectedType, setSelectedType] = useState('');

	useEffect(() => {
		if (!selectedBrand) {
			setTypeFilters([...new Set(data.map((item) => item.type.description))]);
			return;
		}

		setTypeFilters([
			...new Set(
				data
					.filter((item) => item.brand.description === selectedBrand)
					.map((item) => item.type.description)
			),
		]);
	}, [selectedBrand]);

	useEffect(() => {
		if (!selectedType) {
			setBrandFilters([...new Set(data.map((item) => item.brand.description))]);
			return;
		}

		setBrandFilters([
			...new Set(
				data
					.filter((item) => item.type.description === selectedType)
					.map((item) => item.brand.description)
			),
		]);
	}, [selectedType]);

	return (
		<div className="flex flex-col gap-2">
			<div className="w-full flex gap-2 items-center max-xl:flex-col">
				<div className="w-1/2 flex gap-2 items-center max-xl:flex-col max-xl:w-full">
					<Input
						placeholder="Part number..."
						value={(table.getColumn('partNumber')?.getFilterValue() as string) ?? ''}
						onChange={(event) =>
							table.getColumn('partNumber')?.setFilterValue(event.target.value)
						}
						className="max-w-sm bg-black text-white placeholder:text-white max-xl:max-w-none"
					/>
					<Select
						onValueChange={(data) => {
							setSelectedBrand(data);
							table.getColumn('brand_description')?.setFilterValue(data);
						}}
						value={
							(table.getColumn('brand_description')?.getFilterValue() as string) ?? ''
						}
					>
						<SelectTrigger className="w-full bg-black text-white">
							<SelectValue placeholder="Выберите бренд..." />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{brandFilters.map((data) => (
									<SelectItem value={data} key={data}>
										{data}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					<Select
						onValueChange={(data) => {
							console.log(data);
							setSelectedType(data);
							table.getColumn('type_description')?.setFilterValue(data);
						}}
						value={
							(table.getColumn('type_description')?.getFilterValue() as string) ?? ''
						}
					>
						<SelectTrigger className="w-full bg-black text-white">
							<SelectValue placeholder="Выберите тип детали..." />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{typeFilters.map((data) => (
									<SelectItem value={data} key={data}>
										{data}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					<Button
						className="max-xl:w-full"
						type={'button'}
						variant={'destructive'}
						onClick={() => {
							setColumnFilters([]);
							setSelectedBrand('');
							setSelectedType('');
						}}
					>
						<Trash />
					</Button>
				</div>
				<div className="ml-auto">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto bg-black text-white">
								Columns
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(value)
											}
										>
											{`${column.columnDef.header}`}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell>No results.</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
};

export default DataTable;
