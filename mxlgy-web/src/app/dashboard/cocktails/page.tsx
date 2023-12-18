import { cookies } from 'next/headers'
import DrinkLibrary from '../components/DrinkLibrary'
import { redirect } from 'next/navigation'

async function getData() {
  const userId = cookies().get('mxlgy_id')?.value

  const res = await fetch(`http://127.0.0.1:3001/api/recipes/get_all_recipes?userid=${userId}`)

  if (!res.ok) {
    throw new Error('Failed to fetch drinks.')
  }

  return res.json()
}

export default async function Cocktails() {
  try {
    const data = await getData()

    const drinks = data.map((drink: any) => ({
      name: drink.recipename,
      url: drink.recipename,
      imageUrl: drink.image,
      instructions: drink.instructions,
      ingredients: drink.ingredients.map((ingredient: any) => ({ name: ingredient.ingredientname, amount: ingredient.amount, price: ingredient.price, owned: ingredient.owned })),
    }))

    return (
      <div className="flex flex-col gap-y-8 items-center text-red-500">
        <h1 className="text-5xl font-extrabold">The Library</h1>
        <DrinkLibrary drinks={drinks} />
      </div>
    )
  } catch (error) {
    redirect('/dashboard/login')
  }
}
