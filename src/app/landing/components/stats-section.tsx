"use client"

import { 
  useEffect,
  useState
} from "react"

import {
  CalendarDays,
  CalendarRange,
  Users,
  Star,
  BarChart3
} from "lucide-react"

import {
  motion,
  AnimatePresence
} from "framer-motion"

import {
  supabase
} from "@/lib/supabase-client"


import {
  Card,
  CardContent
} from "@/components/ui/card"



type Stats = {

  today_visitors:number

  week_visitors:number

  total_visitors:number

  average_rating:number

}



function AnimatedNumber({
  value,
  suffix=""
}:{
  value:number
  suffix?:string
}){


return (

<AnimatePresence mode="wait">


<motion.span

key={value}

initial={{
opacity:0,
y:15,
scale:.9
}}

animate={{
opacity:1,
y:0,
scale:1
}}

transition={{
duration:.4
}}

>

{value.toLocaleString("id-ID")}
{suffix}

</motion.span>


</AnimatePresence>

)

}




export function StatsSection(){


const [stats,setStats] =
useState<Stats>({

today_visitors:0,

week_visitors:0,

total_visitors:0,

average_rating:0

})


const [
updated,
setUpdated
]=useState(false)



useEffect(()=>{


fetchStats()


const interval =
setInterval(
fetchStats,
60000
)


return ()=>clearInterval(interval)


},[])



async function fetchStats(){


const {
data:visitor,
error
}=await supabase

.from("landing_statistics")
.select("*")
.single()



if(error){

console.error(error)

return

}




const {
data:feedback

}=await supabase

.from("feedbacks")
.select("rating")




let avgRating = 0



if(
feedback &&
feedback.length
){


const total =
feedback.reduce(
(sum,item)=>
sum + Number(item.rating),
0
)


avgRating =
Number(
(
total /
feedback.length
)
.toFixed(1)
)


}




setStats({

today_visitors:
visitor.today_visitors ?? 0,


week_visitors:
visitor.week_visitors ?? 0,


total_visitors:
visitor.total_visitors ?? 0,


average_rating:
avgRating


})



setUpdated(true)


setTimeout(
()=>setUpdated(false),
800
)


}







const cards=[


{
icon:CalendarDays,

value:stats.today_visitors,

label:
"Pengunjung Hari Ini",

description:
"Kunjungan hari ini"

},


{
icon:CalendarRange,

value:stats.week_visitors,

label:
"Pengunjung 7 Hari",

description:
"Jumlah kunjungan minggu ini"

},



{
icon:Users,

value:stats.total_visitors,

label:
"Total Pengunjung",

description:
"Seluruh kunjungan website"

},



{
icon:Star,

value:stats.average_rating,

suffix:" /5",

label:
"Rating Pengguna",

description:
"Rata-rata kepuasan pengguna"

}


]







return (

<section

className="
relative
overflow-hidden

py-20
sm:py-28

bg-gradient-to-b

from-white
via-green-50/50
to-white

dark:from-[#020817]
dark:via-[#041b11]
dark:to-[#020817]

"


>



{/* BACKGROUND */}

<div

className="
absolute
top-0
left-0

w-96
h-96

bg-green-300/20

rounded-full

blur-3xl

dark:bg-green-500/10

"

/>





<div

className="
container
mx-auto

px-4
sm:px-6
lg:px-8

relative

"

>



{/* HEADER */}

<motion.div

initial={{
opacity:0,
y:30
}}

whileInView={{
opacity:1,
y:0
}}

viewport={{
once:true
}}

className="
text-center
max-w-3xl
mx-auto
mb-12
"

>


<div

className="
mx-auto
mb-4

w-fit

rounded-full

bg-primary/10

p-3

"

>

<BarChart3

className="
h-8
w-8
text-primary

"

/>

</div>



<h2

className="
text-3xl
sm:text-4xl

font-bold

"

>

Statistik
Monitor Patuh LH

</h2>


<p

className="
mt-4

text-muted-foreground

"

>

Informasi statistik kunjungan website
dan tingkat kepuasan pengguna layanan.

</p>


</motion.div>






{/* CARDS */}


<div

className="

grid

grid-cols-1

sm:grid-cols-2

lg:grid-cols-4

gap-5
sm:gap-6

"

>


{
cards.map(
(card,index)=>(


<motion.div

key={index}


initial={{
opacity:0,
y:40
}}

whileInView={{
opacity:1,
y:0
}}

viewport={{
once:true
}}

transition={{
delay:index*.1
}}


animate={
updated
?
{
scale:[1,1.03,1]
}
:
{}
}


>


<Card

className="
h-full

text-center

bg-background/60

backdrop-blur

border-border/50

hover:shadow-lg

transition

"

>


<CardContent

className="
p-6

"

>


<div

className="
flex
justify-center
mb-5

"

>


<div

className="
rounded-xl

bg-primary/10

p-3

"

>


<card.icon

className="
h-7
w-7
text-primary

"

/>


</div>


</div>





<h3

className="
text-3xl
font-bold

"

>


<AnimatedNumber

value={card.value}

suffix={
card.suffix
}

/>


</h3>





<p

className="
font-semibold
mt-2

"

>

{card.label}

</p>




<p

className="
text-sm

text-muted-foreground

mt-1

"

>

{card.description}

</p>



</CardContent>


</Card>


</motion.div>


)

)

}


</div>


</div>


</section>


)

}