import { Link, useNavigate } from 'react-router-dom'
import { FaSearch } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';


export default function Header() {
    const currentUser = useSelector((state) => state.user.currentUser);

    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);


    return (
        <header className='bg-slate-200 shadow-md'>
            <div className="flex flex-wrap justify-between items-center max-w-6xl mx-auto p-3">
                <h1 className='text-sm sm:text-xl font-bold flex flex-wrap'>
                    <Link to={'/'}>
                        <span className='text-slate-500'>
                            Asif
                        </span>
                        <span className='text-slate-700'>
                            Estate
                        </span>
                    </Link>
                </h1>
                <form className='rounded-full flex items-center gap-2 p-3 bg-slate-100'>
                    <input
                        type="search"
                        placeholder="Search..."
                        className='bg-transparent outline-none w-24 sm:w-64'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch onClick={handleSubmit} className='text-slate-600' />
                </form>
                <div className='flex gap-2'>
                    <ul className='flex gap-2 font-semibold hover:underline'>
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
                                    <img crossOrigin="anonymous" src={currentUser?.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
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
