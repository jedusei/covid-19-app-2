import React from 'react';
import {
    View, Text, StyleSheet, TouchableNativeFeedback,
    TextInput, StatusBar, TouchableOpacity, ActivityIndicator
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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

export default function VerificationScreen({ route, navigation }) {
    const { phoneNumber } = route.params;
    const [code, setCode] = React.useState("");
    const [isValid, setValid] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" translucent={false} />
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
                        keyboardType="phone-pad"
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
                            setTimeout(() => {
                                setLoading(false);
                                if (code != "12345")
                                    alert("The code you entered is invalid.");
                            }, 2000);
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
                    <TouchableOpacity onPress={() => alert("The code has been re-sent.")}>
                        <Text style={styles.link}>Re-send the code</Text>
                    </TouchableOpacity>
                    <Text> or </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.link}>Send the code to a different number</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}