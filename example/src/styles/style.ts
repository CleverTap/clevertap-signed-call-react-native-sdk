import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  image: {
    width: '80%',
    height: '25%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  mainSection: {
    marginTop: 10,
    justifyContent: 'center',
  },
  mainHeader: {
    fontSize: 24,
    textAlign: 'center',
    color: '#344055',
    fontWeight: '500',
  },
  inputContainer: {
    marginTop: 20,
  },
  horizontalAlignment: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 7,
    borderRadius: 1,
    fontSize: 18,
    marginTop: 2,
  },
  buttonContainer: {
    marginTop: 20,
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
