import React from 'react';
import {
    Text, View, StyleSheet,
    Image, TouchableOpacity, ImageBackground,
    TouchableNativeFeedback, Modal, TextInput,
    CheckBox, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';

const info = {
    updated_at: new Date(),
    stats: [
        {
            label: "Cases",
            img: require('../../assets/covid-19-bg-2.jpg'),
            value: 641
        },
        {
            label: "Recoveries",
            img: require('../../assets/sanitizer_and_mask.jpg'),
            value: 83
        },
        {
            label: "Deaths",
            img: require('../../assets/grave.jpg'),
            value: 6
        }
    ],
    news: [
        {
            title: "Lorem ipsum dolor sit amet",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu tellus eleifend nisl gravida dapibus. Duis aliquet condimentum lectus nec scelerisque. Mauris venenatis, mi vel tincidunt maximus, sapien dolor pulvinar est, eget tincidunt enim diam sit amet augue. Proin vitae congue eros, eu consequat dui. Aliquam eget tempor enim. Phasellus non neque a nibh dignissim fringilla interdum at risus. Nulla purus diam, posuere eget euismod quis, elementum et erat. Ut facilisis nunc eu mauris vulputate dignissim. Donec eu orci volutpat, gravida odio eu, rhoncus lectus. Nullam neque risus, rhoncus nec ullamcorper a, aliquam eu nunc. In porttitor mi quis nibh consectetur feugiat. Nam feugiat quam sed quam rhoncus laoreet. Proin aliquam neque non ipsum dapibus pulvinar."
        },
        {
            title: "Lorem ipsum dolor sit amet",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu tellus eleifend nisl gravida dapibus. Duis aliquet condimentum lectus nec scelerisque. Mauris venenatis, mi vel tincidunt maximus, sapien dolor pulvinar est, eget tincidunt enim diam sit amet augue. Proin vitae congue eros, eu consequat dui. Aliquam eget tempor enim. Phasellus non neque a nibh dignissim fringilla interdum at risus. Nulla purus diam, posuere eget euismod quis, elementum et erat. Ut facilisis nunc eu mauris vulputate dignissim. Donec eu orci volutpat, gravida odio eu, rhoncus lectus. Nullam neque risus, rhoncus nec ullamcorper a, aliquam eu nunc. In porttitor mi quis nibh consectetur feugiat. Nam feugiat quam sed quam rhoncus laoreet. Proin aliquam neque non ipsum dapibus pulvinar."
        },
        {
            title: "Lorem ipsum dolor sit amet",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu tellus eleifend nisl gravida dapibus. Duis aliquet condimentum lectus nec scelerisque. Mauris venenatis, mi vel tincidunt maximus, sapien dolor pulvinar est, eget tincidunt enim diam sit amet augue. Proin vitae congue eros, eu consequat dui. Aliquam eget tempor enim. Phasellus non neque a nibh dignissim fringilla interdum at risus. Nulla purus diam, posuere eget euismod quis, elementum et erat. Ut facilisis nunc eu mauris vulputate dignissim. Donec eu orci volutpat, gravida odio eu, rhoncus lectus. Nullam neque risus, rhoncus nec ullamcorper a, aliquam eu nunc. In porttitor mi quis nibh consectetur feugiat. Nam feugiat quam sed quam rhoncus laoreet. Proin aliquam neque non ipsum dapibus pulvinar."
        }
    ]
};

let countries = require('../../assets/countries.json');

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
    h1: {
        flex: 1,
        fontSize: 35,
        fontWeight: 'bold'
    },
    stat_card: {
        width: 300,
        height: 200,
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#000'
    },
    stat_card_img: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5
    },
    stat_card_title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        opacity: 0.9,
    },
    stat_card_value: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 33
    },
    news_title: {
        fontWeight: 'bold',
        fontSize: 18
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

export default function Home() {
    const [isLoading, setLoading] = React.useState(true);
    const [showProfile, setShowProfile] = React.useState(false);

    React.useEffect(() => {
        setTimeout(setLoading, 1000, false);
    }, []);

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setShowProfile(true)}>
                        <View style={{ marginRight: 20, borderRadius: styles.profile_img.borderRadius, borderColor: "#e2e2e2", borderWidth: 1 }}>
                            <Image fadeDuration={0} source={require('../../assets/generic-profile-photo.png')} style={styles.profile_img} />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.h1}>Home</Text>
                    <TouchableOpacity onPress={() => setShowNotifications(true)}>
                        <Ionicons name="ios-notifications-outline" size={35} color="black" />
                    </TouchableOpacity>
                </View>
                {isLoading ?
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size={40} />
                    </View>
                    : <FlatList
                        ListHeaderComponent={() => (
                            <>
                                <FlatList horizontal
                                    data={info.stats}
                                    keyExtractor={(item) => item.label}
                                    contentContainerStyle={{ backgroundColor: '#f6f6f6', paddingHorizontal: 10 }}
                                    renderItem={({ item }) => (
                                        <View style={styles.stat_card}>
                                            <ImageBackground style={styles.stat_card_img} source={item.img} />
                                            <TouchableNativeFeedback>
                                                <View style={{ flex: 1, padding: 15, borderRadius: 20 }}>
                                                    <Text style={styles.stat_card_title}>{item.label}</Text>
                                                    <Text style={styles.stat_card_value}>{item.value}</Text>
                                                </View>
                                            </TouchableNativeFeedback>
                                        </View>
                                    )}
                                />
                                <View style={{ padding: 20 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>News</Text>
                                    <Text>Last Updated: <Text style={{ fontWeight: 'bold' }}>{moment(info.updated_at).format("DD/MM/yyyy [at] hh:mm A")}</Text></Text>
                                </View>
                            </>
                        )}
                        data={info.news}
                        keyExtractor={(item, index) => String(index)}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        renderItem={({ item }) => (
                            <View style={{ marginHorizontal: 40, marginVertical: 10 }}>
                                <View style={{ paddingBottom: 10, marginBottom: 10, borderBottomColor: "#e2e2e2", borderBottomWidth: 1 }}>
                                    <Text style={styles.news_title}>{item.title}</Text>
                                </View>
                                <Text>{item.content}</Text>
                            </View>
                        )}
                    />
                }
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