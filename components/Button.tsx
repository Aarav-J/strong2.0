import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = { 
    title: string; 
    icon?: keyof typeof FontAwesome.glyphMap | React.ReactNode; 
    onPress?: () => void;
    color?: string;
    backgroundColor?: string;
}

export default function Button({title, icon, onPress, color="white", backgroundColor}: Props) {
    // Render the icon based on its type
    const renderIcon = () => {
        if (!icon) return null;
        
        if (typeof icon === 'string') {
            // It's a FontAwesome icon name
            return <FontAwesome name={icon as keyof typeof FontAwesome.glyphMap} size={20} color={color} />;
        } else {
            // It's a ReactNode
            return icon;
        }
    };

    return (
        <Pressable 
            style={[styles.button, {backgroundColor: backgroundColor}]} 
            onPress={onPress}
        >
            <View style={styles.content}>
                {renderIcon()}
                <Text style={[styles.text, {color: color}]}>{title}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        padding: 12,
        elevation: 2,
        // borderWidth: 1,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        marginLeft: 8,
        fontWeight: "bold",
    },
});