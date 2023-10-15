import { ClerkProvider } from '@clerk/nextjs'
import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import TopBar from '@/components/shared/TopBar'
import LeftSideBar from '@/components/shared/LeftSideBar'
import RightSideBar from '@/components/shared/RightSideBar'
import BottomBar from '@/components/shared/BottomBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gisty - Meet people and share the hottest gist.',
  description: 'A social media network that connects people and communities talking about trending topics.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <TopBar />
          <main className='flex flex-row'>
            <LeftSideBar />
            <section className='main-container'>
              <div className='w-full md:max-w-4xl sm:max-w-screen-sm'>
                {children}
              </div>
            </section>
            <RightSideBar />
          </main>
          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  )
}
