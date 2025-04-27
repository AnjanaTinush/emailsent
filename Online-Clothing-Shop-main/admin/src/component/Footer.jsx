import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";

export default function Footer(){
  return (
    <footer className="bg-[#161A1D] text-[#F5F3F4] py-8 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-[#660708] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/shop" className="hover:text-[#660708] transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-[#660708] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#660708] transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-[#660708] transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaEnvelope className="mr-2" />
                <a href="mailto:info@clothingstore.com" className="hover:text-[#660708] transition-colors">
                  info@clothingstore.com
                </a>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2" />
                <a href="tel:+1234567890" className="hover:text-[#660708] transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <p>123 Fashion Street, Style City, SC 12345</p>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#660708] transition-colors"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#660708] transition-colors"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#660708] transition-colors"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="border-t border-[#660708] mt-8 pt-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Clothing Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

