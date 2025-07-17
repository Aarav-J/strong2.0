import { useRef, useState } from "react";
import { TextInput } from 'react-native';

export function useNumpadInput(initialValue: string = '') { 
    const [value, setValue] = useState(initialValue); 
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const inputRef = useRef<TextInput>(null);

    const handleKeyPress = (key: string) => { 
        const {start, end} = selection; 
        const newText = value.slice(0, start) + key + value.slice(end);
        const newPosition = start + 1; 
        setValue(newText);
        setSelection({ start: newPosition, end: newPosition });
    }

    const handleDelete = () => { 
        const {start, end} = selection; 
        if(start === 0 && end === 0) return; 
        if(start !== end) { 
            const newText = value.slice(0, start) + value.slice(end);
            setValue(newText);
            setSelection({ start, end: start });
            
        } else { 
            const newStart = start -1; 
            const newText = value.slice(0, newStart) + value.slice(start);
            setValue(newText);
            setSelection({ start: newStart, end: newStart });
        }
    }
    return { 
        value, selection, inputRef, handleKeyPress, handleDelete, 
        setValue, setSelection,
     };
}
