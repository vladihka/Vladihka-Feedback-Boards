import { usePathname } from "next/navigation";
import axios from "axios";

export function useBoardName(){
    const pathName = usePathname();
    const result = /^\/board\/([a-z0-9\-]+)(\/.*)?$/.exec(pathName);
    const boardName = result?.[1];
    return boardName;
}

export async function isBoardAdmin(boardName){
    const res = await axios.get('/api/board')
    return  !!res.data.find(board => board.name === boardName);
}