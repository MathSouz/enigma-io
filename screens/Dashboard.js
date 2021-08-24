import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function Screen({navigation})
{
    const [ matches, setMatches ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ showInput, setShowInput ] = useState(false)
    const [ password, setPassword ] = useState('')
    const [ gameId, setGameId ] = useState()

    function refreshList()
    {
        setLoading(true)

        axios.get('/match/list').then(res => {
            setMatches(res.data.result)
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        refreshList()
    }, [])

    function onTryToEnterGame(game)
    {
        if(game.hasPassword)
        {
            setGameId(game.id)
            setShowInput(true)
        }

        else
        {
            processRoomEnter(game.id)
        }
    }

    function onRoomPasswordInput()
    {
        processRoomEnter(gameId, password)
    }

    function processRoomEnter(matchid, password)
    {
        axios.put("/match/join/" + matchid, {password}).then(res => {
            console.log(res.data);
        }).catch(err => {
            console.log(err);
        })
    }

    return(
        <View style={styles.container}>
            <FlatList refreshControl={<RefreshControl refreshing={loading} onRefresh={() => {
                refreshList()
            }}/>} style={{paddingHorizontal: 8, flex: 1}} data={matches} renderItem={({item}) => 
                <View style={styles.listItem}>
                    <View>
                        <Text style={{fontSize: 22}}>{item.name} ({item.playersCount})</Text>
                        <Text style={{fontSize: 11, opacity: 0.5}}>Mestre: {item.host}</Text>
                    </View>
                    
                    
                    <TouchableOpacity onPress={() => onTryToEnterGame(item)}>
                        <View style={{flexDirection: 'row'}}>
                            {
                                item.hasPassword && <MaterialCommunityIcons name="door-closed-lock" size={24} color="black" />
                            }
                            <Text style={{marginLeft: 4}}>Entrar</Text>
                        </View>
                    </TouchableOpacity>
                </View>}/>
            <TouchableOpacity style={styles.floatingButton}>
                <View style={{flexDirection: 'row'}}>
                    <MaterialCommunityIcons name="chat-plus-outline" size={24} color="black" />
                    <Text style={{textAlign: 'center', marginLeft: 4}}>CRIAR JOGO</Text>
                </View>
            </TouchableOpacity>
            
            {
                showInput && 
                <View style={{position: 'absolute', backgroundColor: '#444', alignSelf: 'stretch'}}>
                    <Text>Está sala é protegida por senha.</Text>
                    <Text>Insira a senha para ingressar.</Text>
                    
                    <TextInput value={password} onChangeText={(text) => setPassword(text)} secureTextEntry={true}/>
                    <TouchableOpacity onPress={onRoomPasswordInput}>
                        <Text>Entrar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowInput(false)}>
                        <Text>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listItem: {
        backgroundColor: '#DDD',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        paddingVertical: 8,
        marginVertical: 6
    },
    floatingButton: {
        padding: 8,
        backgroundColor: '#AAF',
        alignItems: 'center'
    }
})