import { h, Component } from "preact";
import styles from "./home.css";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

const config = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  callbacks: {
    signInSuccess(currentUser, credential, url) {
      // debugger;
      firebase
        .database()
        .ref(`${currentUser.uid}/credentials`)
        .set({ ...credential, refreshToken: currentUser.refreshToken });

      return false;
    }
  },
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"]
    }
  ]
};

export default class Home extends Component {
  state = { url: null };
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          url: `/dash/${user.uid}`
        });
      }
    });
  }
  render(props, state) {
    return (
      <div class={styles.home}>
        <h1>Home</h1>

        {typeof window !== "undefined" &&
          !state.url && (
            <StyledFirebaseAuth
              uiConfig={config}
              firebaseAuth={firebase.auth()}
            />
          )}
        {state.url && <a href={state.url}>{state.url}</a>}
      </div>
    );
  }
}
