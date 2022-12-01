import * as React from 'react';
import { Text, View, TextInput, ScrollView } from 'react-native';
import Modal from "react-native-modal";
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';
import Icon from '@expo/vector-icons/FontAwesome';
import Constants from 'expo-constants';
import Pressable from './PressableComponent';
import Styles from './Styles';


export default ({ navigation }) => {
  // definizione dello stato
  const [type, setType] = React.useState('');
  const [manager, setManager] = React.useState('');
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [webSite, setWebSite] = React.useState('');
  const [secure, setSecure] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalError, setModalError] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState('');
  const [modalMessage, setModalMessage] = React.useState('');

  // salva stato su storage cifrato
  const secureSave = async () => {
    let state = {
      type: type,
      manager: manager,
      user: user,
      password: password,
      webSite: Constants.expoConfig.extra.url != '' ? Constants.expoConfig.extra.url : webSite,
    };
    await SecureStore.setItemAsync('userData', JSON.stringify(state));
  };

  // legge stato da storage cifrato
  const secureRead = async () => {
    let result = await SecureStore.getItemAsync('userData');
    if (result) {
      let state = JSON.parse(result);
      setType(state.type);
      setManager(state.manager);
      setUser(state.user);
      setPassword(state.password);
      setWebSite(state.webSite);
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
    if (!webSite.endsWith('/')) {
      setWebSite(webSite + '/');
    }
    // controlli
    let err = false;
    let ttl = 'OPERAZIONE ESEGUITA';
    let msg = 'I dati sono stati salvati senza errori.';
    if (type == '') {
      err = true;
      ttl = 'ATTENZIONE';
      msg = 'Non hai indicato il tipo di accesso.';
    } else if (type == 'spid' && manager == '') {
      err = true;
      ttl = 'ATTENZIONE';
      msg = 'Non hai indicato il gestore per l\'accesso SPID.';
    } else if (user == '') {
      err = true;
      ttl = 'ATTENZIONE';
      msg = 'Non hai indicato il nome utente.';
    } else if (password == '') {
      err = true;
      ttl = 'ATTENZIONE';
      msg = 'Non hai indicato la password dell\'utente';
    } else if (Constants.expoConfig.extra.url == '' && webSite == '') {
      err = true;
      ttl = 'ATTENZIONE';
      msg = 'Non hai indicato l\'indirizzo del sito del registro elettronico';
    } else if (Constants.expoConfig.extra.url == '' && !webSite.startsWith('http://') &&
               !webSite.startsWith('https://')) {
      err = true;
      ttl = 'ATTENZIONE';
      msg = 'L\'indirizzo del sito del registro elettronico non è valido';
    }
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
      <Text style={Styles.title}>Dati per l'accesso al registro</Text>
      <Text style={Styles.label}>Tipo di accesso:</Text>
      <View style={Styles.picker}>
        <Picker
          selectedValue={type}
          onValueChange={(val) => { setType(val); setManager(''); }}
        >
          <Picker.Item style={Styles.pickerItem}
            label="Scegli il tipo..." value="" enabled={type == ''} color= '#aaaaaa'
          />
          <Picker.Item style={Styles.pickerItem} label="Usa SPID" value="spid" />
          <Picker.Item style={Styles.pickerItem} label="Usa GOOGLE" value="google" />
          <Picker.Item style={Styles.pickerItem} label="Usa credenziali del registro" value="password" />
        </Picker>
      </View>
      <Text style={type == 'spid' ? Styles.label : Styles.labelDisabled}>Gestore SPID:</Text>
      <View style={Styles.picker}>
        <Picker
          selectedValue={manager}
          onValueChange={(val) => {setManager(val)}}
          enabled={type == 'spid'}
        >
          <Picker.Item style={Styles.pickerItem}
            label="Scegli il gestore..." value="" enabled={manager == ''} color= '#aaaaaa'
          />
          <Picker.Item style={Styles.pickerItem} label="Aruba ID" value="IdAruba" />
          <Picker.Item style={Styles.pickerItem} label="InfoCert ID" value="IdInfocert" />
          <Picker.Item style={Styles.pickerItem} label="Intesa ID" value="IdIntesa" />
          <Picker.Item style={Styles.pickerItem} label="Lepida ID" value="IdLepida" />
          <Picker.Item style={Styles.pickerItem} label="Namirial ID" value="IdNamirial" />
          <Picker.Item style={Styles.pickerItem} label="Poste ID" value="IdPoste" />
          <Picker.Item style={Styles.pickerItem} label="Sielte ID" value="IdSielte" />
          <Picker.Item style={Styles.pickerItem} label="SpidItalia" value="IdRegister" />
          <Picker.Item style={Styles.pickerItem} label="TIM ID" value="IdTim" />
        </Picker>
      </View>
      <Text style={Styles.label}>Nome utente:</Text>
      <TextInput
        style={Styles.input}
        onChangeText={(val) => setUser(val.replace(/\s/g, ''))}
        value={user}
      />
      <Text style={Styles.label}>Password utente:</Text>
      <View style={Styles.passwordContainer}>
        <TextInput
          style={Styles.password}
          secureTextEntry={secure}
          onChangeText={(val) => setPassword(val)}
          value={password}
        />
        <Icon
          style={Styles.icon}
          name={secure ? 'eye' : 'eye-slash'}
          onPress={() => setSecure(!secure)}
        />
      </View>
      {Constants.expoConfig.extra.url == '' &&
        <>
          <Text style={Styles.label}>Indirizzo del sito del registro elettronico:</Text>
          <TextInput
            style={Styles.input}
            onChangeText={(val) => setWebSite(val.replace(/\s/g, ''))}
            value={webSite}
          />
        </>
      }
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
