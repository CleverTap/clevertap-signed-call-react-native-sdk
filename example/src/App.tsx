import { init } from 'clevertap-signed-call-react-native';
import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import type { SignedCallResponse } from 'src/models/SignedCallResponse';

export default function App() {
  const [result] = React.useState<string | null>();

  React.useEffect(() => {
    init({
      accountId: '61a52046f56a14cb19a1e9cc',
      apiKey:
        '9dcced09dae16c5e3606c22346d92361b77efdb360425913850bea4f22d812dd',
      cuid: 'shivam',
      missedCallActions: {
        '0': 'call me back',
      },
    })
      .then((response: SignedCallResponse) => {
        if (response.isSuccessful) {
          console.log('Signed Call SDK initialized: ', response);
        } else {
          console.log('Signed Call initialization failed: ', response);
        }
      })
      .catch((e: any) => {
        console.error(e);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result ?? 'Signed Call Initialized'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
