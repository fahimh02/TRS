interface AuthFooter {
  href: string
  label: string
  hrefLabel: string
}

export const AuthFooter = ({ href, label, hrefLabel }: AuthFooter) => {
  return (
    <div className='flex items-center gap-2 justify-start max-w-full '>
      <p className='font-[400] text-[14px]'>{label}</p>
      <a href={href}>
        <span className='text-[#422afb] font-[500] '>{hrefLabel}</span>
      </a>
    </div>
  )
}
