import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'

import '../globals.css'

export const metadata = {
    title: 'Gisty - Meet people and share the hottest gist.',
    description: 'A social media network that connects people and communities talking about trending topics.'
}

const inter = Inter({
    subsets: ["latin"]
})

export default function RootLayout({ 
    children 
}: { children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang='en'>
                <body className={`${inter.className} bg-dark-1`}>
                    <div className='w-full flex justify-center items-center min-h-screen'>
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}