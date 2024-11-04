import Aas from "../assets/image/zocopng.png";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuthBody = ({ children }: { children: any }) => {
  return (
    <div className="h-[100vh] w-full  flex">
      <div className="formlogin w-[55%]  h-[100vh] bg-white flex justify-center">
        <div className=" flex flex-col w-[420px] justify-center">
          {children}
        </div>
      </div>
      <div className="rightlogin w-[45%] h-[100vh] bg-[#0F2A3B] rounded-bl-[250px] flex justify-center items-center ">
        <img
          src={Aas}
          alt=""
          className="w-[400px]  h-[500px] object-contain "
        />
      </div>
    </div>
  );
};
