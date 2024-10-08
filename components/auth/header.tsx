import { cn } from "@/lib/utils";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-y-4">
      <h1 className="text-3xl font-bold">Auth</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
