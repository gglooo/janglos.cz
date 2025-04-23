import { Providers } from "./context/Providers";
import Portfolio from "./pages/Portfolio";

function App() {
    return (
        <Providers>
            <Portfolio />
        </Providers>
    );
}

export default App;
