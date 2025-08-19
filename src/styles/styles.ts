import { StyleSheet } from 'react-native';
import colors from './colors';

const globalStyles = StyleSheet.create({
  backButton: {
    top: 50,
    left: 20,
    position: "absolute",
    zIndex: 1,
    padding: 10,
  },
  backButtonText: {
    color: '#555',
    fontSize: 16,
  },
  bemVindo: {
    fontSize: 30,
    fontWeight: 'bold',
    right: 15,
    padding: 30,
    color: colors.black,
    top: 25
  },
  buttonLoginUser: {
    paddingTop: 25,
    alignItems: "center",
    },
  buttonText: {
    color: colors.lightGray,
    fontWeight: 'bold',
    fontSize: 20,
    },
  textButtonCad: {
    color: colors.black,
    fontSize: 15,
    left: 70,
    top: 20,
    textDecorationLine: "underline",
    },
  /*buttontCadPro: {
    color: colors.lightGray,
    fontWeight: 'bold',
    fontSize: 20,
    backgroundColor: colors.darkGray,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20
  },*/
  buttonLoginTeacher: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    marginBottom: 15,
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
  buttonRegisterUser: {
    backgroundColor: colors.darkGray,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    color: colors.lightGray,
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 5,
    borderWidth: 1,
    borderColor: colors.lightGray,
    elevation: 5,
  },
  buttonOnBoarding:{
    backgroundColor: colors.darkGray,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: "center",
    borderColor: colors.lightGray,
    borderWidth: 1,
    elevation: 5
  },
  buttonShowVideo:{
    backgroundColor: colors.yellow,
    right: 230,
    top: 48,
    borderRadius: 8,
    borderWidth: 1.5
  },
  buttonShowVideoProfile:{
    backgroundColor: colors.yellow,
    justifyContent: "center",
    alignItems: "center",
    left: 10,
    top: 18,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.black,
    width: 110
  },
  contact:{
    fontSize: 20,
    color: colors.black,
    top: 26,
    right: 60,
    textDecorationLine: 'underline'
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: colors.yellow,
  },
  containerHomeTeacher: {
    flex: 1,
    backgroundColor: colors.yellow
  },
  containerCardsTeacher: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.darkGray,
    top: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  containerHomeUser: {
    flex: 1,
    backgroundColor: colors.yellow
  },
  containerProfileUser: {
    flex: 1,
    top: 70,
    justifyContent: "center",
    backgroundColor: colors.darkGray,
    borderRadius: 20
  },
  containerProfileId: {
    flex: 1,
    backgroundColor: colors.yellow,
  },
  containerCardsProfileId:{
    top: 30,
    backgroundColor: colors.darkGray,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  containerStyle:{
    backgroundColor: colors.darkGray,
    paddingTop: 30,
    paddingBottom: 16,
  },
  circleCheck:{
    marginRight: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
},
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 43,
    fontStyle:"italic",
    marginBottom: 25,
    justifyContent: "center",
    textShadowColor: colors.black,
    textShadowOffset: {width: 1, height: 2},
    textShadowRadius: 10,
    },
  titleHomeTeacher: {
    fontSize: 30,
    fontWeight: 'bold',
    top: 50,
    left: 15,
  },
  subtitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 30,
    justifyContent: "center",
    color: colors.lightGray,
    textShadowColor: colors.black,
    textShadowOffset: {width: -2, height: 2},
    textShadowRadius: 5,
  },
  text:{
    alignItems: "center",
    fontSize: 15,
    justifyContent: "center",
    left: 70,
    textDecorationLine: "underline"
  },
  textNameExercise:{
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    textDecorationLine: 'underline',
    color: colors.black,
    right: 20,
    top: 5
  },
  textNameExerciseProfile:{
    justifyContent: "center",
    alignItems: "center",
    textDecorationLine: "underline",
    fontSize: 20,
    color: colors.black,
    left: 12,
    top: 5
  },
  titleProfileId: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.black,
    top: 50,
    alignSelf: "center",
    justifyContent: "center"
  },
  textShowVideo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.black,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  textShowVideoProfile: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.black,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  textHomeUser:{
    textAlign: "center",
    fontSize: 30,
    justifyContent: "center",
    fontWeight: "bold",
    fontStyle: 'italic',
    margin: 10,
    color: colors.yellow,
    paddingTop: 5,
    textShadowColor: colors.black,
    textShadowOffset: {width: -2, height: 2},
    textShadowRadius: 5,
  },
  textProfileId:{
    textAlign: "center",
    fontSize: 30,
    justifyContent: "center",
    fontWeight: "bold",
    color: colors.yellow,
    paddingTop: 5,
    margin: 10,
  },
  textEmail: {
    fontSize: 14,
    color: '#555' 
  },
  textNameHomeTeacher: {
    fontSize: 18,
    fontWeight: '500'
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#9b9b9bff",
    borderRadius: 30,
    padding: 10,
    backgroundColor:colors.lightGray
  },
  textButton: {
    fontSize: 15,
    top: 5,
    textDecorationLine: "underline"
  },
  card: {
    backgroundColor: colors.lightGray,
    borderRadius: 15,
    height: 90,
    width: 350,
    left: 20,
    borderColor: colors.black,
    borderWidth: 2,
    elevation: 5,
    margin: 5
  },
  cardHomeTeacher: {
    backgroundColor: colors.lightGray,
    borderColor: colors.black,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 2,
    top: 70,
    width: "90%",
    justifyContent: "center",
    alignContent: "center",
    left: 20,
  },
  textHomeTeacher: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 30,
    left: 120,
    top: 25,
    color: colors.yellow,
    fontStyle: "italic",
    fontWeight: 'bold',
    textShadowColor: colors.black,
    textShadowOffset: {width: -1, height: 3},
    textShadowRadius: 1
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  emptyButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5
  },
  emptyButtonText: {
    alignItems: 'center',
    borderColor: colors.black,
    fontSize: 18,
    left: 50,
    top: 10
  },
  line:{
    color: colors.lightGray,
    textShadowColor: colors.black,
    textShadowOffset: {width: -2, height: 2},
    textShadowRadius: 1,
    fontSize: 24,
    left: 90,
    top: 55,
    position: 'absolute',
    alignSelf:"center",
  },
  lineBetweenCards:{
    backgroundColor: colors.yellow,
    alignSelf: "center",
    height: 2,
    position: 'absolute',
    width: "40%",
    top: 125,
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  loadingContainerHomeTeacher: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoutUser: {
    fontSize: 20,
    color: colors.red,
    top: 26,
    right: 40,
    alignSelf: "center",
  },
  logoutTeacher: {
    fontSize: 20,
    color: colors.red,
    top: 10,
    right: 25,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#000',
  },
  viewProfileId: {
    paddingTop: 5,
    paddingHorizontal: 20,
    paddingBottom: 5,
    backgroundColor: colors.darkGray
  },
  exerciseInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseInput: {
    flex: 1,
    marginRight: 8,
  },
  addExerciseButton: {
   position: 'absolute',
   bottom: 70,
   right: 20,
    backgroundColor: colors.yellow,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    elevation: 5,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: colors.yellow,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  disabledButton: {
    opacity: 0.5,
  },
  homeUser:{
    flex: 1,
    backgroundColor: colors.darkGray
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    bottom: 30,
    color: colors.yellow
  },
  deleteButtonText: {
    color: 'red',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  addButton: {
    backgroundColor: colors.yellow,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start',
    top: 50
  },
  saveButton: {
    backgroundColor: colors.yellow,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    top: 5,
    marginVertical: 5
  },
  saveButtonText: {
    color: colors.black,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: colors.darkGray,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    top: 5
  },
  cancelButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  viewHomeUser:{
    backgroundColor: colors.darkGray,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 1
     
  },
  removeStudentButton: {
  backgroundColor: colors.red,
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: colors.black,
  elevation: 3,
  alignSelf: "center",
  right: 130,
  top: 10,
  },
  removeStudentButtonText: {
    color: colors.lightGray,
    fontWeight: 'bold',
    fontSize: 14,
    justifyContent: "center"
  },
  removeButtonExercise:{
    backgroundColor: colors.red,
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    elevation: 3,
    bottom: 13,
    right: 10,
    alignSelf: 'flex-end',
  }
});

export default globalStyles;
