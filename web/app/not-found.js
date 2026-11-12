import Link from 'next/link';
export default function NotFound(){return <section className="error-page"><h1>We couldn’t find that trip or expense</h1><p>The link might be incorrect, or the item may have been deleted.</p><Link className="button" href="/trips">Back to trips</Link></section>}
