import Head from 'next/head'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import Link from 'next/link'

const Minting = dynamic(() => import('../components/mint'))

export default function Home() {
	return (
		<div className="h-screen flex flex-col justify-between">
			<Head>
				<title>VEGENS NFT</title>
				<meta name="description" content="CANTO CRICKETS" />
			</Head>

			<div className='flex justify-center flex-col items-center mt-8'>
				<div className="mb-4">
					<Image src="/Logo_VEGENS_2.png" width={480} height={480} />
					<p className="w-full text-center font-sans font-bold text-4xl md:text-lg md:font-semibold">VEGENS NFT</p>
				</div>

				<div className="grid-flow-col gap-4 space-x-4 justify-self-center md:place-self-center md:justify-self-end mb-4">
					<a href="https://opensea.io/collection/vegens"><Image src="/opensea.png" width={32} height={32} /></a>
					<a href="https://looksrare.org/collections/0xf9713C11780151f142E3D1089efAEC0646BcC314"><Image src="/looksrare.png" width={32} height={32} /></a>
					<a href="https://x2y2.io/collection/vegens/items"><Image src="/x2y2.png" width={32} height={32} /></a>
					<a href="https://etherscan.io/address/0xf9713c11780151f142e3d1089efaec0646bcc314"><Image src="/etherscan.png" width={32} height={32} /></a>
					<a href="https://twitter.com/vegensnft"><Image src="/twitter.png" width={32} height={32} /></a>
					<a href="https://discord.gg/vegens"><Image src="/discord.png" width={40} height={32} /></a>
				</div>

				<Minting />

				<Link href="/disclaimer"><a className="link mt-2">Legal disclaimer</a></Link>
			</div>
		</div>
	)
}