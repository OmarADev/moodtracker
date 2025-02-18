import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Icon library

const StatisticsScreen = () => {
    const [moodData, setMoodData] = useState([]);
    const [moodCount, setMoodCount] = useState({
        sad: 0,
        normal: 0,
        good: 0,
        happy: 0,
    });

    useEffect(() => {
        loadMoodHistory();
    }, []);

    const loadMoodHistory = async () => {
        try {
            const storedMoods = await AsyncStorage.getItem('moods');
            if (storedMoods) {
                const moods = JSON.parse(storedMoods);
                setMoodData(moods);
                calculateMoodPercentage(moods);
            }
        } catch (error) {
            console.error("Error loading moods:", error);
        }
    };

    const calculateMoodPercentage = (moods) => {
        let moodStats = { sad: 0, normal: 0, good: 0, happy: 0 };
        moods.forEach(mood => {
            if (mood.mood === 'Sad') {
                moodStats.sad += 1;
            } else if (mood.mood === 'Normal') {
                moodStats.normal += 1;
            } else if (mood.mood === 'Good') {
                moodStats.good += 1;
            } else if (mood.mood === 'Happy') {
                moodStats.happy += 1;
            }
        });
        setMoodCount(moodStats);
    };

    const totalMoods = moodData.length;
    const happyPercentage = totalMoods > 0 ? (moodCount.happy / totalMoods) * 100 : 0;
    const normalPercentage = totalMoods > 0 ? (moodCount.normal / totalMoods) * 100 : 0;
    const goodPercentage = totalMoods > 0 ? (moodCount.good / totalMoods) * 100 : 0;
    const sadPercentage = totalMoods > 0 ? (moodCount.sad / totalMoods) * 100 : 0;

    const chartData = {
        labels: ['Happy', 'Normal', 'Good', 'Sad'],
        datasets: [{
            data: [
                happyPercentage > 0 ? happyPercentage : 0.1,
                normalPercentage > 0 ? normalPercentage : 0.1,
                goodPercentage > 0 ? goodPercentage : 0.1,
                sadPercentage > 0 ? sadPercentage : 0.1
            ],
        }],
    };

    const handleMoodClear = () => {
        setMoodData([]);
        setMoodCount({ sad: 0, normal: 0, good: 0, happy: 0 });
        AsyncStorage.removeItem('moods');
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Mood Statistics</Text>

            {totalMoods > 0 ? (
                <BarChart
                    data={chartData}
                    width={320}
                    height={220}
                    chartConfig={{
                        backgroundGradientFrom: '#ffcc00',
                        backgroundGradientTo: '#ff9900',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: { borderRadius: 16 },
                        propsForBackgroundLines: { strokeDasharray: '' },
                    }}
                    verticalLabelRotation={30}
                />
            ) : (
                <Text style={styles.text}>No mood data available</Text>
            )}

            <View style={styles.summaryContainer}>
                <Text style={styles.text}>Total Moods: {totalMoods}</Text>
                <Text style={styles.summaryText}>Most Common Mood: {Object.keys(moodCount).reduce((a, b) => moodCount[a] > moodCount[b] ? a : b)}</Text>
            </View>

            <View style={styles.moodBreakdown}>
                <Text style={styles.subtitle}>Mood Breakdown</Text>
                <View style={styles.breakdownItem}>
                    <MaterialCommunityIcons name="emoticon-sad" size={24} color="black" />
                    <Text style={styles.breakdownText}>Sad: {moodCount.sad}</Text>
                </View>
                <View style={styles.breakdownItem}>
                    <MaterialCommunityIcons name="emoticon-neutral" size={24} color="black" />
                    <Text style={styles.breakdownText}>Normal: {moodCount.normal}</Text>
                </View>
                <View style={styles.breakdownItem}>
                    <MaterialCommunityIcons name="emoticon-happy" size={24} color="black" />
                    <Text style={styles.breakdownText}>Good: {moodCount.good}</Text>
                </View>
                <View style={styles.breakdownItem}>
                    <MaterialCommunityIcons name="emoticon" size={24} color="black" />
                    <Text style={styles.breakdownText}>Happy: {moodCount.happy}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.clearButton} onPress={handleMoodClear}>
                <Text style={styles.clearButtonText}>Clear All Data</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default StatisticsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    },
    summaryContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    summaryText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    moodBreakdown: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    breakdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    breakdownText: {
        fontSize: 16,
        marginLeft: 10,
    },
    clearButton: {
        backgroundColor: '#ff5733',
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
