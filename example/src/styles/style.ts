import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  image: {
    width: '60%',
    height: '20%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  mainSection: {
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
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  buttonText: {
    color: '#F24C54',
    fontSize: 12,
  },
  separator: {
    fontSize: 24,
    color: '#CCC',
  },
});

export default styles;
