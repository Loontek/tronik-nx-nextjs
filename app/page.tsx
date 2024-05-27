"use client"

import logo from '@/public/Logo_noText_Tronik.png'
import styles from './page.module.css';
import {useEffect, useState} from "react";
import {Button} from "@mui/material";

const url = 'http://localhost:3000/api'

interface Brand {
	id: number;
	code: string;
	description: string;
}

interface Type {
	id: number;
	code: string;
	description: string;
}

interface Detail {
	brandId: number;
	typeId: number;
	code: string;
}

export default function Home() {
	const [brands, setBrands] = useState<Brand[]>([])
	const [types, setTypes] = useState<Type[]>([])
	const [article, setArticle] = useState<string>('')
	const [brandSelected, setBrandSelected] = useState<boolean>(false)
	const [typeSelected, setTypeSelected] = useState<boolean>(false)
	const [detail, setDetail] = useState<Detail>({
		brandId: 0,
		typeId: 0,
		code: ''
	})

	useEffect(() => {
		getBrands()
			.then(data => {
				setBrands(data)
			})
		getTypes()
			.then(data => {
				setTypes(data)
			})
	}, [])

	useEffect(() => {
		// if(brandSelected && detail.typeId) {
		// 	setTypeSelected(false)
		//
		// 	return
		// }

		if(brandSelected && typeSelected) {
			getCode(detail.brandId, detail.typeId)
				.then(data => {
					setArticle(prevState => prevState + data)
					setDetail(prevState => ({
						...prevState,
						code: data
					}))
				})
		}
	}, [brandSelected, typeSelected]);

	const getBrands = async () => {
		const res = await fetch(`${url}/brands`)

		return await res.json()
	}

	const getTypes = async () => {
		const res = await fetch(`${url}/types`)

		return await res.json()
	}

	const getCode = async (brandId: number, typeId: number) => {
		const res = await fetch(`${url}/details?getCode=true&brandId=${brandId}&typeId=${typeId}`)

		return res.json()
	}

	const addDetail = async (detail: Detail) => {
		const res = fetch(`${url}/details`, {
			method: "POST",
			body: JSON.stringify(detail)
		})
	}

	const onBrandSelect = (brand: Brand) => {
		setArticle(prevState => {
			setDetail(prevState1 => ({
				...prevState1,
				brandId: brand.id
			}))

			return prevState + brand.code
		})
		setBrandSelected(prevState => !prevState)
	}

	const onTypeSelect = (type: Type) => {
		setArticle(prevState => {
			setDetail(prevState1 => ({
				...prevState1,
				typeId: type.id
			}))

			return prevState + type.code
		})
		setTypeSelected(prevState => !prevState)
	}

	const onClear = () => {
		setArticle('')
		setBrandSelected(false)
		setTypeSelected(false)
	}

	const onCopy = () => {
		navigator.clipboard.writeText(article)

		addDetail(detail)
	}

	return (
		<>
			<header className={styles.header}>
				<img src={logo.src} alt="Tronik" width={500}/>
				<h1>Article <br/> generator </h1>
			</header>
			<main className={styles.main}>
				<h2 className={styles.article}>{article}</h2>
				<div className={styles.buttons}>
					<Button variant={"contained"} onClick={() => onCopy()}>Скопировать</Button>
					<Button variant={"contained"} color={"error"} onClick={() => onClear()}>Очистить</Button>
				</div>
				<div className={styles.selects}>
					<ul>
						{brands?.map(brand => (
							<li>
								<Button variant={"text"} color={"primary"} disabled={brandSelected} onClick={() => onBrandSelect(brand)}>{brand.code} | {brand.description}</Button>
							</li>
						))}
					</ul>
					<ul>
						{types?.map(type => (
							<li>
								<Button variant={"text"} color={"primary"} disabled={typeSelected || !brandSelected} onClick={() => onTypeSelect(type)}>{type.code} | {type.description}</Button>
							</li>
						))}
					</ul>
				</div>
			</main>
		</>
	)
}
