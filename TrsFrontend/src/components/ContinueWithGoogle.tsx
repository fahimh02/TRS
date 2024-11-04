import Google from "../assets/image/google.svg";

export const ContinueWithGoogle = () => {
  return (
    <button className="continuegoogle inline-flex appearance-none items-center justify-center select-none relative whitespace-nowrap align-middle outline-transparent outline-2 outline-offset-2 w-auto leading-6 rounded-2xl font-medium shadow-sm transition-all duration-250 ease-in-out box-border h-12 min-w-10 text-sm px-4 bg-secondaryGray-300 pt-4 pb-4 text-navy-700 bg-[#F4F7FE] mb-[10px] ">
      <img src={Google} className="w-[20px] h-[20px] mr-[10px]" />
      Continue with Google
    </button>
  );
};
