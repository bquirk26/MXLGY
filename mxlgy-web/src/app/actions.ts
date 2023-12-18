'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(userId: string) {
    const res = await fetch(`http://127.0.0.1:3001/api/users/exists?userid=${userId}`)

    if (res.ok) {
        cookies().set('mxlgy_id', userId)
        revalidatePath('/', 'layout')
        redirect('/dashboard/cocktails')
    } else {
        throw new Error('Failed to login.')
    }
}

export async function signup(userId: string) {
    const res = await fetch(`http://127.0.0.1:3001/api/users/signup?userid=${userId}`)

    if (res.ok) {
        cookies().set('mxlgy_id', userId)
        revalidatePath('/', 'layout')
        redirect('/dashboard/cocktails')
    } else {
        throw new Error('Failed to signup.')
    }
}

export async function logout() {
    cookies().delete('mxlgy_id')
    revalidatePath('/', 'layout')
    redirect('/dashboard/cocktails')
}

export async function ownIngredient(ingredientName: string) {
    const userId = cookies().get('mxlgy_id')?.value
    const res = await fetch(`http://127.0.0.1:3001/api/ingredients/${encodeURIComponent(ingredientName)}/own?userid=${userId}`)

    if (res.ok) {
        revalidatePath('/')
    } else {
        throw new Error('Failed to own ingredient.')
    }}

export async function disownIngredient(ingredientName: string) {
    const userId = cookies().get('mxlgy_id')?.value
    const res = await fetch(`http://127.0.0.1:3001/api/ingredients/${encodeURIComponent(ingredientName)}/disown?userid=${userId}`)

    if (res.ok) {
        revalidatePath('/')
    } else {
        throw new Error('Failed to disown ingredient.')
    }
}
