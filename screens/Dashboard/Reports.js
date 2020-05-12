import React from 'react';
import {
    Text, View, StyleSheet, AsyncStorage,
    ActivityIndicator, TouchableOpacity, Modal,
    CheckBox, TextInput, TouchableNativeFeedback, SectionList
} from 'react-native';
import FloatingActionButton from '../../components/FloatingActionButton';
import { AntDesign, FontAwesome5, FontAwesome, Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';

function setDefaultReports() {
    AsyncStorage.setItem('reports', JSON.stringify([
        {
            date: new Date(),
            target: "Self",
            location: "Accra",
            landmark: "Accra Mall",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu tellus eleifend nisl gravida dapibus. Duis aliquet condimentum lectus nec scelerisque."
        },
        {
            date: new Date(Date.now() - 86000000),
            target: "Self",
            location: "Accra",
            landmark: "Flagstaff House",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu tellus eleifend nisl gravida dapibus. Duis aliquet condimentum lectus nec scelerisque."
        },
        {
            date: new Date(Date.now() - 88500000),
            target: "Someone else",
            location: "Kasoa",
            landmark: "West Hills Mall",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu tellus eleifend nisl gravida dapibus. Duis aliquet condimentum lectus nec scelerisque."
        },
        {
            date: new Date("2020-03-06T13:00"),
            target: "Self",
            location: "Kumasi",
            landmark: "Manhyia Palace",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu tellus eleifend nisl gravida dapibus. Duis aliquet condimentum lectus nec scelerisque."
        },
        {
            date: new Date("2020-01-01T09:30"),
            target: "Self",
            location: "Atomic Down",
            landmark: "Goil Filling Station",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu tellus eleifend nisl gravida dapibus. Duis aliquet condimentum lectus nec scelerisque."
        },
        {
            date: new Date("2020-01-01T07:20"),
            target: "Self",
            location: "Kisseiman",
            landmark: "Ecobank",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu tellus eleifend nisl gravida dapibus. Duis aliquet condimentum lectus nec scelerisque."
        },
        {
            date: new Date("2020-01-01T04:00"),
            target: "Self",
            location: "Tema",
            landmark: "Tema Harbour",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu tellus eleifend nisl gravida dapibus. Duis aliquet condimentum lectus nec scelerisque."
        }
    ]));
}
//setDefaultReports();

function groupReports(reports) {
    let results = [], currentDate, currentGroup, today = moment(new Date().setHours(0, 0, 0, 0));
    reports.forEach(report => {
        if (currentDate && currentDate.isSame(report.date, 'day'))
            currentGroup.data.push(report)
        else {
            currentDate = moment(report.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            let title;
            let diff = today.diff(currentDate, 'days');
            if (diff == 0)
                title = "Today";
            else if (diff == 1)
                title = "Yesterday";
            else
                title = currentDate.format("MMMM D, YYYY");

            currentGroup = { title, data: [report] };
            results.push(currentGroup)
        }
    });
    return results;
}

export default function Reports() {
    const [isLoading, setLoading] = React.useState(true);
    const [showFAB, setShowFAB] = React.useState(false);
    const [reports, setReports] = React.useState();
    const [showMakeReportModal, setShowMakeReportModal] = React.useState(false);
    const [currentReport, setCurrentReport] = React.useState();

    // Load reports
    React.useEffect(() => {
        AsyncStorage.getItem('reports', (err, result) => {
            if (!err) {
                setReports(JSON.parse(result));
                // setReports([]);
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
                    : reports.length == 0 ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
                            <FontAwesome5 name="notes-medical" color='#DBDBDB' size={100} />
                            <Text style={{ marginTop: 10, fontSize: 20, color: '#C7C7C7' }}>No case reports made yet...</Text>
                        </View>
                        :
                        <SectionList
                            sections={groupReports(reports)}
                            keyExtractor={(item, index) => String(index)}
                            ItemSeparatorComponent={() => <View style={{ backgroundColor: "#e2e2e2", height: 1 }} />}
                            ListFooterComponent={() => <View style={{ height: 120 }} />}
                            renderSectionHeader={({ section }) => (
                                <View style={styles.report_section_header}>
                                    <Text style={styles.report_section_title}>{section.title}</Text>
                                </View>
                            )}
                            renderItem={({ item }) => (
                                <TouchableNativeFeedback onPress={() => setCurrentReport(item)}>
                                    <View style={styles.report_row}>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={styles.report_target}>{item.target}</Text>
                                            <Text style={styles.report_time}>{moment(item.date).format("h:mm A")}</Text>
                                        </View>
                                        <Text numberOfLines={2}>{item.description}</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            )}
                        />
                }
                <FloatingActionButton visible={showFAB} onPress={() => setShowMakeReportModal(true)}>
                    <Ionicons name="md-add" size={24} color='#fff' />
                </FloatingActionButton>
            </View>
            <MakeReportModal
                visible={showMakeReportModal}
                onRequestClose={() => setShowMakeReportModal(false)}
                onMakeReport={report => {
                    reports.unshift(report);
                    AsyncStorage.setItem('reports', JSON.stringify(reports));
                    setShowMakeReportModal(false);
                }}
            />
            <ViewReportModal report={currentReport} visible={Boolean(currentReport)} onRequestClose={() => setCurrentReport(null)} />
        </>
    );
}

function MakeReportModal({ visible, onMakeReport, onRequestClose }) {
    const initialState = {
        target: "", location: "", landmark: "", contact: "", description: ""
    };
    const [report, setReport] = React.useState(initialState);
    const [isValidContact, setIsValidContact] = React.useState(true);
    const isValid = (report.isForSelf !== undefined) && (!report.isForSelf ? report.target.length : true) && report.location.length && report.landmark.length && isValidContact && report.description.length;
    const [isLoading, setLoading] = React.useState(false);

    return (
        <>
            <Modal animationType='slide' visible={visible} onRequestClose={onRequestClose}>
                <View style={styles.modal}>
                    <View style={styles.modal_header}>
                        <Text style={styles.modal_title}>Make Report</Text>
                        <TouchableOpacity onPress={onRequestClose}>
                            <AntDesign name="close" size={25} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.modal_body}>
                        <Text>Who are you reporting?</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 10 }}>
                            <CheckBox value={report.isForSelf} onValueChange={value => setReport({ ...report, isForSelf: value })} />
                            <Text style={{ marginRight: 20 }}>Self</Text>
                            <CheckBox value={(report.isForSelf !== undefined) ? !report.isForSelf : false} onValueChange={value => setReport({ ...report, isForSelf: !value })} />
                            <Text>Other Individual</Text>
                            {report.isForSelf === undefined &&
                                <View style={{ flex: 1, marginRight: 10, alignItems: 'flex-end' }}>
                                    <FontAwesome name='warning' size={15} color="#dede53" />
                                </View>
                            }
                        </View>
                        {report.isForSelf == false &&
                            <>
                                <Text>Full name of other individual</Text>
                                <View style={styles.text_field}>
                                    <TextInput
                                        value={report.target}
                                        style={{ flex: 1 }}
                                        onChangeText={text => setReport({ ...report, target: text.trim() })} />
                                    {report.target.length == 0 &&
                                        <FontAwesome name='warning' size={15} color="#dede53" />
                                    }
                                </View>
                            </>
                        }
                        <Text>Location or Digital Address</Text>
                        <View style={styles.text_field}>
                            <TextInput
                                placeholder="eg. GA-492-74"
                                value={report.location}
                                style={{ flex: 1 }}
                                onChangeText={text => setReport({ ...report, location: text.trim() })} />
                            {report.location.length == 0 &&
                                <FontAwesome name='warning' size={15} color="#dede53" />
                            }
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 3, marginRight: 10 }}>
                                <Text>Nearest Landmark</Text>
                                <View style={styles.text_field}>
                                    <TextInput
                                        placeholder="eg. Goil Fuel Station"
                                        value={report.landmark}
                                        style={{ flex: 1 }}
                                        onChangeText={text => setReport({ ...report, landmark: text.trim() })} />
                                    {report.landmark.length == 0 &&
                                        <FontAwesome name='warning' size={15} color="#dede53" />
                                    }
                                </View>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text>Alternate Contact</Text>
                                <View style={styles.text_field}>
                                    <TextInput
                                        keyboardType="phone-pad"
                                        placeholder="Phone Number"
                                        maxLength={10}
                                        value={report.contact}
                                        style={{ flex: 1 }}
                                        onChangeText={text => {
                                            setReport({ ...report, contact: text });
                                            setIsValidContact(text.length ? /^0(2[034678]|5[045679])[0-9]{7}/.test(text) : true)
                                        }} />
                                    {isValidContact ||
                                        <FontAwesome name='warning' size={15} color="#dede53" />
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text>Description</Text>
                            {report.description.length == 0 &&
                                <FontAwesome name='warning' size={15} color="#dede53" />
                            }
                        </View>
                        <TextInput multiline
                            placeholder="Describe how you're feeling..."
                            numberOfLines={10}
                            value={report.description}
                            style={styles.text_field_multiline}
                            onChangeText={text => setReport({ ...report, description: text })} />
                        <TouchableNativeFeedback
                            disabled={!isValid}
                            onPress={() => {
                                setLoading(true);
                                setTimeout(() => {
                                    setLoading(false);
                                    report.date = new Date();
                                    if (report.isForSelf)
                                        report.target = 'Self';

                                    delete report.isForSelf;
                                    onMakeReport(report);
                                    setReport(initialState);
                                }, 1000);
                            }}>
                            <View style={isValid ? styles.btn : styles.btn_disabled}>
                                {isLoading ?
                                    <ActivityIndicator size={27} color="#fff" />
                                    :
                                    <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>Report Case</Text>
                                }
                            </View>
                        </TouchableNativeFeedback>
                    </ScrollView>
                </View>
            </Modal>
        </>
    );
}

function ViewReportModal({ visible, report, onRequestClose }) {
    return (
        <Modal visible={visible} transparent animationType='fade' onRequestClose={onRequestClose}>
            {visible &&
                <View style={{ flex: 1, backgroundColor: '#00000030', justifyContent: 'center' }}>
                    <View style={styles.report_details_modal}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Text style={styles.report_details_title}>Report Details</Text>
                            <TouchableOpacity onPress={onRequestClose}>
                                <AntDesign name="close" size={25} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginRight: 50 }}>
                                <Text style={styles.report_details_label}>Individual</Text>
                                <Text>{report.target}</Text>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text style={styles.report_details_label}>Date</Text>
                                <Text>{moment(report.date).format("MMMM D, YYYY [at] h:mm A")}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                            <View style={{ flex: 1, marginRight: 50 }}>
                                <Text style={styles.report_details_label}>Location</Text>
                                <Text>{report.location}</Text>
                            </View>
                            <View style={{ flex: 2 }}>
                                <Text style={styles.report_details_label}>Nearest Landmark</Text>
                                <Text>{report.landmark}</Text>
                            </View>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.report_details_label}>Description</Text>
                            <Text>{report.description}</Text>
                        </View>
                    </View>
                </View>
            }
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    report_section_header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#EEEEEE",
        borderTopWidth: 1,
        borderTopColor: "#D0D0D0",
        borderBottomWidth: 1,
        borderBottomColor: "#D0D0D0"
    },
    report_section_title: {
        fontWeight: 'bold'
    },
    report_row: {
        padding: 20
    },
    report_target: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    report_time: {
        fontSize: 12,
        opacity: 0.5
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
    text_field: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e2e2',
        padding: 10,
        marginVertical: 10
    },
    text_field_multiline: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e2e2',
        padding: 10,
        marginVertical: 10,
        textAlignVertical: 'top'
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
    report_details_modal: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 20,
        elevation: 4
    },
    report_details_title: {
        fontSize: 20,
        fontWeight: 'bold'
    }, report_details_label: {
        fontWeight: 'bold',
        opacity: 0.7
    }
});