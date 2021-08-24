import axios from 'axios';
import React, { useEffect } from 'react'
import { Text, TouchableOpacity, View } from "react-native"

export default function Screen({navigation})
{
    return(
        <View>
            <TouchableOpacity onPress={() => {
                navigation.navigate('Dashboard')
            }}>
                <Text>Explorar jogos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                navigation.navigate('MyGames')
            }}>
                <Text>Meus jogos</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text>Opções</Text>
            </TouchableOpacity>
        </View>
    )
}