import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { db } from '../firebase_config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';

const DetailRecipeScreen = ({ route }) => {
    const { documentId } = route.params;
    const [recipe, setRecipe] = useState(null);
    const [isDataFetching, setFetchingStatus] = useState(true);
    const stringsList = ['String 1', 'String 2', 'String 3'];

    const handleDownload = async () => {
        try {
           
            const csvData = stringsList.join('\n');
            const filePath = FileSystem.documentDirectory + 'strings.txt';
            await FileSystem.writeAsStringAsync(filePath, csvData, { encoding: FileSystem.EncodingType.UTF8 });
            await FileSystem.downloadAsync(filePath, FileSystem.documentDirectory + 'strings.txt');
            console.log('File downloaded successfully');
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const docRef = doc(db, 'Recipe', documentId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const recipeData = docSnap.data();
                    setRecipe(recipeData);
                    setFetchingStatus(false);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document: ", error);
                setFetchingStatus(false);
            }
        }
        fetchData();
    }, []);

    return (
        isDataFetching ? 
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View> :
            <ScrollView style={styles.container}>
                {recipe &&
                    <>
                        <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
                        <Text style={styles.title}>{recipe.dish}</Text>
                        <Text style={styles.description}>{recipe.description}</Text>
                        <Text style={styles.sectionTitle}>Ingredients:</Text>
                        {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                            ingredient.name &&
                            <View key={index} style={styles.ingredientContainer}>
                                {ingredient.image && <Image source={{ uri: ingredient.image }} style={styles.ingredientImage} />}
                                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                            </View>
                        ))}
                        <Text style={styles.sectionTitle}>Instructions:</Text>
                        {recipe.instruction && recipe.instruction.map((instruction, index) => (
                            instruction &&
                            <View style={styles.instructionContainer} key={index}>
                                <Text style={styles.instruction}>{instruction}</Text>
                            </View>
                        ))}
                    </>
                }
            </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2E1C47', 
        padding: 10,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        marginBottom: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#B8E2C5', 
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#ffffff', 
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#B8E2C5', 
        marginBottom: 12,
    },
    ingredientContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#5C4D9B', 
        padding: 8,
        borderRadius: 8,
        shadowColor: '#FFD700', 
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 6,
    },
    ingredientImage: {   
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    ingredientName: {
        fontSize: 16,
        color: '#ffffff',
    },
    instructionContainer: {
        marginBottom: 16,
        backgroundColor: '#5C4D9B', 
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderColor: '#ffffff', 
        shadowColor: '#FFD700', 
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 6,
    },
    instruction: {
        fontSize: 14,
        color: '#F7F1E1', 
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
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});

export default DetailRecipeScreen;
