import React from 'react';
import {Brain} from 'lucide-react';
export function Footer() {
  return (
    <section className="relative overflow-hidden py-10 bg-violet-400 text-white font-playfair">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="-m-6 flex flex-wrap">
          <div className="w-full p-6 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-2 inline-flex items-center">
               <Brain className="h-[10vh] w-[10vw] text-white" />
              </div>
              <div>
                <p className="mb-4  text-base font-medium">Helping Minds</p>
                <p className="text-sm text-gray-900">
                  &copy; Copyright 2024. All Rights Reserved.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              {/* <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-900">
                Website
              </h3>
              <ul>
                <li className="mb-4">
                  <a className=" text-base font-medium text-white hover:text-gray-700" href="#">
                    Home
                  </a>
                </li>
                <li className="mb-4">
                  <a className=" text-base font-medium text-white hover:text-gray-700" href="#">
                    For Tenants
                  </a>
                </li>
                <li className="mb-4">
                  <a className=" text-base font-medium text-white hover:text-gray-700" href="#">
                    For Owners
                  </a>
                </li>
                
              </ul> */}
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-900">
                Contact Us
              </h3>
              <ul>
                <li className="mb-4">
                  <a className=" text-base font-medium text-white hover:text-gray-700" href="/">
                    9872345671
                  </a>
                </li>
                <li className="mb-4">
                  <a className=" text-base font-medium text-white hover:text-gray-700" href="/">
                    smriti@gmail.com
                  </a>
                </li>
                <li className="mb-4">
                  <a className=" text-base font-medium text-white hover:text-gray-700" href="/">
                    www.smriti.com
                  </a>
                </li>
                
              </ul>
            </div>
          </div>
          <div className="w-full p-6 md:w-1/2 lg:w-3/12">
            <div className="h-full">
              <h3 className="tracking-px mb-9  text-xs font-semibold uppercase text-gray-900">
                Legals
              </h3>
              <ul>
                <li className="mb-4">
                  <a className=" text-base font-medium text-white hover:text-gray-700" href="/">
                    Terms &amp; Conditions
                  </a>
                </li>
                <li className="mb-4">
                  <a className=" text-base font-medium text-white hover:text-gray-700" href="/">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a className=" text-base font-medium text-white hover:text-gray-700" href="/">
                    Licensing
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Footer;