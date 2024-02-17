import ErrorNotification from "./ErrorNotification";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ErrorNotification />
      </div>
    </BrowserRouter>
  );
}

export default App;
