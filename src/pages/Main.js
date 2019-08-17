import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

import api from '../services/api';
import RequireId from './id';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';


export default function Main({ navigation }) {


    const id = navigation.getParam('user');
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);
    const [auth, setAuth] = useState(false)

    

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: { user: id }
            })

            setUsers(response.data);
        }

        loadUsers()
    }, [id]);

    useEffect(() => {
        const socket = io('https://tindevback.herokuapp.com/', {
            query: { user: id }
        })

        socket.on('match', dev => {
            setMatchDev(dev);
        })

    }, [id]);

    async function handleLike() {
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: id },
        })

        setUsers(rest)
    }

    async function handleDislike() {
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: id },
        })

        setUsers(rest)
    }

    async function handleLogout() {
        await AsyncStorage.clear();

        navigation.navigate('Login');
    }

    if (!auth) {
       return (<RequireId handlePopupDismissed={() => setAuth(true)} />)
    } else {
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image source={logo} style={styles.logo} />
            </TouchableOpacity>

            <View style={styles.cardsContainer}>
                {users.length === 0
                    ? <Text style={styles.empty}>Acabou :(</Text>
                    : (
                        users.map((user, index) => (
                            <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                                <Image style={styles.avatar} source={{ uri: user.avatar }} />
                                <View style={styles.footer}>
                                    <Text style={styles.name}>{user.name}</Text>
                                    <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                                </View>
                            </View>
                        ))
                    )}
            </View>
            {users.length > 0 ? (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleDislike}>
                        <Image source={dislike} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleLike}>
                        <Image source={like} />
                    </TouchableOpacity>
                </View>
            ) : <View></View>}

            {matchDev && (
                <View style={styles.matchContainer}>
                    <Image source={itsamatch} />
                    <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />

                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>

                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.closeMatch}>FECHAR</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#282a36",
      alignItems: "center",
      justifyContent: "space-between"
    },
  
    logo: {
      marginTop: 30
    },
  
    empty: {
      alignSelf: "center",
      color: "#999",
      fontSize: 24,
      fontWeight: "bold"
    },
  
    cardsContainer: {
      flex: 1,
      alignSelf: "stretch",
      justifyContent: "center",
      maxHeight: 500
    },
  
    card: {
      borderWidth: 1,
      borderColor: "#44475a",
      borderRadius: 8,
      margin: 30,
      overflow: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
  
    avatar: {
      flex: 1,
      height: 300
    },
  
    footer: {
      backgroundColor: "#44475a",
      paddingHorizontal: 20,
      paddingVertical: 15
    },
  
    name: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#f8f8f2"
    },
  
    bio: {
      fontSize: 14,
      color: "#f8f8f2",
      marginTop: 5,
      lineHeight: 18
    },
  
    buttonsContainer: {
      flexDirection: "row",
      marginBottom: 30
    },
  
    button: {
      zIndex: 1,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "#f8f8f2",
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 20,
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 2,
      shadowOffset: {
        width: 0,
        height: 2
      }
    },
  
    matchContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    },
  
    matchImage: {
      height: 60,
      resizeMode: "contain"
    },
  
    matchAvatar: {
      width: 160,
      height: 160,
      borderRadius: 80,
      borderWidth: 5,
      borderColor: "#282a36",
      marginVertical: 30
    },
  
    matchName: {
      fontSize: 23,
      fontWeight: "bold",
      color: "#f8f8f2"
    },
  
    matchBio: {
      marginTop: 10,
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
      lineHeight: 24,
      textAlign: "center",
      paddingHorizontal: 30
    },
  
    closeMatch: {
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
      textAlign: "center",
      marginTop: 30,
      fontWeight: "bold"
    }
  });