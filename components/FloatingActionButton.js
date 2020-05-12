import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableNativeFeedback, Animated } from 'react-native';

export default function FloatingActionButton({ visible = true, color, children, onPress }) {
    const anim = React.useRef(new Animated.Value(visible ? 1 : 0)).current;
    useEffect(() => {
        Animated.timing(anim, {
            toValue: (visible ? 1 : 0),
            duration: 100
        }).start();
    });
    return (
        <View style={styles.container}>
            <TouchableNativeFeedback enabled={visible} onPress={onPress} background={TouchableNativeFeedback.Ripple("#ffffff30", false)}>
                <Animated.View style={[styles.btn, { backgroundColor: color || '#444242', scaleX: anim, scaleY: anim }]}>
                    {children}
                </Animated.View>
            </TouchableNativeFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0, right: 0, bottom: 40,
        alignItems: 'center'
    },
    btn: {
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        borderRadius: 28
    }
});