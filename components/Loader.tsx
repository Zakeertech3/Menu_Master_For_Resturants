import React from 'react';
import { ForkKnifeIcon } from './icons/ForkKnifeIcon';

const loadingMessages = [
  "Consulting with master chefs...",
  "Analyzing flavor profiles...",
  "Translating culinary terms...",
  "Scanning for the tastiest options...",
  "Decoding the menu's secrets...",
  "Crafting your recommendations..."
];

const Loader: React.FC = () => {
    const [message, setMessage] = React.useState(loadingMessages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = loadingMessages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);


  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
      <ForkKnifeIcon className="h-16 w-16 text-brand-primary animate-bounce" />
      <p className="text-xl font-semibold text-gray-700">{message}</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-brand-primary h-2.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
      </div>
    </div>
  );
};

export default Loader;
