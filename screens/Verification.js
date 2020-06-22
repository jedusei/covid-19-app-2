import React from 'react';
import {
    AsyncStorage, View, Text, StyleSheet, TouchableNativeFeedback,
    TextInput, StatusBar, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { sendCode, verifyCode } from '../api';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff'
    },
    h1: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    h2: {
        fontSize: 15,
    },
    text_field: {
        fontSize: 23,
        fontWeight: 'bold',
        letterSpacing: 5,
        textAlign: 'center',
        paddingVertical: 10,
    },
    btn: {
        alignSelf: "stretch",
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#313131'
    },
    btn_disabled: {
        alignSelf: "stretch",
        alignItems: 'center',
        paddingVertical: 15,
        opacity: 0.8,
        backgroundColor: '#afafaf'
    },
    link: {
        color: "#0866d6",
        textDecorationLine: 'underline'
    }
});

export default function Verification({ route, navigation }) {
    const { phoneNumber } = route.params;
    const [code, setCode] = React.useState("12345");
    const [isValid, setValid] = React.useState(true);
    const [isLoading, setLoading] = React.useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Verification PIN</Text>
            <Text style={styles.h2}>
                A verification code has been sent to <Text style={{ fontWeight: 'bold' }}>{phoneNumber}</Text>.
                </Text>
            <Text style={styles.h2}>
                Please enter it in the field below.
                </Text>
            <View style={{ marginVertical: 50, borderBottomWidth: 1, width: 200 }}>
                <TextInput
                    keyboardType="number-pad"
                    placeholder="XXXXX"
                    maxLength={5}
                    value={code}
                    style={styles.text_field}
                    onChangeText={text => {
                        setCode(text);
                        setValid(/^[0-9]{5}/.test(text));
                    }} />
            </View>
            <TouchableNativeFeedback
                disabled={!isValid || isLoading}
                onPress={() => {
                    if (!isLoading) {
                        setLoading(true);
                        verifyCode(phoneNumber, code)
                            .then(async (result) => {
                                if (!result)
                                    alert("The code you entered is invalid.");
                                else {
                                    await AsyncStorage.multiSet([
                                        ['logged_in', 'true'],
                                        ['access_token', result.mobileToken],
                                        ['user', JSON.stringify(result.user)]
                                    ]);
                                    navigation.reset({ index: 0, routes: [{ name: 'GeneralInfo' }] });
                                }
                            })
                            .catch(() => {
                                alert("Please make sure you're connected to the internet and try again.");
                            })
                            .finally(() => setLoading(false));
                    }
                }}>
                <View style={isValid ? styles.btn : styles.btn_disabled}>
                    {isLoading ?
                        <ActivityIndicator size={27} color="#fff" />
                        :
                        <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>Verify</Text>
                    }
                </View>
            </TouchableNativeFeedback>
            <Text style={{ marginTop: 10 }}>Didn't receive the code?</Text>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => sendCode(phoneNumber).catch(() => alert("Please make sure you're connected to the internet and try again."))}>
                    <Text style={styles.link}>Re-send the code</Text>
                </TouchableOpacity>
                <Text> or </Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.link}>Send the code to a different number</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
}