import React from 'react';
import {
    Text, View, StyleSheet, FlatList, AsyncStorage,
    TouchableNativeFeedback, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { FontAwesome5, Ionicons, AntDesign } from '@expo/vector-icons';
import FloatingActionButton from '../../components/FloatingActionButton';
import AppModal from '../../components/AppModal';
import moment from 'moment';

const ratings = [
    { id: 0, label: "None", color: '#73e403' },
    { id: 1, label: "Mild", color: '#00c300' },
    { id: 2, label: "Mid", color: '#bdbd03' },
    { id: 3, label: "Semi", color: '#ff7f00' },
    { id: 4, label: "High", color: '#f00' }
];

export default function Vitals() {
    const [isLoading, setLoading] = React.useState(true);
    const [showFAB, setShowFAB] = React.useState(false);
    const [vitals, setVitals] = React.useState([]);
    const [modalVisible, setModalVisible] = React.useState(false);

    // Load reports
    React.useEffect(() => {
        AsyncStorage.getItem('vitals', (err, result) => {
            if (!err) {
                setVitals(result ? JSON.parse(result) : []);
                setTimeout(setLoading, 500, false);
            }
        })
    }, []);

    // Show FAB 
    React.useEffect(() => {
        if (!isLoading)
            setTimeout(setShowFAB, 100, true);
    }, [isLoading]);

    return (
        <>
            <View style={styles.container}>
                {isLoading ?
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size={40} />
                    </View>
                    : vitals.length == 0 ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
                            <FontAwesome5 name="heartbeat" color='#DBDBDB' size={100} />
                            <Text style={{ marginTop: 10, fontSize: 20, color: '#C7C7C7' }}>No vitals recorded yet...</Text>
                        </View>
                        :
                        <FlatList
                            data={vitals}
                            keyExtractor={(item, index) => String(index)}
                            contentContainerStyle={{ padding: 20, paddingBottom: 130 }}
                            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#e2e2e2", marginVertical: 20 }} />}
                            renderItem={({ item }) => (
                                <FlatList scrollEnabled={false}
                                    ListHeaderComponent={() => <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>{moment(item.date).format("MMMM D, YYYY [at] h:mm a")}</Text>}
                                    data={Object.entries(item.symptoms)}
                                    keyExtractor={(item, index) => String(index)}
                                    numColumns={3}
                                    renderItem={({ item }) => {
                                        const [key, value] = item;
                                        const { label, color } = ratings[value];
                                        return (
                                            <View style={{ flex: 1, margin: 5, paddingVertical: 20, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: color, borderRadius: 10 }}>
                                                <Text numberOfLines={1} style={{ fontWeight: 'bold', color: '#fff', textShadowColor: 'black', textShadowRadius: 1, }}>{key}</Text>
                                                <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#fff', textShadowColor: 'black', textShadowRadius: 1, }}>{value}</Text>
                                                <Text style={{ color: '#fff', fontWeight: 'bold', textShadowColor: 'black', textShadowRadius: 1, }}>{`(${label})`}</Text>
                                            </View>
                                        );
                                    }}
                                />
                            )}
                        />
                }
                <FloatingActionButton visible={showFAB} onPress={() => setModalVisible(true)}>
                    <Ionicons name="md-add" size={24} color='#fff' />
                </FloatingActionButton>
            </View>
            <LogSymptomsModal visible={modalVisible} onRequestClose={() => setModalVisible(false)}
                onLogSymptoms={(symptoms) => {
                    vitals.unshift({ date: new Date(), symptoms });
                    AsyncStorage.setItem('vitals', JSON.stringify(vitals));
                }} />
        </>
    );
}

function LogSymptomsModal({ visible, onLogSymptoms, onRequestClose }) {
    const [isLoading, setLoading] = React.useState(false);
    const initialSymptoms = {
        "Dry Cough": -1,
        "Tiredness": -1,
        "Sore Throat": -1,
        "Fever": -1,
        "Aches & Pains": -1,
        "Shortness of Breath": -1
    };
    const [symptoms, setSymptoms] = React.useState(initialSymptoms);
    const entries = Object.entries(symptoms);
    const isValid = entries.every(([key, value]) => value != -1);
    const _onRequestClose = () => {
        setSymptoms(initialSymptoms);
        onRequestClose();
    };

    return (
        <AppModal title='Log Symptoms' visible={visible} onRequestClose={_onRequestClose}>
            <FlatList
                data={entries}
                keyExtractor={(item, index) => String(index)}
                contentContainerStyle={{ padding: 20 }}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                renderItem={({ item }) => {
                    const [key, value] = item;
                    return (
                        <SymptomRating key={key} title={key} value={value}
                            onChangeValue={(newValue) => {
                                symptoms[key] = newValue;
                                setSymptoms(Object.assign({}, symptoms));
                            }} />
                    );
                }}
                ListFooterComponent={() => (
                    <TouchableNativeFeedback
                        disabled={!isValid || isLoading}
                        onPress={() => {
                            if (!isLoading) {
                                setLoading(true);
                                setTimeout(async () => {
                                    setLoading(false);
                                    onLogSymptoms(symptoms);
                                    _onRequestClose();
                                }, 2000);
                            }
                        }}>
                        <View style={isValid ? styles.logBtn : styles.logBtn_disabled}>
                            {isLoading ?
                                <ActivityIndicator size={27} color="#fff" />
                                :
                                <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>Log Vitals</Text>
                            }
                        </View>
                    </TouchableNativeFeedback>
                )}
            />
        </AppModal >
    );
}

function SymptomRating({ title, value, onChangeValue }) {
    return (
        <View style={styles.symptom_rating_container}>
            <View style={{ borderBottomColor: '#b5b2b5', borderBottomWidth: 1, paddingBottom: 10, marginBottom: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>{title}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                {ratings.map(r => (
                    <View key={String(r.id)} style={{ flex: 1, alignItems: 'center', marginBottom: 5 }}>
                        {r.id !== value ?
                            <TouchableOpacity onPress={() => onChangeValue(r.id)}>
                                <View style={styles.symptom_rating}>
                                    <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{r.id}</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <View style={styles.symptom_rating_selected}>
                                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff' }}>{r.id}</Text>
                            </View>
                        }
                        <Text>{r.label}</Text>
                    </View>
                ))}
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    symptom_rating_container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 4,
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    symptom_rating: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        borderColor: "#787679",
        borderWidth: 2,
        borderRadius: 30,
        marginVertical: 10
    },
    symptom_rating_selected: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        backgroundColor: '#a3aec2',
        borderRadius: 30,
        marginVertical: 10
    },
    logBtn: {
        alignItems: 'center',
        paddingVertical: 15,
        marginTop: 30,
        marginBottom: 20,
        backgroundColor: '#8592ab'
    },
    logBtn_disabled: {
        alignSelf: "stretch",
        alignItems: 'center',
        paddingVertical: 15,
        marginTop: 30,
        marginBottom: 20,
        opacity: 0.8,
        backgroundColor: '#8592ab'
    }
});