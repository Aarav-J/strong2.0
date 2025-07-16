export type ExerciseSet = 
    | { key: number; type: string; rep: number; weight: number; completed: boolean, rest: {duration: number, completed: boolean} }
    // | { key: number; type: "rest"; duration: number; completed: boolean };

export type ExerciseDetail = {
    key: number;
    name: string;
    sets: ExerciseSet[];
};