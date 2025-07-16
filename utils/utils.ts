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