import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { CompletedWorkout, Exercise, Template, Workout } from './types';

// Types for exercise statistics
type ExerciseStats = {
  maxWeight: number;
  maxReps: number;
  totalVolume: number;
  sets: number;
  lastUsed: string | null;
};

type MuscleGroupVolume = {
  [key: string]: number;
};

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
    updateExerciseName: (exerciseKey: number, newName: string) => void;
    updateWorkoutName: (newName: string) => void;
    templates: Template[];
    setTemplates: (newTemplates: Template[]) => void;
    setActiveExercise: () => void;
    exerciseData: Exercise[];
    setExerciseData: (newExerciseData: Exercise[]) => void;
    startWorkout: (name: string, templateId?: number) => void; 
    finishWorkout: () => Promise<void>;
    workoutHistory: CompletedWorkout[];
    loadWorkoutHistory: () => Promise<void>;
    // Stats helper functions
    getExerciseStats: (exerciseId: number) => ExerciseStats;
    getTotalVolumeByDate: () => { date: string; volume: number }[];
    getMuscleGroupVolumeDistribution: () => MuscleGroupVolume;
    deleteWorkout: (workoutId: string) => Promise<void>;
};

export const useStore = create<StoreState>((set, get) => ({
    workoutDetails: null,
    workoutHistory: [],
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
            templateName: "Pull day", 
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
        const startTime = Date.now();
        
        if(!templateId) { 
            console.log("No template ID provided, starting a custom workout");
            return {workoutDetails: { 
                key: 0, 
                name: name, 
                exercises: [],
                startTime
            }};
        } else { 
            const template = state.templates[templateId-1];
            if(!template) return state; // If template not found, return current state
            const exercises = template.exercises.map((exercise, index) => ({
                key: index,
                workoutIndex: exercise.exerciseId,
                templateId: templateId-1,
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
                templateId,
                exercises: exercises,
                startTime
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
    
    updateExerciseName: (exerciseKey: number, newName: string) => set((state) => {
        if(!state.workoutDetails) return state; // Ensure workoutDetails is not null
        
        // Create a deep copy of the workout details
        const updatedWorkoutDetails = {...state.workoutDetails};
        
        // Find the exercise by key and update its name
        const exerciseIndex = updatedWorkoutDetails.exercises.findIndex(ex => ex.key === exerciseKey);
        if (exerciseIndex === -1) return state; // Exercise not found
        
        updatedWorkoutDetails.exercises[exerciseIndex] = {
            ...updatedWorkoutDetails.exercises[exerciseIndex],
            name: newName.trim() || 'Unnamed Exercise' // Prevent empty names
        };
        
        return {workoutDetails: updatedWorkoutDetails};
    }),
    
    updateWorkoutName: (newName: string) => set((state) => {
        if(!state.workoutDetails) return state; // Ensure workoutDetails is not null
        
        // Create a deep copy of the workout details
        const updatedWorkoutDetails = {...state.workoutDetails};
        
        // Update the workout name
        updatedWorkoutDetails.name = newName.trim() || 'Unnamed Workout'; // Prevent empty names
        
        return {workoutDetails: updatedWorkoutDetails};
    }),
    // startWorkout: (name: string, templateId?: number, ) => set((state) => {
    //     if (templateId == undefined) {
            
    //     }
    // }),
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
                        // Always use numbers, convert empty to 0
                        if (value === '') {
                          newWorkoutDetails.exercises[parentKey].sets[setKey].rep = 0;
                        } else {
                          newWorkoutDetails.exercises[parentKey].sets[setKey].rep = parseInt(value) || 0;
                        }
                    } else if (field === 'weight') { 
                        // Always use numbers, convert empty to 0
                        if (value === '') {
                          newWorkoutDetails.exercises[parentKey].sets[setKey].weight = 0;
                        } else if (value === '.') {
                          // Just a decimal point becomes 0
                          newWorkoutDetails.exercises[parentKey].sets[setKey].weight = 0;
                        } else {
                          // For all other cases, parse as float
                          newWorkoutDetails.exercises[parentKey].sets[setKey].weight = parseFloat(value) || 0;
                        }
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

        const currentValue = field === 'rep' ? (currentSet.rep || '').toString() : (currentSet.weight || '').toString();
        
        // Don't allow input that's too long
        if (currentValue.length >= 4 && selection.start === selection.end) return null;
        
        // Only allow one decimal point for weights
        if (key === '.' && field === 'weight' && currentValue.includes('.') && selection.start === selection.end) {
          return null;
        }
        
        // Don't allow decimals for reps
        if (key === '.' && field === 'rep') return null;
        
        // Special case: if current value is "0" and we're not adding a decimal point, replace the zero
        if (currentValue === '0' && key !== '.' && selection.start === selection.end) {
          const newValue = key;
          state.updateInputValue(activeInputId, newValue);
          return { newValue, newCursor: 1 };
        }
        
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

        const currentValue = field === 'rep' ? (currentSet.rep || '').toString() : (currentSet.weight || '').toString();
        
        let newValue;
        let newCursor;
        
        if (selection.start !== selection.end) {
            // Delete selected text
            newValue = currentValue.slice(0, selection.start) + currentValue.slice(selection.end);
            newCursor = selection.start;
        } else {
            // Delete character before cursor
            newValue = currentValue.slice(0, selection.start - 1) + currentValue.slice(selection.start);
            newCursor = selection.start - 1;
        }
        
        // Don't update if we're trying to delete with nothing to delete
        if (newValue === currentValue) return null;
        
        // If the result is empty, allow it during typing (will be converted to 0 on blur)
        if (newValue === '') {
          state.updateInputValue(activeInputId, newValue);
          return { newValue, newCursor: 0 };
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

    finishWorkout: async () => {
        const state = get();
        if (!state.workoutDetails) return;

        // Calculate workout duration
        const startTime = state.workoutDetails.startTime || Date.now() - 3600000; // Default to 1 hour if no start time
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Format date for display
        const date = new Date();
        const formattedDate = date.toISOString();
        
        // Create completed workout object
        const completedWorkout: CompletedWorkout = {
            id: `workout-${date.getTime()}`,
            name: state.workoutDetails.name,
            date: formattedDate,
            duration: duration,
            exercises: state.workoutDetails.exercises,
            templateId: state.workoutDetails.templateId
        };

        // Update workout history
        const updatedHistory = [...state.workoutHistory, completedWorkout];
        
        // Save to AsyncStorage
        try {
            await AsyncStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
            set({ workoutHistory: updatedHistory, workoutDetails: null });
        } catch (error) {
            console.error('Error saving workout history:', error);
        }
    },

    loadWorkoutHistory: async () => {
        try {
            const historyData = await AsyncStorage.getItem('workoutHistory');
            if (historyData) {
                const parsedHistory = JSON.parse(historyData) as CompletedWorkout[];
                set({ workoutHistory: parsedHistory });
            }
        } catch (error) {
            console.error('Error loading workout history:', error);
        }
    },

    // Delete a workout from history by ID
    deleteWorkout: async (workoutId: string) => {
        try {
            const state = get();
            const updatedHistory = state.workoutHistory.filter(workout => workout.id !== workoutId);
            await AsyncStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
            set({ workoutHistory: updatedHistory });
        } catch (error) {
            console.error('Error deleting workout:', error);
        }
    },

    // Get statistics for a specific exercise
    getExerciseStats: (exerciseId: number) => {
        const state = get();
        const stats: ExerciseStats = {
            maxWeight: 0,
            maxReps: 0,
            totalVolume: 0,
            sets: 0,
            lastUsed: null
        };

        // Track the most recent date this exercise was used
        let lastUsedDate: string | null = null;

        // Go through all completed workouts
        state.workoutHistory.forEach(workout => {
            // Look for this exercise in the workout
            workout.exercises.forEach(exercise => {
                if (exercise.workoutIndex === exerciseId) {
                    // Update last used date if this workout is more recent
                    if (!lastUsedDate || workout.date > lastUsedDate) {
                        lastUsedDate = workout.date;
                    }

                    // Process each completed set
                    exercise.sets.forEach(set => {
                        if (set.completed) {
                            stats.sets++;
                            
                            // Update max weight if this set has a higher weight
                            if (set.weight > stats.maxWeight) {
                                stats.maxWeight = set.weight;
                            }
                            
                            // Update max reps if this set has more reps
                            if (set.rep > stats.maxReps) {
                                stats.maxReps = set.rep;
                            }
                            
                            // Add to total volume (weight × reps)
                            stats.totalVolume += set.weight * set.rep;
                        }
                    });
                }
            });
        });

        // Just use the ISO string we already have
        stats.lastUsed = lastUsedDate;
        
        return stats;
    },

    // Get total volume by date for trend analysis
    getTotalVolumeByDate: () => {
        const state = get();
        const volumeByDate: { [date: string]: number } = {};
        
        // Calculate total volume for each workout date
        state.workoutHistory.forEach(workout => {
            // Get date part only (YYYY-MM-DD) for grouping
            const dateStr = workout.date.split('T')[0];
            
            if (!volumeByDate[dateStr]) {
                volumeByDate[dateStr] = 0;
            }
            
            // Sum volume from all exercises in this workout
            workout.exercises.forEach(exercise => {
                exercise.sets.forEach(set => {
                    if (set.completed) {
                        volumeByDate[dateStr] += set.weight * set.rep;
                    }
                });
            });
        });
        
        // Convert to array format for charting
        return Object.entries(volumeByDate)
            .map(([date, volume]) => ({ date, volume }))
            .sort((a, b) => a.date.localeCompare(b.date)); // Sort by date
    },
    
    // Get volume distribution by muscle group
    getMuscleGroupVolumeDistribution: () => {
        const state = get();
        const muscleGroupVolume: MuscleGroupVolume = {};
        
        // Initialize with zero for common muscle groups
        const commonMuscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Other'];
        commonMuscleGroups.forEach(group => {
            muscleGroupVolume[group] = 0;
        });
        
        // Go through all completed workouts and exercises
        state.workoutHistory.forEach(workout => {
            workout.exercises.forEach(exercise => {
                // Get the exercise data to determine muscle group
                const exerciseData = state.exerciseData.find(e => e.id === exercise.workoutIndex);
                let muscleGroup = exerciseData?.muscle || 'Other';
                
                // Simplify muscle groups for better visualization
                if (muscleGroup.includes('chest')) muscleGroup = 'Chest';
                else if (muscleGroup.includes('back') || muscleGroup.includes('lat')) muscleGroup = 'Back';
                else if (muscleGroup.includes('quad') || muscleGroup.includes('glut') || 
                         muscleGroup.includes('hamstring') || muscleGroup.includes('calf')) muscleGroup = 'Legs';
                else if (muscleGroup.includes('shoulder') || muscleGroup.includes('delt')) muscleGroup = 'Shoulders';
                else if (muscleGroup.includes('bicep') || muscleGroup.includes('tricep') || 
                         muscleGroup.includes('forearm')) muscleGroup = 'Arms';
                else if (muscleGroup.includes('abs') || muscleGroup.includes('core')) muscleGroup = 'Core';
                else muscleGroup = 'Other';
                
                // Calculate volume for this exercise
                let exerciseVolume = 0;
                exercise.sets.forEach(set => {
                    if (set.completed) {
                        exerciseVolume += set.weight * set.rep;
                    }
                });
                
                // Add to the appropriate muscle group
                muscleGroupVolume[muscleGroup] += exerciseVolume;
            });
        });
        
        return muscleGroupVolume;
    },
}));