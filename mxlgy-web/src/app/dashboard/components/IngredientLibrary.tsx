'use client'

import { useState } from 'react'

import Fuse from 'fuse.js'
import IngredientRow from './IngredientRow'

export type Ingredient = {
    name: string,
    amount: string,
    imageUrl: string,
    owned: boolean,
    price: number
}

export type IngredientLibraryProps = {
    ingredients: Ingredient[],
}

export default function IngredientLibrary(props: IngredientLibraryProps) {
    const [searchResults, setSearchResults] = useState<Ingredient[]>(props.ingredients)

    const fuse = new Fuse(props.ingredients, {
        keys: ['name'],
    })

    const unownedIngredients = searchResults.filter((ingredient) => !ingredient.owned)
    const ownedIngredients = searchResults.filter((ingredient) => ingredient.owned)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.value === '') {
            setSearchResults(props.ingredients)
        } else {
            setSearchResults(fuse.search(e.target.value).map((result) => result.item))
        }
    }

    return (
        <>
            <input onChange={handleChange} className="max-w-lg w-full text-2xl font-semibold outline-none border-2 border-black focus:border-blue-500 placeholder-neutral-600 px-4 py-3" type="text" placeholder="Search for ingredients ..." />
            <div className="grid grid-cols-2 gap-4 w-full">
                <div>
                    <div className="text-2xl font-bold text-center py-4">Unowned Ingredients</div>
                    {unownedIngredients.map((ingredient) => <IngredientRow ingredient={ingredient} key={ingredient.name} />)}
                </div>
                <div>
                <div className="text-2xl font-bold text-center py-4">Owned Ingredients</div>
                    {ownedIngredients.map((ingredient) => <IngredientRow ingredient={ingredient} key={ingredient.name} />)}
                </div>
            </div>
            {searchResults.length === 0 && <p className="text-lg text-black font-mono">No results.</p>}
        </>
    )
}
