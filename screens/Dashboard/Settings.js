import React from 'react';
import {
    Text, View, StyleSheet, TouchableOpacity,
    TouchableNativeFeedback, Modal, Platform, ActivityIndicator
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Feather, EvilIcons, AntDesign } from '@expo/vector-icons';
import AppModal from '../../components/AppModal';
import openMap from 'react-native-open-maps'

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
        title: "Personal Details",
        description: "View and update your personal details",
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
const testing_centres = [
    {
        "name": "Medifem Hospital & Laboratories",
        "address": "Westlands Blvd, Accra, Ghana",
        "placesName": "Westlands",
        "location": {
            "coordinates": [
                -0.2077531,
                5.6572118
            ]
        }
    },
    {
        "name": "Adenta Medical Centre",
        "address": "Legon, Accra, Ghana",
        "placesName": "Adenta",
        "location": {
            "coordinates": [
                -0.1954516,
                5.650697099999999
            ]
        }
    },
    {
        "name": "Nyaho Medical Center",
        "address": "Accra",
        "placesName": "Airport Residential Area, 35 Kofi Annan St, Accra, Ghana",
        "location": {
            "coordinates": [
                -0.1850195,
                5.6142401
            ]
        }
    },
    {
        "name": "Nyaho Medical Center",
        "address": "No. 12 quashie road",
        "placesName": "Kwabena Aniefe Street No. 1, Accra, Ghana",
        "location": {
            "coordinates": [
                -0.2051318,
                5.6148583
            ]
        }
    },
    {
        "name": "Ani-Fori Medical Institute",
        "address": "West Legon",
        "placesName": "Accra, Ghana",
        "location": {
            "coordinates": [
                -0.1869644,
                5.6037168
            ]
        }
    },
    {
        "name": "Here We Go",
        "address": "Housing Down",
        "placesName": "Legon, Accra, Ghana",
        "location": {
            "coordinates": [
                -0.1954516,
                5.650697099999999
            ]
        }
    },
    {
        "name": "Adenta Municipality",
        "address": "New Site",
        "placesName": null,
        "location": {
            "coordinates": [
                -0.15418,
                5.7141674
            ]
        }
    },
    {
        "name": "Here",
        "address": "123 Street",
        "placesName": null,
        "location": {
            "coordinates": [
                -0.1869644,
                5.6037168
            ]
        }
    },
    {
        "name": "Simple Testing Site",
        "address": "A simple address",
        "placesName": null,
        "location": {
            "coordinates": [
                20.748237,
                34.473883
            ]
        }
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
    }
});

export default function Settings() {
    const [currentModal, setCurrentModal] = React.useState();
    const modals = {
        'self_assessment': SelfAssessmentModal,
        'faqs': FAQsModal,
        'testing_centres': TestingCentresModal
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
    const [selectedCentre, setSelectedCentre] = React.useState();
    return (
        <>
            <AppModal title="Testing Centres" visible={visible} onRequestClose={onRequestClose} onShow={() => isLoading && setTimeout(setLoading, 1000, false)}>
                {isLoading ?
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size={40} />
                    </View>
                    :
                    <FlatList
                        data={testing_centres}
                        keyExtractor={item => item.address}
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