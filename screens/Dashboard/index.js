import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, FontAwesome5, FontAwesome, Ionicons } from '@expo/vector-icons';
import Home from './Home';
import Reports from './Reports';
import Vitals from './Vitals';
import Settings from './Settings';
import {
    Text, View, StyleSheet,
    Image, TouchableOpacity,
    TouchableNativeFeedback, TextInput,
    CheckBox, ActivityIndicator, Alert, AsyncStorage
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import AppModal from '../../components/AppModal';
import moment from 'moment';
import { getNotifications } from '../../api';

const Tab = createBottomTabNavigator();
const tabs = [
    { name: "Home", component: Home },
    { name: "Reports", title: "Case Reports", component: Reports },
    { name: "Vitals", component: Vitals },
    { name: "Settings", component: Settings }
];
export default function Dashboard() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    switch (route.name) {
                        case "Home":
                            return <Entypo name="home" color={color} size={size} />
                        case "Reports":
                            return <FontAwesome5 name="notes-medical" color={color} size={size} />
                        case "Vitals":
                            return <FontAwesome5 name="heartbeat" color={color} size={size} />
                        case "Settings":
                            return <Ionicons name="md-settings" color={color} size={size + 5} />
                    }
                }
            })}
            tabBarOptions={{
                activeTintColor: '#313131'
            }}>
            {tabs.map(tab =>
                <Tab.Screen key={tab.name} name={tab.name}>
                    {({ navigation }) => {
                        let Component = tab.component;
                        return (
                            <View style={styles.container}>
                                <Header title={tab.title || tab.name} />
                                <Component navigation={navigation} />
                            </View>
                        );
                    }}
                </Tab.Screen>
            )}
        </Tab.Navigator>
    );
}

function Header({ title }) {
    const [showProfile, setShowProfile] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setShowProfile(true)}>
                    <View style={{ marginRight: 20, borderRadius: styles.profile_img.borderRadius, borderColor: "#e2e2e2", borderWidth: 1 }}>
                        <Image source={require('../../assets/generic-profile-photo.png')} style={styles.profile_img} />
                    </View>
                </TouchableOpacity>
                <Text style={styles.header_title}>{title}</Text>
                <TouchableOpacity onPress={() => setShowNotifications(true)}>
                    <Ionicons name="ios-notifications-outline" size={35} color="black" />
                </TouchableOpacity>
            </View>
            <ProfileModal visible={showProfile} onRequestClose={() => setShowProfile(false)} />
            <NotificationsModal visible={showNotifications} onRequestClose={() => setShowNotifications(false)} />
        </>
    );
}

function ProfileModal({ visible, onRequestClose }) {
    const [isLoading, setLoading] = React.useState(false);
    const [isMale, setIsMale] = React.useState(true);
    const [age, setAge] = React.useState("");
    const [ageIsValid, setAgeValid] = React.useState(true);
    const [firstVisitedCountry, setFirstVisitedCountry] = React.useState(countries[0]);
    const [secondVisitedCountry, setSecondVisitedCountry] = React.useState(countries[0]);
    const [currentCountryIndex, setCurrentCountryIndex] = React.useState(-1);
    const [showCountries, setShowCountries] = React.useState(false);
    const [healthLicenseNo, setHealthLicenseNo] = React.useState("");
    const isValid = ageIsValid && (isMale !== undefined);

    const loadUserData = () => {
        AsyncStorage.getItem('user', (err, user) => {
            user = JSON.parse(user);
            setIsMale(user.gender === "male");
            setAge(String(user.age));
            setFirstVisitedCountry(countries.find(c => c.name === user.lastCountriesVisited[0]) || countries[0]);
            setSecondVisitedCountry(countries.find(c => c.name === user.lastCountriesVisited[1]) || countries[1]);
            setHealthLicenseNo(user.licenseNumber);
        });
    };

    const saveUserData = () => {
        let user = {
            gender: isMale ? "male" : "female",
            age: Number.parseInt(age),
            licenseNumber: healthLicenseNo,
            lastCountriesVisited: [firstVisitedCountry.name, secondVisitedCountry.name]
        };

        return new Promise(resolve => {
            AsyncStorage.setItem('user', JSON.stringify(user), () => {
                setTimeout(resolve, 1500);
            });
        })
    };

    return (
        <>
            <AppModal title="Profile" animationType='slide' visible={visible} onRequestClose={onRequestClose} onShow={loadUserData}>
                <ScrollView contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 20 }}>
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
                                saveUserData().then(async () => {
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
                                });
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
            </AppModal>
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
        <AppModal title="Select Country" titleStyle={{ fontSize: 20 }}
            animationType='slide'
            visible={visible}
            onRequestClose={onRequestClose}>
            <FlatList
                data={countries}
                ItemSeparatorComponent={() => <View style={{ backgroundColor: "#e2e2e2", height: 1 }} />}
                renderItem={({ item }) => (
                    <TouchableNativeFeedback onPress={() => onSelectCountry(item)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: (item.id == selectedCountry.id ? "#f3f3f3" : "#fff") }}>
                            <Image source={{ uri: item.flag }} style={{ width: 40, height: 30, marginRight: 10, borderWidth: 1, borderColor: "#f3f3f3" }} />
                            <Text>{item.name}</Text>
                        </View>
                    </TouchableNativeFeedback>
                )} />
        </AppModal>
    );
}

function NotificationsModal({ visible, onRequestClose }) {
    const [isLoading, setLoading] = React.useState(true);
    const [notifications, setNotifications] = React.useState();

    const getNotifs = () => {
        setLoading(true);
        setTimeout(() => {
            getNotifications()
                .then(notifs => {
                    setNotifications(notifs);
                })
                .catch(() => {
                    alert("Couldn't refresh notifications. Please make sure you're connected to the internet and try again.");
                    if (!notifications)
                        onRequestClose();
                })
                .finally(() => setLoading(false));
        }, 500);
    }

    return (
        <AppModal title="Notifications"
            animationType='slide'
            visible={visible}
            onRequestClose={onRequestClose}
            onShow={getNotifs}>
            {isLoading ?
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size={40} />
                </View>
                :
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => String(item.date)}
                    ItemSeparatorComponent={() => <View style={{ backgroundColor: "#e2e2e2", height: 1 }} />}
                    renderItem={({ item }) => (
                        <View style={styles.notif_row}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.notif_title}>{item.title}</Text>
                                <Text style={styles.notif_desc}>{item.title}</Text>
                            </View>
                            <Text style={styles.notif_time}>{moment(item.date).fromNow()}</Text>
                        </View>
                    )}
                />
            }
        </AppModal>
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
    },
    notif_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20
    },
    notif_title: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    notif_desc: {
        fontSize: 15
    },
    notif_time: {
        fontSize: 12,
        opacity: 0.5
    }
});