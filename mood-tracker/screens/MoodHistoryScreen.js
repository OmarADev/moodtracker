import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MoodHistoryScreen = () => {
    const [moodHistory, setMoodHistory] = useState([]);

    useEffect(() => {
        loadMoodHistory();
    }, []);

    const loadMoodHistory = async () => {
        try {
            const storedMoods = await AsyncStorage.getItem('moods');
            if (storedMoods) {
                setMoodHistory(JSON.parse(storedMoods).reverse()); // Show latest first
            }
        } catch (error) {
            console.error("Error loading moods:", error);
        }
    };

    const clearMoodHistory = async () => {
        Alert.alert("Confirm", "Are you sure you want to delete all moods?", [
            { text: "Cancel", style: "cancel" },
            { text: "Yes", onPress: async () => {
                await AsyncStorage.removeItem('moods');
                setMoodHistory([]);
                Alert.alert("Mood history cleared!");
            }} ,
        ]);
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mood History</Text>

            {moodHistory.length === 0 ? (
                <Text style={styles.noMoodsText}>No moods saved yet.</Text>
            ) : (
                <FlatList
                    data={moodHistory}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.moodItem}>
                            <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                            <Text style={styles.moodText}>{item.mood}</Text>
                            <Text style={styles.noteText}>"{item.note}"</Text>
                            {/* <Text style={styles.dateText}>{new Date(item.date).toLocaleString()}</Text> */}
                        </View>
                    )}
                />
            )}

            {moodHistory.length > 0 && (
                <TouchableOpacity style={styles.clearButton} onPress={clearMoodHistory}>
                    <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default MoodHistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    noMoodsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
    moodItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    moodText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    noteText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#555',
    },
    dateText: {
        fontSize: 14,
        color: '#888',
        marginTop: 5,
    },
    clearButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    clearButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
