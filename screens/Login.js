import React, { useContext, useEffect, useState } from 'react'
import { Alert, AsyncStorage, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, TouchableWithoutFeedbackBase, View } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import axios from 'axios'

function Input(props)
{
    const [ visible, setVisible ] = useState(props.secure)

    return(
        <View style={[styles.borderedComponent, styles.input]}>
            <MaterialCommunityIcons style={[styles.defaultMargin, {marginLeft: 12}]} name={props.secure ? "lock-outline" : "email-outline"} size={24} color="black" />
            <TextInput keyboardType={props.secure ? "default" : "email-address"} style={{flex: 1}} secureTextEntry={visible} value={props.value} onChangeText={(text) => props.setValue(text)}/>
            {
                props.secure && 
                <TouchableOpacity style={[styles.defaultPadding, {paddingRight: 12}]} onPress={() => setVisible(!visible)}>
                    <MaterialCommunityIcons name={visible ? "eye-off-outline" : "eye-outline"} size={24} color="black" />
                </TouchableOpacity>
            }
        </View>
    )
}

export default function Screen({navigation})
{
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ remember, setRemember ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
        async function getData()
        {
            const email = await AsyncStorage.getItem('email')
            const password = await AsyncStorage.getItem('password')

            if(email) setEmail(email)
            if(password) setPassword(password)
        }

        getData()
    }, [])

    function processLogin()
    {
        setLoading(true)
        axios.put('/auth/', {email, password}).then(res => {
            const data = res.data

            if(!data.success)
            {
                Alert.alert(data.result)
                return
            }

            AsyncStorage.setItem('token', data.result)

            if(remember)
            {
                AsyncStorage.setItem('email', email)
                AsyncStorage.setItem('password', password)
            }

            navigation.navigate('MainMenu')

        }).catch(err => {
            console.log(err);
        }).finally(() => {
            setLoading(false)
        })
    }

    function onLoginButtonPress()
    {
        processLogin()
    }

    function onRegisterButtonPress()
    {
        navigation.navigate('Register')
    }

    return(
        <View style={styles.container}>
            <Text style={styles.inputLabel}>Email</Text>
            <Input value={email} setValue={(text) => setEmail(text)} secure={false}/>
            <Text style={styles.inputLabel}>Senha</Text>
            <Input value={password} setValue={(text) => setPassword(text)} secure={true}/>
            <TouchableOpacity disabled={loading} onPress={onLoginButtonPress} style={[styles.borderedComponent, styles.defaultPadding, {alignItems: 'center', marginTop: 8}]}>
                <Text>{loading ? "Entrando..." : "Entrar"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setRemember(!remember)} style={styles.checkbox}>
                <MaterialCommunityIcons name={remember ? "checkbox-marked" : "checkbox-blank-outline"} size={24} color="black" />
                <Text>Lembrar?</Text>
            </TouchableOpacity>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 8}}>
                <Text>Não possui cadastro? </Text>
                <TouchableOpacity onPress={onRegisterButtonPress}>
                    <Text style={{textDecorationLine: 'underline'}}>Registre-se</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 12
    },
    input: {
        display: 'flex',
        flexDirection: 'row',
    },
    borderedComponent: {
        backgroundColor: '#DDD',
        borderRadius: 64
    },
    defaultMargin: {
        margin: 8
    },
    defaultPadding: {
        padding: 8
    },
    inputLabel: {
        marginBottom: 4,
        marginTop: 8
    },
    checkbox: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 12,
        alignItems: 'center'
    }
})