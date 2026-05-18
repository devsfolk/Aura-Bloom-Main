import React from 'react';
import { Download, CheckCircle2, Smartphone, Apple, Chrome, Share, PlusSquare, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const DashboardInstallCard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'android' | 'ios'>('android');
  const [installPrompt, setInstallPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [isInstalling, setIsInstalling] = React.useState(false);

  React.useEffect(() => {
    // Check standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setIsInstalling(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstallAndroid = async () => {
    if (!installPrompt) {
      // Fallback instruction trigger
      alert("Note: If the install option is not appearing, your browser may already have the app installed, or you need to use Chrome/Edge and select 'Install' from the top right menu.");
      return;
    }

    setIsInstalling(true);
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome !== 'accepted') {
      setIsInstalling(false);
    }
    setInstallPrompt(null);
  };

  return (
    <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
      <CardHeader className="p-6 md:p-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-black uppercase tracking-tight">Add to Home Screen</CardTitle>
            <CardDescription className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              PWA Dashboard Control Center
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 md:p-8 pt-2 space-y-6">
        <p className="text-xs text-gray-500 leading-relaxed">
          Install the DevsFolk Dashboard directly onto your device's home screen. The sandbox security rules of mobile operating systems prevent automatic background installation, but you can select your platform below for a smooth setup.
        </p>

        {/* Tab Selectors */}
        <div className="grid grid-cols-2 p-1.5 bg-gray-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('android')}
            className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'android'
                ? 'bg-white text-indigo-600 shadow-md shadow-black/5'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <Chrome className="h-4 w-4" />
            Android / Chrome
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'ios'
                ? 'bg-white text-indigo-600 shadow-md shadow-black/5'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <Apple className="h-4 w-4" />
            iOS / Safari
          </button>
        </div>

        {/* Dynamic Installer Section */}
        {activeTab === 'android' ? (
          <div className="space-y-4">
            <div className="p-5 rounded-[2rem] bg-gradient-to-tr from-indigo-50 to-purple-50/50 border border-indigo-100/50">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-indigo-950/80 leading-relaxed font-semibold">
                  For Android and Chrome/Edge desktop users. Direct OS-level installation is supported natively!
                </p>
              </div>
            </div>

            {isInstalled ? (
              <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-green-50 border border-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-black text-green-900 uppercase tracking-tight">App Installed Successfully</p>
                  <p className="text-[10px] text-green-700/80 font-bold uppercase tracking-wider mt-0.5">
                    Launch directly from your desktop or home screen
                  </p>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => void handleInstallAndroid()}
                disabled={isInstalling}
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-black/10 transition-transform active:scale-95 bg-black hover:bg-gray-900 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                {isInstalling ? 'Verifying Prompt...' : 'Install Android / Desktop App'}
              </Button>
            )}

            {!isInstalled && !installPrompt && (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  💡 No native prompt found? Open Chrome's menu <br />
                  and tap <span className="text-black">"Install App"</span> or <span className="text-black">"Add to Home Screen"</span>.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-5 rounded-[2rem] bg-indigo-50 border border-indigo-100">
              <p className="text-[10px] text-indigo-900 font-black uppercase tracking-wider leading-none mb-3">
                iOS / Safari Security Policy
              </p>
              <p className="text-[11px] text-indigo-950/80 leading-relaxed font-semibold">
                Apple security policies strictly prohibit automatic home screen installations from web buttons. There is no code API in iOS to trigger this natively.
              </p>
            </div>

            {/* Apple Installation Step Guide */}
            <div className="space-y-3 p-5 rounded-[2rem] bg-gray-50 border border-gray-100">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                Pin to iPhone/iPad in 2 quick steps:
              </p>
              
              <div className="space-y-4 font-semibold text-[11px] text-gray-700">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-xl bg-white border flex items-center justify-center text-xs font-black shadow-sm flex-shrink-0">
                    1
                  </div>
                  <p className="leading-snug">
                    Tap Safari's <span className="font-black text-black">Share Button</span> <Share className="h-4 w-4 inline mx-1 text-indigo-600" /> in the bottom tool bar.
                  </p>
                </div>
                
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-xl bg-white border flex items-center justify-center text-xs font-black shadow-sm flex-shrink-0">
                    2
                  </div>
                  <p className="leading-snug">
                    Select <span className="font-black text-black">Add to Home Screen</span> <PlusSquare className="h-4 w-4 inline mx-1 text-indigo-600" /> from the list options.
                  </p>
                </div>
              </div>
            </div>

            <Button
              disabled
              className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-dashed"
            >
              iOS Auto-Install Blocked by Apple OS
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
