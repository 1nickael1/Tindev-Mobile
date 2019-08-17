import React, { Component } from 'react';
import { Alert,StyleSheet, Image, Text, TouchableOpacity, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types'
import FingerprintScanner from 'react-native-fingerprint-scanner';

class FingerprintPopup extends Component {

    state = { errorMessage: undefined }

    componentDidMount() {
        FingerprintScanner
            .authenticate({ onAttempt: this.handleAuthenticationAttempted })
            .then(() => this.props.handlePopupDismissed())
            .catch(this.handleAuthenticationAttempted);
    }
    
    componentWillUnmount = () => FingerprintScanner.release()
    
    handleAuthenticationAttempted = (error) => this.setState({ errorMessage: error.message });
    render() {
        const { errorMessage } = this.state;
        const { style } = this.props;
        return (
            <View style={styles.container}>
                <View style={[styles.contentContainer, style]}>
                    <Image style={styles.logo}
                        source={require('../assets/finger_print.png')} />
                    <Text style={styles.heading}>
                        Autenticação{'\n'}com Digital
              </Text>
                    <Text style={[styles.description,
                    { color: (this.state.errorMessage) ? '#ea3d13' : '#a5a5a5' }]} >
                        {errorMessage || 'Escaneie sua digital\npara autenticar e continuar'}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#282a36",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#44475a',
        borderRadius: 50,

    },
    logo: {
        marginVertical: 45,
    },
    heading: {
        textAlign: 'center',
        color: '#00a4de',
        fontSize: 21,
    },
    description: {
        textAlign: 'center',
        height: 65,
        fontSize: 18,
        marginVertical: 10,
        marginHorizontal: 20,
    },
    buttonContainer: {
        padding: 20,
    },
    buttonText: {
        color: '#8fbc5a',
        fontSize: 15,
        fontWeight: 'bold',
    }
})

FingerprintPopup.propTypes = {
    style: ViewPropTypes.style,
    handlePopupDismissed: PropTypes.func.isRequired,
};
export default FingerprintPopup;