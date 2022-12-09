import * as React from 'react';
import { Text, View, ScrollView } from 'react-native';
import Modal from "react-native-modal";
import * as SecureStore from 'expo-secure-store';
import Checkbox from 'expo-checkbox';
import Pressable from './PressableComponent';
import Styles from './Styles';


export default ({ navigation }) => {
  // definizione dello stato
  const [hideScreen, setHideScreen] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalError, setModalError] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState('');
  const [modalMessage, setModalMessage] = React.useState('');

  // salva stato su storage cifrato
  const secureSave = async () => {
    let state = {
      hideScreen: hideScreen,
    };
    await SecureStore.setItemAsync('settingsData', JSON.stringify(state));
  };

  // legge stato da storage cifrato
  const secureRead = async () => {
    let result = await SecureStore.getItemAsync('settingsData');
    if (result) {
      let state = JSON.parse(result);
      setHideScreen(state.hideScreen);
    }
  };

  // nasconde popup
  const modalDismiss = () => {
    setModalVisible(false);
    if (!modalError) {
      secureSave();
      navigation.navigate('home');
    }
  }

  // controlla e salva dati
  const submit = () => {
    // controlli
    let err = false;
    let ttl = 'OPERAZIONE ESEGUITA';
    let msg = 'I dati sono stati salvati senza errori.';
    // mostra popup
    setModalVisible(true);
    setModalError(err);
    setModalTitle(ttl);
    setModalMessage(msg);
  };

  // inizializza dati
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      secureRead();
    });
    return unsubscribe;
  }, [navigation]);

  // mostra pagina
  return (
    <ScrollView style={Styles.container}>
      <Text style={Styles.title}>Impostazioni generali</Text>
      <Pressable onPress={() => setHideScreen(!hideScreen)}>
        <View style={Styles.checkboxContainer}>
          <Checkbox style={Styles.checkbox}
            value={hideScreen}
          />
          <Text style={Styles.label}>Nasconde lo schermo durante il login</Text>
        </View>
      </Pressable>
      <View style={Styles.buttonContainer}>
        <Pressable onPress={submit}>
          <Text style={Styles.buttonPrimary}>SALVA</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('home')}>
          <Text style={Styles.buttonSecondary}>ANNULLA</Text>
        </Pressable>
      </View>
      <Modal
        isVisible={modalVisible}
      >
        <View style={[{backgroundColor: modalError ? '#ff0000' : '#00ff00'}, Styles.modalContainer]}>
          <Text style={[{color: modalError ? '#ffffff' : '#000000'}, Styles.modalTitle]}>{modalTitle}</Text>
          <Text style={[{color: modalError ? '#ffffff' : '#000000'}, Styles.modalMessage]}>{modalMessage}</Text>
          <Pressable onPress={modalDismiss}>
            <Text style={modalError ? Styles.buttonSecondary : Styles.buttonPrimary}>OK</Text>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
};
