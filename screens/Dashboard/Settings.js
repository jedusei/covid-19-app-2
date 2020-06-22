import React from 'react';
import {
    Text, View, StyleSheet, TouchableOpacity, Image,
    TouchableNativeFeedback, Modal, Platform,
    ActivityIndicator, Alert, AsyncStorage
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Feather, EvilIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import AppModal from '../../components/AppModal';
import openMap from 'react-native-open-maps'
import { getWorldStats, getCountryStats, getCountries, getTestingCentres } from '../../api';
import moment from 'moment';

const FAQs = require('../../assets/faqs.json');
const sections = [
    {
        title: "Self Assessment",
        description: "Ascertain your COVID-19 risk using our screening tool",
        modal: 'self_assessment'
    },
    {
        title: "FAQs",
        description: "Get answers to frequently asked questions",
        modal: "faqs"
    },
    {
        title: "Testing Centers",
        description: "View testing centers near you",
        modal: "testing_centres"
    },
    {
        title: "Global Statistics",
        description: "View worldwide COVID-19 statistics",
        modal: "stats"
    },
    {
        title: "Audio",
        description: "Listen to audio",
    },
    {
        title: "Privacy Policy",
        description: "View our privacy policy",
    },
    {
        title: "Share",
        description: "Share this app with friends and family",
    }
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomColor: "#e2e2e2",
        borderBottomWidth: 1
    },
    section_title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    btn: {
        alignSelf: "stretch",
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#313131'
    },
    btn_logout: {
        alignSelf: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 15,
        marginVertical: 15,
        backgroundColor: '#313131'
    },
    faq_title: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    map_btn: {
        marginLeft: 10,
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#2a7ed2'
    },
    details_modal: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 20,
        elevation: 4
    },
    details_modal_header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomColor: '#e2e2e2',
        borderBottomWidth: 1
    },
    headerView: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomColor: '#b3b0b3',
        borderBottomWidth: 2
    },
    headerText: {
        fontSize: 40,
        fontWeight: 'bold'
    },
    card: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        elevation: 1
    },
    cardTitle: {
        fontSize: 20,
        marginLeft: 8
    },
    statTitle: {
        fontSize: 10
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    updatedText: {
        paddingVertical: 2,
        alignSelf: 'flex-end',
        opacity: 0.5,
        marginBottom: 60
    },
    refreshBtn: {
        backgroundColor: '#313131',
        elevation: 4,
        borderRadius: 5,
        padding: 10,
        paddingHorizontal: 15,
        alignSelf: 'center'
    },
    refreshBtnTxt: {
        color: "white",
        fontSize: 20
    }
});

export default function Settings({ navigation }) {
    const [currentModal, setCurrentModal] = React.useState();
    const modals = {
        'self_assessment': SelfAssessmentModal,
        'faqs': FAQsModal,
        'testing_centres': TestingCentresModal,
        'stats': WorldStatsModal
    };
    const logout = () => {
        Alert.alert('Confirmation', "Are you sure you want to logout?", [
            { text: "Cancel" },
            {
                text: "OK",
                onPress: () => {
                    AsyncStorage.removeItem('logged_in');
                    navigation.navigate("Landing");
                }
            }
        ]);
    };

    return (
        <>
            <View style={styles.container}>
                <FlatList
                    data={sections}
                    keyExtractor={item => item.title}
                    renderItem={({ item }) => (
                        <TouchableNativeFeedback
                            onPress={() => setCurrentModal(item.modal)}>
                            <View style={styles.section}>
                                <View>
                                    <Text style={styles.section_title}>{item.title}</Text>
                                    <Text>{item.description}</Text>
                                </View>
                                <Feather name="chevron-right" size={24} color="black" />
                            </View>
                        </TouchableNativeFeedback>
                    )}
                    ListFooterComponent={() =>
                        <TouchableNativeFeedback onPress={logout}>
                            <View style={styles.btn_logout}>
                                <Text style={{ fontSize: 20, color: '#fff' }}>Logout</Text>
                            </View>
                        </TouchableNativeFeedback>
                    }
                />
            </View>
            {Object.entries(modals).map(([key, Component]) =>
                <Component key={key} visible={currentModal === key} onRequestClose={() => setCurrentModal()} />
            )}
        </>
    );
}

function SelfAssessmentModal({ visible, onRequestClose }) {
    return (
        <AppModal title="Self Assessment" visible={visible} onRequestClose={onRequestClose}>
            <View style={{ flex: 1, padding: 20, justifyContent: 'space-between' }}>
                <View>
                    <Text style={styles.section_title}>Getting Started</Text>
                    <Text style={{ marginBottom: 20 }}>This tool is intended to help you understand what to do next about COVID-19. You'll answer a few questions about your symptoms, travel, and contact you've had with others.</Text>
                    <Text style={styles.section_title}>Note</Text>
                    <Text style={{ marginBottom: 5 }}>Recommendations provided by this tool do not constitute medical advice and should not be used to diagnose or treat medical conditions.</Text>
                    <Text>Let's all look out for each other by knowing our status, trying not to infect others, and reserving care for those in need.</Text>
                </View>
                <TouchableNativeFeedback>
                    <View style={styles.btn}>
                        <Text style={{ fontSize: 20, color: '#fff' }}>Start Assessment</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </AppModal>
    );
}

function FAQsModal({ visible, onRequestClose }) {
    return (
        <AppModal title="FAQs" visible={visible} onRequestClose={onRequestClose}>
            <FlatList
                data={FAQs}
                keyExtractor={item => item.title}
                contentContainerStyle={{ padding: 20 }}
                renderItem={({ item }) => <ExpandableSection title={item.title} content={item.content} />}
            />
        </AppModal>
    )
}

function ExpandableSection({ title, content }) {
    const [expanded, setExpanded] = React.useState(false);
    return (
        <View style={{ marginBottom: 20 }}>
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, marginRight: 20 }}>
                        <Text style={styles.faq_title}>{title}</Text>
                    </View>
                    <EvilIcons name={expanded ? "chevron-down" : "chevron-right"} size={24} color="black" />
                </View>
            </TouchableOpacity>
            {expanded && <Text>{content}</Text>}
        </View>
    )
}

function TestingCentresModal({ visible, onRequestClose }) {
    const [isLoading, setLoading] = React.useState(true);
    const [testingCentres, setTestingCentres] = React.useState();
    const [selectedCentre, setSelectedCentre] = React.useState();
    const loadCentres = () => {
        if (isLoading) {
            getTestingCentres()
                .then(result => {
                    setTestingCentres(result);
                })
                .catch((err) => {
                    alert("Please make sure you're connected to the internet and try again.");
                    onRequestClose();
                })
                .finally(() => setLoading(false));
        }
    }
    return (
        <>
            <AppModal title="Testing Centres" visible={visible} onRequestClose={onRequestClose} onShow={loadCentres}>
                {isLoading ?
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size={40} />
                    </View>
                    :
                    <FlatList
                        data={testingCentres}
                        keyExtractor={(item, index) => String(index)}
                        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#e2e2e2" }} />}
                        renderItem={({ item }) => (
                            <TouchableNativeFeedback onPress={() => setSelectedCentre(item)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.section_title}>{item.name}</Text>
                                        <Text>{item.address}</Text>
                                    </View>
                                    <Feather name="chevron-right" size={24} color="black" />
                                </View>
                            </TouchableNativeFeedback>
                        )}
                    />
                }
            </AppModal>
            <Modal transparent visible={Boolean(selectedCentre)} animationType='fade' onRequestClose={() => setSelectedCentre()}>
                {selectedCentre &&
                    <View style={{ flex: 1, backgroundColor: '#000000b0', justifyContent: 'center' }}>
                        <View style={styles.details_modal}>
                            <View style={styles.details_modal_header}>
                                <Text numberOfLines={1} style={{ flex: 1, marginRight: 20, fontSize: 20, fontWeight: 'bold' }}>{selectedCentre.name}</Text>
                                <TouchableOpacity onPress={() => setSelectedCentre()}>
                                    <AntDesign name="close" size={25} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ margin: 20, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold', opacity: 0.7 }}>Location</Text>
                                    <Text style={{ fontSize: 17 }}>{selectedCentre.address}</Text>
                                </View>
                                <TouchableNativeFeedback onPress={() => openMap({ end: selectedCentre.location.coordinates[1] + ',' + selectedCentre.location.coordinates[0] })}>
                                    <View style={styles.map_btn}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold', textTransform: (Platform.os === 'ios' ? 'none' : 'uppercase') }}>
                                            Get Directions
                                        </Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                    </View>
                }
            </Modal>
        </>
    );
}

function WorldStatsModal({ visible, onRequestClose }) {
    const [worldStats, setWorldStats] = React.useState({});
    const [countryStats, setCountryStats] = React.useState({});
    const [countries, setCountries] = React.useState([]);
    const [currentCountry, setCurrentCountry] = React.useState({
        name: "Ghana",
        flag: "https://corona.lmao.ninja/assets/img/flags/gh.png"
    });
    const [isModalVisible, setModalVisible] = React.useState(false);
    const [isLoading, setLoading] = React.useState(true);

    // Load countries
    React.useEffect(() => {
        if (isLoading) {
            (async () => {
                try {
                    let _worldStats = await getWorldStats();
                    let _countryStats = await getCountryStats(currentCountry.name);
                    if (countries.length == 0)
                        setCountries(await getCountries());

                    setWorldStats(_worldStats);
                    setCountryStats(_countryStats);
                }
                catch{
                    await new Promise(resolve => {
                        setTimeout(
                            Alert.alert,
                            1000,
                            'Network Error',
                            'Please check your internet connection.',
                            [{ text: 'OK', onPress: resolve }],
                            { cancelable: false }
                        );
                    });
                }
                finally {
                    setLoading(false);
                }
            })();
        }
    }, [isLoading]);

    return (
        <AppModal title="Global Statistics" visible={visible} onRequestClose={onRequestClose}>
            <ScrollView style={styles.container}>
                <View style={{ paddingHorizontal: 10, paddingVertical: 15 }}>
                    <Card
                        title="Worldwide Statistics"
                        icon={<Ionicons name="ios-globe" size={25} color='blue' />}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Statistic label='Confirmed' color='blue' value={worldStats.confirmed} />
                            <Statistic label='Recovered' color='green' value={worldStats.recovered} />
                            <Statistic label='Deaths' color='red' value={worldStats.deaths} showBorder={false} />
                        </View>
                    </Card>
                    <Text style={{ marginTop: 20, marginBottom: 5, marginLeft: 5, fontWeight: 'bold' }}>Select Country:</Text>
                    <TouchableNativeFeedback onPress={() => {
                        if (countries.length == 0)
                            Alert.alert("Countries not loaded", "Tap the refresh button to load the countries.");
                        else
                            setModalVisible(true);
                    }
                    }>
                        <View style={{ ...styles.card, flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingRight: 15 }}>
                            <Image style={{ width: 30, height: 20 }} source={{ uri: currentCountry.flag }} />
                            <Text style={{ flex: 1, fontSize: 20, marginLeft: 5 }}>{currentCountry.name}</Text>
                            <Ionicons name='ios-arrow-down' size={15} color='#6f6d70' />
                        </View>
                    </TouchableNativeFeedback>
                    <Card
                        title="Statistics"
                        icon={<Ionicons name="md-stats" size={25} color='green' />}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <Statistic label='Confirmed' color='blue' value={countryStats.confirmed} />
                                <Statistic label='Active' color='#e5b45e' value={countryStats.active} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Statistic label='Recovered' color='green' value={countryStats.recovered} />
                                <Statistic label='Critical' color='#755659' value={countryStats.critical} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Statistic label='Deaths' color='red' value={countryStats.deaths} showBorder={false} />
                                <Statistic label='Tests' color='#67499b' value={countryStats.tests} showBorder={false} />
                            </View>
                        </View>
                    </Card>
                    <Text style={{ ...styles.updatedText, opacity: (countryStats.updated ? styles.updatedText.opacity : 0) }}>
                        Last updated on
              <Text style={{ fontWeight: 'bold' }}>
                            {moment(countryStats.updated).format(' DD/MM/YYYY [at] h:mm A')}
                        </Text>
                    </Text>
                    <TouchableNativeFeedback
                        onPress={() => {
                            setLoading(true);
                            setCurrentCountry(currentCountry);
                        }
                        }>
                        <View style={styles.refreshBtn}>
                            <Text style={styles.refreshBtnTxt}>REFRESH</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </ScrollView>
            <Modal visible={isModalVisible} animationType='slide' onRequestClose={() => setModalVisible(false)} >
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff', elevation: 4 }}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#edebee', true)} onPress={() => setModalVisible(false)}>
                        <View style={{ borderRadius: 15, overflow: 'hidden' }}>
                            <Ionicons name={Platform.os == 'ios' ? 'ios-arrow-back' : 'md-arrow-back'} size={30} />
                        </View>
                    </TouchableNativeFeedback>
                    <Text style={{ marginLeft: 15, fontSize: 20, fontWeight: 'bold' }}>Select Country</Text>
                </View>
                <FlatList
                    data={countries}
                    keyExtractor={(c) => c.name}
                    renderItem=
                    {({ item }) =>
                        <TouchableNativeFeedback
                            onPress={async () => {
                                setLoading(true);
                                setCurrentCountry(item);
                                setModalVisible(false);
                            }
                            }>

                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: (item.name == currentCountry.name ? "#f3f3f3" : "#fff") }}>
                                <Image source={{ uri: item.flag }} style={{ width: 40, height: 30, marginRight: 10, borderWidth: 1, borderColor: "#f3f3f3" }} />
                                <Text>{item.name}</Text>
                            </View>
                        </TouchableNativeFeedback>
                    }
                    contentContainerStyle={{ backgroundColor: '#edebee' }}
                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#e0e0e0' }} />} />
            </Modal>
            <Modal visible={isLoading} transparent={true}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', opacity: 0.8 }}>
                    <ActivityIndicator color='#fff' size={50} />
                </View>
            </Modal>
        </AppModal>
    );
}
function Card({ icon, title, children }) {
    return (
        <View style={{ ...styles.card, paddingHorizontal: 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5, paddingHorizontal: 10 }}>
                {icon}
                <Text style={styles.cardTitle}>{title}</Text>
            </View>
            {children}
        </View>
    );
}
function Statistic({ label, value, color, showBorder = true }) {
    return (
        <View style={{ flex: 1, paddingLeft: 10, paddingVertical: 15, borderRightColor: '#ece9ec', borderRightWidth: (showBorder ? 1 : 0) }}>
            <Text style={{ ...styles.statisticTitle, color }}>{label}</Text>
            <Text style={styles.statValue}>{value !== undefined ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '--'}</Text>
        </View>
    );
}