import { User } from 'lucide-react';

interface AuthorBoxProps {
  name?: string;
  bio?: string;
}

export function AuthorBox({
  name = 'Sleep Stack Team',
  bio = 'The Sleep Stack editorial team combines sleep science research with real wearable device data to provide evidence-based sleep improvement guidance. Our content is reviewed for accuracy and updated regularly.',
}: AuthorBoxProps) {
  return (
    <div className="glass-card rounded-2xl p-6 flex items-start gap-4 mt-12">
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
        <User className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="text-sm font-bold text-on-surface">{name}</p>
        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{bio}</p>
      </div>
    </div>
  );
}
