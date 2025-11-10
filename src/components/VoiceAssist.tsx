import { useState } from 'react';
import { Mic, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function VoiceAssist() {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const commands = {
    en: [
      { phrase: 'start irrigation', action: () => handleStartIrrigation(), response: 'Starting irrigation now' },
      { phrase: 'show soil condition', action: () => navigate('/soil'), response: 'Showing soil monitor' },
      { phrase: 'show alerts', action: () => navigate('/alerts'), response: 'Showing alerts' },
      { phrase: 'show crop health', action: () => navigate('/crop'), response: 'Showing crop health' },
      { phrase: 'stop irrigation', action: () => handleStopIrrigation(), response: 'Stopping irrigation' },
    ],
    hi: [
      { phrase: 'सिंचाई शुरू', action: () => handleStartIrrigation(), response: 'सिंचाई शुरू की जा रही है' },
      { phrase: 'फ़सल स्वास्थ्य दिखाओ', action: () => navigate('/crop'), response: 'फ़सल स्वास्थ्य दिखाया जा रहा है' },
      { phrase: 'सूचना दिखाओ', action: () => navigate('/alerts'), response: 'सूचना दिखाई जा रही है' },
    ],
    mr: [
      { phrase: 'सिंचन सुरू करा', action: () => handleStartIrrigation(), response: 'सिंचन सुरू केले' },
      { phrase: 'पीक आरोग्य दाखवा', action: () => navigate('/crop'), response: 'पीक आरोग्य दाखवले जात आहे' },
      { phrase: 'सूचना दाखवा', action: () => navigate('/alerts'), response: 'सूचना दाखवली जात आहे' },
    ],
  };

  const handleStartIrrigation = () => {
    const event = new CustomEvent('irrigationControl', { detail: { action: 'start' } });
    window.dispatchEvent(event);
  };

  const handleStopIrrigation = () => {
    const event = new CustomEvent('irrigationControl', { detail: { action: 'stop' } });
    window.dispatchEvent(event);
  };

  const handleVoiceClick = () => {
    if (isListening) {
      setIsListening(false);
      setCommand('');
      setResponse('');
      return;
    }

    setIsListening(true);
    setCommand('');
    setResponse('');

    // Simulate voice recognition
    setTimeout(() => {
      const langCommands = commands[language];
      const randomCommand = langCommands[Math.floor(Math.random() * langCommands.length)];
      setCommand(randomCommand.phrase);
      setResponse(randomCommand.response);
      
      setTimeout(() => {
        randomCommand.action();
        setTimeout(() => {
          setIsListening(false);
          setCommand('');
          setResponse('');
        }, 2000);
      }, 1000);
    }, 1500);
  };

  return (
    <>
      <button
        onClick={handleVoiceClick}
        className="fixed bottom-24 md:bottom-8 right-4 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-all"
        aria-label="Voice Assistant"
      >
        {isListening ? (
          <div className="relative">
            <Mic className="w-6 h-6 md:w-7 md:h-7" />
            <div className="absolute inset-0 animate-ping">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-400 rounded-full opacity-75"></div>
            </div>
          </div>
        ) : (
          <Mic className="w-6 h-6 md:w-7 md:h-7" />
        )}
      </button>

      {isListening && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl">Voice Assistant</h3>
              <button
                onClick={() => setIsListening(false)}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                  <Mic className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 animate-ping">
                  <div className="w-20 h-20 bg-green-400 rounded-full opacity-75"></div>
                </div>
              </div>

              <div className="text-center">
                {!command && <p className="text-muted-foreground">Listening...</p>}
                {command && (
                  <div className="space-y-2">
                    <p className="text-green-600 dark:text-green-400">"{command}"</p>
                    {response && <p className="text-muted-foreground">{response}</p>}
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Try saying:</p>
                <div className="mt-2 space-y-1">
                  {commands[language].slice(0, 3).map((cmd, i) => (
                    <p key={i} className="text-xs">• {cmd.phrase}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
