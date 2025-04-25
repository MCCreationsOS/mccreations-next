import Menu from "@/components/Menu/Navbar";
import { Suspense } from "react";

export default function MapPageLayout({ children }: {children: React.ReactNode}) {
    return (
           <Suspense>
               {children}
           </Suspense>
     )
   }