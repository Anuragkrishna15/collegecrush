
import * as React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <Loader2 className="animate-spin h-10 w-10 text-white" />
  );
};

export default LoadingSpinner;