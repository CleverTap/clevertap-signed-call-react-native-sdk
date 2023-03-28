"use strict";
exports.__esModule = true;
var clevertap_signed_call_react_native_1 = require("clevertap-signed-call-react-native");
var React = require("react");
var LogLevel_1 = require("../../src/models/LogLevel");
var RegistrationScreen_1 = require("./screens/RegistrationScreen");
var native_1 = require("@react-navigation/native");
var native_stack_1 = require("@react-navigation/native-stack");
var DialerScreen_1 = require("./screens/DialerScreen");
var Stack = native_stack_1.createNativeStackNavigator();
function App() {
    React.useEffect(function () {
        //enables Verbose mode logging for Signed Call SDK
        clevertap_signed_call_react_native_1.SignedCall.setDebugLevel(LogLevel_1.LogLevel.Verbose);
    }, []);
    return (React.createElement(native_1.NavigationContainer, null,
        React.createElement(Stack.Navigator, { initialRouteName: "Registration" },
            React.createElement(Stack.Screen, { name: "Registration", component: RegistrationScreen_1["default"], options: {
                    headerShown: false
                } }),
            React.createElement(Stack.Screen, { name: "Dialer", component: DialerScreen_1["default"], options: {
                    headerShown: false
                } }))));
}
exports["default"] = App;
