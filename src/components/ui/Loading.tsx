import { Loader2 } from 'lucide-react';
import { TR } from '../../constants/tr';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export default function Loading({ text = TR.common.loading, fullScreen = false }: LoadingProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-linen-300/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gold-500 mx-auto" />
          <p className="mt-4 text-espresso-800 font-medium">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500 mx-auto" />
        <p className="mt-2 text-espresso-700">{text}</p>
      </div>
    </div>
  );
}
