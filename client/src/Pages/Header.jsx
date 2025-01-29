import { Link } from 'react-router-dom'
import { FaSearch } from "react-icons/fa";
import { useSelector } from 'react-redux';


export default function Header() {
    const currentUser = useSelector((state) => state.user.currentUser);

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className="flex flex-wrap justify-between items-center max-w-6xl mx-auto p-3">
                <h1 className='text-sm sm:text-xl font-bold flex flex-wrap'>
                    <Link to={'/'}>
                        <span className='text-slate-500'>
                            Sahand
                        </span>
                        <span className='text-slate-700'>
                            Estate
                        </span>
                    </Link>
                </h1>
                <form className='rounded-full flex items-center gap-2 p-3 bg-slate-100'>
                    <input type="search" placeholder="Search..." className='bg-transparent outline-none w-24 sm:w-64' />
                    <FaSearch className='text-slate-600' />
                </form>
                <div className='flex gap-2'>
                    <ul className='flex gap-2'>
                        <li className='text-slate-500 hidden sm:inline hover:underline'>
                            <Link to="/">
                                Home
                            </Link>
                        </li>
                        <li className='text-slate-500 hidden sm:inline hover:underline'>
                            <Link to="/about">
                                About
                            </Link>
                        </li>
                        <li className='text-slate-500 hover:underline'>
                            {currentUser ? (
                                <Link to="/profile">
                                    <img src={currentUser?.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                                </Link>
                            ) : (
                                <Link to="/signin">
                                    Sign In
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}
