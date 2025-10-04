import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const FeedScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Feed Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 32,
    },
});

export default FeedScreen;