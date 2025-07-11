import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { ActivityIndicator, View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/slices/userSlice';

import HomeScreen from '../screens/Home';
import LoginScreen from '../screens/Login';
import ProfileScreen from '../screens/Profile';
import RegisterScreen from '../screens/Register';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const [sessionChecked, setSessionChecked] = useState(false);
    const [session, setSession] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const restoreSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (data?.session) {
                setSession(data.session);
                dispatch(setUserData({
                    name: data.session.user.email,
                    income: 0,
                }));
            }
            setSessionChecked(true);
        };

        restoreSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    if (!sessionChecked) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Checking session...</Text>
            </View>
        );
    }
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {session ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        {/* Add other protected screens */}
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
};

export default AppNavigator;
