"use client"
import {useForm, SubmitHandler} from "react-hook-form"

type Props = {}

interface FormInput {
  video_url: string,
  query: string
}

function UserForm({}: Props) {
  const {register, handleSubmit} = useForm<FormInput>()
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex items-center justify-center flex-col'>
        <input type="text" {...register("video_url")} className='border-2'/>
        <input type="text" {...register("query")} className='border-2'/>

        <button type='submit'>Submit</button>
      </div>
    </form>
  )
}

export default UserForm