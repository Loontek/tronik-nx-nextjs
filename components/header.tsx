'use client';
import Image from 'next/image';
import logo from '@/public/tronik-logo1-1.png';

const Header = () => {
	return (
		<header className="flex justify-between items-center bg-gradient-to-br from-black from-40% to-transparent to-60% px-24 py-8 max-lg:px-6 max-lg:py-4 max-lg:from-60% max-lg:to-80%">
			<a href="#" className="flex gap-10 max-lg:flex-col max-lg:gap-2">
				<Image src={logo} alt="Logo" />
				<h1 className="flex flex-col text-white uppercase font-bold text-xl">
					Article
					<br />
					Generator
				</h1>
			</a>
		</header>
	);
};

export default Header;
