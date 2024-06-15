import Link from "next/link";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const Footer = () => {
    return (
        <footer className="mt-16 mb-0 bg-white">
            <div className="container mx-auto px-4">
                <div className="mt-5">
                    <Link href="/" className="font-black text-tertiary-light">
                        Afric<span className='text-primary'>Vogue</span>
                    </Link>
                </div>
                <h4 className="font-semibold text-[20px] py-3">Contact</h4>
                <div className="flex flex-wrap gap-16 items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center mb-4">
                            <LocationOnIcon />
                            <a 
                                href="https://maps.app.goo.gl/segckXu4xHSfdwis9" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-2"
                            >
                                Ashaley Botwe Accra, Ghana
                            </a>
                        </div>                  
                        <div className="flex items-center mb-4">
                            <EmailIcon />
                            <a href="mailto:dheztinykartel@gmail.com" className="ml-2">
                                dheztinykartel@gmail.com
                            </a>
                        </div>
                        <div className="flex items-center mb-4">
                            <PhoneIcon />
                            <a href="tel:+2330505306932" className="ml-2">
                                0505306932
                            </a>
                        </div>
                        <div className="flex items-center mt-4">
                            <WhatsAppIcon />
                            <a href="https://wa.me/2330505306932" className="ml-2">
                                0505306932
                            </a>
                        </div>
                        <div className="flex items-center mt-4">
                            <InstagramIcon />
                            <a href="https://www.instagram.com/africvouge" className="ml-2">
                                africvouge
                            </a>
                        </div>
                    </div>
                    <div className="flex-1 md:text-right">
                        <h4 className="font-semibold text-[20px] py-3">Information</h4>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Blog Post</AccordionTrigger>
                                <AccordionContent>
                                    COMING SOON.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Our Story</AccordionTrigger>
                                <AccordionContent>
                                    For over two decades, AfricVogue has been a beacon of style and cultural pride in the African fashion industry.
                                    Established with a passion for vibrant fabrics and traditional craftsmanship, AfricVogue has consistently celebrated the rich heritage of African fashion.
                                    Our collections, inspired by diverse African cultures, 
                                    feature exquisite designs that blend contemporary trends with timeless elegance. 
                                    Through our commitment to quality and innovation, we have earned the trust and admiration of customers both locally and globally, making AfricVogue a leading name in African fashion. As we look to the future, we remain dedicated to honoring our roots while setting 
                                    new standards in fashion excellence.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Terms & Conditions</AccordionTrigger>
                                <AccordionContent>
                                    1. Introduction
                                    <p>Welcome to AfricVogue. By accessing or using our website and services,
                                    you agree to comply with and be bound by the following terms and conditions.
                                    Please read them carefully before using our services.</p>
                                    2. Definitions
                                    <p> We, us, our refers to AfricVogue.
                                        You, your refers to the user or customer using our services.
                                    </p>
                                    3. Use of the Website
                                    <p> Eligibility: By using this website, you represent 
                                        that you are at least 18 years old or have
                                        the permission of a guardian.
                                        Account: You may need to create an account to access certain features. 
                                        You are responsible for maintaining the confidentiality of your account information and for all activities under your account.
                                        Prohibited Activities: You agree not to engage in any activity that could harm the website, its users, or violate any laws.</p>
                                    4. Products and Orders 
                                    <p>
                                        Product Information: We strive to display accurate product information. 
                                        However, slight variations in color, design, or packaging may occur.
                                        Pricing: All prices are listed in Ghanaian cedis (GHS). 
                                        Prices and availability are subject to change without notice.
                                        Order Acceptance: We reserve the right to refuse or cancel any order at
                                        our discretion.
                                    </p>
                                    5. Payment
                                    <p>
                                        Methods: We accept various payment methods, including but not limited to credit/debit cards and mobile money.
                                        Payment Security: We use secure payment gateways to process transactions. 
                                        Your payment details are encrypted and safe.
                                    </p>
                                    6. Shipping and Delivery
                                    <p>
                                        Shipping: We offer local and international shipping. 
                                        Shipping costs and delivery times vary based on your location and the shipping method selected.
                                        Delivery: Delivery times are estimates and not guaranteed.
                                        We are not responsible for delays caused by carriers or customs.
                                    </p>
                                    7. Returns and Refunds
                                    <p>
                                        Returns: You may return eligible items within 14 days of receipt for a refund or exchange. Items must be in original condition and packaging.
                                        Refunds: Refunds will be processed within 7-10 business days after we receive the returned items. Shipping costs are non-refundable.
                                    </p>
                                    8. Intellectual Property
                                    <p>
                                        All content on this website, including but not limited to text, images, 
                                        graphics, logos, and designs, is the property of 
                                        AfricVogue and is protected by intellectual property laws. 
                                        Unauthorized use of any content is prohibited.
                                    </p>              
                                    9. Privacy
                                    <p>
                                        We value your privacy. Please review our Privacy Policy to understand
                                        how we collect, use, and protect your personal information.
                                    </p>
                                    10. Limitation of Liability
                                    <p>
                                        AfricVogue is not liable for any direct, indirect, incidental, special, 
                                        or consequential damages arising from your use of our website or services.
                                    </p>
                                    11. Changes to Terms and Conditions
                                    <p>
                                        We reserve the right to update these terms and conditions at any time without prior notice. Changes will be effective upon posting on the website. 
                                        Continued use of the website constitutes acceptance of the revised terms.
                                    </p>
                                    12. Governing Law
                                    <p>
                                        These terms and conditions are governed by and construed in accordance with the laws of Ghana. 
                                        Any disputes arising from these terms will be resolved in the courts of Ghana.
                                    </p>
                                    <p>
                                        Thank you for choosing AfricVogue. 
                                        We appreciate your business and look forward to serving you.
                                    </p>    
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
            <div className="h-6 md:h-[50px] w-full flex items-center justify-center">
                <a href="https://hollali.pxxl.space/" className="text-light font-bold">
                    Developed by Hollali
                </a>
            </div>
        </footer>
    );
};

export default Footer;
