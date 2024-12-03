import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Pressable, StyleSheet } from 'react-native';
import { auth } from '../firebase_config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { showToastWithGravityAndOffset } from '../toast';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                showToastWithGravityAndOffset("Successfully Signed In");
            })
            .catch(error => {
                Alert.alert('Error', error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login</Text>
            <TextInput
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                style={styles.textInput}
            />
            <TextInput
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                style={styles.textInput}
            />
            <Pressable onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Signup')} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Sign Up</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#2E1C47', // Rich dark purple background
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#F9E8FF',
        textAlign: 'center',
    },
    textInput: {
        marginBottom: 12,
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#8D69C4',
        backgroundColor: '#ffffff',
        color: '#5C4D9B',
        fontSize: 16,
    },
    button: {
        marginTop: 10,
        borderRadius: 8,
        backgroundColor: '#8fbc8f',
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#F9E8FF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    secondaryButton: {
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#8D69C4',
        backgroundColor: '#4B3869',
        paddingVertical: 12,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#B8E2C5',
        fontSize: 16,
        fontWeight: '600',
    },
});
