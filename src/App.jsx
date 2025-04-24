
import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import ContactList from "./ContactList";

export default function App() {
  return (
    <Provider store={store}>
      <ContactList />
    </Provider>
  );
}
