import React from 'react';
import {
    Text, View, StyleSheet, Animated,
    ImageBackground, TouchableNativeFeedback, ActivityIndicator, Easing
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { getGhanaStats } from '../../api';

const info = {
    updated_at: new Date(),
    stats: [
        {
            label: "Cases",
            img: require('../../assets/covid-19-bg-2.jpg')
        },
        {
            label: "Recoveries",
            img: require('../../assets/sanitizer_and_mask.jpg')
        },
        {
            label: "Deaths",
            img: require('../../assets/grave.jpg')
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

export default function Home() {
    const [isLoading, setLoading] = React.useState(true);
    const [isRefreshing, setRefreshing] = React.useState(false);
    const rotateAnim = React.useRef(new Animated.Value(0));
    const rotate = rotateAnim.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });
    const loadStats = () => {
        return getGhanaStats()
            .then(stats => {
                info.stats[0].value = stats.cases;
                info.stats[1].value = stats.recovered;
                info.stats[2].value = stats.deaths;
                info.updated_at = stats.updated;
            })
            .catch(() => alert('Please check your internet connection and try again.'))
    };

    React.useEffect(() => {
        loadStats().finally(() => setLoading(false));
    }, []);

    return (
        <>
            <View style={styles.container}>
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
                                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
                                                    <Text style={styles.stat_card_title}>{item.label}</Text>
                                                    <Text style={styles.stat_card_value}>{item.value || '--'}</Text>
                                                </View>
                                            </TouchableNativeFeedback>
                                        </View>
                                    )}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>News</Text>
                                        <Text>Last updated {moment(info.updated_at).fromNow()}...</Text>
                                    </View>
                                    <TouchableNativeFeedback disabled={isRefreshing} onPress={() => {
                                        setRefreshing(true);
                                        let anim = Animated.loop(
                                            Animated.timing(rotateAnim.current, {
                                                toValue: 1,
                                                duration: 1000,
                                                easing: Easing.linear,
                                                useNativeDriver: true
                                            })
                                        );
                                        anim.start();
                                        setTimeout(() => {
                                            loadStats().finally(() => {
                                                setRefreshing(false);
                                                anim.stop();
                                                rotateAnim.current.setValue(0);
                                            });
                                        }, 1000);
                                    }}>
                                        <Animated.View style={{ padding: 10, transform: [{ rotate }] }}>
                                            <Ionicons name="md-refresh" size={20} />
                                        </Animated.View>
                                    </TouchableNativeFeedback>
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
        </>
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
        position: 'absolute',
        top: 5,
        left: 10,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        opacity: 0.9,
    },
    stat_card_value: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 53
    },
    news_title: {
        fontWeight: 'bold',
        fontSize: 18
    }
});