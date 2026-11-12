'use client';
export default function ErrorPage({ reset }) {
  return <section className="error-page" role="alert"><h1>TripTally couldn’t load this page</h1><p>The Express API may be stopped or temporarily unavailable. Start the API in a separate terminal and try again.</p><button className="button" onClick={()=>reset()}>Try again</button></section>;
}
