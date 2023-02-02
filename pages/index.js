import Head from 'next/head'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import Link from 'next/link'

const Minting = dynamic(() => import('../components/mint'))

export default function Home() {
	return (
		<div className="h-screen flex flex-col justify-between">
			<Head>
				<title>Canto Crickets</title>
				<meta name="description" content="!chirp" />
			</Head>

			<div className='flex justify-center flex-col items-center mt-8'>
				<div className="mb-4">
					<Image src="/smaller.gif" width={480} height={470.63} />
					<p className="w-full text-center font-modseven font-bold text-10xl md:text-lg md:font-bold">Canto Crickets. 333 supply. no roadmap. !chrip made by degens for the degns</p>
				</div>

				<div className="grid-flow-col gap-4 space-x-4 justify-self-center md:place-self-center md:justify-self-end mb-4">
					<a href="https://etherscan.io/address/0xf9713c11780151f142e3d1089efaec0646bcc314"><Image src="/etherscan.png" width={32} height={32} /></a>
					<a href="https://twitter.com/cantocrickets"><Image src="/twitter.png" width={32} height={32} /></a>
				</div>

				<Minting />

				<Link href="/disclaimer"><a className="link mt-2">Legal disclaimer</a></Link>
			</div>
		</div>
	)
}