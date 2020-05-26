import React from 'react';
import {
    Text, View, StyleSheet,
    Modal, TouchableOpacity
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function AppModal(props) {
    return (
        <Modal animationType='slide' {...props}>
            <View style={styles.modal}>
                <View style={styles.modal_header}>
                    <Text style={[styles.modal_title, props.titleStyle]}>{props.title}</Text>
                    <TouchableOpacity onPress={props.onRequestClose}>
                        <AntDesign name="close" size={25} />
                    </TouchableOpacity>
                </View>
                {props.children}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: '#fff'
    },
    modal_header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e2e2"
    },
    modal_title: {
        fontWeight: 'bold',
        fontSize: 30
    }
});