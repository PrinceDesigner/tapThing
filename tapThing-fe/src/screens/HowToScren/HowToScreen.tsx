import HowItFeels from '@/components/ui/HowFeel';
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const HowToScreen: React.FC = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <HowItFeels />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
    },
});

export default HowToScreen;