import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

interface AvatarCardProps {
  image?: string;
  fallbackText?: string; // 👈 separate prop for fallback text
  name?: string;
  description?: string;
  link?: string;
  showName?: boolean;
  showDescription?: boolean;
}

export const AvatarCard = ({
  image,
  fallbackText = 'U',
  name,
  description,
  link = '#',
  showName = true,
  showDescription = false,
}: AvatarCardProps) => {
  const content = (
    <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors">
      <Avatar className="h-10 w-10">
        <AvatarImage src={image} alt={name || 'avatar'} />
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </Avatar>

      {(showName || showDescription) && (
        <div className="flex flex-col">
          {showName && name && <span className="text-sm font-medium text-foreground">{name}</span>}
          {showDescription && description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
};
