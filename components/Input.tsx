import { StyleSheet, TextInput } from "react-native";

type Props = { 
    value: number; 
    onChange: (text: number) => void;
}


export default function Input({ value, onChange }: Props) {
    const handleNumberChange = (text: string) => { 
        const cleanedvalue = text.replace(/[^0-9]/g, ""); 
        const parsedValue = parseInt(cleanedvalue, 10);
        if(!isNaN(parsedValue)) { 
            onChange(parsedValue);
        } else { 
            onChange(0); 
        }
    }
    return (
        <TextInput 
            // type="text" 
            value={value.toString()} 
            onChangeText={handleNumberChange}
            // text={value}
            placeholder="Enter number"
            keyboardType="numeric"
            style={styles.input} 
        />
    );
}

const styles = StyleSheet.create({ 
   input: { 
        width: "100%",
        height: 50,
        backgroundColor: "#222",
        color: "white",
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 18,
   } 
})