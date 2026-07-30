"use client"
import {useForm, SubmitHandler} from "react-hook-form"
import { useState } from "react"

type Props = {}

interface FormInput {
  video_url: string,
  query: string
}

function UserForm({}: Props) {
  const {
    register,
    handleSubmit,
    formState:{errors}
  } = useForm<FormInput>()

  const [text, setText] = useState("");

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    console.log(data);
    const video_id = data.video_url.split("v=")[1];
    const query = data.query
    console.log(video_id)
    try {
        const response = await fetch("http://localhost:8000/generate", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            video_id: video_id,
            query: query
          })
      });

      const data = await response.json();
      if(data) {
        setText(data.response)
      }
      console.log(data)
    } catch (error) {
      
    }
  }
  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex items-center justify-center flex-col'>
        <input type="text" {...register("video_url", {required:true})} className='border-2'/>
        {errors.video_url && <span>Video Url is required</span>}

        <input type="text" {...register("query", {required:true})} className='border-2'/>
        {errors.query && <span>Query is required</span>}

        <button type='submit'>Submit</button>
      </div>
    </form>
    <textarea name="" id="" value={text} className="border-2"/>
    </>
  )
}

export default UserForm