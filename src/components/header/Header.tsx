import Navbar from './Navbar';
import Contacts from './Contacts';
import Logo from './Logo';

export default function Header() {
    return (
        <header>
            <Contacts />
            <Logo/>
            <Navbar/>
        </header>
    );
}