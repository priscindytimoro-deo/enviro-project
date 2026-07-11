"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import {
  Star,
  Send,
  MessageSquareText,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

import { supabase } from "@/lib/supabase-client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"


export function FeedbackSection() {

  const [nama, setNama] = useState("")
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState(0)
  const [pesan, setPesan] = useState("")


  const [loading, setLoading] = useState(false)


  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<
    "success" | "error" | ""
  >("")


  const [errors, setErrors] = useState({

    nama: "",
    email: "",
    rating: "",
    pesan: "",

  })



  function validateForm(){

    const newErrors = {

      nama:"",
      email:"",
      rating:"",
      pesan:"",

    }



    if(!nama.trim()){

      newErrors.nama =
      "Nama lengkap wajib diisi."

    }



    if(!email.trim()){

      newErrors.email =
      "Email wajib diisi."

    }
    else if(
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email)
    ){

      newErrors.email =
      "Format email tidak valid."

    }




    if(rating === 0){

      newErrors.rating =
      "Silakan pilih rating terlebih dahulu."

    }



    if(!pesan.trim()){

      newErrors.pesan =
      "Masukan wajib diisi."

    }
    else if(
      pesan.length < 10
    ){

      newErrors.pesan =
      "Masukan minimal 10 karakter."

    }



    setErrors(newErrors)


    return Object.values(newErrors)
    .every(
      item => item === ""
    )

  }





  async function handleSubmit(
    e: React.FormEvent
  ){

    e.preventDefault()


    setMessage("")
    setStatus("")



    const valid = validateForm()



    if(!valid){

      setStatus("error")

      setMessage(
        "Mohon periksa kembali data Anda."
      )

      return

    }



    setLoading(true)



    const { error } = await supabase
    .from("feedbacks")
    .insert({

      nama,
      email,
      rating,
      pesan,

    })



    setLoading(false)




    if(error){

      console.error(error)


      setStatus("error")

      setMessage(
        "Terjadi kesalahan saat mengirim masukan."
      )


      return

    }




    setNama("")
    setEmail("")
    setRating(0)
    setPesan("")


    setStatus("success")

    setMessage(
      "Terima kasih. Masukan Anda berhasil dikirim."
    )


  }





  return (

<section
className="
relative
py-5
bg-gradient-to-b
from-white
via-green-50/50
to-white

dark:from-[#020817]
dark:via-[#041b11]
dark:to-[#020817]
"
>


<div
className="
container
mx-auto
px-4
sm:px-6
lg:px-8
"
>


<Card
className="
max-w-3xl
mx-auto
bg-background/70
backdrop-blur
border-border/50
"
>


<CardHeader
className="text-center"
>


<motion.div

initial={{
scale:0,
opacity:0
}}

whileInView={{
scale:1,
opacity:1
}}

transition={{
duration:.5
}}

className="
mx-auto
mb-4
rounded-full
bg-primary/10
p-3
"

>

<MessageSquareText
className="
h-8
w-8
text-primary
"
/>

</motion.div>



<CardTitle
className="text-2xl"
>

Saran & Penilaian

</CardTitle>


<p
className="
text-muted-foreground
"
>

Berikan pengalaman Anda terhadap layanan
Monitor Patuh LH.

</p>


</CardHeader>




<CardContent>


<form
onSubmit={handleSubmit}
className="
space-y-5
"
>



{/* NAMA */}

<div>

<div
className="
relative
"
>

<User
className="
absolute
left-3
top-3
size-4
text-muted-foreground
"
/>


<Input

placeholder="Nama Lengkap"

value={nama}

onChange={(e)=>{

setNama(e.target.value)

setErrors({
...errors,
nama:""
})

}}

className="pl-10"

/>

</div>


{
errors.nama &&
<p className="text-sm text-red-500 mt-1">
{errors.nama}
</p>
}


</div>





{/* EMAIL */}

<div>


<div
className="relative"
>

<Mail
className="
absolute
left-3
top-3
size-4
text-muted-foreground
"
/>


<Input

type="email"

placeholder="Email"

value={email}

onChange={(e)=>{

setEmail(e.target.value)

setErrors({
...errors,
email:""
})

}}

className="pl-10"

/>


</div>


{
errors.email &&
<p className="text-sm text-red-500 mt-1">
{errors.email}
</p>
}


</div>





{/* RATING */}

<div
className="text-center"
>


<p
className="
font-medium
mb-3
"
>

Berikan Rating

</p>


<div
className="
flex
justify-center
gap-2
"
>


{
[1,2,3,4,5]
.map(item=>(


<button

type="button"

key={item}

onClick={()=>{

setRating(item)

setErrors({
...errors,
rating:""
})

}}

>

<Star

className={`
size-8
transition
hover:scale-110

${
item <= rating
?
"fill-yellow-400 text-yellow-400"
:
"text-muted-foreground"
}

`}

/>


</button>


))

}


</div>



{
errors.rating &&
<p
className="
text-sm
text-red-500
mt-2
"
>
{errors.rating}
</p>
}



</div>






{/* PESAN */}


<div>


<Textarea

rows={5}

placeholder="Tuliskan masukan Anda"

value={pesan}

onChange={(e)=>{

setPesan(e.target.value)

setErrors({
...errors,
pesan:""
})

}}


/>


{
errors.pesan &&
<p className="text-sm text-red-500 mt-1">
{errors.pesan}
</p>
}


</div>







<Button

disabled={loading}

className="
w-full
"

>


<Send
className="
mr-2
size-4
"
/>


{
loading
?
"Mengirim..."
:
"Kirim Masukan"
}


</Button>







{/* ALERT */}

<AnimatePresence>


{
message &&


<motion.div

initial={{
opacity:0,
y:20
}}

animate={{
opacity:1,
y:0
}}

exit={{
opacity:0,
y:-20
}}

className={`
flex
items-center
gap-2
rounded-lg
p-3
text-sm

${
status==="success"
?
"bg-green-100 text-green-700"
:
"bg-red-100 text-red-700"
}

`}

>


{
status==="success"
?
<CheckCircle2
className="size-5"
/>
:
<AlertCircle
className="size-5"
/>
}


{message}


</motion.div>


}


</AnimatePresence>



</form>


</CardContent>


</Card>


</div>


</section>


  )
}