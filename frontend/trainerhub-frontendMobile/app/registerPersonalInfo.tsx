import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
    const router = useRouter();

    const [genero, setGenero] = useState('');
    const [altura, setAltura] = useState('');
    const [peso, setPeso] = useState('');
    const [telefone, setTelefone] = useState('');

    // Função para formatar telefone automaticamente
    const formatTelefone = (value: string) => {
        const nums = value.replace(/\D/g, ""); 

        if (nums.length <= 2) {
            return `(${nums}`;
        }
        if (nums.length <= 6) {
            return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
        }
        if (nums.length <= 10) {
            return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
        }
        return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7, 11)}`;
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, padding: 20, backgroundColor: 'white' }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Text style={{ fontSize: 34, fontWeight: '700', marginTop: 40 }}>
                Registrar
            </Text>

            <Text style={{ fontSize: 12, fontWeight: '700', marginTop: 10 }}>
                Gênero
            </Text>
            <TextInput
                placeholder="Gênero"
                value={genero}
                onChangeText={setGenero}
                style={{
                    borderWidth: 1,
                    borderColor: '#000',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                }}
            />

            <Text style={{ fontSize: 12, fontWeight: '700', marginTop: 10 }}>
                Altura
            </Text>
            <TextInput
                placeholder="Altura"
                value={altura}
                onChangeText={setAltura}
                style={{
                    borderWidth: 1,
                    borderColor: '#000',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                }}
            />

            <Text style={{ fontSize: 12, fontWeight: '700', marginTop: 5 }}>
                Peso
            </Text>
            <TextInput
                placeholder="Peso"
                value={peso}
                onChangeText={setPeso}
                style={{
                    borderWidth: 1,
                    borderColor: '#000',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                }}
            />

            <Text style={{ fontSize: 12, fontWeight: '700', marginTop: 5 }}>
                Telefone
            </Text>
            <TextInput
                placeholder="(XX) XXXXX-XXXX"
                value={telefone}
                onChangeText={(text) => setTelefone(formatTelefone(text))}
                keyboardType="numeric"
                maxLength={15}
                style={{
                    borderWidth: 1,
                    borderColor: '#000',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                }}
            />

            <TouchableOpacity
                onPress={() => router.replace("/(tabs)/home")}
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
