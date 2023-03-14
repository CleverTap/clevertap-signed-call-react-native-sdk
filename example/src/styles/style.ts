import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingHorizontal: 30,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '25%',
    resizeMode: 'contain',
  },
  mainSection: {
    marginTop: 30,
    justifyContent: 'center',
  },
  mainHeader: {
    fontSize: 25,
    textAlign: 'center',
    color: '#344055',
    fontWeight: '500',
  },
  inputContainer: {
    marginTop: 20,
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 7,
    borderRadius: 1,
    fontFamily: 'regular',
    fontSize: 18,
    marginTop: 2,
  },
  buttonContainer: {
    marginTop: 30,
  },
  labels: {
    fontSize: 18,
    color: '#7d7d7d',
    marginTop: 10,
    marginBottom: 5,
    lineHeight: 25,
    fontFamily: 'regular',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default styles;
