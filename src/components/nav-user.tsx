"use client";

import {
  LogOut,
} from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase-client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";



export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {


const router = useRouter();





// LOGOUT

const handleLogout = async () => {

  await supabase.auth.signOut();

  router.replace("/landing");

};






return (


<SidebarMenu>


<SidebarMenuItem>


<SidebarMenuButton

size="lg"

onClick={handleLogout}

className="
cursor-pointer
hover:bg-red-500/10
hover:text-red-600
"

>



{/* LOGO */}

<div

className="
flex
h-8
w-8
items-center
justify-center
rounded-lg
overflow-hidden
"

>


<Image

src="/logo.svg"

alt="Logo"

width={28}

height={28}

className="
object-contain
"

/>


</div>








{/* TEXT */}


<div

className="
flex-1
text-left
text-sm
leading-tight
"

>


<span

className="
truncate
font-medium
"

>

Logout

</span>



</div>







<LogOut

className="
size-5
text-red-600
"

/>





</SidebarMenuButton>



</SidebarMenuItem>



</SidebarMenu>


);

}