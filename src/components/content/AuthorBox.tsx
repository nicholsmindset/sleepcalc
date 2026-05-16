import Image from 'next/image';
import Link from 'next/link';
import { Users } from 'lucide-react';

interface AuthorBoxProps {
  name?: string;
  /** Only set when a real, named contributor with verifiable credentials exists. */
  credentials?: string;
  bio?: string;
  imageUrl?: string;
}

export function AuthorBox({
  name = 'Sleep Stack Editorial Team',
  credentials,
  bio = 'Researched, written, and maintained by the Sleep Stack editorial team. Our sleep guidance is grounded in published recommendations from public-health and sleep-medicine authorities, including the CDC, the National Institutes of Health, and the American Academy of Sleep Medicine. It is educational in nature and not a substitute for professional medical advice.',
  imageUrl,
}: AuthorBoxProps) {
  return (
    <div className="glass-card rounded-2xl p-6 flex items-start gap-4 mt-12">
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} width={48} height={48} className="rounded-full object-cover" />
        ) : (
          <Users className="w-6 h-6 text-primary" />
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-on-surface">{name}</p>
        {credentials && (
          <p className="text-xs text-primary mt-0.5">{credentials}</p>
        )}
        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{bio}</p>
        <Link
          href="/editorial-policy"
          className="text-xs text-primary hover:underline mt-2 inline-block"
        >
          How we research and review content &rarr;
        </Link>
      </div>
    </div>
  );
}
