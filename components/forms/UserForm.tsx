"use client"
import {useForm, SubmitHandler} from "react-hook-form"

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
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
    const video_id = data.video_url.split("v=")[1];
    console.log(video_id)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex items-center justify-center flex-col'>
        <input type="text" {...register("video_url", {required:true})} className='border-2'/>
        {errors.video_url && <span>Video Url is required</span>}

        <input type="text" {...register("query", {required:true})} className='border-2'/>
        {errors.query && <span>Query is required</span>}

        <button type='submit'>Submit</button>
      </div>
    </form>
  )
}

export default UserForm