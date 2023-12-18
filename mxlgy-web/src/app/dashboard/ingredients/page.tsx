import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import IngredientLibrary from '../components/IngredientLibrary'

async function getData() {
  const userId = cookies().get('mxlgy_id')?.value

  const res = await fetch(`http://localhost:3001/api/ingredients/get_all_ingredients?userid=${userId}`, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error('Failed to fetch ingredients.')
  }

  return await res.json()
}

export default async function Ingredients() {
  try {
    const data = await getData()

    const ingredients = data.ingredients.map((ingredient: any) => ({
      name: ingredient.ingredientname,
      imageUrl: encodeURI(`https://www.thecocktaildb.com/images/ingredients/${ingredient.ingredientname}.png`),
      owned: ingredient.owned,
      price: ingredient.price
    }))

    return (
      <div className="flex flex-col gap-y-8 items-center text-blue-500 w-full">
        <h1 className="text-5xl font-extrabold">The Pantry</h1>
        <IngredientLibrary ingredients={ingredients} />
      </div>
    )
  } catch (error) {
    redirect('/dashboard/login')
  }
}
