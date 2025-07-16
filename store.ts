import { create } from 'zustand';
import { ExerciseDetail } from './types';


type StoreState = {
    activeExercise: number; 
    activeSet: number[]; 
    chosenEditKey: number[], 
    workoutDetails: ExerciseDetail[];
    setNext: () => void; 
    setActiveSet: (newActiveSet: number[]) => void; 
    setWorkoutDetails: (newWorkoutDetails: ExerciseDetail[]) => void; 
    setCompletedElement: (key: number[]) => void; 
    addSet: (key: number) => void; 
    numpadVisible: boolean;
    setNumpadVisible: (val: boolean) => void;
};

export const useStore = create<StoreState>((set) => ({
    workoutDetails: [
        {
            key: 0,
            name: "Bench Press (Barbell)",
            sets: [
                { key: 0, type: "set", rep: 12, weight: 90, completed: false, rest: {duration: 30, completed: false}},
                // { key: 1, type: "rest", duration: 120, completed: false },
                { key: 1, type: "set", rep: 10, weight: 100, completed: false, rest: {duration: 120, completed: false} },
                // { key: 3, type: "rest", duration: 120, completed: false }
            ]
        }
    ],
    setWorkoutDetails: (newWorkoutDetails) =>
        set((state) => ({ workoutDetails: newWorkoutDetails })), 
    activeExercise: 0, 
    setActiveExercise: () => set((state) => ({activeExercise: state.activeExercise})),
    activeSet: [0,0,0], 
    setNext: () => set((state) => {
        const parentKey = state.activeSet[0];
        const key = state.activeSet[1]; 
        const workoutLength = state.workoutDetails.length
        const setLength = state.workoutDetails[parentKey].sets.length

        if(key + 1 >= setLength) { 
            if(parentKey + 1 >= workoutLength) { 
                return {activeSet: [parentKey, key, 2] }
            } else { 
                return {activeSet: [parentKey + 1, 0]}
            }
        } else { 
            return {activeSet: [parentKey, key +1]}
        }
        // Add your logic here using parentKey if needed
        // return {};
    }),
    setActiveSet: (newActiveSet) => set((state) => ({activeSet: newActiveSet})),
    chosenEditKey: [0,0,0], 
    setChosenEditKey: () => set((state) => ({chosenEditKey: state.chosenEditKey})),
    setCompletedElement: (key: number[]) => set((state) => { 
        let tempWorkoutDetails = [...state.workoutDetails]
        // let tempSets = [...state.workoutDetails[key[0]].sets]
        if(key[2] == 1) { 
            tempWorkoutDetails[key[0]].sets[key[1]].rest.completed = !tempWorkoutDetails[key[0]].sets[key[1]].rest.completed
        } else { 
            tempWorkoutDetails[key[0]].sets[key[1]].completed = !tempWorkoutDetails[key[0]].sets[key[1]].completed
        }
        
        return {workoutDetails: tempWorkoutDetails}
    }),
    addSet: (key: number) => set((state) => { 
        let tempDetails = [...state.workoutDetails]
        const maxKey = state.workoutDetails[key].sets.length 
        const lastSet = tempDetails[key].sets[maxKey-1]
        const newSet = {key: maxKey, type: "set" as const, rep: lastSet.rep, weight: lastSet.weight, completed: false, rest: {duration: 120, completed: false}}
        tempDetails[key].sets.push(newSet)
        return {workoutDetails: tempDetails}
    }), 
    numpadVisible: false, 
    setNumpadVisible: (val: boolean) => set((state) => ({numpadVisible: val}))
}));
