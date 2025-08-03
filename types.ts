export type ExerciseSet = 
    | { key: number; type: string; rep: number; weight: number; completed: boolean, rest: {duration: number, completed: boolean} }
    // | { key: number; type: "rest"; duration: number; completed: boolean };

export type ExerciseDetail = {
    key: number;
    workoutIndex: number; // Index of the workout in the list
    templateId?: number; 
    name: string;
    sets: ExerciseSet[];
};

export type Exercise = { 
    id: number; 
    name: string; 
    level: string, 
    target: string, 
    equipment: string[], 
    directions: string[], 
    type: string, 
    image_path: string, 
}
export type Template = { 
        key: number; 
        templateName: string;
        exercises: { exerciseId: number; sets: number; }[];   
}