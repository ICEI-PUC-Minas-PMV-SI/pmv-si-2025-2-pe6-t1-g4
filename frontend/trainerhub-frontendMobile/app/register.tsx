import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

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
                E-mail
            </Text>
            <View style={{ marginTop: 5 }}>
                <TextInput
                    placeholder="jane@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
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
                    Senha
                </Text>
                <TextInput
                    placeholder="Senha"
                    value={senha}
                    onChangeText={setSenha}
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
                    Confirmar Senha
                </Text>
                <TextInput
                    placeholder="Confirmar senha"
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
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
                onPress={() => router.replace("/(auth)/registerPersonal")}
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