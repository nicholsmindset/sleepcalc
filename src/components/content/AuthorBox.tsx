import Image from 'next/image';
import { User } from 'lucide-react';

interface AuthorBoxProps {
  name?: string;
  credentials?: string;
  bio?: string;
  imageUrl?: string;
}

export function AuthorBox({
  name = 'Dr. Sarah Mitchell, PhD',
  credentials = 'Board-Certified Sleep Medicine · MSc Sleep Science',
  bio = 'Sleep researcher and certified sleep medicine specialist with over a decade of experience in clinical sleep studies and wearable health technology. Content is reviewed for scientific accuracy and updated regularly.',
  imageUrl,
}: AuthorBoxProps) {
  return (
    <div className="glass-card rounded-2xl p-6 flex items-start gap-4 mt-12">
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} width={48} height={48} className="rounded-full object-cover" />
        ) : (
          <User className="w-6 h-6 text-primary" />
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-on-surface">{name}</p>
        {credentials && (
          <p className="text-xs text-primary mt-0.5">{credentials}</p>
        )}
        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{bio}</p>
      </div>
    </div>
  );
}
