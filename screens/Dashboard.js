import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ActivityIndicator, Image, Pressable, StyleSheet, FlatList, TextInput } from 'react-native';
import { auth, db } from '../firebase_config/firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

export default function DashboardScreen({ navigation }) {
    const [isDataFetching, setFetchingStatus] = useState(true);
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        signOut(auth)
            .then(() => console.log("Logged out successfully"))
            .catch(error => console.error('Error:', error));
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    onPress={handleLogout}
                    style={styles.logoutButton}>
                    <MaterialIcons name="logout" size={20} color="white" />
                    <Text style={styles.logoutText}>Logout</Text>
                </Pressable>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const fetchedRecipes = [];
                const querySnapshot = await getDocs(query(collection(db, 'Recipe')));
                querySnapshot.forEach((doc) => {
                    fetchedRecipes.push({ ...doc.data(), id: doc.id });
                });
                setRecipes(fetchedRecipes);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setFetchingStatus(false);
            }
        };

        fetchRecipes();
    }, []);

    const filteredRecipes = recipes.filter(recipe =>
        recipe.dish.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search Recipes..."
                placeholderTextColor="#D4C2F2"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {isDataFetching ? (
                <ActivityIndicator size="large" color="#A689E8" />
            ) : (
                <FlatList
                    data={filteredRecipes}
                    renderItem={({ item }) => (
                        <Card
                            dish={item.dish}
                            description={item.description}
                            imageUrl={item.imageUrl}
                            onViewRecipe={() => navigation.navigate('DetailRecipe', { documentId: item.id })}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
}

const Card = ({ dish, description, imageUrl, onViewRecipe }) => (
    <View style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text style={styles.title}>{dish}</Text>
        <Text style={styles.description}>{description}</Text>
        <Pressable onPress={onViewRecipe} style={styles.button}>
            <Text style={styles.buttonText}>View Recipe</Text>
        </Pressable>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F1E1', 
        padding: 10,
    },
    searchInput: {
        height: 45,
        borderColor: '#8D69C4',
        borderWidth: 2,
        borderRadius: 12,
        color: '#ffffff',
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#5C4D9B', 
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#5C4D9B', 
        borderRadius: 20,
        padding: 10,
        marginRight: 10,
        shadowColor: '#FFD700', 
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 8,
    },
    logoutText: {
        marginLeft: 8,
        color: '#B8E2C5',
        fontWeight: 'bold',
        fontSize: 16,
    },
    listContent: {
        paddingHorizontal: 8,
    },
    card: {
        backgroundColor: '#4B3869', 
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#FFD700', 
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 6,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#B8E2C5', 
        marginBottom: 6,
    },
    description: {
        fontSize: 16,
        color: '#ffffff', 
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#8fbc8f', 
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#B88B4A', 
        shadowColor: '#B8E2C5', 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 6,
    },
    buttonText: {
        color: '#F9E8FF', 
        fontWeight: 'bold',
        fontSize: 16,
    },
});
