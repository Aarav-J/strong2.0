import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { Exercise, Template, Workout } from './types';

type StoreState = {
    activeExercise: number; 
    activeSet: number[]; 
    chosenEditKey: number[], 
    workoutDetails: Workout | null;
    setNext: () => void; 
    setActiveSet: (newActiveSet: number[]) => void; 
    setWorkoutDetails: (newWorkoutDetails: Workout) => void; 
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
    resetRestTimer: (parentKey: number, setKey: number) => void;
    selectedInfoExercise: number | null; 
    setSelectedInfoExercise: (id: number | null) => void;
    addExercise: (newWorkout: Exercise) => void;
    templates: Template[];
    setTemplates: (newTemplates: Template[]) => void;
    setActiveExercise: () => void;
    exerciseData: Exercise[];
    setExerciseData: (newExerciseData: Exercise[]) => void;
    startWorkout: (name: string, templateId?: number) => void; 
};

export const useStore = create<StoreState>((set, get) => ({
    workoutDetails: null,
    templates: [
        {
            key: 0, 
            templateName: "Push Day", 
            exercises: [
                {exerciseId: 83, sets: 3},
                {exerciseId: 57, sets: 3}, 
                {exerciseId: 26, sets: 3}, 
                {exerciseId: 39, sets: 3},
                {exerciseId: 89, sets: 3},
                {exerciseId: 36, sets: 3},
                {exerciseId: 99, sets: 3},
                {exerciseId: 143, sets: 3}

            ]
        }, 
        {
            key: 1, 
            templateName: "Push Day", 
            exercises: [
                {exerciseId: 83, sets: 3},
                {exerciseId: 57, sets: 3}, 
                {exerciseId: 26, sets: 3}, 
                {exerciseId: 39, sets: 3},
                {exerciseId: 89, sets: 3},
                {exerciseId: 36, sets: 3},
                {exerciseId: 99, sets: 3},
                {exerciseId: 143, sets: 3}

            ]
        }
    ],
    startWorkout: (name: string, templateId?: number) => set((state) => {
        if(!templateId) { 
            return {workoutDetails: { 
                key: 0, 
                name: name, 
                exercises: []
            }};
        } else { 
            const template = state.templates.find(t => t.key === templateId);
            if(!template) return state; // If template not found, return current state
            const exercises = template.exercises.map((exercise, index) => ({
                key: index,
                workoutIndex: exercise.exerciseId,
                name: state.exerciseData[exercise.exerciseId]?.name || "Unknown Exercise",
                sets: Array.from({ length: exercise.sets }, (_, setIndex) => ({
                    key: setIndex,
                    type: "set",
                    rep: 0,
                    weight: 0,
                    completed: false,
                    rest: { duration: 120, completed: false }
                }))
            }));
            
            return {workoutDetails: { 
                key: 0, 
                name: name, 
                exercises: exercises
            }};
        }
    }),
    setTemplates: (newTemplates: Template[]) => set((state) => ({ templates: newTemplates })),
    exerciseData: [], 
    setExerciseData: (newExerciseData: Exercise[]) => set((state) => ({ exerciseData: newExerciseData })),

    setWorkoutDetails: (newWorkoutDetails: Workout) =>
        set((state) => ({ workoutDetails: newWorkoutDetails })), 
    activeExercise: 0, 
    setActiveExercise: () => set((state) => ({activeExercise: state.activeExercise})),
    activeSet: [0,0,0], 
    setSelectedInfoExercise: (id: number | null) => set((state) => ({selectedInfoExercise: id})),
    selectedInfoExercise: null, 
    setNext: () => set((state) => {
        const parentKey = state.activeSet[0];
        const key = state.activeSet[1]; 
        const workoutLength = state.workoutDetails?.exercises.length || 0;
        const setLength = state.workoutDetails?.exercises[parentKey]?.sets.length || 0;

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
    addExercise: (newExercise: Exercise) => set((state) => { 
        if(!state.workoutDetails) return state; // Ensure workoutDetails is not null
        let newWorkoutDetails = {...state.workoutDetails};
        // newWorkoutDetails.exercises
        newWorkoutDetails.exercises.push({ 
            key: newWorkoutDetails.exercises.length, 
            workoutIndex: newExercise.id,
            name: newExercise.name,
            sets: [ 
                
            ]
        })
        return {workoutDetails: newWorkoutDetails};
        
    }),
    setActiveSet: (newActiveSet) => set((state) => ({activeSet: newActiveSet})),
    chosenEditKey: [0,0,0], 
    setChosenEditKey: () => set((state) => ({chosenEditKey: state.chosenEditKey})),
    setCompletedElement: (key: number[]) => set((state) => { 
        if(!state.workoutDetails) return state; // Ensure workoutDetails is not null
        let tempWorkoutDetails = {...state.workoutDetails}; 
        // let tempSets = [...state.workoutDetails[key[0]].sets]
        if(key[2] == 1) { 
            tempWorkoutDetails.exercises[key[0]].sets[key[1]].rest.completed = !tempWorkoutDetails.exercises[key[0]].sets[key[1]].rest.completed
        } else { 
            tempWorkoutDetails.exercises[key[0]].sets[key[1]].completed = !tempWorkoutDetails.exercises[key[0]].sets[key[1]].completed
        }
        
        return {workoutDetails: tempWorkoutDetails}
    }),
    addSet: (key: number) => set((state) => { 
        if(!state.workoutDetails) return state; // Ensure workoutDetails is not null
        let tempDetails = {...state.workoutDetails}; 

        const maxKey = state.workoutDetails.exercises[key].sets.length 
        if(maxKey === 0) {
            tempDetails.exercises[key].sets.push({key: 0, type: "set", rep: 0, weight: 0, completed: false, rest: {duration: 120, completed: false}})
        } else { 
            const lastSet = tempDetails.exercises[key].sets[maxKey-1]
            // const newSet = {key: maxKey, type: "set" as const, rep: lastSet.rep, weight: lastSet.weight, completed: false, rest: {duration: 120, completed: false}}
            tempDetails.exercises[key].sets.push({key: maxKey, type: "set" as const, rep: lastSet.rep, weight: lastSet.weight, completed: false, rest: {duration: 120, completed: false}})
        }
        
        return {workoutDetails: tempDetails}
    }), 
    numpadVisible: false, 
    setNumpadVisible: (val: boolean) => set((state) => ({numpadVisible: val})), 
    activeInputId: null,
    setActiveInputId: (id: string | null) => set((state) => ({activeInputId: id})),
    updateInputValue: (inputId, value) => 
        set((state) => { 
            if (!state.workoutDetails) return state; // Ensure workoutDetails is not null
            const parts = inputId.split('-'); 
            if(parts.length === 4 && parts[0] === 'set') { 
                const parentKey = parseInt(parts[1]);
                const setKey = parseInt(parts[2]);
                const field = parts[3];

                const newWorkoutDetails = {...state.workoutDetails};
                if(newWorkoutDetails.exercises[parentKey]?.sets[setKey]) { 
                    if(field === 'rep') { 
                        newWorkoutDetails.exercises[parentKey].sets[setKey].rep = parseInt(value) || 0;
                    } else if (field === 'weight') { 
                        newWorkoutDetails.exercises[parentKey].sets[setKey].weight = parseFloat(value) || 0;
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
        
        const currentSet = state.workoutDetails?.exercises[parentKey]?.sets[setKey];
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
        
        const currentSet = state.workoutDetails?.exercises[parentKey]?.sets[setKey];
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
    resetRestTimer: (parentKey, setKey) => 
        set((state) => {
        if(!state.workoutDetails) return state; // Ensure workoutDetails is not null
        const newWorkoutDetails = {...state.workoutDetails};
        if (newWorkoutDetails.exercises[parentKey]?.sets[setKey]) {
            // Reset rest completion status
            newWorkoutDetails.exercises[parentKey].sets[setKey].rest.completed = false;

            // Clear any stored timer data
            const storageKey = `restTimerEnd-${parentKey}-${setKey}`;
            AsyncStorage.removeItem(storageKey);
        }
        return { workoutDetails: newWorkoutDetails };
    }),

}));