// src/components/layout/Footer.tsx

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-4 mt-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CLIMATIK PRO</h3>
            <p className="text-gray-400">
              Enterprise-grade weather intelligence for data-driven organizations.
            </p>
          </div>
          
          {['Product', 'Solutions', 'Developers', 'Company'].map((section) => (
            <div key={section}>
              <h4 className="font-bold text-lg mb-4">{section}</h4>
              <ul className="space-y-2 text-gray-400">
                {Array.from({ length: 4 }, (_, i) => (
                  <li 
                    key={i}
                    className="cursor-pointer hover:text-white transition-colors"
                  >
                    {section} Feature {i + 1}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-500">© 2023 Climatik Pro. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            {['Twitter', 'GitHub', 'LinkedIn', 'Instagram'].map((social) => (
              <a 
                key={social}
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;