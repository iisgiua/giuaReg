import React, { useRef } from 'react';
import { SafeAreaView, BackHandler, ActivityIndicator, View } from "react-native";
import { WebView } from 'react-native-webview';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import Styles from './Styles';


export default ({ navigation }) => {
  // definizione dello stato
  const [type, setType] = React.useState('');
  const [manager, setManager] = React.useState('');
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [webSite, setWebSite] = React.useState('');
  const [hideScreen, setHideScreen] = React.useState(true);
  const [script, setScript] = React.useState('');
  const [currentUrl, setCurrentUrl] = React.useState('');
  const webViewRef = useRef(null);
  const timerRef = useRef(null);

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
      if (state.type == 'password') {
        setScript(scriptPassword(state.webSite, state.user, state.password));
      } else if (state.type == 'google') {
        setScript(scriptGoogle(state.user, state.password));
      } else if (state.type == 'spid') {
        setScript(scriptSpid(state.manager, state.user, state.password));
      }
    }
    result = await SecureStore.getItemAsync('settingsData');
    if (result) {
      let state = JSON.parse(result);
      setHideScreen(state.hideScreen);
    }
  };

  // indicatore di caricamento della pagina
  const ActivityIndicatorElement = () => {
    return (
      <ActivityIndicator
        color="#000099"
        size="large"
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />
    );
  };

  // determina URL iniziale
  const createUrl = () => {
    let url = webSite;
    if (type == 'spid') {
      url = url + 'spid/login/' + manager;
    } else if (type == 'google') {
      url = url + 'login/gsuite';
    }
    return url;
  };

  // login automatico con credenziali
  const scriptPassword = (url, usr, psw) => {
    return `
      if (document.readyState === 'complete') {
        if (location.href.startsWith('${url}login/form/')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA LOGIN');
          document.querySelector('#username').value = '${usr}';
          document.querySelector('#password').value = '${psw}';
          document.querySelector('#login').click();
        }
      }
      true;
    `;
  };

  // login automatico con GOOGLE
  const scriptGoogle = (usr, psw) => {
    return `
      if (document.readyState === 'complete') {
        if (location.href.startsWith('https://accounts.google.com/o/oauth2/v2/auth/identifier?')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA GOOGLE UTENTE');
          document.querySelector('input[name="identifier"]').value = '${usr}';
          document.evaluate('//button/span[contains(text(),"Avanti")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        } else if (location.href.startsWith('https://accounts.google.com/signin/v2/challenge/pwd?')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA GOOGLE PASSWORD');
          document.querySelector('input[name="password"]').value = '${psw}';
          document.evaluate('//button/span[contains(text(),"Avanti")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        } else if (location.href.startsWith('https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA GOOGLE PROFILI');
          document.querySelector('ul li div[data-email="${usr}"]').click();
        }
      }
      true;
    `;
  }

  // login automatico con SPID
  const scriptSpid = (mng, usr, psw) => {
    return `
      if (document.readyState === 'complete') {
        if (location.href.startsWith('https://loginspid.aruba.it/ServiceLoginWelcome?')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID ARUBA');
          document.querySelector('input[name="username"]').value = '${usr}';
          document.querySelector('input[name="password"]').value = '${psw}';
          document.querySelector('button[type="submit"]').click();
        } else if (location.href.startsWith('https://loginspid.aruba.it/')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID ARUBA CONSENSO');
          document.evaluate('//button[contains(text(),"Autorizz")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        } else if (location.href.startsWith('https://identity.infocert.it/basic-auth/login?')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID INFOCERT');
          document.querySelector('input[name="nome_utente"]').value = '${usr}';
          document.querySelector('input[name="password"]').value = '${psw}';
          document.querySelector('button[type="submit"]').click();
        } else if (location.href.startsWith('https://identity.infocert.it/')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID INFOCERT CONSENSO');
          document.evaluate('//button[contains(text(),"Continua")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        } else if (location.href.startsWith('https://spid.intesa.it/Time4UserServices/services/idp/AuthnRequest/?')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID INTESA');
          document.querySelector('input#MainContent_LoginForm_nome_utente').value = '${usr}';
          document.querySelector('input#MainContent_LoginForm_password').value = '${psw}';
          document.querySelector('form#outer').submit();
        } else if (location.href.startsWith('https://spid.intesa.it/')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID INTESA CONSENSO');
          document.evaluate('//button[contains(text(),"Autorizz")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        } else if (location.href.startsWith('https://id.lepida.it/idp/profile/SAML2/Redirect/SSO?')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID LEPIDA');
          document.querySelector('input#username').value = '${usr}';
          document.querySelector('input#password').value = '${psw}';
          document.querySelector('button[type="submit"]').click();
        } else if (location.href.startsWith('https://id.lepida.it/')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID LEPIDA CONSENSO');
          document.evaluate('//button[contains(text(),"Autorizz")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        } else if (location.href.startsWith('https://idp.namirialtsp.com/cas/login?')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID NAMIRIAL');
          document.querySelector('input#input_username').value = '${usr}';
          document.querySelector('input#input_password').value = '${psw}';
          document.querySelector('button[type="submit"]').click();
        } else if (location.href.startsWith('https://https://idp.namirialtsp.com/')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID NAMIRIAL CONSENSO');
          document.evaluate('//button[contains(text(),"Autorizz")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        } else if (location.href.startsWith('https://posteid.poste.it/jod-login-schema/login.jsp')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID POSTE');
          document.querySelector('input[name="username"]').value = '${usr}';
          document.querySelector('input[name="password"]').value = '${psw}';
          document.querySelector('button[type="submit"]').click();
        } else if (location.href.startsWith('https://posteid.poste.it/jod-login-schema/consent.jsp')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID POSTE CONSENSO');
          document.evaluate('//button[contains(text(),"Acconsento")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        } else if (location.href.startsWith('https://identity.sieltecloud.it/simplesaml/module.php/sielteid/loginform.php?')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID SIELTE');
          document.querySelector('input#username').value = '${usr}';
          document.querySelector('input#password').value = '${psw}';
          document.querySelector('button[type="submit"]').click();
        } else if (location.href.startsWith('https://identity.sieltecloud.it/')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID SIELTE CONSENSO');
          document.evaluate('//button[contains(text(),"Autorizz")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        } else if (location.href.startsWith('https://spid.register.it/login/doLogin?')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID REGISTER');
          document.querySelector('input#username').value = '${usr}';
          document.querySelector('input#password').value = '${psw}';
          document.querySelector('button[type="submit"]').click();
        } else if (location.href.startsWith('https://spid.register.it/')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID REGISTER CONSENSO');
          document.evaluate('//button[contains(text(),"Autorizz")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        } else if (location.href.startsWith('https://login.id.tim.it/basic-auth/login?')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID TIM');
          document.querySelector('input#nome_utente').value = '${usr}';
          document.querySelector('input#password').value = '${psw}';
          document.querySelector('form#spid-login').submit();
        } else if (location.href.startsWith('https://login.id.tim.it/')) {
          //-- window.ReactNativeWebView.postMessage('LOG: PAGINA SPID TIM CONSENSO');
          document.evaluate('//button[contains(text(),"Autorizz")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        }
      }
      true;
    `;
  }

  // gestione cambio pagina
  const navigationChanged = (event) => {
    if (event.nativeEvent.data == 'CLOCK' && !event.nativeEvent.loading &&
        event.nativeEvent.url != currentUrl) {
      setCurrentUrl(event.nativeEvent.url);
      if (event.nativeEvent.url == webSite) {
        //-- console.warn('CLEAR');
        clearInterval(timerRef.current);
        connectApp();
      } else {
        //-- console.warn('URL: ' + event.nativeEvent.url);
        webViewRef.current.injectJavaScript(script);
      }
    //-- } else {
      //-- console.log(event);
    }
  };

  // connessione app su browser esterno
  const connectApp = async () => {
    try {
      const infoUrl = webSite+'app/connect/init';
      const response = await fetch(infoUrl, {
        header: {'Content-Type': 'application/json'}
      });
      console.log(response);
      const json = await response.json();
      const connectUrl = webSite+'app/connect/'+json.token;
      WebBrowser.openAuthSessionAsync(connectUrl, null, {createTask: false, showTitle: false})
        .then(() => navigation.goBack());
    } catch (error) {
      console.error(error);
    }
  }

  // timer per catturare cambi pagina
  React.useEffect(() => {
    timerRef.current = setInterval(() => {
      webViewRef.current.injectJavaScript(`
        window.ReactNativeWebView.postMessage('CLOCK');
        true;
      `);
    }, 100);
    return () => clearInterval(timerRef.current);
  }, []);

  // inizializza dati webview how execute script
  React.useEffect(() => {
    const handler = navigation.addListener('focus', () => {
      secureRead();
    });
    return handler;
  }, [navigation]);

  // inizializza comportamento pulsante hardware
  React.useEffect(() => {
    const backAction = () => {
      webViewRef.current.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  // mostra pagina
  return (
    <SafeAreaView style={{flex: 1}}>
      {hideScreen
        ?
        <>
          <ActivityIndicatorElement />
          <WebView
            style={Styles.hidden}
            source={{uri: createUrl()}}
            onMessage={navigationChanged}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            userAgent='Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
            ref={webViewRef}
          />
        </>
        :
        <WebView
          source={{uri: createUrl()}}
          onMessage={navigationChanged}
          renderLoading={ActivityIndicatorElement}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          userAgent='Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
          ref={webViewRef}
        />
      }
    </SafeAreaView>
  );
};
