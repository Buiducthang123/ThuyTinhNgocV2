export const useSearchStore = defineStore('search',()=>{

    const searchKey = ref();

    const router = useRouter()

    const handleUpdateSearch = (keyWord:string) =>{
        searchKey.value = keyWord
    }

    return {
        searchKey,
        handleUpdateSearch,
    }

})