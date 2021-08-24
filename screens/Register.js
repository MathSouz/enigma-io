import React, { useEffect, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View, Text, Alert } from "react-native"
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons'
import axios from 'axios'

function PasswordInput(props)
{    
    return(
        <View>
            <Text style={{marginBottom: 8}}>{props.label}</Text>
            <View style={[styles.borderedComponent, styles.input]}>
                <MaterialCommunityIcons style={[styles.defaultMargin, {marginLeft: 12}]} name={props.icon} size={24} color="black" />
                <TextInput secureTextEntry={true} value={props.value} onChangeText={(text) => {
                    props.setValue(text)
                }} style={{flex: 1}}/>
            </View>
        </View>
    )
}

function VerifyInput(props)
{
    const [ verified, setVerified ] = useState(false)
    const [ verifing, setVerifing ] = useState(false)

    function onVerifyButtonPress()
    {
        if(props.value.trim().length == 0)
        {
            setVerified(false)
            return
        }

        setVerifing(true)

        axios.get(props.verifyEndpoint + props.value).then(res => {
            setVerified(!res.data.result)
        }).catch(err => {
            console.log(err);
            setVerified(false)
        }).finally(() => {
            setVerifing(false)
        })
    }
    
    return(
        <View>
            <Text style={{marginBottom: 8}}>{props.label}</Text>
            <View style={[styles.borderedComponent, styles.input]}>
                <MaterialCommunityIcons style={[styles.defaultMargin, {marginLeft: 12}]} name={props.icon} size={24} color="black" />
                <TextInput value={props.value} onChangeText={(text) => {
                    props.setValue(text)
                    setVerified(false)
                }} style={{flex: 1}}/>
                <TouchableOpacity style={{justifyContent: 'center', paddingHorizontal: 12}} onPress={onVerifyButtonPress} disabled={verifing}>
                    <Text style={verified ? {color: 'green'} : {color: 'red'}}>
                        {verifing ? "Verificando..." : verified ? "Verificado" : "Não verificado"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default function Screen({navigation})
{
    const [ agree, setAgree ] = useState(false)
    const [ username, setUsername ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ loading, setLoading ] = useState(false)

    function checkPassword()
    {
        if(password.length == 0 || confirmPassword.length == 0)
        {
            return false
        }

        return password == confirmPassword
    }
    
    function onRegisterButtonPress()
    {
        if(!agree)
        {
            Alert.alert("Para se cadastrar, você PRECISA ler e aceitar os Termos de Uso.")
            return
        }

        if(!checkPassword())
        {
            Alert.alert("Senhas incompatíveis.")
            return
        }

        setLoading(true)
        
        axios.post("/auth/register", {username, email, password}).then(res => {
            const data = res.data

            if(data.success)
            {
                navigation.navigate("Login")
            }

            else
            {
                Alert.alert("Ocorreu um erro no cadastro.")
            }

        }).catch(err => {
            console.log(err);
        }).finally(() => {
            
        })

        setLoading(false)
    }

    return(
        <View style={styles.container}>
            <VerifyInput value={username} setValue={setUsername} verifyEndpoint="/auth/usable/username/" icon="account-outline" label="Nome de usuário"/>
            <VerifyInput value={email} setValue={setEmail} verifyEndpoint="/auth/usable/email/" icon="email-outline" label="Email"/>
            <PasswordInput value={password} setValue={setPassword} icon="lock-outline" label="Senha"/>
            <PasswordInput value={confirmPassword} setValue={setConfirmPassword} icon="lock-outline" label="Confirme a senha"/>

            <TouchableOpacity onPress={() => setAgree(!agree)} style={styles.checkbox}>
                <MaterialCommunityIcons style={{marginRight: 8}} name={agree ? "checkbox-marked" : "checkbox-blank-outline"} size={24} color="black" />
                <Text style={{maxWidth: '75%'}}>Estou ciente e concordo com todos os Termos de Uso do App.</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={loading} onPress={onRegisterButtonPress}>
                <Text>{loading ? "Realizando cadastro..." : "Realizar cadastro"}</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingHorizontal: 12,
        flex: 1
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