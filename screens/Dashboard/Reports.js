import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});

export default function Reports() {
    return (
        <View style={styles.container}>
            <Text>Report</Text>
        </View>
    );
}