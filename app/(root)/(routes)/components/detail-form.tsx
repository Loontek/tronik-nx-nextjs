'use client';

import { Brand, Type } from '@prisma/client';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Copy, Loader, Save, Trash } from 'lucide-react';

const detailFormSchema = z.object({
	description: z.string().optional(),
	brand: z.string().length(3, { message: 'Это поле обязательно' }),
	type: z.string().length(2, { message: 'Это поле обязательно' }),
	code: z.string(),
});

export type DetailFormValues = z.infer<typeof detailFormSchema>;

interface DetailFormProps {
	brands: Brand[];
	types: Type[];
}

const DetailForm: FC<DetailFormProps> = ({ brands, types }) => {
	const form = useForm<DetailFormValues>({
		resolver: zodResolver(detailFormSchema),
		defaultValues: {
			description: '',
			brand: '',
			type: '',
			code: '',
		},
	});
	const [partNumber, setPartNumber] = useState('');
	const [savedPartNumber, setSavedPartNumber] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const subscription = form.watch((value) => {
			const brand = value.brand || '';
			const type = value.type || '';
			const code = value.code || '';
			const partNumber = `${brand}${type}${code}`;

			if (brand !== '' && type !== '' && code === '') {
				getCode(brand, type).then((data: any) => {
					form.setValue('code', data);
				});
			}

			setPartNumber(partNumber);
		});

		return () => subscription.unsubscribe();
	}, [form.watch]);

	const onSubmit = async (data: DetailFormValues) => {
		try {
			setLoading(true);

			const detail = {
				description: data.description,
				brandCode: data.brand,
				typeCode: data.type,
				code: data.code,
				partNumber,
			};

			const res = await fetch(`/api/details`, {
				method: 'POST',
				body: JSON.stringify(detail),
			});

			setSavedPartNumber(partNumber);

			form.setValue('code', '');

			toast.success(`Добавлен артикул ${partNumber}`);
		} catch (e: any) {
			console.log(e.message);
			toast.error('Что-то пошло не так');
		} finally {
			setLoading(false);
		}
	};

	const onReset = () => {
		setPartNumber('');
		setSavedPartNumber('');
		form.reset();
	};

	const onCopy = async () => {
		if (!partNumber) {
			toast.error('Артикул пуст');
			return;
		}

		if (partNumber.length < 8) {
			toast.error('Артикул не полный');
			return;
		}

		if (!savedPartNumber) {
			toast.error('Артикул не сохранён');
			return;
		}

		const copyPromise = navigator.clipboard.writeText(savedPartNumber);

		toast.promise(copyPromise, {
			loading: 'Копируем артикул...',
			success: 'Артикул скопирован в буфер обмена',
			error: 'Сохранить не получилось',
		});
	};

	const getCode = async (brand: string, type: string) => {
		try {
			const res = await fetch(
				`/api/details?getCode=true&brandCode=${brand}&typeCode=${type}`
			);

			return await res.json();
		} catch (e: any) {
			console.log(e.message);
		}
	};

	return (
		<Form {...form}>
			<form
				className="w-1/2 flex flex-col gap-4 justify-center items-center max-xl:w-full"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="w-3/4 justify-center">
					<InputOTP maxLength={8} readOnly={true} value={partNumber}>
						<InputOTPGroup className="w-full flex justify-center">
							<InputOTPSlot index={0} className="bg-black text-white" />
							<InputOTPSlot index={1} className="bg-black text-white" />
							<InputOTPSlot index={2} className="bg-black text-white" />
							<InputOTPSeparator />
							<InputOTPSlot index={3} className="bg-black text-white" />
							<InputOTPSlot index={4} className="bg-black text-white" />
							<InputOTPSeparator />
							<InputOTPSlot index={5} className="bg-black text-white" />
							<InputOTPSlot index={6} className="bg-black text-white" />
							<InputOTPSlot index={7} className="bg-black text-white" />
						</InputOTPGroup>
					</InputOTP>
				</div>
				<FormField
					name={'description'}
					control={form.control}
					render={({ field }) => (
						<FormItem className="flex flex-col gap-1 w-full">
							<FormLabel>Описание</FormLabel>
							<FormControl>
								<Input
									className="bg-gray-200"
									placeholder={'Описание...'}
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<div className="flex gap-4 w-full max-xl:flex-col">
					<FormField
						name={'brand'}
						control={form.control}
						render={({ field }) => (
							<FormItem className="w-1/2 max-xl:w-full">
								<div className="flex justify-between">
									<FormLabel>Бренд</FormLabel>
									<FormMessage className="leading-[1]" />
								</div>
								<Select
									onValueChange={(data) => {
										const type = form.getValues().type;
										const code = form.getValues().code;

										if (code) {
											getCode(data, type).then((data: any) => {
												form.setValue('code', data);
											});
										}

										field.onChange(data);
									}}
									value={field.value}
									disabled={loading}
								>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Выберите бренд..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											{brands.map((brand) => (
												<SelectItem value={brand.code} key={brand.code}>
													{brand.description}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>
					<FormField
						name={'type'}
						control={form.control}
						render={({ field }) => (
							<FormItem className="w-1/2 max-xl:w-full">
								<div className="flex justify-between">
									<FormLabel>Тип детали</FormLabel>
									<FormMessage className="leading-[1]" />
								</div>
								<Select
									onValueChange={(data) => {
										const brand = form.getValues().brand;
										const code = form.getValues().code;

										if (code) {
											getCode(brand, data).then((data: any) => {
												form.setValue('code', data);
											});
										}

										field.onChange(data);
									}}
									value={field.value}
									disabled={loading || !form.getValues().brand}
								>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Выберите тип детали..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											{types.map((type) => (
												<SelectItem value={type.code} key={type.code}>
													{type.description}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>
				</div>
				<div className="flex w-full gap-6 max-md:flex-col max-md:gap-2">
					<Button
						className="flex gap-1 w-full"
						variant={'outline'}
						type={'submit'}
						disabled={loading}
					>
						{loading ? (
							<>
								<Loader className="animate-spin" />
								Добавляется
							</>
						) : (
							<>
								<Save />
								Сохранить
							</>
						)}
					</Button>
					<Button
						className="flex gap-1 w-full"
						variant={'outline'}
						type={'button'}
						onClick={onCopy}
					>
						<Copy />
						Скопировать
					</Button>
					<Button
						className="flex gap-1 w-full"
						variant={'destructive'}
						type={'button'}
						onClick={onReset}
					>
						<Trash />
						Очистить
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default DetailForm;
