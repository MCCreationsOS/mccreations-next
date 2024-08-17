import Menu from "@/components/Menu/Menu";
import { Suspense } from "react";

export default function MapPageLayout({ children }: {children: React.ReactNode}) {
    return (
           <Suspense>
             <Menu selectedPage={"none"}></Menu>
               {children}
           </Suspense>
     )
   }