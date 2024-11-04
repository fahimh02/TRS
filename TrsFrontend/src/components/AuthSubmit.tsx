/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@nextui-org/react";

export const AuthSubmit = ({
  onClick,
  label,
}: {
  onClick: any;
  label: string;
}) => {
  return (
    <Button
      color="secondary"
      onClick={() => onClick()}
      className="buttonsubmitsesion bg-[#B3C300] mt-[10px]  mb-[24px]"
    >
      {label}
    </Button>
  );
};
