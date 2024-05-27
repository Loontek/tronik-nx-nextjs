import logo from '@/public/Logo_noText_Tronik.png'
import styles from './page.module.css';
import Main from "@/app/components/Main";
import {Toaster} from "react-hot-toast";

const url = 'https://tronik-nx-nextjs.vercel.app/api'

interface Detail {
	brandId: number;
	typeId: number;
	code: string;
}

const getBrands = async () => {
	try {
		const res = await fetch(`${url}/brands`)

		return await res.json()
	} catch (e: any){
		console.log(e.message)
	}
}

const getTypes = async () => {
	try {
		const res = await fetch(`${url}/types`)

		return await res.json()
	} catch (e: any){
		console.log(e.message)
	}
}

const getCode = async (brandId: number, typeId: number) => {
	'use server'
	try {
		const res = await fetch(`${url}/details?getCode=true&brandId=${brandId}&typeId=${typeId}`)

		return await res.json()
	} catch (e: any){
		console.log(e.message)
	}
}

const addDetail = async (detail: Detail) => {
	'use server'
	try {
		const res = fetch(`${url}/details`, {
			method: "POST",
			body: JSON.stringify(detail)
		})
	} catch (e: any){
		console.log(e.message)
	}
}

export default async function Home() {
	const brands = await getBrands()
	const types = await getTypes()

	return (
		<>
			<Toaster />
			<header className={styles.header}>
				<img src={logo.src} alt="Tronik" width={500}/>
				<h1>Article <br/> generator </h1>
			</header>
			<Main brands={brands} types={types} getCode={getCode} addDetail={addDetail}/>
		</>
	)
}
