'use client'

import { useState, useEffect } from 'react'
import DrinkCard from './DrinkCard'
import DrinkModal, { DrinkModalProps } from './DrinkModal'

import Fuse from 'fuse.js'

export type DrinkLibraryProps = {
    drinks: DrinkModalProps[],
}

function sort(arr: any, sortType: 'name' | 'price' | 'percent') {
    switch (sortType) {
        case 'name': {
            return arr

        }
        case 'price': {
            return arr.toSorted((a: any, b: any) => (a['price'] < b['price'] ? 1 : -1))
        }
        case 'percent': {
            return arr.toSorted((a: any, b: any) => (a['percent'] < b['percent'] ? 1 : -1))
        }
    }
}

export default function DrinkLibrary(props: DrinkLibraryProps) {
    const [sortType, setSortType] = useState<'name' | 'price' | 'percent'>('name')

    props.drinks = props.drinks.map((drink) => ({
        ...drink,
        price: drink.ingredients.map((ingredient): number => ingredient.price).reduce((a, b) => a + b, 0),
        percent: Math.round(100 * drink.ingredients.map((ingredient): number => ingredient.owned ? 1 : 0).reduce((a, b) => a + b, 0) / drink.ingredients.length)
    }))

    const [drink, setDrink] = useState<DrinkModalProps | null>(null)
    const [searchResults, setSearchResults] = useState<DrinkModalProps[]>(props.drinks)

    const fuse = new Fuse(props.drinks, {
        keys: ['name'],
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.value == '') {
            setSearchResults(props.drinks.map((drink) => ({
                ...drink,
                price: drink.ingredients.map((ingredient): number => ingredient.price).reduce((a, b) => a + b, 0),
                percent: Math.round(100 * drink.ingredients.map((ingredient): number => ingredient.owned ? 1 : 0).reduce((a, b) => a + b, 0) / drink.ingredients.length)
            })))
        } else {
            setSearchResults(fuse.search(e.target.value).map((result) => result.item))
        }
    }

    return (
        <>
            <input onChange={handleChange} className="max-w-lg w-full text-2xl font-semibold outline-none border-2 border-black focus:border-red-500 placeholder-neutral-600 px-4 py-3" type="text" placeholder="Search for cocktails ..." />
            <div className="flex gap-4">
                <button onClick={() => setSortType("name")} className={`${sortType === "name" ? 'bg-red-500 text-white hover:bg-red-600' : 'hover:bg-red-100'} rounded-full font-semibold border-2 border-red-500 px-4 py-2 transition`}>Sort Alphabetically</button>
                <button onClick={() => setSortType("price")} className={`${sortType === "price" ? 'bg-red-500 text-white hover:bg-red-600' : 'hover:bg-red-100'} rounded-full font-semibold border-2 border-red-500 px-4 py-2 transition`}>Sort By Cost</button>
                <button onClick={() => setSortType("percent")} className={`${sortType === "percent" ? 'bg-red-500 text-white hover:bg-red-600' : 'hover:bg-red-100'} rounded-full font-semibold border-2 border-red-500 px-4 py-2 transition`}>Sort By Makeability</button>
            </div>
            {searchResults.length === 0 && <p className="text-lg text-black font-mono">No results.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {sort(searchResults, sortType).map((drink: any) => <div className="hover:cursor-pointer" key={drink.name} onClick={() => setDrink(drink)}><DrinkCard {...drink} /></div>)}
            </div>
            {drink && <DrinkModal close={() => setDrink(null)} {...drink} />}
        </>
    )
}
