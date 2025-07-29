import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type FilterOption = {
    id: string;
    label: string;
    selected: boolean;
};

type FilterProps = {
    filterChoices: string[][], 
    setFilterChoices: (choices: string[][]) => void;
}



const Filter = ({filterChoices, setFilterChoices}: FilterProps) => {
    const [bodyPartModalVisible, setBodyPartModalVisible] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    
    const [bodyParts, setBodyParts] = useState<FilterOption[]>([
        { id: 'abs', label: 'Abs', selected: false },
        { id: 'anterior', label: 'Anterior', selected: false },
        { id: 'back', label: 'Back', selected: false },
        { id: 'biceps', label: 'Biceps', selected: false },
        { id: 'butt', label: 'Butt', selected: false },
        { id: 'calves', label: 'Calves', selected: false },
        { id: 'chest', label: 'Chest', selected: false },
        { id: 'forearm', label: 'Forearm', selected: false },
        { id: 'inner', label: 'Inner', selected: false },
        { id: 'lower', label: 'Lower', selected: false },
        { id: 'middle', label: 'Middle', selected: false },
        { id: 'neck', label: 'Neck', selected: false },
        { id: 'rear', label: 'Rear', selected: false },
        { id: 'shoulder', label: 'Shoulder', selected: false },
        { id: 'thigh', label: 'Thigh', selected: false },
        { id: 'triceps', label: 'Triceps', selected: false },
        { id: 'upper', label: 'Upper', selected: false },
    ]);
    
    const [categories, setCategories] = useState<FilterOption[]>([
        {id: "body_weight", label: "Body weight", selected: false},
        {id: "free_weights", label: "Free weights", selected: false},
        {id: "machine", label: "Machine", selected: false},
        {id: "cable", label: "Cable pull", selected: false},
    ]);

    const toggleBodyPart = (id: string) => {
        setBodyParts(prev => prev.map(item => 
            item.id === id ? { ...item, selected: !item.selected } : item
        ));
    };

    const toggleCategory = (id: string) => {
        setCategories(prev => prev.map(item => 
            item.id === id ? { ...item, selected: !item.selected } : item
        ));
    };

    const applyBodyPartFilters = () => {
        const selectedParts = bodyParts.filter(bp => bp.selected).map(bp => bp.label);
        let tempFilterChoices = [...filterChoices];
        tempFilterChoices[0] = selectedParts;
        setFilterChoices(tempFilterChoices);
        setBodyPartModalVisible(false);
    };

    const applyCategoryFilters = () => {
        const selectedCategories = categories.filter(cat => cat.selected).map(cat => cat.label);
        let tempFilterChoices = [...filterChoices];
        tempFilterChoices[1] = selectedCategories;
        setFilterChoices(tempFilterChoices);
        setCategoryModalVisible(false);
    };

    const clearBodyPartFilters = () => {
        setBodyParts(prev => prev.map(item => ({ ...item, selected: false })));
        let tempFilterChoices = [...filterChoices];
        tempFilterChoices[0] = [];
        setFilterChoices(tempFilterChoices);
    };

    const clearCategoryFilters = () => {
        setCategories(prev => prev.map(item => ({ ...item, selected: false })));
        let tempFilterChoices = [...filterChoices];
        tempFilterChoices[1] = [];
        setFilterChoices(tempFilterChoices);
    };

    const getSelectedBodyPartsText = () => {
        const selected = bodyParts.filter(bp => bp.selected);
        if (selected.length === 0) return "Any body part";
        if (selected.length === 1) return selected[0].label;
        return `${selected.length} selected`;
    };

    const getSelectedCategoriesText = () => {
        const selected = categories.filter(cat => cat.selected);
        if (selected.length === 0) return "Any Category";
        if (selected.length === 1) return selected[0].label;
        return `${selected.length} selected`;
    };

    const renderFilterItem = ({ item }: { item: FilterOption }) => (
        <TouchableOpacity 
            style={[styles.filterItem, item.selected && styles.selectedFilterItem]}
            onPress={() => bodyPartModalVisible ? toggleBodyPart(item.id) : toggleCategory(item.id)}
        >
            <Text style={[styles.filterItemText, item.selected && styles.selectedFilterItemText]}>
                {item.label}
            </Text>
            {item.selected && (
                <Ionicons name="checkmark" size={20} color="#34A6FB" />
            )}
        </TouchableOpacity>
    );

    return (
        <>
            <View style={styles.filterContainer}>
                <Pressable 
                    style={styles.filter}
                    onPress={() => setBodyPartModalVisible(true)}
                >
                    <Text style={styles.filterText}>{getSelectedBodyPartsText()}</Text>
                    <Ionicons name="chevron-down" size={16} color="white" />
                </Pressable>
                
                <Pressable 
                    style={styles.filter}
                    onPress={() => setCategoryModalVisible(true)}
                >
                    <Text style={styles.filterText}>{getSelectedCategoriesText()}</Text>
                    <Ionicons name="chevron-down" size={16} color="white" />
                </Pressable>
            </View>

        
            <Modal
                visible={bodyPartModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setBodyPartModalVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    onPress={() => setBodyPartModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Body Parts</Text>
                            <TouchableOpacity 
                                onPress={() => setBodyPartModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                        
                        <FlatList
                            data={bodyParts}
                            renderItem={renderFilterItem}
                            keyExtractor={(item) => item.id}
                            style={styles.filterList}
                        />
                        
                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={styles.clearButton}
                                onPress={clearBodyPartFilters}
                            >
                                <Text style={styles.clearButtonText}>Clear All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.applyButton}
                                onPress={applyBodyPartFilters}
                            >
                                <Text style={styles.applyButtonText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            
            <Modal
                visible={categoryModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setCategoryModalVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    onPress={() => setCategoryModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Categories</Text>
                            <TouchableOpacity 
                                onPress={() => setCategoryModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                        
                        <FlatList
                            data={categories}
                            renderItem={renderFilterItem}
                            keyExtractor={(item) => item.id}
                            style={styles.filterList}
                        />
                        
                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={styles.clearButton}
                                onPress={clearCategoryFilters}
                            >
                                <Text style={styles.clearButtonText}>Clear All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.applyButton}
                                onPress={applyCategoryFilters}
                            >
                                <Text style={styles.applyButtonText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

export default Filter;

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: 10,
    },
    filter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '48%',
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#222',
    },
    filterText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        width: '100%',
        maxHeight: '70%',
        padding: 0,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    closeButton: {
        padding: 4,
    },
    filterList: {
        maxHeight: 300,
    },
    filterItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        backgroundColor: 'transparent',
    },
    selectedFilterItem: {
        backgroundColor: '#34A6FB20',
    },
    filterItemText: {
        fontSize: 16,
        color: 'white',
        flex: 1,
    },
    selectedFilterItemText: {
        color: '#34A6FB',
        fontWeight: '600',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    clearButton: {
        flex: 1,
        padding: 12,
        marginRight: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#666',
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    applyButton: {
        flex: 1,
        padding: 12,
        marginLeft: 10,
        borderRadius: 8,
        backgroundColor: '#34A6FB',
        alignItems: 'center',
    },
    applyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});