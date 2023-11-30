
import {create} from 'zustand';

interface Store {
    tokenuser : string | null;
    username : string | null;
    id : string | null;
    setTokenUser: (tokenuser: string) => void;
    setId: (id: string) => void;
    setUserName: (username: string) => void;
}

const useStore= create<Store>((set) => ({
    tokenuser: null,
    username: null,
    id: null,
    setTokenUser: (tokenuser: string) => set({tokenuser}),
    setId: (id: string) => set({id}),
    setUserName: (username: string) => set({username}),
}))
export default useStore;
