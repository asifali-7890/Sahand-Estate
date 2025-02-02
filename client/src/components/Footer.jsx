import { FaLinkedin, FaGithub, FaFacebook } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-slate-800 text-white py-10">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-2xl font-bold mb-2">Contact Me</h2>
                        <p>Email: <a href="mailto:gufraanquraishi@gmail.com" className="text-blue-400 hover:underline">gufraanquraishi@gmail.com</a></p>
                        <p>Phone: <a href="tel:+918420414655" className="text-blue-400 hover:underline">+91 84204 14655</a></p>
                    </div>
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-2xl font-bold mb-2">Connect with Me</h2>
                        <div className="flex space-x-4">
                            <a href="https://www.linkedin.com/in/AsifAli1010/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                                <FaLinkedin size={30} />
                            </a>
                            <a href="https://github.com/asifali-7890" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                                <FaGithub size={30} />
                            </a>
                            <a href="https://www.facebook.com/gufraan.ali.73" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                                <FaFacebook size={30} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-6">
                    <p>© 2025 Asif Ali. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;