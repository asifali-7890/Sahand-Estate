import { Link } from 'react-router-dom'
import { FaSearch } from "react-icons/fa";

export default function Header() {
    return (
        <header className='bg-slate-200 shadow-md'>
            <div className="flex flex-wrap justify-between items-center max-w-6xl mx-auto p-3">
                <h1 className='text-sm sm:text-xl font-bold flex flex-wrap'>
                    <span className='text-slate-500'>
                        Sahand
                    </span>
                    <span className='text-slate-700'>
                        Estate
                    </span>
                </h1>
                <form className='rounded-full flex items-center gap-2 p-3 bg-slate-100'>
                    <input type="search" placeholder="Search..." className='bg-transparent outline-none w-24 sm:w-64' />
                    <FaSearch className='text-slate-600' />
                </form>
                <div className='flex gap-2'>
                    <ul className='flex gap-2'>
                        <li className='text-slate-500 hidden sm:inline hover:underline'>
                            <Link to="/home">Home</Link>
                        </li>
                        <li className='text-slate-500 hidden sm:inline hover:underline'>
                            <Link to="/about">About</Link>
                        </li>
                        <li className='text-slate-500 hover:underline'>
                            <Link to="/signin">Sign In</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}
