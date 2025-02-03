/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import DatePicker from "react-datepicker";
import {useForm, Controller, useFieldArray,SubmitHandler} from "react-hook-form"
import "react-datepicker/dist/react-datepicker.css";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  firstName: z.string().min(1,"First Name is required"),
  lastName:z.string().min(1,"Last Name is required"),
  email:z.string().email("Invalid Email Address"),
  age: z.string().min(18,"You must be at least 18 years old"),
  gender:z.enum(["Male","Female","Others",""],{
    message:"Gender is required"
  }),
  address:z.object({
    city:z.string().min(1,"City is required"),
    state:z.string().min(1,"State is required")
  }),
  hobbies:z.array(
    z.object({
      name:z.string().min(1, "Hobby name is required")
    })
  ).min(1,"At least one hobby is required"),
  startDate:z.date(),
  subscribe:z.boolean(),
  referral:z.string()


})

type FormData = z.infer<typeof formSchema>;
 const RegistrationForm : React.FC=()=> {
 

    const {register,formState:{errors,isSubmitting},control,getValues,setError,handleSubmit} = useForm<FormData>({
        defaultValues:{
            firstName: "",
            lastName: "",
            email: "",
            age: "18",
            gender: undefined,
            address: { city: "", state: "" },
            hobbies: [{ name: "" }],
            startDate: new Date(),
            subscribe: false,
            referral: "",
        },
        resolver:zodResolver(formSchema)
        

    })

  const {fields, append, remove} =  useFieldArray({
        control,
        name:"hobbies"
    })

  const onSubmit:SubmitHandler<FormData> = async (data)=>{
    try{
        console.log("Success",data)
    }
    catch(error:any){
    console.error("Error:",error);
    setError("root",{message:error.message})
    }

  }



  return (
    <form 
    onSubmit={handleSubmit(onSubmit)}
    className="space-y-6 max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Registration Form</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName">First Name</label>
          <input type='text' id="firstName"  {...register("firstName",{
            required:"First name is required",
          })} />
          {errors.firstName &&(<p style={{color:"red"}}>{errors.firstName.message}</p>)}
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input type='text' id="lastName" {...register("lastName",{
            required:"Last name is required"
          })} />
             {errors.lastName &&(<p style={{color:"red"}}>{errors.lastName.message}</p>)}
        </div>
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" 
        {...register("email",{
         required:"Email is required",
         pattern:{value:/^\S+@\S+$/i,message:"Invalid email address"}
        })}
        />
           {errors.email &&(<p style={{color:"red"}}>{errors.email.message}</p>)}
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input id="age"  type="number" {...register("age",{
            required:"Age is required",
            min:{value:18, message:"Age must be greater than 18"}

        })}/>

       {errors.age &&(<p style={{color:"red"}}>{errors.age.message}</p>)}
      </div>

      <div>
      <label htmlFor="gender">Select Gender:</label>
      <select id="gender" {...register("gender",{required:"Gender is required"})}>
      <option value="">-- Select --</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
      <option value="prefer_not_say">Prefer not to say</option>
      </select>
      {errors.gender &&(<p style={{color:"red"}}>{errors.gender.message}</p>)}

       
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city">City</label>
          <input id="city" type='text'  {...register("address.city",{required:"City is required"})}/>

          {errors?.address?.city &&(<p style={{color:"red"}}>{errors?.address?.city?.message}</p>)}
        </div>
        <div>
          <label htmlFor="state">State</label>
          <input id="state" type='text' {...register("address.state",{required:"State is required"})} />
          {errors?.address?.state &&(<p style={{color:"red"}}>{errors?.address?.state?.message}</p>)}
        </div>
      </div>

      <div>
        <label>Hobbies</label>
        {fields.map((hobby,index)=>(<div key={hobby?.id}>
            <input
            {...register(`hobbies.${index}.name`,{
                required:"Hobby name is required"
            })}
            placeholder='Hobby name'
            />
              {errors.hobbies?.[index]?.name && (
            <p style={{color:"red"}}>{errors?.hobbies[index]?.name?.message}</p>
        )}
        {fields.length>1 &&
        (<button type='button' onClick={()=>remove(index)}> Remove Hobby</button>)}
        </div>))}
        <button type="button"  className="mt-2" onClick={()=> append({name:""})}>
          Add Hobby
        </button>
      </div>

      <div className='mt-2'>
        <label>Start Date</label>
        <Controller
        control={control}
        name="startDate"
        render={({field:{onChange,value}})=>{
            return <DatePicker 
            onChange={onChange}
            selected={value}
            />

        }}
        />
        {errors?.startDate &&(<p style={{color:"red"}}>{errors?.startDate?.message}</p>)}
      </div>

      <div className="flex items-center space-x-2">
      <input type="checkbox" 
      {...register("subscribe")}
      />
       
        <label htmlFor="subscribe">Subscribe to newsletter</label>
      </div>

     {getValues("subscribe") && <div>
        <label htmlFor="referral">Referral</label>
        <textarea
          id="referral"
         {...register("referral",{
            required:"Referral source is required"
         })}
          placeholder="How did you hear about us?"
        />

{errors?.referral &&(<p style={{color:"red"}}>{errors?.referral?.message}</p>)}
      </div>}
      {errors?.root &&(<p style={{color:"red"}}>{errors?.root?.message}</p>)}

      <button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting?"Submitting...":"Submit"}
      </button>
    </form>
  )
}

export default RegistrationForm
