import Head from 'next/head'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import localFont from '@next/font/local'

const modseven = localFont({ src: '../public/modes.ttf' })

const Minting = dynamic(() => import('../components/mint'))

export default function Home() {
	return (
		<div className="h-screen flex flex-col justify-between">
			<Head>
				<title>Canto Crickets</title>
				<meta name="description" content="!chirp" />
			</Head>

			<div className='flex justify-center flex-col items-center mt-8'>
				<Image src="/smaller.gif" width={480} height={470.63} />
				<p className={`w-full text-green-500 text-center ${modseven.className} text-4xl md:text-lg mt-4`}>Canto Crickets</p>
				<p className={`w-full text-green-500 text-center ${modseven.className} text-4xl md:text-lg`}>333 supply. no roadmap.</p>
				<p className={`w-full text-green-500 text-center ${modseven.className} text-4xl md:text-lg mb-4`}>!chirp made by degens for the degens</p>

				<div className="grid-flow-col gap-4 space-x-4 justify-self-center md:place-self-center md:justify-self-end mb-4">
					<a href="https://etherscan.io/address/0xf9713c11780151f142e3d1089efaec0646bcc314"><Image src="/etherscan.png" width={32} height={32} /></a>
					<a href="https://twitter.com/cantocrickets"><Image src="/twitter.png" width={32} height={32} /></a>
				</div>

				<Minting />
			</div>
		</div>
	)
}