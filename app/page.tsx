import logo from '@/public/Logo_noText_Tronik.png'
import styles from './page.module.css';
import Main from "@/app/components/Main";

const url = 'http://localhost:3000/api'

interface Detail {
	brandId: number;
	typeId: number;
	code: string;
}

const getBrands = async () => {
	const res = await fetch(`${url}/brands`)

	return await res.json()
}

const getTypes = async () => {
	const res = await fetch(`${url}/types`)

	return await res.json()
}

const getCode = async (brandId: number, typeId: number) => {
	'use server'

	const res = await fetch(`${url}/details?getCode=true&brandId=${brandId}&typeId=${typeId}`)

	return res.json()
}

const addDetail = async (detail: Detail) => {
	'use server'

	const res = fetch(`${url}/details`, {
		method: "POST",
		body: JSON.stringify(detail)
	})
}

export default async function Home() {
	const brands = await getBrands()
	const types = await getTypes()

	return (
		<>
			<header className={styles.header}>
				<img src={logo.src} alt="Tronik" width={500}/>
				<h1>Article <br/> generator </h1>
			</header>
			<Main brands={brands} types={types} getCode={getCode} addDetail={addDetail}/>
		</>
	)
}
