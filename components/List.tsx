"use client"

import {Button} from "@mui/material";
import styles from "@/components/List.module.css"

interface IList {
    list: any;
    onClick: any;
    selected: boolean;
}

export default function List({ list, onClick, selected }: IList) {
    return (
        <ul className={styles.list}>
            {list?.map((item: any) => (
                <li key={item.code}>
                    <Button variant={"text"} color={"primary"} disabled={selected}
                            onClick={() => onClick(item)}>{item.code} | {item.description}</Button>
                </li>
            ))}
        </ul>
    )
}