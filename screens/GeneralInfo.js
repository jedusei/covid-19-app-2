import React from 'react';
import {
    View, Text, StyleSheet,
    TouchableNativeFeedback
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const sections = require('../assets/general_info.json');

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff'
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: "#e2e2e2"
    },
    h1: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    h2: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    section: {
        marginHorizontal: 15
    },
    btn: {
        alignSelf: "stretch",
        alignItems: 'center',
        paddingVertical: 15,
        marginTop: 50,
        backgroundColor: '#313131'
    }
});

export default function GeneralInfo({ navigation }) {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.h1}>General Information</Text>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                {sections.map(section =>
                    <View key={section.title} style={{ marginBottom: 20 }}>
                        <Text style={styles.h2}>{section.title}</Text>
                        <Text>{section.content}</Text>
                    </View>
                )}
                <TouchableNativeFeedback onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] })}>
                    <View style={styles.btn}>
                        <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>OK</Text>
                    </View>
                </TouchableNativeFeedback>
            </ScrollView>
        </View>
    );
}