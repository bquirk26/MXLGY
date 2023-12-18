import { cookies } from 'next/headers';
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log(cookies().get('mxlgy_id')?.value)
  return (
    <main className='flex flex-col items-center gap-y-8 min-h-screen mx-auto bg-white px-2 md:w-4/5 pb-32'>
      <header className="flex w-full justify-between items-center py-8">
        <a href="/dashboard" className="text-5xl font-bold font-mono">MXLGY</a>
        <div className="text-lg font-mono flex gap-8">
          {cookies().get('mxlgy_id')?.value === undefined ?
            <a href="/dashboard/login" className="hover:underline underline-offset-2 decoration-dotted">Login</a> :
            <a href="/dashboard/logout" className="hover:underline underline-offset-2 decoration-dotted">Logout</a>
          }
        </div>
      </header>
      {children}
      <nav className='h-16 flex justify-center items-center fixed left-0 right-0 bottom-0 bg-white border-t-2 border-black overflow-hidden'>
        <div className="text-2xl font-bold">
          <Link className='px-8 py-4 hover:bg-red-500/20 text-red-500 transition' href={'/dashboard/cocktails'}>Library</Link>
          <Link className='px-8 py-4 hover:bg-blue-500/20 text-blue-500 transition' href={'/dashboard/ingredients'}>Pantry</Link>
        </div>
      </nav>
      <footer className="hidden md:block fixed bottom-0 right-0 p-4 font-mono text-neutral-600">© 2023 MXLGY</footer>
      <footer className="hidden md:block fixed bottom-0 left-0 p-4 font-mono text-neutral-600">{cookies().get('mxlgy_id')?.value.substring(0, 16)}</footer>
    </main>
  )
}
