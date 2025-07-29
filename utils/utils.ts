import { Exercise } from "@/types";
import Fuse from 'fuse.js';

export const compareArrays = (array1: any[], array2: any[])  => { 
    if(array1.length == array2.length) { 
        for(let i = 0; i < array1.length; i++) { 
            if(array1[i] != array2[i]){
                return false;
            }
        }
        return true;
    }
    else { 
        return false;
    }
}

export const fuzzySearch = (data: Exercise[], query: string) => {
    const fuseOptions = { 
        keys: ['name'],
        threshold: 0.2
    }
    const fuse = new Fuse(data, fuseOptions);
    const results = fuse.search(query);
    return results.map(result => result.item);
}