import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons';
import Home from './Home';
import Report from './Report';
import Vitals from './Vitals';
import Settings from './Settings';

const Tab = createBottomTabNavigator();
export default function Dashboard() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                switch (route.name) {
                    case "Home":
                        return <Entypo name="home" color={color} size={size} />
                    case "Report":
                        return <FontAwesome5 name="notes-medical" color={color} size={size} />
                    case "Vitals":
                        return <FontAwesome5 name="heartbeat" color={color} size={size} />
                    case "Settings":
                        return <Ionicons name="md-settings" color={color} size={size + 5} />
                }
            }
        })}
            tabBarOptions={{
                activeTintColor: '#313131',
                inactiveTintColor: 'gray',
            }}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Report" component={Report} />
            <Tab.Screen name="Vitals" component={Vitals} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    );
} 