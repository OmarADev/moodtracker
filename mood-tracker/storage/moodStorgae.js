import AsyncStorage from '@react-native-async-storage/async-storage';

const saveMood = async (mood) => {
    try {
        const moodEntry = { mood, date: new Date().toISOString() };
        const storedMoods = await AsyncStorage.getItem('moods');
        const moodList = storedMoods ? JSON.parse(storedMoods) : [];
        moodList.push(moodEntry);
        await AsyncStorage.setItem('moods', JSON.stringify(moodList));
    } catch (error) {
        console.error("Error saving mood:", error);
    }
};
