import React, {useId} from 'react'

const Textarea = React.forwardRef( function Textarea({
    label,
    type = "text",
    className = "",
    ...props
}, ref){
    const id = useId()
    return (
        <div className='w-full'>
            {label && <label 
            className='inline-block mb-1 pl-1 text-black font-bold text-white bg-black' 
            htmlFor={id}>
                {label}
            </label>
            }
            <textarea
            type={type}
            className={`px-3 py-3 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
            ref={ref}
            {...props}
            id={id}
            />
            
        </div>
    )
})

export default Textarea