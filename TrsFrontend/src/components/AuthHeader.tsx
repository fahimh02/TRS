interface AuthHeader {
  title: string
  description: string
}

export const AuthHeader = ({ title, description }: AuthHeader) => {
  return (
    <div className='titleform flex flex-col mb-[16px]'>
      <h3 className='sessiontitle text-[36px] font-[700] mb-[10px] '>{title}</h3>
      <p className='subtitlesession text-[#A0AEC0] '>{description}</p>
    </div>
  )
}
