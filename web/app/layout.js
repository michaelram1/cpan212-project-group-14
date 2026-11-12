import './globals.css';
import Header from '../components/Header';
import { TripSelectionProvider } from '../components/TripSelectionProvider';
export const metadata = { title: 'TripTally — Travel Budget Tracker', description:'Plan trips and track expenses across currencies.' };

export default function RootLayout({children}) {
  return <html lang="en"><body><TripSelectionProvider><Header/><main className="container">{children}</main><footer className="footer">TripTally · Your travel budget in one place</footer></TripSelectionProvider></body></html>;
}
