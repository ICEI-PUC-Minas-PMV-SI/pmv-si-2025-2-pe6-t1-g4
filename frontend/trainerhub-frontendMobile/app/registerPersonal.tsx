import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
    const router = useRouter();

    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataDeNascimento, setDataDeNascimento] = useState('');

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, padding: 20, backgroundColor: 'white' }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {/* Título */}
            <Text style={{ fontSize: 34, fontWeight: '700', marginTop: 40 }}>
                Registrar
            </Text>

            {/* Inputs */}
            <Text style={{ fontSize: 12, fontWeight: '700', marginTop: 10 }}>
                Nome completo
            </Text>
            <View style={{ marginTop: 5 }}>
                <TextInput
                    placeholder="Nome completo"
                    value={nomeCompleto}
                    onChangeText={setNomeCompleto}
                    autoCapitalize="none"
                    style={{
                        borderWidth: 1,
                        borderColor: '#000',
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 16,
                    }}
                />
                <Text style={{ fontSize: 12, fontWeight: '700', marginTop: 5 }}>
                    Cpf
                </Text>
                <TextInput
                    placeholder="Cpf"
                    value={cpf}
                    onChangeText={setCpf}
                    secureTextEntry
                    style={{
                        borderWidth: 1,
                        borderColor: '#000',
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 16,
                    }}
                />
                <Text style={{ fontSize: 12, fontWeight: '700', marginTop: 5 }}>
                    Data de nascimento
                </Text>
                <TextInput
                    placeholder="Data de nascimento"
                    value={dataDeNascimento}
                    onChangeText={setDataDeNascimento}
                    secureTextEntry
                    style={{
                        borderWidth: 1,
                        borderColor: '#000',
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 16,
                    }}
                />
            </View>

            {/* Botão */}
            <TouchableOpacity
                onPress={() => router.replace("/(auth)/registerPersonalInfo")}
                style={{
                    backgroundColor: 'black',
                    padding: 16,
                    borderRadius: 10,
                    marginTop: 10,
                }}
            >
                <Text style={{ color: 'white', fontWeight: '700', textAlign: 'center' }}>
                    Avançar
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}