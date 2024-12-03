import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase_config/firebase';
import { showToastWithGravityAndOffset } from '../toast';

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                showToastWithGravityAndOffset("Successfully Signed Up");
                navigation.navigate('Login');
            })
            .catch((error) => alert(error.message));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Sign Up</Text>
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
            <TextInput
                placeholder="Confirm Password"
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                secureTextEntry
                style={styles.textInput}
            />
            <Pressable onPress={handleSignup} style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#2E1C47',
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
        color: '#2E1C47',
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
});
