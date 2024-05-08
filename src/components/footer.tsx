import Link from "next/link";
import { BsFillSendFill, BsTelephoneOutbound } from "react-icons/bs";
import { BiMessageDetail } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";
import { BsGeoAlt } from "react-icons/bs";

const Footer = () => {
    return (
        <footer className="mt-16 mb-0 bg-white">
            <div className="container mx-auto px-4">
                <div className="mt-5">
                <Link href="/" className="font-black text-tertiary-light">
                    E<span className='text-primary'>store</span>
                </Link>
                </div>
                <h4 className="font-semibold text-[40px] py-6">Contact</h4>
                <div className="flex flex-wrap gap-16 items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center mb-4">
                            <BsGeoAlt />
                        Aviation Road Accra, Ghana
                        </div>                   
                        <div className="flex items-center mb-4">
                            <BsFillSendFill />
                            <a href="mailto:dheztinykartel@gmail.com" 
                            className="ml-2">dheztinykartel@gmail.com</a>
                        </div>
                        <div className="flex items-center mb-4">
                            <BsTelephoneOutbound />
                            <a href="tel:+2330505306932" className="ml-2">
                                +233 0505306932
                            </a>
                        </div>
                        <div className="flex items-center">
                            <BiMessageDetail />
                            <p className="ml-2">Live Chat: Hollali</p>
                        </div>
                        <div className="flex items-center mt-4">
                            <FaWhatsapp />
                            <a href="https://wa.me/2330505306932" className="ml-2">
                            +233 0505306932</a>
                        </div>
                    </div>
                    <div className="flex-1 md:text-right">
                        <p className="pb-4">Our Story</p>
                        <p className="pb-4">Terms of Service</p>
                        <p>Customer Support</p>
                    </div>
                </div>
            </div>
            <div className="bg-purple-100 h-6 md:h-[50px] w-full">
                <p className="text-light text-center font-bold">Developed by Hollali</p>
            </div>
        </footer>
    );
};

export default Footer;
