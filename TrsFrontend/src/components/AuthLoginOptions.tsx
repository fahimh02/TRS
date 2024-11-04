import { Checkbox } from '@nextui-org/react'

export const AuthLoginOptions = () => {
  return (
    <div className='flex items-center justify-between mb-[24px] '>
      <div className=' w-full relative flex items-center '>
        <Checkbox defaultSelected radius='sm'></Checkbox>
        Keep me logged in
      </div>
      <a href='/recovery-password' className=' text-[14px] w-[150px] '>
        Forgot password?
      </a>
    </div>
  )
}
