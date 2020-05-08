import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Vitals from './Vitals';

const Tab = createBottomTabNavigator();
export default function Dashboard() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Vitals" component={Vitals} />
        </Tab.Navigator>
    );
}

function TabIcon() {
    return (
        <View>

        </View>
    );
}