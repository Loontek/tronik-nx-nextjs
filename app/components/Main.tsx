"use client"

import styles from "@/app/components/Main.module.css";
import {Button, TextField} from "@mui/material";
import List from "@/app/components/List";
import {ChangeEvent, useEffect, useState} from "react";
import toast from "react-hot-toast";

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

interface IMain {
    brands: Brand[];
    types: Type[];
    getCode: any;
    addDetail: any
}

export default function Main({ brands, types, getCode, addDetail }: IMain) {
    const [article, setArticle] = useState<string>('')
    const [brandSelected, setBrandSelected] = useState<boolean>(false)
    const [typeSelected, setTypeSelected] = useState<boolean>(false)
    const [detail, setDetail] = useState<Detail>({
        brandId: 0,
        typeId: 0,
        code: '',
    })
    const [description, setDescription] = useState<string>('')

    useEffect(() => {
        if(brandSelected && typeSelected) {
            getCode(detail.brandId, detail.typeId)
                .then((data: any) => {
                    setArticle(prevState => prevState + data)
                    setDetail(prevState => ({
                        ...prevState,
                        code: data
                    }))
                })
        }
    }, [brandSelected, typeSelected])

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
        setDescription('')
    }

    const onSave = () => {
        const addPromise = addDetail({
            ...detail,
            description
        })

        toast.promise(addPromise, {
            loading: 'Сохраняем артикул...',
            success: 'Артикул сохранён',
            error: 'Что-то пошло не так...'
        })
    }

    const onCopy = () => {
        const copyPromise = navigator.clipboard.writeText(article)

        toast.promise(copyPromise, {
            loading: 'Копируем артикул...',
            success: 'Артикул скопирован в буфер обмена',
            error: 'Сохранить не получилось'
        })
    }

    const onDescriptionChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDescription(e.target.value)
    }

    useEffect(() => {
        console.log(description)
    }, [description])


    return (
        <main className={styles.main}>
            <h2 className={styles.article}>{article}</h2>
            <TextField placeholder={'Введите описание'} value={description} onChange={(e) => onDescriptionChange(e)}/>
            <div className={styles.buttons}>
                <Button variant={"contained"} onClick={() => onSave()}>Сохранить</Button>
                <Button variant={"contained"} onClick={() => onCopy()}>Скопировать</Button>
                <Button variant={"contained"} color={"error"} onClick={() => onClear()}>Очистить</Button>
            </div>
            <div className={styles.selects}>
                <List list={brands} onClick={onBrandSelect} selected={brandSelected}/>
                <List list={types} onClick={onTypeSelect} selected={typeSelected}/>
            </div>
        </main>
    )
}