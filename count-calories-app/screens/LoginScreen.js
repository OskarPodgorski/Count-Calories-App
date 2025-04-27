import { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import * as Linking from 'expo-linking';
import { useSSO, useSignUp } from '@clerk/clerk-expo';
import { useAuth } from '@clerk/clerk-expo';

import * as MyStyles from "../styles/MyStyles";

export default function LoginScreen({onLoginSuccess}) {
  const { startSSOFlow } = useSSO();
  const { signUp } = useSignUp();
  const { isLoaded, isSignedIn } = useAuth();

  const [showLoginButtons, setShowLoginButtons] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

useEffect(() => {

  if (!isLoaded) {
    setShowLoginButtons(false);
  } else if (isLoaded && isSignedIn) {
    setShowLoginButtons(false);
    setIsLoggingIn(false);
    onLoginSuccess();
  } else if (isLoaded && !isSignedIn) {
    setShowLoginButtons(!isLoggingIn);
  }
  
}, [isLoaded, isSignedIn, isLoggingIn]);

const handleSignIn = async (strategy) => {
  try {
    setIsLoggingIn(true);
    const { createdSessionId, setActive } = await startSSOFlow({
      strategy,
      redirectUrl: Linking.createURL('oauth-native-callback'),
    });

    if (createdSessionId) {
      await setActive({ session: createdSessionId });
      onLoginSuccess();
    } 
    else if (signUp) {

      if (signUp.emailAddress) {
        await signUp.update({ username: (primaryEmail.split('@')[0]) });

        if (signUp.status === 'complete') {
          await setActive({ session: signUp.createdSessionId });
          onLoginSuccess();
        }
      } 
      else {
        setIsLoggingIn(false);
      }
    }
  } 
  catch (err) {  
    setIsLoggingIn(false);
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: MyStyles.ColorNight, alignItems: "stretch", gap: 15 }}>

      <Text style={{ paddingVertical: 12, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, textAlign: "center",fontFamily: MyStyles.BaseFont, fontSize: 28, color: MyStyles.ColorWhite, backgroundColor: MyStyles.ColorEerieBlack }}>Count Calories App</Text>

      <View style={{ flex: 1.5, justifyContent: "flex-start", alignItems: "center", gap: 15 }}>
        <Image source={require("../assets/logo.png")} style={{ ...MyStyles.baseStyle.base, width: 130, height: 130, backgroundColor: MyStyles.ColorEerieBlack }} />
      </View>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

        {showLoginButtons ? (

          <View style={{ justifyContent: "center", alignItems: "stretch", gap: 15 }}>

            <TouchableOpacity
              style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorWhite, flexDirection: "row", justifyContent: "center", alignItems: "flex-end" }}
              onPress={() => handleSignIn('oauth_google')}
            >
              <Text style={{ ...MyStyles.baseStyle.text, fontSize: 24,fontFamily: MyStyles.BaseFont, paddingRight: 5 }}>Login with</Text>
              <Image source={require("../assets/googleLogo.png")} style={{ height: 37, width: 88, marginRight: 6 }} resizeMode="contain" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ ...MyStyles.baseStyle.base, backgroundColor: MyStyles.ColorWhite, flexDirection: "row", alignItems: "center" }}
              onPress={() => handleSignIn('oauth_github')}
            >
              <Text style={{ ...MyStyles.baseStyle.text, fontSize: 24,fontFamily: MyStyles.BaseFont, paddingRight: 4 }}>Login with</Text>
              <Image source={require("../assets/githubLogo.png")} style={{ height: 40, width: 98, marginRight: 5}} resizeMode="contain" />
            </TouchableOpacity>

          </View>

          ) : (

        <Text style={{ ...MyStyles.baseStyle.base, ...MyStyles.baseStyle.text, fontSize: 28, color: MyStyles.ColorSilver, backgroundColor: MyStyles.ColorEerieBlack }}>Loading...</Text>

        )}

      </View>

    </View>
  );
}
