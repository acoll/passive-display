import { h } from "preact";
import "./style";
import App from "./components/app";
import firebase from "firebase";

if (typeof window !== "undefined") {
  window.firebase = firebase;
}

export default function Index() {
  return (
    <div id="root">
      {typeof window !== "undefined" && <script src="/__/firebase/init.js" />}
      <App />
    </div>
  );
}
