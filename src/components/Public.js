import React from 'react';
import { Link } from 'react-router-dom';

const Public = () => {
  return (
    <section className='public'>
        <header>
            <h1>
                Welcome to&nbsp;
                <span className='nowrap'>
                &#x1F6E0;Demo Repairs!&#x1F6E0;
                </span>
            </h1>
        </header>
        <main className='public__main'>
            <p>
                Located in Beautiful Dhaka city, Demo Repairs 
                provides a trained staff ready to meet your tech 
                repair needs.
            </p>
            <address className='public__addr'>
                Demo Repair <br/>
                123 foo <br />
                Dhaka city, Dhaka 1234 <br />
                <a href='tel:+8801111111'>
                    (+880) 11111111
                </a>
            </address>
            <br/>
            <p>Owner: XYZ </p>
        </main>
        <footer>
            <Link to={'/login'}>
                Employee Login
            </Link>
        </footer>
    </section>
  )
}

export default Public;
