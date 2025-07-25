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
    activeInputId?: string | null; 
    setActiveInputId: (id: string | null) => void;
    updateInputValue: (inputId: string, value: string) => void;
    handleNumpadKeyPress: (key: string, selection: { start: number, end: number }) => { newValue: string, newCursor: number } | null;
    handleNumpadDelete: (selection: { start: number, end: number }) => { newValue: string, newCursor: number } | null;
    currentSelection: { start: number, end: number };
    restCompletedVisible: boolean;
    setRestCompletedVisible: (val: boolean) => void;
};

export const useStore = create<StoreState>((set, get) => ({
    workoutDetails: [
        {
            key: 0,
            name: "Bench Press (Barbell)",
            sets: [
                { key: 0, type: "set", rep: 12, weight: 90, completed: false, rest: {duration: 10, completed: false}},
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
    setNumpadVisible: (val: boolean) => set((state) => ({numpadVisible: val})), 
    activeInputId: null,
    setActiveInputId: (id: string | null) => set((state) => ({activeInputId: id})),
    updateInputValue: (inputId, value) => 
        set((state) => { 
            const parts = inputId.split('-'); 
            if(parts.length === 4 && parts[0] === 'set') { 
                const parentKey = parseInt(parts[1]);
                const setKey = parseInt(parts[2]);
                const field = parts[3];

                const newWorkoutDetails = [...state.workoutDetails];
                if(newWorkoutDetails[parentKey]?.sets[setKey]) { 
                    if(field === 'rep') { 
                        newWorkoutDetails[parentKey].sets[setKey].rep = parseInt(value) || 0;
                    } else if (field === 'weight') { 
                        newWorkoutDetails[parentKey].sets[setKey].weight = parseFloat(value) || 0;
                    }
                }
                return {workoutDetails: newWorkoutDetails}
            }
            return state; 
        }),
    handleNumpadKeyPress: (key, selection) => {
        const state = get();
        const { activeInputId } = state;
        if (!activeInputId) return null;

        const parts = activeInputId.split('-');
        if (parts.length === 4 && parts[0] === 'set') {
        const parentKey = parseInt(parts[1]);
        const setKey = parseInt(parts[2]);
        const field = parts[3];
        
        const currentSet = state.workoutDetails[parentKey]?.sets[setKey];
        if (!currentSet) return null;

        const currentValue = field === 'rep' ? currentSet.rep.toString() : currentSet.weight.toString();
        if(currentValue.length >= 4) return null;
        // Insert key at selection position
        const newValue = currentValue.slice(0, selection.start) + key + currentValue.slice(selection.end);
        const newCursor = selection.start + 1;
        
        // Update the store
        state.updateInputValue(activeInputId, newValue);
        
        return { newValue, newCursor };
        }
        return null;
    },
    
    handleNumpadDelete: (selection) => {
        const state = get();
        const { activeInputId } = state;
        if (!activeInputId || selection.start === 0 && selection.end === 0) return null;

        const parts = activeInputId.split('-');
        if (parts.length === 4 && parts[0] === 'set') {
        const parentKey = parseInt(parts[1]);
        const setKey = parseInt(parts[2]);
        const field = parts[3];
        
        const currentSet = state.workoutDetails[parentKey]?.sets[setKey];
        if (!currentSet) return null;

        const currentValue = field === 'rep' ? currentSet.rep.toString() : currentSet.weight.toString();
        
        let newValue;
        let newCursor;
        
        if (selection.start !== selection.end) {
            console.log(selection); 
            // Delete selected text
            newValue = currentValue.slice(0, selection.start) + currentValue.slice(selection.end);
            newCursor = selection.start;
            console.log("new thingy", newValue)
        } else {
            // Delete character before cursor
            newValue = currentValue.slice(0, selection.start - 1) + currentValue.slice(selection.start);
            newCursor = selection.start - 1;
        }
        
        // Update the store
        state.updateInputValue(activeInputId, newValue);
        
        return { newValue, newCursor };
        }
        return null;
    },
    currentSelection: { start: 0, end: 0 },
    restCompletedVisible: false, 
    setRestCompletedVisible: (val: boolean) => set((state) => ({restCompletedVisible: val})),


}));