import Navbar from "./components/Navbar";
import React from "react";
import Portfolio from "./pages/Portfolio";
import { RecoilRoot } from "recoil";

function App() {
    return (
        <RecoilRoot>
            <Portfolio />
        </RecoilRoot>
    );
}

export default App;
