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

			<div className='flex justify-center flex-col items-center m-8'>
				<Image src="/smaller.gif" width={480} height={470.63} />
				<p className={`w-full text-green-500 text-center ${modseven.className} text-lg md:text-2xl mt-4`}>Canto Crickets</p>
				<p className={`w-full text-green-500 text-center ${modseven.className} text-lg md:text-2xl`}>333 supply. 150 $CANTO. no roadmap.</p>
				<p className={`w-full text-green-500 text-center ${modseven.className} text-lg md:text-2xl mb-4`}>!chirp made by degens for the degens</p>

					<div className="flex flex-row gap-4  justify-self-center md:place-self-center md:justify-self-end mb-4">
						<a href="https://evm.explorer.canto.io/address/0x932f297E8920D1385739B58E10fF9824a91f520a"><Image src="/etherscan.png" width={32} height={32} /></a>
						<a href="https://twitter.com/cantocrickets"><Image src="/twitter.png" width={32} height={32} /></a>
					</div>

				<Minting />
			</div>
		</div>
	)
}
