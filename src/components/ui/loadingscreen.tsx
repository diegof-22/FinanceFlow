import { Icons } from "./icons";


export const LoadingScreen = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900">
    <div className="text-center">
      <Icons.spinner className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
      <p className="text-white font-medium">Caricamento...</p>
    </div>
  </div>
);