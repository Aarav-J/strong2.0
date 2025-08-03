import { Exercise } from "@/types";
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import Fuse from 'fuse.js';
import Papa from 'papaparse';

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

export const filterExercises = (data: Exercise[], filterChoices: string[][]) => {
    if (
        Array.isArray(filterChoices) &&
        filterChoices.length === 2 &&
        filterChoices[0].length === 0 &&
        filterChoices[1].length === 0
    ) return data;

    return data.filter((exercise) => {
        const bodyPartMatch = filterChoices[0].length === 0 || filterChoices[0].includes(exercise.target);
        const categoryMatch = filterChoices[1].length === 0 || filterChoices[1].includes(exercise.type);
        return bodyPartMatch && categoryMatch;
    });
}


export const getExercise = async (exerciseId: number) => { 
    try {
                // setLoading(true);
                
                const asset = Asset.fromModule(require('../assets/exercises.csv'));
                await asset.downloadAsync();
                
                const csvContent = await FileSystem.readAsStringAsync(asset.localUri || asset.uri);
                
                const result = Papa.parse(csvContent, {
                    header: true,
                    skipEmptyLines: true,
                    delimiter: ',',
                });
                
                const exerciseData = result.data as Exercise[];
                return exerciseData.find(exercise => exercise.id === exerciseId) || null;

            } catch (error) {
                console.error('Error loading CSV:', error);
            } finally {
                // setLoading(false);
            }
}

export const returnExerciseData = async () => { 
    try {
                // setLoading(true);
                
                const asset = Asset.fromModule(require('../assets/exercises.csv'));
                await asset.downloadAsync();
                
                const csvContent = await FileSystem.readAsStringAsync(asset.localUri || asset.uri);
                
                const result = Papa.parse(csvContent, {
                    header: true,
                    skipEmptyLines: true,
                    delimiter: ',',
                });
                
                const exerciseData = result.data as Exercise[];
                return exerciseData
                // return exerciseData.find(exercise => exercise.id === exerciseId) || null;

            } catch (error) {
                console.error('Error loading CSV:', error);
            } finally {
                // setLoading(false);
            }
}