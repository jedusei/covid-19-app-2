import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Entypo, FontAwesome5, FontAwesome, Ionicons } from '@expo/vector-icons';
import Home from './Home';
import Report from './Report';
import Vitals from './Vitals';
import Settings from './Settings';
import {
    Text, View, StyleSheet,
    Image, TouchableOpacity,
    TouchableNativeFeedback, Modal, TextInput,
    CheckBox, ActivityIndicator, Alert
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();
const tabs = [
    { name: "Home", component: Home },
    { name: "Report", component: Report },
    { name: "Vitals", component: Vitals },
    { name: "Settings", component: Settings }
];
export default function Dashboard() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
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
            {tabs.map(tab =>
                <Tab.Screen key={tab.name} name={tab.name}>
                    {() => {
                        let Component = tab.component;
                        return (
                            <View style={styles.container}>
                                <Header title={tab.name} />
                                <Component />
                            </View>
                        );
                    }}
                </Tab.Screen>
            )}
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: "#e2e2e2",
        padding: 20
    },
    profile_img: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'contain'
    },
    header_title: {
        flex: 1,
        fontSize: 30,
        fontWeight: 'bold'
    },
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
    },
    modal_body: {
        paddingTop: 10,
        paddingHorizontal: 20
    },
    section_title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginVertical: 10
    },
    text_field: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e2e2',
        padding: 10,
        marginVertical: 10
    },
    visited_countries_container: {
        flexDirection: 'row',
        alignItems: 'stretch',
        height: 100,
        marginVertical: 10
    },
    visited_country: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000'
    },
    visited_country_flag: {
        width: 40,
        height: 30,
        marginBottom: 5
    },
    btn: {
        alignItems: 'center',
        paddingVertical: 15,
        marginVertical: 20,
        backgroundColor: '#313131'
    },
    btn_disabled: {
        alignSelf: "stretch",
        alignItems: 'center',
        paddingVertical: 15,
        marginVertical: 20,
        opacity: 0.8,
        backgroundColor: '#afafaf'
    }
});

function Header({ title }) {
    const [showProfile, setShowProfile] = React.useState(false);
    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setShowProfile(true)}>
                    <View style={{ marginRight: 20, borderRadius: styles.profile_img.borderRadius, borderColor: "#e2e2e2", borderWidth: 1 }}>
                        <Image source={require('../../assets/generic-profile-photo.png')} style={styles.profile_img} />
                    </View>
                </TouchableOpacity>
                <Text style={styles.header_title}>{title}</Text>
                <TouchableOpacity>
                    <Ionicons name="ios-notifications-outline" size={35} color="black" />
                </TouchableOpacity>
            </View>
            <ProfileModal visible={showProfile} onRequestClose={() => setShowProfile(false)} />
        </>
    );
}

function ProfileModal({ visible, onRequestClose }) {
    const [isLoading, setLoading] = React.useState(false);
    const [isMale, setIsMale] = React.useState();
    const [age, setAge] = React.useState("");
    const [ageIsValid, setAgeValid] = React.useState(false);
    const [firstVisitedCountry, setFirstVisitedCountry] = React.useState(countries[0]);
    const [secondVisitedCountry, setSecondVisitedCountry] = React.useState(countries[0]);
    const [currentCountryIndex, setCurrentCountryIndex] = React.useState(-1);
    const [showCountries, setShowCountries] = React.useState(false);
    const [healthLicenseNo, setHealthLicenseNo] = React.useState("");
    const isValid = ageIsValid && (isMale !== undefined);
    return (
        <>
            <Modal animationType='slide' visible={visible} onRequestClose={onRequestClose}>
                <View style={styles.modal}>
                    <View style={styles.modal_header}>
                        <Text style={styles.modal_title}>Profile</Text>
                        <TouchableOpacity onPress={onRequestClose}>
                            <AntDesign name="close" size={25} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.modal_body}>
                        <Text style={styles.section_title}>Personal details</Text>
                        <Text>Gender:</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <CheckBox value={isMale} onValueChange={value => setIsMale(value)} />
                            <Text style={{ marginRight: 20 }}>Male</Text>
                            <CheckBox value={(isMale !== undefined) ? !isMale : false} onValueChange={value => setIsMale(!value)} />
                            <Text>Female</Text>
                            {isMale === undefined &&
                                <View style={{ flex: 1, marginRight: 10, alignItems: 'flex-end' }}>
                                    <FontAwesome name='warning' size={15} color="#dede53" />
                                </View>
                            }
                        </View>
                        <Text>Age:</Text>
                        <View style={styles.text_field}>
                            <TextInput
                                keyboardType="numeric"
                                maxLength={3}
                                value={age}
                                style={{ flex: 1 }}
                                onChangeText={text => {
                                    setAge(text);
                                    setAgeValid(/^\d+$/.test(text) && Number.parseInt(text) <= 123);
                                }} />
                            {ageIsValid ||
                                <FontAwesome name='warning' size={15} color="#dede53" />
                            }
                        </View>
                        <Text style={styles.section_title}>Travel history</Text>
                        <Text>Select the last two countries you visited (if applicable):</Text>
                        <View style={styles.visited_countries_container}>
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => setCurrentCountryIndex(0) || setShowCountries(true)}>
                                <View key={firstVisitedCountry.name} style={[styles.visited_country, { marginRight: 20 }]}>
                                    <Image source={{ uri: firstVisitedCountry.flag }} style={styles.visited_country_flag} />
                                    <Text>{firstVisitedCountry.name}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => setCurrentCountryIndex(1) || setShowCountries(true)}>
                                <View key={secondVisitedCountry.name} style={styles.visited_country}>
                                    <Image source={{ uri: secondVisitedCountry.flag }} style={styles.visited_country_flag} />
                                    <Text>{secondVisitedCountry.name}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.section_title}>Medical Professional information</Text>
                        <Text>If you're a health worker, please enter your health license number below:</Text>
                        <View style={styles.text_field}>
                            <TextInput
                                keyboardType="number-pad"
                                value={healthLicenseNo}
                                style={{ flex: 1 }}
                                onChangeText={setHealthLicenseNo} />
                        </View>
                        <TouchableNativeFeedback
                            disabled={!isValid || isLoading}
                            onPress={() => {
                                if (!isLoading) {
                                    setLoading(true);
                                    setTimeout(async () => {
                                        setLoading(false);
                                        await new Promise(resolve => {
                                            Alert.alert(
                                                "Success",
                                                "Your profile has been successfully updated.",
                                                [{ text: "OK", onPress: resolve }],
                                                { onDismiss: resolve }
                                            );
                                        });
                                        onRequestClose();
                                    }, 2000);
                                }
                            }}>
                            <View style={isValid ? styles.btn : styles.btn_disabled}>
                                {isLoading ?
                                    <ActivityIndicator size={27} color="#fff" />
                                    :
                                    <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>Update Profile</Text>
                                }
                            </View>
                        </TouchableNativeFeedback>
                    </ScrollView>
                </View>
            </Modal>
            <CountriesModal selectedCountry={currentCountryIndex == 0 ? firstVisitedCountry : secondVisitedCountry} visible={showCountries} onRequestClose={() => setShowCountries(false)}
                onSelectCountry={country => {
                    if (currentCountryIndex == 0)
                        setFirstVisitedCountry(country);
                    else
                        setSecondVisitedCountry(country);

                    setTimeout(setShowCountries, 1000, false);
                }}
            />
        </>
    );
}

const countries = require('../../assets/countries.json');
function CountriesModal({ visible, selectedCountry, onSelectCountry, onRequestClose }) {
    return (
        <Modal animationType='slide' visible={visible} onRequestClose={onRequestClose}>
            <View style={styles.modal}>
                <View style={styles.modal_header}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Select Country</Text>
                    <TouchableOpacity onPress={onRequestClose}>
                        <AntDesign name="close" size={25} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={countries}
                    ItemSeparatorComponent={() => <View style={{ backgroundColor: "#e2e2e2", height: 1 }} />}
                    renderItem={({ item, index }) => (
                        <TouchableNativeFeedback onPress={() => onSelectCountry(item)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: (item.id == selectedCountry.id ? "#f3f3f3" : "#fff") }}>
                                <Image source={{ uri: item.flag }} style={{ width: 40, height: 30, marginRight: 10, borderWidth: 1, borderColor: "#f3f3f3" }} />
                                <Text>{item.name}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    )} />
            </View>
        </Modal>
    );
}

