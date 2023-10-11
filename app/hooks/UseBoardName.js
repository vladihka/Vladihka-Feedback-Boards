import { usePathname } from "next/navigation";

export default function useBoardName(){
    const pathName = usePathname();
    const result = /^\/board\/([a-z0-9\-]+)(\/.*)?$/.exec(pathName);
    const boardName = result?.[1];
    return boardName;
}