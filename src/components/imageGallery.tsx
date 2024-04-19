import Image from "next/image";
import { urlFor } from "@/lib/sanity";

interface iAppProps {
    images: any;
}
export default function ImageGallery({images}: iAppProps){
    return(
        <div className="grid gap-4 lg:grid-cols-5">
            <div className="order-last flex gap-4 lg:order-none lg:flex-col">
                {images.map((image:any, idx:any) => (
                    <div key={idx} className="overflow-hidden rounded-lg bg-gray-100">
                        <Image 
                        src={urlFor(image).url()} 
                        width={200}
                        height={200} 
                        alt="photo"
                        className="h-full w-full object-cover object-center cursor-pointer"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
