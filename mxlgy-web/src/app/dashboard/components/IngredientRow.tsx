'use client'

import { Ingredient } from "./IngredientLibrary"
import { ownIngredient, disownIngredient } from "@/app/actions"

export type IngredientRowProps = {
    ingredient: Ingredient,
}

export default function IngredientRow(props: IngredientRowProps) {
    function handleClick() {
        if (props.ingredient.owned) {
            disownIngredient(props.ingredient.name)
        } else {
            ownIngredient(props.ingredient.name)
        }

        location.reload()
    }

    return (
        <div onClick={handleClick} className="flex hover:cursor-pointer hover:bg-black/5 transition border-b-2 border-black py-4">
            <img className="object-cover w-16" src={props.ingredient.imageUrl} />
            <div className="flex grow items-center justify-between p-4">
                <p className="text-black text-xl font-semibold">{props.ingredient.name}</p>
                <p className={`text-black/50 font-bold text-sm`}>{'$' + props.ingredient.price}</p>
            </div>
        </div>
    )
}
