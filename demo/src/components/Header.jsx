import metrifoxLogo from '../assets/metrifox_logo.svg';
import '../styles/components.css';

const Header = ({
                    title = "SDK Demo",
                    subtitle = "Test the Metrifox JavaScript SDK with real API calls"
                }) => {
    return (
        <header className="app-header">
            <div className="header-content">
                <img src={metrifoxLogo} alt="Metrifox" className="metrifox-logo" />
                <h1 className="app-title">{title}</h1>
            </div>
            <p className="app-subtitle">{subtitle}</p>
        </header>
    );
};

export default Header;