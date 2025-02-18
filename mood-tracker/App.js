import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import WelcomeScreen from "./screens/WelcomeScreen";
import MoodHistory from "./screens/MoodHistoryScreen"; // Ensure this path is correct
import Statistics from "./screens/StatisticsScreen"; // Import your Statistics screen

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Welcome">
        <Drawer.Screen name="Welcome" component={WelcomeScreen} />
        { <Drawer.Screen name="MoodHistory" component={MoodHistory} /> }
        { <Drawer.Screen name="Statistics" component={Statistics} /> }
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;